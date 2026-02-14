import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { authService, getApiErrorMessage } from '../services/auth';
import type { RootStackParamList } from '../app/AppNavigator';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Register'>;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function RegisterScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  function validate(): boolean {
    const next: typeof errors = {};
    if (!name.trim()) next.name = 'Name is required';
    if (!email.trim()) next.email = 'Email is required';
    else if (!EMAIL_REGEX.test(email)) next.email = 'Please enter a valid email';
    if (password.length < 8) next.password = 'Password must be at least 8 characters';
    setErrors(next);
    setApiError('');
    return Object.keys(next).length === 0;
  }

  async function handleRegister() {
    if (!validate() || loading) return;
    setLoading(true);
    try {
      await authService.register({ name: name.trim(), email: email.trim(), password });
      navigation.replace('Login');
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
        <Text style={styles.title}>Create account</Text>
        {apiError ? <Text style={styles.apiError}>{apiError}</Text> : null}
        <Input
          label="Name"
          value={name}
          onChangeText={setName}
          placeholder="Your name"
          autoCapitalize="words"
          error={errors.name}
        />
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
        />
        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Min 8 characters"
          secureTextEntry
          error={errors.password}
        />
        <Button title="Register" onPress={handleRegister} loading={loading} />
        <TouchableOpacity style={styles.linkWrap} onPress={() => navigation.replace('Login')}>
          <Text style={styles.link}>Already have an account? Log in</Text>
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
  linkWrap: { marginTop: 20, alignItems: 'center' },
  link: { color: '#6366f1', fontSize: 15, fontWeight: '500' },
});
