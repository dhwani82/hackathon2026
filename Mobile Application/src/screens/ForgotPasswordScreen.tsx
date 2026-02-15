import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { authService, getApiErrorMessage } from '../services/auth';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ForgotPassword'>;
};

export function ForgotPasswordScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  async function handleSubmit() {
    if (!email.trim() || loading) return;
    setLoading(true);
    setApiError('');
    try {
      await authService.forgot({ email: email.trim() });
      navigation.replace('ResetPassword', { email: email.trim() });
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
        contentContainerStyle={[styles.scroll, styles.scrollCenter]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.centerContent}>
          <Text style={styles.title}>Forgot password</Text>
          <Text style={styles.subtitle}>Enter your email and we’ll send you a code to reset your password.</Text>
        {apiError ? <Text style={styles.apiError}>{apiError}</Text> : null}
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Button title="Send reset code" onPress={handleSubmit} loading={loading} />
        <Button
          title="Back to login"
          onPress={() => navigation.goBack()}
          variant="outline"
          disabled={loading}
        />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#f8fafc' },
  scroll: { padding: 24, paddingTop: 48 },
  scrollCenter: { flexGrow: 1, justifyContent: 'center', alignItems: 'center' },
  centerContent: { width: '100%', maxWidth: 400 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8, color: '#1e293b' },
  subtitle: { fontSize: 15, color: '#64748b', marginBottom: 24, textAlign: 'center' },
  apiError: { color: '#c00', marginBottom: 16, fontSize: 14, textAlign: 'center' },
});
