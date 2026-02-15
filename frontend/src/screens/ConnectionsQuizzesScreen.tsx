import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

// --- Green Flag Quiz ---
const GREEN_FLAG_TITLE = 'Find the Green Flag';
const GREEN_FLAG_QUESTIONS: { question: string; choices: string[]; correctIndex: number }[] = [
  {
    question:
      "You've been talking to someone for a week. One night you don't reply for a few hours because you're busy. They respond:",
    choices: [
      '"Wow… guess I\'m not important to you."',
      'Sends 12 messages asking where you are.',
      '"Hope everything\'s okay! Talk tomorrow"',
    ],
    correctIndex: 2,
  },
  {
    question: "You share that something they did hurt your feelings.",
    choices: [
      '"You\'re too sensitive."',
      '"I\'m sorry. Can you tell me more so I understand?"',
      'Changes the subject.',
    ],
    correctIndex: 1,
  },
  {
    question: 'You mention hanging out with friends of the opposite gender.',
    choices: [
      '"You shouldn\'t be around them if you respect me."',
      '"Who exactly was there? Send pics."',
      '"Hope you had fun! Tell me about it."',
    ],
    correctIndex: 2,
  },
  {
    question: 'After only 3 days of talking, they say:',
    choices: [
      '"I think you\'re my soulmate. Let\'s move in together."',
      '"Delete your dating apps right now."',
      '"I\'m enjoying getting to know you. Let\'s take it slow."',
    ],
    correctIndex: 2,
  },
  {
    question: 'You disagree about something small (like a movie or opinion).',
    choices: [
      '"We see it differently, but that\'s okay."',
      'Insults your intelligence.',
      'Says, "Whatever, this is dumb," and ignores you.',
    ],
    correctIndex: 0,
  },
];

// --- Love Language Quiz ---
// A=0 Words of Affirmation, B=1 Quality time, C=2 Acts of Service, D=3 Physical Touch, E=4 Receiving Gifts
const LOVE_LANG_LABELS = ['A', 'B', 'C', 'D', 'E'];
const LOVE_LANG_NAMES = [
  'Words of Affirmation',
  'Quality Time',
  'Acts of Service',
  'Physical Touch',
  'Receiving Gifts',
];

const LOVE_LANGUAGE_TITLE = 'Discover your love language';

type LoveLangLetter = 'A' | 'B' | 'C' | 'D' | 'E';

const LOVE_LANGUAGE_QUESTIONS: { question: string; choices: { letter: LoveLangLetter; text: string }[] }[] = [
  {
    question: 'I feel most loved when someone…',
    choices: [
      { letter: 'A', text: 'Compliments me sincerely' },
      { letter: 'B', text: 'Gives me their full attention' },
      { letter: 'C', text: 'Does helpful things without asking' },
    ],
  },
  {
    question: 'The most romantic thing is…',
    choices: [
      { letter: 'C', text: 'Doing something thoughtful for me' },
      { letter: 'D', text: 'Holding me close' },
      { letter: 'E', text: 'A meaningful gift' },
    ],
  },
  {
    question: 'The sweetest small moment is…',
    choices: [
      { letter: 'A', text: 'A heartfelt text message' },
      { letter: 'D', text: 'A random hug' },
      { letter: 'E', text: 'A tiny surprise gift' },
    ],
  },
  {
    question: 'My favorite date sounds like…',
    choices: [
      { letter: 'A', text: 'A deep conversation about life' },
      { letter: 'B', text: 'A long walk or adventure together' },
      { letter: 'E', text: 'A surprise planned just for me' },
    ],
  },
  {
    question: 'I receive love when someone is…',
    choices: [
      { letter: 'B', text: 'Making time to be together' },
      { letter: 'C', text: 'Helping with tasks' },
      { letter: 'D', text: 'Hugging or touching' },
    ],
  },
  {
    question: 'What hurts the most?',
    choices: [
      { letter: 'C', text: 'Broken promises or no effort' },
      { letter: 'D', text: 'Lack of affection' },
      { letter: 'E', text: 'Forgotten special occasions' },
    ],
  },
  {
    question: "When I'm having a bad day, I want someone to…",
    choices: [
      { letter: 'A', text: 'Encourage me with kind words' },
      { letter: 'B', text: 'Sit with me and just be present' },
      { letter: 'C', text: 'Take something off my plate' },
    ],
  },
  {
    question: 'In conflict, I need…',
    choices: [
      { letter: 'A', text: 'Reassuring words' },
      { letter: 'D', text: 'A comforting touch' },
      { letter: 'E', text: 'A peace-offering gesture' },
    ],
  },
  {
    question: 'I feel closest to someone when…',
    choices: [
      { letter: 'A', text: 'We share meaningful words' },
      { letter: 'B', text: 'We spend uninterrupted time together' },
      { letter: 'E', text: 'We exchange meaningful items' },
    ],
  },
  {
    question: 'A perfect partner would…',
    choices: [
      { letter: 'B', text: 'Plan a whole day just for us' },
      { letter: 'C', text: 'Help me with something stressful' },
      { letter: 'D', text: 'Hold my hand or hug me' },
    ],
  },
];

