import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import { authApi } from '../api/auth';
import { storage } from '../utils/storage';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ⭐ Handle deep link (Mobile)
    const handleDeepLink = async (event: { url: string }) => {
      console.log('Deep link received:', event.url);
      await processToken(event.url);
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);
    
    // ⭐ Handle query parameter (Web)
    const checkWebToken = async () => {
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        
        if (token) {
          console.log('Token from web query:', token.substring(0, 20) + '...');
          
          try {
            await storage.saveToken(token);
            await authApi.getMe();
            
            // Clean URL
            window.history.replaceState({}, '', '/');
            
            onLoginSuccess();
          } catch (error) {
            console.error('Web token processing error:', error);
            Alert.alert('Error', 'Failed to process login');
            setLoading(false);
          }
        }
      }
    };
    
    checkWebToken();
    checkAuth();

    return () => subscription.remove();
  }, []);

  const processToken = async (url: string) => {
    try {
      const urlObj = new URL(url);
      const token = urlObj.searchParams.get('token');
      
      if (token) {
        console.log('Token received:', token.substring(0, 20) + '...');
        await storage.saveToken(token);
        await authApi.getMe();
        onLoginSuccess();
      }
    } catch (error) {
      console.error('Token processing error:', error);
      Alert.alert('Error', 'Failed to process login');
      setLoading(false);
    }
  };

  const checkAuth = async () => {
    try {
      const isAuth = await authApi.isAuthenticated();
      if (isAuth) {
        onLoginSuccess();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      await authApi.loginWithGoogle();
    } catch (error) {
      console.error('Login failed:', error);
      Alert.alert('Error', 'Failed to open login page');
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
      <View style={styles.header}>
        <Text style={styles.logo}>🌱</Text>
        <Text style={styles.title}>Idle Garden</Text>
        <Text style={styles.subtitle}>Grow your garden empire!</Text>
      </View>

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
