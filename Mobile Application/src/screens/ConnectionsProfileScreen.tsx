import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Pressable,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CommonActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Button } from '../components/Button';
import { authService } from '../services/auth';
import { useRootStackNavigation } from '../navigation/RootStackNavigationContext';
import type { RootStackParamList } from '../navigation/rootStackTypes';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ConnectionsProfile'>;
  route: { params: { lookingFor: string; gender: string; pronouns: string } };
};

export function ConnectionsProfileScreen({ navigation, route }: Props) {
  const rootStackNav = useRootStackNavigation();
  const { lookingFor = '', gender = '', pronouns = '' } = route.params ?? {};
  const [profileImageUri, setProfileImageUri] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [preferences, setPreferences] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const menuSlideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (menuVisible) {
      Animated.timing(menuSlideAnim, { toValue: 0, duration: 250, useNativeDriver: true }).start();
    } else {
      Animated.timing(menuSlideAnim, { toValue: 300, duration: 200, useNativeDriver: true }).start();
    }
  }, [menuVisible]);

  React.useEffect(() => {
    let mounted = true;
    authService.me().then((u) => {
      if (mounted && u) setName(u.name);
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  function showPhotoOptions() {
    Alert.alert(
      'Profile picture',
      'Choose an option',
      [
        { text: 'Take a picture', onPress: handleTakePicture },
        { text: 'Choose from gallery', onPress: handleSelectFromGallery },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  }

  async function handleTakePicture() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera access is required.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) setProfileImageUri(result.assets[0].uri);
  }

  async function handleSelectFromGallery() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Photo library access is required.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) setProfileImageUri(result.assets[0].uri);
  }

  function handleDone() {
    setProfileSaved(true);
  }

  function startEdit() {
    setProfileSaved(false);
  }

  function closeMenu() {
    setMenuVisible(false);
  }

  function handleBackToFeed() {
    if (rootStackNav) {
      rootStackNav.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: 'MainTabs',
              state: {
                routes: [
                  { name: 'Feed' },
                  { name: 'CreatePost' },
                  { name: 'Profile' },
                ],
                index: 0,
              },
            },
          ],
        })
      );
    }
  }

  function handleMenuSocials() {
    closeMenu();
    if (rootStackNav) {
      rootStackNav.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: 'MainTabs',
              state: {
                routes: [
                  { name: 'Feed' },
                  { name: 'CreatePost' },
                  { name: 'Profile' },
                ],
                index: 2,
              },
            },
          ],
        })
      );
    }
  }

  function handleMenuAboutApp() {
    closeMenu();
    Alert.alert('About app', 'Cuepid – dating & style tips. Connect with people and get inspired.');
  }

  async function handleMenuLogout() {
    closeMenu();
    await authService.logout();
    if (rootStackNav) {
      rootStackNav.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Login' }] }));
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={handleBackToFeed}
          style={styles.backBtn}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cuepid Dating Profile</Text>
        <TouchableOpacity
          onPress={() => setMenuVisible(true)}
          style={styles.settingsIconBtn}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="settings-outline" size={24} color="#1e293b" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {profileSaved ? (
          <>
            <View style={styles.photoSection}>
              <View style={styles.avatarCircle}>
                {profileImageUri ? (
                  <Image source={{ uri: profileImageUri }} style={styles.avatarImage} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Ionicons name="person" size={40} color="#94a3b8" />
                    <Text style={styles.avatarPlaceholderText}>No photo</Text>
                  </View>
                )}
              </View>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.valueText}>{name || '—'}</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Age</Text>
              <Text style={styles.valueText}>{age || '—'}</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Looking for</Text>
              <Text style={styles.valueText}>{lookingFor || '—'}</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Gender</Text>
              <Text style={styles.valueText}>{gender || '—'}</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Pronouns</Text>
              <Text style={styles.valueText}>{pronouns || '—'}</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Little to know me</Text>
              <Text style={[styles.valueText, styles.valueBlock]}>{preferences || '—'}</Text>
            </View>
            <TouchableOpacity style={styles.editBtn} onPress={startEdit} activeOpacity={0.8}>
              <Ionicons name="pencil" size={18} color="#6366f1" />
              <Text style={styles.editBtnText}>Edit profile</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity onPress={showPhotoOptions} style={styles.photoSection}>
              <View style={styles.avatarCircle}>
                {profileImageUri ? (
                  <Image source={{ uri: profileImageUri }} style={styles.avatarImage} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Ionicons name="camera" size={40} color="#94a3b8" />
                    <Text style={styles.avatarPlaceholderText}>Add photo</Text>
                  </View>
                )}
              </View>
              <Text style={styles.photoHint}>Tap to take a picture or choose from gallery</Text>
            </TouchableOpacity>

            <View style={styles.field}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Your name"
                placeholderTextColor="#94a3b8"
                value={name}
                onChangeText={setName}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Age</Text>
              <TextInput
                style={styles.input}
                placeholder="Age"
                placeholderTextColor="#94a3b8"
                value={age}
                onChangeText={setAge}
                keyboardType="number-pad"
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Looking for</Text>
              <Text style={styles.valueText}>{lookingFor}</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Gender preference</Text>
              <Text style={styles.valueText}>{gender}</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Pronouns</Text>
              <Text style={styles.valueText}>{pronouns}</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Little to know me (optional)</Text>
              <TextInput
                style={[styles.input, styles.inputMultiline]}
                placeholder="e.g. interests, what you're looking for"
                placeholderTextColor="#94a3b8"
                value={preferences}
                onChangeText={setPreferences}
                multiline
                numberOfLines={3}
              />
            </View>

            <Button title="Done" onPress={handleDone} style={styles.doneBtn} />
          </>
        )}
      </ScrollView>

      <Modal visible={menuVisible} transparent animationType="fade">
        <View style={styles.menuBackdrop}>
          <Pressable style={styles.menuBackdropPressable} onPress={closeMenu} />
          <Animated.View style={[styles.menuPanel, { transform: [{ translateX: menuSlideAnim }] }]}>
            <Pressable style={styles.menuItem} onPress={handleMenuSocials}>
              <Ionicons name="share-social-outline" size={22} color="#1e293b" />
              <Text style={styles.menuItemText}>Socials</Text>
            </Pressable>
            <Pressable style={styles.menuItem} onPress={handleMenuAboutApp}>
              <Ionicons name="information-circle-outline" size={22} color="#1e293b" />
              <Text style={styles.menuItemText}>About app</Text>
            </Pressable>
            <Pressable style={[styles.menuItem, styles.menuItemLogout]} onPress={handleMenuLogout}>
              <Ionicons name="log-out-outline" size={22} color="#dc2626" />
              <Text style={styles.menuItemTextLogout}>Logout</Text>
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
  backBtn: { padding: 4, marginRight: 4 },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: '700', color: '#1e293b', textAlign: 'center' },
  settingsIconBtn: { padding: 4 },
  scroll: { padding: 24, paddingBottom: 48 },
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
  photoSection: { alignItems: 'center', marginBottom: 24 },
  avatarCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: { width: 120, height: 120 },
  avatarPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  avatarPlaceholderText: { fontSize: 12, color: '#94a3b8', marginTop: 4 },
  photoHint: { fontSize: 12, color: '#64748b', marginTop: 8 },
  field: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#475569', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1e293b',
    backgroundColor: '#fff',
  },
  inputMultiline: { minHeight: 80, textAlignVertical: 'top' },
  valueText: { fontSize: 16, color: '#1e293b', fontWeight: '500' },
  valueBlock: { marginTop: 2 },
  doneBtn: { marginTop: 16 },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#e0e7ff',
    alignSelf: 'flex-start',
  },
  editBtnText: { fontSize: 16, fontWeight: '600', color: '#6366f1' },
});
