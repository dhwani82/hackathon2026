import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { tokenStorage } from '../storage/token';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Splash'>;
};

const PINK_GRADIENT = ['#fbcfe8', '#ec4899'] as const; // light pink to hot pink (same as logo)

export function SplashScreen({ navigation }: Props) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      // Flow: Splash → Login (no token) or MainTabs (has token); after login → Feed
      const token = await tokenStorage.get();
      if (!mounted) return;
      if (!token) {
        navigation.replace('Login');
      } else {
        // Go to app immediately; don't wait for backend (avoids long hang on new device/slow network).
        // If token is invalid, API calls will 401 and user can log in again from Profile.
        navigation.replace('MainTabs');
      }
      setReady(true);
    }

    checkAuth();
    return () => { mounted = false; };
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/chat-icon.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <MaskedView
        maskElement={<Text style={[styles.title, styles.titleMask]}>Cuepid</Text>}
        style={styles.titleMaskWrap}
      >
        <LinearGradient
          colors={[PINK_GRADIENT[0], PINK_GRADIENT[1]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.titleGradient}
        />
      </MaskedView>
      {!ready ? (
        <ActivityIndicator size="large" color="#ec4899" style={styles.loader} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  titleMaskWrap: {
    height: 48,
    marginBottom: 32,
  },
  titleGradient: {
    flex: 1,
    height: 48,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
  },
  titleMask: { color: 'black' },
  loader: {
    position: 'absolute',
    bottom: 80,
  },
});
