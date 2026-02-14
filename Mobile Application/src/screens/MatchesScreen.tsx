import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { MOCK_MATCHES } from '../data/mockMatches';
import type { MatchItem } from '../types';

function MatchRow({ item }: { item: MatchItem }) {
  return (
    <View style={styles.row}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>{item.name}</Text>
        {item.lastMessage ? (
          <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessage}</Text>
        ) : null}
      </View>
    </View>
  );
}

export function MatchesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Matches</Text>
      <FlatList
        data={MOCK_MATCHES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MatchRow item={item} />}
        ListEmptyComponent={<Text style={styles.empty}>No matches yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#f8fafc' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 20, color: '#1e293b' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: { fontSize: 18, color: '#fff', fontWeight: '600' },
  content: { flex: 1 },
  name: { fontSize: 16, fontWeight: '600', color: '#1e293b' },
  lastMessage: { fontSize: 14, color: '#64748b', marginTop: 2 },
  empty: { fontSize: 15, color: '#64748b', textAlign: 'center', marginTop: 24 },
});
