/**
 * Root stack and dating tab param lists.
 * Kept in a separate file to avoid require cycles (e.g. AppNavigator <-> ConnectionsProfileScreen).
 */
export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: { email: string };
  MainTabs: undefined;
  ConnectionsOnboarding: undefined;
  WelcomeQuipid: { lookingFor: string; gender: string; pronouns: string };
  ConnectionsProfile: { lookingFor: string; gender: string; pronouns: string };
};

export type DatingTabParamList = {
  Explore: undefined;
  Chat: undefined;
  Quizzes: undefined;
  Profile: { lookingFor: string; gender: string; pronouns: string };
};
