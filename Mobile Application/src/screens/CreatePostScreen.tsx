import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export function CreatePostScreen() {
  const [text, setText] = useState('');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scroll, styles.centerWrap]}
        keyboardShouldPersistTaps="handled"
      >
      <Text style={styles.title}>Create a post</Text>
      <View style={styles.inputWrap}>
        <Input
          placeholder="What's on your mind?"
          value={text}
          onChangeText={setText}
          multiline
          numberOfLines={4}
        />
      </View>
      <Button
        title="Post"
        onPress={() => setText('')}
        disabled={!text.trim()}
        style={styles.postButton}
      />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  scrollView: { flex: 1 },
  scroll: { padding: 24, flexGrow: 1, justifyContent: 'center', alignItems: 'center' },
  centerWrap: { width: '100%', maxWidth: 400 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 20, color: '#1e293b' },
  inputWrap: { width: '80%' },
  postButton: { width: '80%' },
});
