import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

export function ConnectionsChatScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.center}>
        <Ionicons name="chatbubbles-outline" size={64} color="#94a3b8" />
        <Text style={styles.title}>Chat</Text>
        <Text style={styles.subtitle}>Your conversations will appear here. Coming soon.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 22, fontWeight: '700', color: '#1e293b', marginTop: 16 },
  subtitle: { fontSize: 15, color: '#64748b', marginTop: 8, textAlign: 'center' },
});
