import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { authApi } from '../api/auth';
import { storage } from '../utils/storage';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Listen for deep link (OAuth callback)
    const handleDeepLink = async (event: { url: string }) => {
      const url = event.url;
      
      // Parse token from URL
      // Expected: exp://localhost:19000/--/?token=xxx
      const tokenMatch = url.match(/[?&]token=([^&]+)/);
      
      if (tokenMatch) {
        const token = tokenMatch[1];
        await storage.saveToken(token);
        
        // Get user data
        try {
          await authApi.getMe();
          onLoginSuccess();
        } catch (error) {
          console.error('Failed to get user:', error);
          setLoading(false);
        }
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);

    // Check if already logged in
    checkAuth();

    return () => subscription.remove();
  }, []);

  const checkAuth = async () => {
    setLoading(true);
    const isAuth = await authApi.isAuthenticated();
    if (isAuth) {
      onLoginSuccess();
    }
    setLoading(false);
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      await authApi.loginWithGoogle();
    } catch (error) {
      console.error('Login failed:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Logo/Title */}
      <View style={styles.header}>
        <Text style={styles.logo}>🌱</Text>
        <Text style={styles.title}>Idle Garden</Text>
        <Text style={styles.subtitle}>Grow your garden empire!</Text>
      </View>

      {/* Login Button */}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri: 'https://www.google.com/favicon.ico' }}
          style={styles.googleIcon}
        />
        <Text style={styles.loginButtonText}>Sign in with Google</Text>
      </TouchableOpacity>

      {/* Footer */}
      <Text style={styles.footer}>
        By signing in, you agree to our{'\n'}Terms of Service & Privacy Policy
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logo: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#888',
    fontSize: 14,
  },
});
