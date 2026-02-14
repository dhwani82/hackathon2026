import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Button } from '../components/Button';
import { MOCK_PROFILES } from '../data/mockProfiles';
import type { ProfileCard } from '../types';

export function DiscoverScreen() {
  const [cards, setCards] = useState<ProfileCard[]>(MOCK_PROFILES);
  const [currentIndex, setCurrentIndex] = useState(0);

  const current = cards[currentIndex];

  function handleLike() {
    if (currentIndex >= cards.length - 1) {
      setCards(MOCK_PROFILES);
      setCurrentIndex(0);
      return;
    }
    setCurrentIndex((i) => i + 1);
  }

  function handlePass() {
    if (currentIndex >= cards.length - 1) {
      setCards(MOCK_PROFILES);
      setCurrentIndex(0);
      return;
    }
    setCurrentIndex((i) => i + 1);
  }

  if (cards.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No more profiles. Check back later!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Discover</Text>
      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{current?.name?.charAt(0) ?? '?'}</Text>
        </View>
        <Text style={styles.name}>{current?.name}, {current?.age}</Text>
        <Text style={styles.bio}>{current?.bio ?? 'No bio'}</Text>
      </View>
      <View style={styles.actions}>
        <Button title="Pass" onPress={handlePass} variant="outline" />
        <View style={styles.spacer} />
        <Button title="Like" onPress={handleLike} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#f8fafc' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 20, color: '#1e293b' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: { fontSize: 32, color: '#fff', fontWeight: '600' },
  name: { fontSize: 20, fontWeight: '700', color: '#1e293b', marginBottom: 4 },
  bio: { fontSize: 15, color: '#64748b' },
  actions: { flexDirection: 'row', alignItems: 'center' },
  spacer: { width: 16 },
  emptyText: { fontSize: 16, color: '#64748b' },
});
