import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { authService, getApiErrorMessage } from '../services/auth';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ResetPassword'>;
  route: RouteProp<RootStackParamList, 'ResetPassword'>;
};

export function ResetPasswordScreen({ navigation, route }: Props) {
  const email = route.params?.email ?? '';
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errors, setErrors] = useState<{ otp?: string; newPassword?: string }>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  function validate(): boolean {
    const next: typeof errors = {};
    if (otp.length !== 6) next.otp = 'Enter the 6-digit code';
    if (newPassword.length < 8) next.newPassword = 'Password must be at least 8 characters';
    setErrors(next);
    setApiError('');
    return Object.keys(next).length === 0;
  }

  async function handleReset() {
    if (!validate() || !email || loading) return;
    setLoading(true);
    try {
      await authService.reset({ email, otp, newPassword });
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
        contentContainerStyle={[styles.scroll, styles.scrollCenter]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.centerContent}>
          <Text style={styles.title}>Reset password</Text>
          {apiError ? <Text style={styles.apiError}>{apiError}</Text> : null}
          <Input
          label="Email"
          value={email}
          editable={false}
          placeholder="Email"
        />
        <Input
          label="Verification code (6 digits)"
          value={otp}
          onChangeText={(t) => setOtp(t.replace(/\D/g, '').slice(0, 6))}
          placeholder="000000"
          keyboardType="number-pad"
          maxLength={6}
          error={errors.otp}
        />
        <Input
          label="New password"
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="Min 8 characters"
          secureTextEntry
          error={errors.newPassword}
        />
        <Button title="Reset password" onPress={handleReset} loading={loading} />
        <Button
          title="Back to login"
          onPress={() => navigation.replace('Login')}
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
  title: { fontSize: 24, fontWeight: '700', marginBottom: 24, color: '#1e293b' },
  apiError: { color: '#c00', marginBottom: 16, fontSize: 14, textAlign: 'center' },
});
