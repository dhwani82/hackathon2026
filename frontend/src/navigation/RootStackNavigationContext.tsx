import React, { createContext, useContext } from 'react';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from './rootStackTypes';

const RootStackNavigationContext = createContext<NativeStackNavigationProp<RootStackParamList> | null>(null);

export function useRootStackNavigation() {
  return useContext(RootStackNavigationContext);
}

export { RootStackNavigationContext };
