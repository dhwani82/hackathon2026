import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'WelcomeQuipid'>;
  route: { params: { lookingFor: string; gender: string; pronouns: string } };
};

const PINK_GRADIENT = ['#fbcfe8', '#ec4899'] as const;

export function WelcomeQuipidScreen({ navigation, route }: Props) {
  const { lookingFor = '', gender = '', pronouns = '' } = route.params ?? {};

  useEffect(() => {
    const t = setTimeout(() => {
      navigation.replace('ConnectionsProfile', { lookingFor, gender, pronouns });
    }, 3000);
    return () => clearTimeout(t);
  }, [navigation, lookingFor, gender, pronouns]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/chat-icon.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <View style={styles.titleRow}>
        <MaskedView
          maskElement={<Text style={[styles.cuepidText, styles.cuepidMask]}>Cuepid</Text>}
          style={styles.cuepidWrap}
        >
          <LinearGradient
            colors={[PINK_GRADIENT[0], PINK_GRADIENT[1]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cuepidGradient}
          />
        </MaskedView>
        <Text style={styles.tagline}> Let's connect</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  cuepidWrap: {
    height: 48,
  },
  cuepidGradient: {
    flex: 1,
    height: 48,
  },
  cuepidText: {
    fontSize: 36,
    fontWeight: '800',
  },
  cuepidMask: { color: 'black' },
  tagline: {
    fontSize: 22,
    fontWeight: '500',
    fontStyle: 'italic',
    color: '#64748b',
    letterSpacing: 0.5,
    marginLeft: 4,
  },
});
