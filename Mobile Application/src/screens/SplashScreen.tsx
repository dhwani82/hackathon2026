import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { tokenStorage } from '../storage/token';
import { authService } from '../services/auth';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Splash'>;
};

export function SplashScreen({ navigation }: Props) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      try {
        const token = await tokenStorage.get();
        if (!token) {
          if (mounted) navigation.replace('Login');
          return;
        }
        await authService.me();
        if (mounted) navigation.replace('MainTabs');
      } catch {
        if (mounted) navigation.replace('Login');
      } finally {
        if (mounted) setReady(true);
      }
    }

    checkAuth();
    return () => { mounted = false; };
  }, [navigation]);

  if (!ready) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#6366f1" />
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
  text: { marginTop: 12, fontSize: 16, color: '#64748b' },
});
