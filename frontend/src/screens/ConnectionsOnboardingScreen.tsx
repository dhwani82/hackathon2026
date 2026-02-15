import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Button } from '../components/Button';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ConnectionsOnboarding'>;
};

type Step = 'landing' | 'age' | 'lookingFor' | 'gender' | 'pronouns';

const LOOKING_OPTIONS = ['Find a partner', 'Find friends'] as const;
const GENDER_OPTIONS = ['Man', 'Woman', 'Non-binary', 'Any'] as const;
const PRONOUN_OPTIONS = ['He/him', 'She/her', 'They/them', 'Other'] as const;

export function ConnectionsOnboardingScreen({ navigation }: Props) {
  const [step, setStep] = useState<Step>('landing');
  const [lookingFor, setLookingFor] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [pronouns, setPronouns] = useState<string>('');

  function goBackToProfile() {
    const parent = navigation.getParent() as any;
    if (parent?.navigate) {
      parent.navigate('MainTabs');
    } else {
      navigation.goBack();
    }
  }

  function handle18No() {
    goBackToProfile();
  }

  function handle18Yes() {
    setStep('lookingFor');
  }

  function handleLookingFor(value: string) {
    setLookingFor(value);
    setStep('gender');
  }

  function handleGender(value: string) {
    setGender(value);
    setStep('pronouns');
  }

  function handlePronouns(value: string) {
    setPronouns(value);
    navigation.replace('WelcomeQuipid', { lookingFor, gender, pronouns: value });
  }

  const contentWrap = styles.contentWrap;

  if (step === 'landing') {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={contentWrap}>
            <Text style={styles.title}>Sign in to date or find new friends</Text>
            <Text style={styles.subtitle}>Answer a few questions to set up your connections profile.</Text>
            <Button title="Sign up for connections" onPress={() => setStep('age')} style={styles.btn} />
            <TouchableOpacity onPress={goBackToProfile} style={styles.backLink}>
              <Ionicons name="arrow-back" size={20} color="#6366f1" />
              <Text style={styles.backLinkText}>Back to Profile</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (step === 'age') {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={contentWrap}>
            <Text style={styles.title}>Are you 18+?</Text>
            <Text style={styles.subtitle}>You must be 18 or older to use connections.</Text>
            <View style={styles.optionsRow}>
              <Button title="Yes" onPress={handle18Yes} style={styles.optionBtn} />
              <Button title="No" onPress={handle18No} variant="outline" style={styles.optionBtn} />
            </View>
            <TouchableOpacity onPress={() => setStep('landing')} style={styles.backLink}>
              <Ionicons name="arrow-back" size={20} color="#6366f1" />
              <Text style={styles.backLinkText}>Back</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (step === 'lookingFor') {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={contentWrap}>
            <Text style={styles.title}>What are you looking for here?</Text>
            {LOOKING_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt}
                style={styles.optionCard}
                onPress={() => handleLookingFor(opt)}
                activeOpacity={0.8}
              >
                <Text style={styles.optionCardText}>{opt}</Text>
                <Ionicons name="chevron-forward" size={22} color="#94a3b8" />
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setStep('age')} style={styles.backLink}>
              <Ionicons name="arrow-back" size={20} color="#6366f1" />
              <Text style={styles.backLinkText}>Back</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (step === 'gender') {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={contentWrap}>
            <Text style={styles.title}>What gender {lookingFor === 'Find a partner' ? 'partner' : 'friend'}?</Text>
            {GENDER_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt}
                style={styles.optionCard}
                onPress={() => handleGender(opt)}
                activeOpacity={0.8}
              >
                <Text style={styles.optionCardText}>{opt}</Text>
                <Ionicons name="chevron-forward" size={22} color="#94a3b8" />
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setStep('lookingFor')} style={styles.backLink}>
              <Ionicons name="arrow-back" size={20} color="#6366f1" />
              <Text style={styles.backLinkText}>Back</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  // pronouns
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={contentWrap}>
          <Text style={styles.title}>What are your pronouns?</Text>
          {PRONOUN_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={styles.optionCard}
              onPress={() => handlePronouns(opt)}
              activeOpacity={0.8}
            >
              <Text style={styles.optionCardText}>{opt}</Text>
              <Ionicons name="chevron-forward" size={22} color="#94a3b8" />
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={() => setStep('gender')} style={styles.backLink}>
            <Ionicons name="arrow-back" size={20} color="#6366f1" />
            <Text style={styles.backLinkText}>Back</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  contentWrap: { width: '100%', maxWidth: 400 },
  title: { fontSize: 22, fontWeight: '700', color: '#1e293b', marginBottom: 12 },
  subtitle: { fontSize: 15, color: '#64748b', marginBottom: 24 },
  btn: { marginBottom: 24 },
  optionsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  optionBtn: { flex: 1 },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  optionCardText: { fontSize: 16, fontWeight: '600', color: '#1e293b' },
  backLink: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 16 },
  backLinkText: { fontSize: 16, fontWeight: '600', color: '#6366f1' },
});
