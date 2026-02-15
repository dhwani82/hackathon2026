import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { DEMO_FEED } from '../data/demoFeed';
import { useReposts } from '../context/RepostsContext';

const ACTION_SIZE = 20;
const INACTIVE_COLOR = '#64748b';
const LIKE_ACTIVE = '#6366f1';
const LOVE_ACTIVE = '#ec4899';
const COMMENT_REPLY_ACTIVE = '#10b981';

type PostActions = { like: number; love: number; comment: number; reply: number };
type PopupType = 'like' | 'love' | 'comment' | 'reply';

function getInitialActions(): Record<string, PostActions> {
  const out: Record<string, PostActions> = {};
  DEMO_FEED.forEach((p) => {
    out[p.id] = { like: 0, love: 0, comment: 0, reply: 0 };
  });
  return out;
}

function getInitialComments(): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  DEMO_FEED.forEach((p) => {
    out[p.id] = [];
  });
  return out;
}

export function FeedScreen() {
  const { addRepost, isReposted } = useReposts();
  const [actions, setActions] = useState<Record<string, PostActions>>(getInitialActions);
  const [popup, setPopup] = useState<{ postId: string; type: PopupType } | null>(null);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentDraft, setCommentDraft] = useState('');
  const [postComments, setPostComments] = useState<Record<string, string[]>>(getInitialComments);

  useEffect(() => {
    if (!popup) return;
    const t = setTimeout(() => setPopup(null), 500);
    return () => clearTimeout(t);
  }, [popup]);

  const handleLike = (postId: string) => {
    setActions((prev) => ({
      ...prev,
      [postId]: {
        ...prev[postId],
        like: prev[postId].like + 1,
      },
    }));
    setPopup({ postId, type: 'like' });
  };

  const handleLove = (postId: string) => {
    setActions((prev) => ({
      ...prev,
      [postId]: {
        ...prev[postId],
        love: prev[postId].love + 1,
      },
    }));
    setPopup({ postId, type: 'love' });
  };

  const openCommentBox = (postId: string) => {
    setActiveCommentPostId(postId);
    setCommentDraft('');
  };

  const submitComment = () => {
    const text = commentDraft.trim();
    if (!activeCommentPostId || !text) return;
    setPostComments((prev) => ({
      ...prev,
      [activeCommentPostId]: [...(prev[activeCommentPostId] ?? []), text],
    }));
    setActions((prev) => ({
      ...prev,
      [activeCommentPostId]: {
        ...prev[activeCommentPostId],
        comment: (prev[activeCommentPostId].comment ?? 0) + 1,
      },
    }));
    setCommentDraft('');
    setActiveCommentPostId(null);
    setPopup({ postId: activeCommentPostId, type: 'comment' });
  };

  const handleRepost = (post: (typeof DEMO_FEED)[0]) => {
    addRepost(post);
    setActions((prev) => ({
      ...prev,
      [post.id]: {
        ...prev[post.id],
        reply: prev[post.id].reply + 1,
      },
    }));
    setPopup({ postId: post.id, type: 'reply' });
  };

  const renderPopupIcon = () => {
    if (!popup) return null;
    const size = 56;
    const color = popup.type === 'like' ? LIKE_ACTIVE : popup.type === 'love' ? LOVE_ACTIVE : COMMENT_REPLY_ACTIVE;
    const name =
      popup.type === 'like'
        ? 'thumbs-up'
        : popup.type === 'love'
          ? 'heart'
          : popup.type === 'comment'
            ? 'chatbubble'
            : 'arrow-undo';
    return (
      <View style={styles.popupWrap}>
        <View style={styles.popupCircle}>
          <Ionicons name={name as any} size={size} color={color} />
        </View>
      </View>
    );
  };

  return (
    <>
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
        <Text style={styles.screenTitle}>Feed</Text>
        {DEMO_FEED.map((post) => {
          const a = actions[post.id] ?? { like: 0, love: 0, comment: 0, reply: 0 };
          const comments = postComments[post.id] ?? [];
          const hasLike = a.like > 0;
          const hasLove = a.love > 0;
          const hasComment = a.comment > 0;
          const hasReply = isReposted(post.id) || a.reply > 0;
          const isCommentOpen = activeCommentPostId === post.id;
          return (
            <View key={post.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.headerLeft}>
                  <View style={styles.avatar}>
                    {post.avatarUrl ? (
                      <Image source={{ uri: post.avatarUrl }} style={styles.avatarImage} />
                    ) : (
                      <Text style={styles.avatarText}>{post.author.charAt(0)}</Text>
                    )}
                  </View>
                  <View style={styles.meta}>
                    <Text style={styles.author}>{post.author}</Text>
                    {post.dateLabel ? (
                      <Text style={styles.date}>{post.dateLabel}</Text>
                    ) : null}
                  </View>
                </View>
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => handleLike(post.id)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons
                      name={hasLike ? 'thumbs-up' : 'thumbs-up-outline'}
                      size={ACTION_SIZE}
                      color={hasLike ? LIKE_ACTIVE : INACTIVE_COLOR}
                    />
                    {a.like > 0 && (
                      <Text style={[styles.count, { color: LIKE_ACTIVE }]}>{a.like}</Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => openCommentBox(post.id)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons
                      name={hasComment ? 'chatbubble' : 'chatbubble-outline'}
                      size={ACTION_SIZE}
                      color={hasComment ? COMMENT_REPLY_ACTIVE : INACTIVE_COLOR}
                    />
                    {a.comment > 0 && (
                      <Text style={[styles.count, { color: COMMENT_REPLY_ACTIVE }]}>{a.comment}</Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => handleLove(post.id)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons
                      name={hasLove ? 'heart' : 'heart-outline'}
                      size={ACTION_SIZE}
                      color={hasLove ? LOVE_ACTIVE : INACTIVE_COLOR}
                    />
                    {a.love > 0 && (
                      <Text style={[styles.count, { color: LOVE_ACTIVE }]}>{a.love}</Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => handleRepost(post)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons
                      name={hasReply ? 'arrow-undo' : 'arrow-undo-outline'}
                      size={ACTION_SIZE}
                      color={hasReply ? COMMENT_REPLY_ACTIVE : INACTIVE_COLOR}
                    />
                    {a.reply > 0 && (
                      <Text style={[styles.count, { color: COMMENT_REPLY_ACTIVE }]}>{a.reply}</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.content}>{post.content}</Text>

              {isCommentOpen && (
                <>
                  {comments.length > 0 && (
                    <View style={styles.commentsList}>
                      {comments.map((c, i) => (
                        <Text key={i} style={styles.commentText}>{c}</Text>
                      ))}
                    </View>
                  )}
                  <View style={styles.commentBox}>
                  <TextInput
                    style={styles.commentInput}
                    placeholder="Write a comment..."
                    placeholderTextColor="#94a3b8"
                    value={commentDraft}
                    onChangeText={setCommentDraft}
                    multiline
                    maxLength={500}
                  />
                  <TouchableOpacity
                    style={styles.sendBtn}
                    onPress={submitComment}
                    disabled={!commentDraft.trim()}
                  >
                    <Ionicons
                      name="arrow-up-circle"
                      size={36}
                      color={commentDraft.trim() ? COMMENT_REPLY_ACTIVE : INACTIVE_COLOR}
                    />
                  </TouchableOpacity>
                </View>
                </>
              )}
            </View>
          );
        })}
        </ScrollView>
      </SafeAreaView>

      <Modal visible={!!popup} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          {renderPopupIcon()}
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  scrollView: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 48 },
  screenTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    color: '#1e293b',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    marginLeft: 2,
  },
  count: {
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 2,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  avatarImage: { width: 40, height: 40 },
  avatarText: { fontSize: 16, color: '#fff', fontWeight: '600' },
  meta: { flex: 1 },
  author: { fontSize: 16, fontWeight: '600', color: '#1e293b' },
  date: { fontSize: 12, color: '#64748b', marginTop: 2 },
  content: { fontSize: 15, color: '#334155', lineHeight: 22 },
  commentsList: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  commentText: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 6,
    paddingHorizontal: 4,
  },
  commentBox: {
    marginTop: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    paddingBottom: 8,
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  commentInput: {
    flex: 1,
    fontSize: 15,
    color: '#1e293b',
    paddingVertical: 6,
    paddingRight: 8,
    maxHeight: 100,
  },
  sendBtn: {
    padding: 4,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  popupCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
});
