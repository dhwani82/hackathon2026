import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { RepostsProvider } from '../context/RepostsContext';
import { ChatbotModal } from '../components/ChatbotModal';
import { SplashScreen } from '../screens/SplashScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { ForgotPasswordScreen } from '../screens/ForgotPasswordScreen';
import { ResetPasswordScreen } from '../screens/ResetPasswordScreen';
import { FeedScreen } from '../screens/FeedScreen';
import { CreatePostScreen } from '../screens/CreatePostScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: { email: string };
  MainTabs: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function MainTabs() {
  const [chatbotVisible, setChatbotVisible] = useState(false);
  return (
    <View style={styles.mainTabsWrap}>
      <Tab.Navigator
        initialRouteName="Feed"
        screenOptions={{
          tabBarActiveTintColor: '#6366f1',
          tabBarInactiveTintColor: '#64748b',
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="Feed"
          component={FeedScreen}
          options={{
            tabBarLabel: 'Feed',
            tabBarIcon: ({ color, size }) => <Ionicons name="newspaper-outline" size={size} color={color} />,
          }}
        />
        <Tab.Screen
          name="CreatePost"
          component={CreatePostScreen}
          options={{
            tabBarLabel: 'Create Post',
            tabBarIcon: ({ color, size }) => <Ionicons name="add-circle-outline" size={size} color={color} />,
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
          }}
        />
      </Tab.Navigator>
      <TouchableOpacity
        style={styles.chatFab}
        onPress={() => setChatbotVisible(true)}
        activeOpacity={0.9}
      >
        <Image source={require('../../assets/chat-icon.png')} style={styles.chatFabIcon} resizeMode="contain" />
      </TouchableOpacity>
      <ChatbotModal visible={chatbotVisible} onClose={() => setChatbotVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  mainTabsWrap: { flex: 1 },
  chatFab: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  chatFabIcon: { width: 36, height: 36 },
});

export function AppNavigator() {
  return (
    <RepostsProvider>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#f8fafc' },
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </RepostsProvider>
  );
}
