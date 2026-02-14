import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { authService, getApiErrorMessage } from '../services/auth';
import { aiService } from '../services/ai';
import type { RootStackParamList } from '../app/AppNavigator';
import type { User } from '../types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;
};

export function ProfileScreen({ navigation }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [prompt, setPrompt] = useState('');
  const [geminiResponse, setGeminiResponse] = useState('');
  const [geminiLoading, setGeminiLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    authService
      .me()
      .then((u) => {
        if (mounted) setUser(u);
      })
      .catch(() => {
        if (mounted) setUser(null);
      })
      .finally(() => {
        if (mounted) setLoadingUser(false);
      });
    return () => { mounted = false; };
  }, []);

  async function handleLogout() {
    await authService.logout();
    const root = navigation.getParent()?.getParent();
    root?.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: 'Login' }] })
    );
  }

  async function handleAskGemini() {
    if (!prompt.trim() || geminiLoading) return;
    setGeminiLoading(true);
    setGeminiResponse('');
    try {
      const response = await aiService.askGemini(prompt.trim());
      setGeminiResponse(response);
    } catch (err) {
      setGeminiResponse(getApiErrorMessage(err));
    } finally {
      setGeminiLoading(false);
    }
  }

  if (loadingUser) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{user?.name ?? '—'}</Text>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user?.email ?? '—'}</Text>
      </View>

      <Text style={styles.sectionTitle}>Ask Gemini</Text>
      <Input
        placeholder="Type a prompt..."
        value={prompt}
        onChangeText={setPrompt}
        multiline
        numberOfLines={3}
      />
      <Button
        title={geminiLoading ? 'Asking...' : 'Send'}
        onPress={handleAskGemini}
        loading={geminiLoading}
        disabled={!prompt.trim()}
      />
      {geminiResponse ? (
        <View style={styles.responseBox}>
          <Text style={styles.responseLabel}>Response</Text>
          <Text style={styles.responseText}>{geminiResponse}</Text>
        </View>
      ) : null}

      <Button
        title="Log out"
        onPress={handleLogout}
        variant="outline"
        disabled={geminiLoading}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  scrollContent: { padding: 24, paddingBottom: 48 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 16, color: '#64748b' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 20, color: '#1e293b' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  label: { fontSize: 12, color: '#64748b', marginBottom: 4 },
  value: { fontSize: 16, fontWeight: '500', color: '#1e293b', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12, color: '#1e293b' },
  responseBox: {
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    padding: 14,
    marginTop: 16,
    marginBottom: 24,
  },
  responseLabel: { fontSize: 12, fontWeight: '600', color: '#64748b', marginBottom: 6 },
  responseText: { fontSize: 14, color: '#334155' },
});
