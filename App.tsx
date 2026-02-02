import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LoginScreen } from './src/screens/LoginScreen';
import { GameScreen } from './src/screens/GameScreen';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      {isAuthenticated ? (
        <GameScreen onLogout={() => setIsAuthenticated(false)} />
      ) : (
        <LoginScreen onLoginSuccess={() => setIsAuthenticated(true)} />
      )}
    </SafeAreaProvider>
  );
}
