import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { authService, getApiErrorMessage } from '../services/auth';
import type { RootStackParamList } from '../app/AppNavigator';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

export function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  async function handleLogin() {
    if (!email.trim() || !password || loading) return;
    setLoading(true);
    setApiError('');
    try {
      await authService.login({ email: email.trim(), password });
      navigation.replace('MainTabs');
    } catch (err) {
      setApiError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Welcome back</Text>
        {apiError ? <Text style={styles.apiError}>{apiError}</Text> : null}
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Your password"
          secureTextEntry
        />
        <Button title="Log in" onPress={handleLogin} loading={loading} />
        <TouchableOpacity style={styles.linkWrap} onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.link}>Forgot password?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkWrap} onPress={() => navigation.replace('Register')}>
          <Text style={styles.link}>Create an account</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#f8fafc' },
  scroll: { padding: 24, paddingTop: 48 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 24, color: '#1e293b' },
  apiError: { color: '#c00', marginBottom: 16, fontSize: 14 },
  linkWrap: { marginTop: 16, alignItems: 'center' },
  link: { color: '#6366f1', fontSize: 15, fontWeight: '500' },
});
