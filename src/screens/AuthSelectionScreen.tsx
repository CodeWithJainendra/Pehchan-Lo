import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';
import { RootStackParamList, AuthMethod } from '../types';
import AuthCard from '../components/AuthCard';

const { height } = Dimensions.get('window');

type AuthSelectionScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AuthSelection'>;

interface Props {
  navigation: AuthSelectionScreenNavigationProp;
}

const AuthSelectionScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const authMethods: AuthMethod[] = [
    {
      id: 'otp',
      title: 'OTP Authentication',
      subtitle: 'Secure verification via SMS',
      description: 'Enter your Aadhar number to receive a 6-digit OTP for secure authentication',
      icon: 'phone-portrait-outline',
      color: Colors.gradients.otp
    },
    {
      id: 'fingerprint',
      title: 'Fingerprint Authentication',
      subtitle: 'Quick biometric access',
      description: 'Use your fingerprint for fast and secure authentication',
      icon: 'finger-print-outline',
      color: Colors.gradients.fingerprint
    },
    {
      id: 'face',
      title: 'Face Authentication',
      subtitle: 'Advanced facial recognition',
      description: 'Secure authentication using facial recognition technology',
      icon: 'scan-outline',
      color: Colors.gradients.face
    }
  ];

  const handleMethodSelect = (method: AuthMethod) => {
    setSelectedMethod(method.id);
    
    // Add a small delay for better UX
    setTimeout(() => {
      if (method.id === 'otp') {
        navigation.navigate('OTPAuth');
      } else {
        navigation.navigate('BiometricAuth', { type: method.id as 'fingerprint' | 'face' });
      }
      setSelectedMethod(null);
    }, 300);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      <LinearGradient
        colors={Colors.gradients.background}
        style={styles.gradientContainer}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.headerIconContainer}>
              <Ionicons 
                name="shield-checkmark" 
                size={32} 
                color={Colors.primary} 
              />
            </View>
            <Text style={styles.headerTitle}>Choose Authentication Method</Text>
            <Text style={styles.headerSubtitle}>
              Select your preferred method to securely access your account
            </Text>
          </View>

          {/* Authentication Methods */}
          <View style={styles.methodsContainer}>
            {authMethods.map((method, index) => (
              <AuthCard
                key={method.id}
                method={method}
                onPress={() => handleMethodSelect(method)}
                isLoading={selectedMethod === method.id}
                index={index}
              />
            ))}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.securityBadge}>
              <Ionicons 
                name="lock-closed" 
                size={14} 
                color={Colors.success} 
              />
              <Text style={styles.securityText}>
                Bank-grade security
              </Text>
            </View>
            <Text style={styles.footerText}>
              Your data is encrypted and protected using industry-standard security protocols
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  gradientContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Spacing.lg,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 4,
  },
  headerTitle: {
    ...Typography.h3,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.xs,
    fontWeight: 'bold',
    fontSize: 20,
  },
  headerSubtitle: {
    ...Typography.caption,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: '85%',
    fontSize: 13,
  },
  methodsContainer: {
    flex: 1,
    paddingTop: Spacing.md,
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  securityText: {
    ...Typography.small,
    color: Colors.success,
    fontWeight: '600',
    marginLeft: 4,
    fontSize: 11,
  },
  footerText: {
    ...Typography.small,
    color: Colors.text.light,
    textAlign: 'center',
    lineHeight: 16,
    maxWidth: '80%',
    fontSize: 11,
  },
});

export default AuthSelectionScreen;