function letterToIndex(l: LoveLangLetter): number {
  return l.charCodeAt(0) - 65;
}

type QuizId = 'green-flag' | 'love-language' | null;

export function ConnectionsQuizzesScreen() {
  const insets = useSafeAreaInsets();
  const [selectedQuiz, setSelectedQuiz] = useState<QuizId>(null);
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

  const isGreenFlag = selectedQuiz === 'green-flag';
  const isLoveLanguage = selectedQuiz === 'love-language';

  const greenFlagTotal = GREEN_FLAG_QUESTIONS.length;
  const loveLangTotal = LOVE_LANGUAGE_QUESTIONS.length;

  const totalQuestions = isGreenFlag ? greenFlagTotal : isLoveLanguage ? loveLangTotal : 0;
  const isLastQuestion = totalQuestions > 0 && currentIndex === totalQuestions - 1;

  const greenFlagScore =
    isGreenFlag && answers.length === greenFlagTotal
      ? answers.filter((a, i) => a === GREEN_FLAG_QUESTIONS[i].correctIndex).length
      : 0;

  function getLoveLanguageCounts(): number[] {
    if (!isLoveLanguage || answers.length !== loveLangTotal) return [0, 0, 0, 0, 0];
    const counts = [0, 0, 0, 0, 0];
    LOVE_LANGUAGE_QUESTIONS.forEach((q, i) => {
      const choice = q.choices[answers[i]];
      if (choice) counts[letterToIndex(choice.letter)]++;
    });
    return counts;
  }

  function handleSelectQuiz(quiz: QuizId) {
    setSelectedQuiz(quiz);
    setStarted(false);
    setCurrentIndex(0);
    setAnswers([]);
    setShowResult(false);
  }

  function handleStart() {
    setStarted(true);
    setCurrentIndex(0);
    setAnswers([]);
    setShowResult(false);
  }

  function handleGoBack() {
    setStarted(false);
    setCurrentIndex(0);
    setAnswers([]);
    setShowResult(false);
  }

  function handleGoBackToQuizList() {
    setSelectedQuiz(null);
    setStarted(false);
    setCurrentIndex(0);
    setAnswers([]);
    setShowResult(false);
  }

  function handleChoice(choiceIndex: number) {
    const newAnswers = [...answers, choiceIndex];
    setAnswers(newAnswers);
    if (isLastQuestion) {
      setShowResult(true);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  }

  const containerStyle = [styles.container, { paddingTop: insets.top }];

  // --- Quiz list (no quiz selected) ---
  if (selectedQuiz === null) {
    return (
      <View style={containerStyle}>
        <ScrollView
          contentContainerStyle={styles.quizListScroll}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.quizListTitle}>Quizzes</Text>
          <Text style={styles.quizListSubtitle}>Learn more about yourself and relationships.</Text>

          <TouchableOpacity
            style={styles.quizCard}
            onPress={() => handleSelectQuiz('green-flag')}
            activeOpacity={0.8}
          >
            <View style={[styles.quizCardIcon, { backgroundColor: '#dcfce7' }]}>
              <Ionicons name="flag-outline" size={40} color="#22c55e" />
            </View>
            <Text style={styles.quizCardTitle}>{GREEN_FLAG_TITLE}</Text>
            <Text style={styles.quizCardDesc}>{greenFlagTotal} questions to spot healthy habits.</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quizCard}
            onPress={() => handleSelectQuiz('love-language')}
            activeOpacity={0.8}
          >
            <View style={[styles.quizCardIcon, { backgroundColor: '#fce7f3' }]}>
              <Ionicons name="heart-outline" size={40} color="#ec4899" />
            </View>
            <Text style={styles.quizCardTitle}>{LOVE_LANGUAGE_TITLE}</Text>
            <Text style={styles.quizCardDesc}>{loveLangTotal} questions to discover how you give and receive love.</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  // --- Green Flag result ---
  if (showResult && isGreenFlag) {
    const percent = totalQuestions > 0 ? Math.round((greenFlagScore / totalQuestions) * 100) : 0;
    return (
      <View style={containerStyle}>
        <ScrollView contentContainerStyle={styles.resultScroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.resultTitle}>Your score</Text>
          <View style={styles.scoreCircleOuter}>
            <View style={styles.scoreCircleInner}>
              <Text style={styles.scoreNumber}>{greenFlagScore}</Text>
              <Text style={styles.scoreDenom}>/ {totalQuestions}</Text>
              <Text style={styles.scorePercent}>{percent}%</Text>
            </View>
          </View>
          <Text style={styles.greenFlagMessage}>Let's make you a green flag!</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={handleStart} activeOpacity={0.8}>
            <Ionicons name="refresh-outline" size={20} color="#fff" />
            <Text style={styles.retryBtnText}>Take again</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.goBackBtn} onPress={handleGoBackToQuizList} activeOpacity={0.8}>
            <Ionicons name="arrow-back" size={20} color="#22c55e" />
            <Text style={styles.goBackBtnText}>Go back</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  // --- Love Language result ---
  if (showResult && isLoveLanguage) {
    const counts = getLoveLanguageCounts();
    const maxCount = Math.max(...counts);
    const topIndex = counts.indexOf(maxCount);
    const primaryName = LOVE_LANG_NAMES[topIndex];
    const totalPicked = counts.reduce((a, b) => a + b, 0);

    return (
      <View style={containerStyle}>
        <ScrollView contentContainerStyle={styles.resultScroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.resultTitle}>Your love language</Text>
          <View style={[styles.scoreCircleOuter, styles.loveLangCircle]}>
            <View style={styles.scoreCircleInner}>
              <Text style={styles.loveLangResultText}>{primaryName}</Text>
              <Text style={styles.loveLangScoreText}>{maxCount} of {totalPicked} answers</Text>
            </View>
          </View>
          <Text style={styles.loveLangSubtext}>
            Mostly {LOVE_LANG_LABELS[topIndex]}: {primaryName}
          </Text>
          <View style={styles.breakdownWrap}>
            {LOVE_LANG_NAMES.map((name, i) => (
              <View key={i} style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>{LOVE_LANG_LABELS[i]}. {name}</Text>
                <Text style={styles.breakdownCount}>{counts[i]}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity style={[styles.retryBtn, styles.pinkBtn]} onPress={handleStart} activeOpacity={0.8}>
            <Ionicons name="refresh-outline" size={20} color="#fff" />
            <Text style={styles.retryBtnText}>Take again</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.goBackBtnLove} onPress={handleGoBackToQuizList} activeOpacity={0.8}>
            <Ionicons name="arrow-back" size={20} color="#ec4899" />
            <Text style={styles.goBackBtnTextLove}>Go back</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  // --- Start screen (quiz selected, not started) ---
  if (!started) {
    const title = isGreenFlag ? GREEN_FLAG_TITLE : LOVE_LANGUAGE_TITLE;
    const subtitle = isGreenFlag
      ? `${greenFlagTotal} questions to spot healthy relationship habits.`
      : `${loveLangTotal} questions to discover how you give and receive love.`;
    const iconBg = isGreenFlag ? '#dcfce7' : '#fce7f3';
    const iconColor = isGreenFlag ? '#22c55e' : '#ec4899';

    return (
      <View style={containerStyle}>
        <View style={styles.startWrap}>
          <TouchableOpacity
            style={styles.backToQuizzesBtn}
            onPress={handleGoBackToQuizList}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="arrow-back" size={24} color="#64748b" />
          </TouchableOpacity>
          <View style={[styles.startIconWrap, { backgroundColor: iconBg }]}>
            <Ionicons name={isGreenFlag ? 'flag-outline' : 'heart-outline'} size={56} color={iconColor} />
          </View>
          <Text style={styles.quizTitle}>{title}</Text>
          <Text style={styles.quizSubtitle}>{subtitle}</Text>
          <TouchableOpacity
            style={[styles.startBtn, isLoveLanguage && styles.startBtnPink]}
            onPress={handleStart}
            activeOpacity={0.8}
          >
            <Text style={styles.startBtnText}>Start quiz</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // --- Questions (Green Flag) ---
  if (isGreenFlag) {
    const q = GREEN_FLAG_QUESTIONS[currentIndex];
    const labels = ['A', 'B', 'C'];
    return (
      <View style={containerStyle}>
        <TouchableOpacity
          style={styles.inlineBackBtn}
          onPress={handleGoBack}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="arrow-back" size={24} color="#64748b" />
        </TouchableOpacity>
        <View style={styles.progressBarWrap}>
          <View
            style={[styles.progressBarFill, { width: `${((currentIndex + 1) / totalQuestions) * 100}%` }]}
          />
        </View>
        <Text style={styles.questionCount}>
          Question {currentIndex + 1} of {totalQuestions}
        </Text>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.questionScrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.questionText}>{q.question}</Text>
          <View style={styles.choicesWrap}>
            {q.choices.map((choice, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.choiceBtn}
                onPress={() => handleChoice(idx)}
                activeOpacity={0.8}
              >
                <Text style={styles.choiceLabel}>{labels[idx]}</Text>
                <Text style={styles.choiceText}>{choice}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  // --- Questions (Love Language) ---
  const q = LOVE_LANGUAGE_QUESTIONS[currentIndex];
  return (
    <View style={containerStyle}>
      <TouchableOpacity
        style={styles.inlineBackBtn}
        onPress={handleGoBack}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Ionicons name="arrow-back" size={24} color="#64748b" />
      </TouchableOpacity>
      <View style={[styles.progressBarWrap, styles.progressBarPink]}>
        <View
          style={[
            styles.progressBarFill,
            styles.progressBarFillPink,
            { width: `${((currentIndex + 1) / totalQuestions) * 100}%` },
          ]}
        />
      </View>
      <Text style={styles.questionCount}>
        Question {currentIndex + 1} of {totalQuestions}
      </Text>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.questionScrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.questionText}>{q.question}</Text>
        <View style={styles.choicesWrap}>
          {q.choices.map((choice, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.choiceBtn}
              onPress={() => handleChoice(idx)}
              activeOpacity={0.8}
            >
              <Text style={[styles.choiceLabel, styles.choiceLabelPink]}>{choice.letter}</Text>
              <Text style={styles.choiceText}>{choice.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  quizListScroll: {
    padding: 24,
    paddingTop: 16,
    paddingBottom: 48,
  },
  quizListTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 4,
  },
  quizListSubtitle: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 24,
  },
  quizCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  quizCardIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quizCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  quizCardDesc: {
    fontSize: 14,
    color: '#64748b',
  },
  inlineBackBtn: {
    position: 'absolute',
    top: 56,
    left: 16,
    zIndex: 10,
    padding: 4,
  },
  backToQuizzesBtn: {
    position: 'absolute',
    top: 56,
    left: 16,
    zIndex: 10,
    padding: 4,
  },
  progressBarWrap: { height: 4, backgroundColor: '#e2e8f0', width: '100%' },
  progressBarPink: { backgroundColor: '#fce7f3' },
  progressBarFill: { height: '100%', backgroundColor: '#22c55e', borderRadius: 2 },
  progressBarFillPink: { backgroundColor: '#ec4899' },
  questionCount: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  scroll: { flex: 1 },
  questionScrollContent: { padding: 24, paddingBottom: 48 },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    lineHeight: 26,
    marginBottom: 24,
  },
  choicesWrap: { gap: 12 },
  choiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  choiceLabel: { fontSize: 16, fontWeight: '700', color: '#22c55e', width: 28 },
  choiceLabelPink: { color: '#ec4899' },
  choiceText: { flex: 1, fontSize: 16, color: '#334155', lineHeight: 22 },
  startWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  startIconWrap: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  quizTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 8,
  },
  quizSubtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 32,
  },
  startBtn: { backgroundColor: '#22c55e', paddingVertical: 14, paddingHorizontal: 32, borderRadius: 12 },
  startBtnPink: { backgroundColor: '#ec4899' },
  startBtnText: { fontSize: 18, fontWeight: '700', color: '#fff' },
  resultScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    paddingTop: 48,
  },
  resultTitle: { fontSize: 20, fontWeight: '700', color: '#1e293b', marginBottom: 24 },
  scoreCircleOuter: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
  },
  loveLangCircle: { backgroundColor: '#ec4899' },
  scoreCircleInner: {
    width: 156,
    height: 156,
    borderRadius: 78,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreNumber: { fontSize: 48, fontWeight: '800', color: '#22c55e' },
  scoreDenom: { fontSize: 20, color: '#64748b', fontWeight: '600' },
  scorePercent: { fontSize: 16, color: '#64748b', marginTop: 2 },
  loveLangResultText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ec4899',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  loveLangScoreText: { fontSize: 16, color: '#64748b', marginTop: 4 },
  loveLangSubtext: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 20,
  },
  breakdownWrap: {
    alignSelf: 'stretch',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  breakdownLabel: { fontSize: 14, color: '#334155', fontWeight: '500' },
  breakdownCount: { fontSize: 16, fontWeight: '700', color: '#ec4899' },
  greenFlagMessage: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 32,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#22c55e',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  pinkBtn: { backgroundColor: '#ec4899' },
  retryBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  goBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#22c55e',
  },
  goBackBtnText: { fontSize: 16, fontWeight: '700', color: '#22c55e' },
  goBackBtnLove: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ec4899',
  },
  goBackBtnTextLove: { fontSize: 16, fontWeight: '700', color: '#ec4899' },
});
