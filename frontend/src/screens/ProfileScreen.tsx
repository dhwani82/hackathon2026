import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, TextInput, Modal, Pressable, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CommonActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { authService } from '../services/auth';
import { useReposts } from '../context/RepostsContext';
import type { RootStackParamList } from '../navigation/AppNavigator';
import type { User } from '../types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;
};

export function ProfileScreen({ navigation }: Props) {
  const { reposts } = useReposts();
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [profileImageUri, setProfileImageUri] = useState<string | null>(null);
  const [profileDisplayName, setProfileDisplayName] = useState('');
  const [tagline, setTagline] = useState('');
  const [profileEditMode, setProfileEditMode] = useState(false);
  const [draftUsername, setDraftUsername] = useState('');
  const [draftTagline, setDraftTagline] = useState('');
  const [readyToDate, setReadyToDate] = useState(false);
  const [draftReadyToDate, setDraftReadyToDate] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const menuSlideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (menuVisible) {
      Animated.timing(menuSlideAnim, { toValue: 0, duration: 250, useNativeDriver: true }).start();
    } else {
      Animated.timing(menuSlideAnim, { toValue: 300, duration: 200, useNativeDriver: true }).start();
    }
  }, [menuVisible]);

  useEffect(() => {
    let mounted = true;
    authService
      .me()
      .then((u) => {
        if (mounted) {
          setUser(u);
          setProfileDisplayName(u?.name ?? '');
        }
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
    if (root) {
      root.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Login' }] }));
    }
  }

  function showProfilePhotoOptions() {
    Alert.alert(
      'Profile photo',
      'Choose an option',
      [
        { text: 'Take a picture', onPress: handleTakePicture },
        { text: 'Select from phone', onPress: handleSelectFromGallery },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  }

  async function handleTakePicture() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera access is required to take a photo.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setProfileImageUri(result.assets[0].uri);
    }
  }

  function startProfileEdit() {
    setDraftUsername(profileDisplayName);
    setDraftTagline(tagline);
    setDraftReadyToDate(readyToDate);
    setProfileEditMode(true);
  }

  function updateProfile() {
    setProfileDisplayName(draftUsername.trim() || profileDisplayName);
    setTagline(draftTagline.trim());
    setReadyToDate(draftReadyToDate);
    setProfileEditMode(false);
  }

  async function handleSelectFromGallery() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Photo library access is required to select a photo.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setProfileImageUri(result.assets[0].uri);
    }
  }

  function closeMenu() {
    setMenuVisible(false);
  }

  function handleMenuProfileDetails() {
    closeMenu();
    Alert.alert('Profile details', 'Edit your profile in the card above.');
  }

  function handleMenuContactDetails() {
    closeMenu();
    Alert.alert('Contact details', user?.email ? `Email: ${user.email}` : 'No contact details.');
  }

  async function handleMenuLogout() {
    closeMenu();
    await handleLogout();
  }

  function handleExplorePress() {
    const stack = navigation.getParent() as any;
    if (stack?.navigate) {
      stack.navigate({
        name: 'ConnectionsProfile',
        params: { lookingFor: '', gender: '', pronouns: '' },
        state: {
          routes: [
            { name: 'Explore' },
            { name: 'Chat' },
            { name: 'Quizzes' },
            { name: 'Profile', params: { lookingFor: '', gender: '', pronouns: '' } },
          ],
          index: 0,
        },
      });
    }
  }

  if (loadingUser) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.center}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={handleExplorePress}
          style={styles.exploreIconBtn}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="compass-outline" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.title}>Cuepid Socials Profile</Text>
        <TouchableOpacity
          onPress={() => setMenuVisible(true)}
          style={styles.settingsIconBtn}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="settings-outline" size={24} color="#1e293b" />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={[styles.scrollContent, styles.scrollCenter]}>
      <View style={styles.centerContent}>

      {/* Container 1: Profile — avatar + top-right Edit, username & tagline */}
      <View style={styles.profileCard}>
        {readyToDate ? (
          <View style={styles.readyToDateHeartWrap}>
            <Ionicons name="heart" size={24} color="#ec4899" />
          </View>
        ) : null}
        <View style={styles.profileRow}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatarCircle}>
              {profileImageUri ? (
                <Image source={{ uri: profileImageUri }} style={styles.profileImage} />
              ) : (
                <Text style={styles.profilePlaceholder}>{((profileDisplayName || user?.name) ?? '?').charAt(0)}</Text>
              )}
            </View>
            <TouchableOpacity
              style={styles.editIconWrap}
              onPress={showProfilePhotoOptions}
              activeOpacity={0.8}
            >
              <Ionicons name="pencil" size={14} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={styles.profileInfo}>
            {!profileEditMode && (
              <View style={styles.profileHeaderRow}>
                <View style={styles.profileHeaderSpacer} />
                <TouchableOpacity
                  style={styles.editProfileBtn}
                  onPress={startProfileEdit}
                  activeOpacity={0.8}
                >
                  <Text style={styles.editProfileBtnText}>Edit</Text>
                </TouchableOpacity>
              </View>
            )}
            {profileEditMode ? (
              <View style={styles.profileEditForm}>
                <TextInput
                  style={styles.profileEditInput}
                  placeholder="Username"
                  placeholderTextColor="#94a3b8"
                  value={draftUsername}
                  onChangeText={setDraftUsername}
                  autoCapitalize="words"
                />
                <TextInput
                  style={[styles.profileEditInput, styles.profileEditInputMultiline]}
                  placeholder="Tagline"
                  placeholderTextColor="#94a3b8"
                  value={draftTagline}
                  onChangeText={setDraftTagline}
                  multiline
                  maxLength={120}
                />
                <TouchableOpacity
                  style={[styles.readyToDateBtn, draftReadyToDate && styles.readyToDateBtnActive]}
                  onPress={() => setDraftReadyToDate(!draftReadyToDate)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.readyToDateBtnText}>Ready to date</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.updateBtn}
                  onPress={updateProfile}
                  activeOpacity={0.8}
                >
                  <Text style={styles.updateBtnText}>Update</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <Text style={styles.profileName}>{(profileDisplayName || user?.name) ?? 'Username'}</Text>
                <Text style={styles.profileTagline} numberOfLines={2}>
                  {tagline || 'Add a tagline...'}
                </Text>
              </>
            )}
          </View>
        </View>
      </View>

      {/* Container 2: Reposted feed */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>My Reposts</Text>
        {reposts.length > 0 ? (
          reposts.map((post) => (
            <View key={post.id} style={styles.repostCard}>
              <View style={styles.repostHeader}>
                <View style={styles.repostAuthorRow}>
                  <View style={styles.avatar}>
                    {post.avatarUrl ? (
                      <Image source={{ uri: post.avatarUrl }} style={styles.avatarImage} />
                    ) : (
                      <Text style={styles.avatarText}>{post.author.charAt(0)}</Text>
                    )}
                  </View>
                  <View style={styles.repostMeta}>
                    <Text style={styles.repostAuthor}>{post.author}</Text>
                    {post.dateLabel ? (
                      <Text style={styles.repostDate}>{post.dateLabel}</Text>
                    ) : null}
                  </View>
                </View>
                <View style={styles.repostedBadge}>
                  <Ionicons name="arrow-redo" size={14} color="#10b981" />
                  <Text style={styles.repostedLabel}>Reposted</Text>
                </View>
              </View>
              <Text style={styles.repostContent}>{post.content}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyReposts}>No reposts yet. Repost from the Feed to see them here.</Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Ready to make connections with people?</Text>
        <TouchableOpacity
          style={styles.connectionsCta}
          onPress={() => (navigation.getParent() as any)?.navigate?.('ConnectionsOnboarding')}
          activeOpacity={0.8}
        >
          <Text style={styles.connectionsCtaText}>Yes, take me there</Text>
          <Ionicons name="arrow-forward" size={20} color="#6366f1" />
        </TouchableOpacity>
      </View>
      </View>
      </ScrollView>

      <Modal visible={menuVisible} transparent animationType="fade">
        <View style={styles.menuBackdrop}>
          <Pressable style={styles.menuBackdropPressable} onPress={closeMenu} />
          <Animated.View style={[styles.menuPanel, { transform: [{ translateX: menuSlideAnim }] }]}>
            <Pressable style={styles.menuItem} onPress={handleMenuProfileDetails}>
              <Ionicons name="person-outline" size={22} color="#1e293b" />
              <Text style={styles.menuItemText}>Profile details</Text>
            </Pressable>
            <Pressable style={styles.menuItem} onPress={handleMenuContactDetails}>
              <Ionicons name="mail-outline" size={22} color="#1e293b" />
              <Text style={styles.menuItemText}>Contact details</Text>
            </Pressable>
            <Pressable style={[styles.menuItem, styles.menuItemLogout]} onPress={handleMenuLogout}>
              <Ionicons name="log-out-outline" size={22} color="#dc2626" />
              <Text style={styles.menuItemTextLogout}>Log out</Text>
            </Pressable>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: '#fff',
  },
  exploreIconBtn: { padding: 4, marginRight: 4 },
  title: { flex: 1, fontSize: 20, fontWeight: '700', color: '#1e293b', textAlign: 'center' },
  settingsIconBtn: { padding: 4 },
  scrollView: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 48 },
  scrollCenter: { flexGrow: 1, justifyContent: 'center', alignItems: 'center' },
  centerContent: { width: '100%', maxWidth: 400 },
  menuBackdrop: { flex: 1, flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.3)' },
  menuBackdropPressable: { flex: 1 },
  menuPanel: {
    width: 280,
    backgroundColor: '#fff',
    paddingTop: 48,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  menuItemText: { fontSize: 16, color: '#1e293b', fontWeight: '500' },
  menuItemLogout: { borderBottomWidth: 0, marginTop: 8 },
  menuItemTextLogout: { fontSize: 16, color: '#dc2626', fontWeight: '600' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 16, color: '#64748b' },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
  },
  readyToDateHeartWrap: {
    position: 'absolute',
    top: -12,
    right: -12,
    zIndex: 1,
  },
  readyToDateBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#fce7f3',
    marginBottom: 10,
  },
  readyToDateBtnActive: {
    backgroundColor: '#fbcfe8',
    borderWidth: 1,
    borderColor: '#ec4899',
  },
  readyToDateBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#be185d',
  },
  profileRow: { flexDirection: 'row', alignItems: 'center' },
  avatarWrap: { position: 'relative', marginRight: 16 },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profileImage: { width: 80, height: 80 },
  profilePlaceholder: { fontSize: 32, color: '#fff', fontWeight: '600' },
  editIconWrap: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#6366f1',
    borderWidth: 2,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: { flex: 1 },
  profileHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  profileHeaderSpacer: { flex: 1 },
  editProfileBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#e0e7ff',
  },
  editProfileBtnText: { fontSize: 13, fontWeight: '600', color: '#6366f1' },
  profileName: { fontSize: 18, fontWeight: '700', color: '#1e293b', marginBottom: 4 },
  profileTagline: { fontSize: 14, color: '#64748b' },
  profileEditForm: { marginTop: 4 },
  profileEditInput: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#1e293b',
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  profileEditInputMultiline: { minHeight: 56, maxHeight: 80 },
  updateBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#6366f1',
    marginTop: 4,
  },
  updateBtnText: { fontSize: 15, fontWeight: '600', color: '#fff' },
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
  cardTitle: { fontSize: 18, fontWeight: '600', color: '#1e293b', marginBottom: 12 },
  emptyReposts: { fontSize: 14, color: '#64748b', fontStyle: 'italic', paddingVertical: 8 },
  connectionsCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 4,
    gap: 8,
  },
  connectionsCtaText: { fontSize: 16, fontWeight: '600', color: '#6366f1' },
  repostCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  repostHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  repostAuthorRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  repostMeta: { marginLeft: 12 },
  repostAuthor: { fontSize: 16, fontWeight: '600', color: '#1e293b' },
  repostDate: { fontSize: 12, color: '#64748b', marginTop: 2 },
  repostedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  repostedLabel: { fontSize: 12, fontWeight: '600', color: '#10b981' },
  repostContent: { fontSize: 15, color: '#334155', lineHeight: 22 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: { width: 40, height: 40 },
  avatarText: { fontSize: 16, color: '#fff', fontWeight: '600' },
});
