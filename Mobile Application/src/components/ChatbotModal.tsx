import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { aiService, getApiErrorMessage } from '../services/ai';

type Message = { id: string; text: string; fromUser: boolean };

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function ChatbotModal({ visible, onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', text: "Hi! I'm your style & dating assistant, powered by Gemini. Ask me anything.", fromUser: false },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (visible && messages.length > 0) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [visible, messages.length]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    const userMsg: Message = { id: Date.now().toString(), text, fromUser: true };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    const botId = (Date.now() + 1).toString();
    setMessages((prev) => [...prev, { id: botId, text: 'Thinking...', fromUser: false }]);
    try {
      const response = await aiService.askGemini(text);
      setMessages((prev) =>
        prev.map((m) => (m.id === botId ? { ...m, text: response } : m))
      );
    } catch (err) {
      const errorText = getApiErrorMessage(err);
      setMessages((prev) =>
        prev.map((m) => (m.id === botId ? { ...m, text: errorText } : m))
      );
    } finally {
      setLoading(false);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <View style={styles.headerIconWrap}>
              <Image source={require('../../assets/chat-icon.png')} style={styles.chatIcon} resizeMode="contain" />
            </View>
            <Text style={styles.headerTitle}>Chat</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} hitSlop={12}>
              <Ionicons name="close" size={28} color="#64748b" />
            </TouchableOpacity>
          </View>
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messageList}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            renderItem={({ item }) => (
              <View style={[styles.bubble, item.fromUser ? styles.userBubble : styles.botBubble]}>
                {!item.fromUser && item.text === 'Thinking...' ? (
                  <ActivityIndicator size="small" color="#6366f1" />
                ) : (
                  <Text style={[styles.bubbleText, item.fromUser && styles.userBubbleText]}>{item.text}</Text>
                )}
              </View>
            )}
          />
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              placeholderTextColor="#94a3b8"
              value={input}
              onChangeText={setInput}
              multiline
              maxLength={500}
              onSubmitEditing={sendMessage}
            />
            <TouchableOpacity
              onPress={sendMessage}
              style={[styles.sendBtn, (!input.trim() || loading) && styles.sendBtnDisabled]}
              disabled={!input.trim() || loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#94a3b8" />
              ) : (
                <Ionicons name="send" size={22} color={input.trim() ? '#fff' : '#94a3b8'} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    minHeight: 400,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerIconWrap: { width: 46, height: 46, marginRight: 10, justifyContent: 'center', alignItems: 'center' },
  chatIcon: { width: 46, height: 46 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b', flex: 1 },
  closeBtn: { padding: 4 },
  messageList: { padding: 16, paddingBottom: 8 },
  bubble: {
    maxWidth: '82%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    marginBottom: 10,
  },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#6366f1' },
  botBubble: { alignSelf: 'flex-start', backgroundColor: '#f1f5f9' },
  bubbleText: { fontSize: 15, color: '#334155' },
  userBubbleText: { color: '#fff' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    paddingBottom: 12 + (Platform.OS === 'ios' ? 24 : 12),
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    backgroundColor: '#fff',
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingTop: 10,
    fontSize: 15,
    color: '#1e293b',
    maxHeight: 100,
    backgroundColor: '#f8fafc',
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: { backgroundColor: '#e2e8f0' },
});
