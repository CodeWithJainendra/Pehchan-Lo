import React, { useState, useEffect, useRef } from 'react';
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  Animated,
  Platform
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import * as LocalAuthentication from 'expo-local-authentication';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Shadows, Animation } from '../constants/theme';
import { RootStackParamList, UserProfile, BiometricType } from '../types';
import { generateUniqueId } from '../utils/authUtils';

type BiometricAuthScreenNavigationProp = StackNavigationProp<RootStackParamList, 'BiometricAuth'>;
type BiometricAuthScreenRouteProp = RouteProp<RootStackParamList, 'BiometricAuth'>;

interface Props {
  navigation: BiometricAuthScreenNavigationProp;
  route: BiometricAuthScreenRouteProp;
}

const BiometricAuthScreen: React.FC<Props> = ({ navigation, route }) => {
  const { type } = route.params;
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [biometricCapabilities, setBiometricCapabilities] = useState<{
    isAvailable: boolean;
    hasHardware: boolean;
    isEnrolled: boolean;
    supportedTypes: number[];
  } | null>(null);

  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    checkBiometricCapabilities();
    startEntranceAnimation();
  }, []);

  const startEntranceAnimation = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: Animation.timing.medium,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start(() => {
      startPulseAnimation();
    });
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const checkBiometricCapabilities = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
      
      setBiometricCapabilities({
        isAvailable: hasHardware && isEnrolled,
        hasHardware,
        isEnrolled,
        supportedTypes
      });

      if (!hasHardware) {
        setError('Biometric hardware not available on this device');
      } else if (!isEnrolled) {
        setError('No biometric credentials enrolled. Please set up biometric authentication in device settings.');
      }
    } catch (error) {
      console.error('Error checking biometric capabilities:', error);
      setError('Unable to check biometric capabilities');
    }
  };

  const handleBiometricAuth = async () => {
    if (!biometricCapabilities?.isAvailable) {
      showFallbackOptions();
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const authResult = await LocalAuthentication.authenticateAsync({
        promptMessage: `Authenticate with ${type === 'fingerprint' ? 'Fingerprint' : 'Face ID'}`,
        fallbackLabel: 'Use PIN',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
      });

      if (authResult.success) {
        const user: UserProfile = {
          id: generateUniqueId(),
          name: 'User', // In real app, this would come from device/secure storage
          authMethod: type,
          lastLogin: new Date()
        };

        const authMethodName = type === 'fingerprint' ? 'Fingerprint Authentication' : 'Face Authentication';
        navigation.navigate('Dashboard', { user, authMethod: authMethodName });
      } else {
        let errorMessage = 'Authentication failed';
        
        switch (authResult.error) {
          case 'user_cancel':
            errorMessage = 'Authentication cancelled by user';
            break;
          case 'user_fallback':
            errorMessage = 'User chose to use fallback method';
            break;
          case 'system_cancel':
            errorMessage = 'Authentication cancelled by system';
            break;
          case 'app_cancel':
            errorMessage = 'Authentication cancelled by app';
            break;
          case 'invalid_context':
            errorMessage = 'Invalid authentication context';
            break;
          case 'biometric_unknown_error':
            errorMessage = 'Unknown biometric error occurred';
            break;
          case 'biometric_unavailable':
            errorMessage = 'Biometric authentication unavailable';
            break;
          case 'biometric_not_supported':
            errorMessage = 'Biometric authentication not supported';
            break;
          case 'biometric_not_enrolled':
            errorMessage = 'No biometric credentials enrolled';
            break;
          default:
            errorMessage = authResult.error || 'Authentication failed';
        }
        
        setError(errorMessage);
      }
    } catch (error) {
      console.error('Biometric authentication error:', error);
      setError('Authentication error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const showFallbackOptions = () => {
    Alert.alert(
      'Biometric Authentication Unavailable',
      'Would you like to try a different authentication method?',
      [
        {
          text: 'Use OTP',
          onPress: () => navigation.navigate('OTPAuth')
        },
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => navigation.goBack()
        }
      ]
    );
  };

  const getMethodConfig = () => {
    switch (type) {
      case 'fingerprint':
        return {
          title: 'Fingerprint Authentication',
          subtitle: 'Touch the fingerprint sensor',
          description: 'Place your finger on the sensor to authenticate',
          icon: 'finger-print',
          colors: Colors.gradients.fingerprint
        };
      case 'face':
        return {
          title: 'Face Authentication',
          subtitle: 'Look at the camera',
          description: 'Position your face within the camera frame',
          icon: 'scan',
          colors: Colors.gradients.face
        };
      default:
        return {
          title: 'Biometric Authentication',
          subtitle: 'Use your biometric',
          description: 'Authenticate using your biometric data',
          icon: 'shield-checkmark',
          colors: Colors.gradients.primary
        };
    }
  };

  const methodConfig = getMethodConfig();

  const getBiometricSupportText = () => {
    if (!biometricCapabilities) return 'Checking device capabilities...';
    
    if (!biometricCapabilities.hasHardware) {
      return 'This device does not support biometric authentication';
    }
    
    if (!biometricCapabilities.isEnrolled) {
      return 'No biometric credentials found. Please set up biometric authentication in your device settings.';
    }
    
    const types = biometricCapabilities.supportedTypes;
    const supportedMethods = [];
    
    if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      supportedMethods.push('Fingerprint');
    }
    if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      supportedMethods.push('Face Recognition');
    }
    if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
      supportedMethods.push('Iris');
    }
    
    return `Supported: ${supportedMethods.join(', ')}`;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      <LinearGradient
        colors={Colors.gradients.background}
        style={styles.gradientContainer}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{methodConfig.title}</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Animated.View
            style={[
              styles.biometricContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }]
              }
            ]}
          >
            <LinearGradient
              colors={methodConfig.colors}
              style={styles.biometricCircle}
            >
              <Animated.View
                style={[
                  styles.iconContainer,
                  {
                    transform: [{ scale: pulseAnim }]
                  }
                ]}
              >
                <Ionicons 
                  name={methodConfig.icon as keyof typeof Ionicons.glyphMap} 
                  size={80} 
                  color={Colors.text.white} 
                />
              </Animated.View>
            </LinearGradient>
          </Animated.View>

          <View style={styles.textContainer}>
            <Text style={styles.title}>{methodConfig.title}</Text>
            <Text style={styles.subtitle}>{methodConfig.subtitle}</Text>
            <Text style={styles.description}>{methodConfig.description}</Text>
          </View>

          {/* Device Capabilities Info */}
          <View style={styles.infoContainer}>
            <Ionicons 
              name="information-circle-outline" 
              size={16} 
              color={Colors.text.secondary} 
            />
            <Text style={styles.infoText}>{getBiometricSupportText()}</Text>
          </View>

          {/* Error Display */}
          {error && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={20} color={Colors.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Authentication Button */}
          <TouchableOpacity
            style={[
              styles.authButton,
              (isLoading || !biometricCapabilities?.isAvailable) && styles.buttonDisabled
            ]}
            onPress={handleBiometricAuth}
            disabled={isLoading || !biometricCapabilities?.isAvailable}
          >
            <LinearGradient
              colors={methodConfig.colors}
              style={styles.buttonGradient}
            >
              {isLoading ? (
                <Animated.View style={styles.loadingIndicator} />
              ) : (
                <>
                  <Ionicons 
                    name={methodConfig.icon as keyof typeof Ionicons.glyphMap} 
                    size={24} 
                    color={Colors.text.white} 
                  />
                  <Text style={styles.buttonText}>
                    Authenticate with {type === 'fingerprint' ? 'Fingerprint' : 'Face ID'}
                  </Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Fallback Option */}
          <TouchableOpacity 
            style={styles.fallbackButton}
            onPress={() => navigation.navigate('OTPAuth')}
          >
            <Text style={styles.fallbackText}>Use OTP Authentication instead</Text>
          </TouchableOpacity>
        </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.small,
  },
  headerTitle: {
    ...Typography.h3,
    color: Colors.text.primary,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  biometricContainer: {
    marginBottom: Spacing.xxl,
  },
  biometricCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.large,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    ...Typography.h2,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
    fontWeight: 'bold',
  },
  subtitle: {
    ...Typography.body,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  description: {
    ...Typography.caption,
    color: Colors.text.light,
    textAlign: 'center',
    lineHeight: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
    maxWidth: '90%',
    ...Shadows.small,
  },
  infoText: {
    ...Typography.caption,
    color: Colors.text.secondary,
    marginLeft: Spacing.xs,
    flex: 1,
    textAlign: 'center',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
    maxWidth: '90%',
  },
  errorText: {
    ...Typography.caption,
    color: Colors.error,
    marginLeft: Spacing.xs,
    flex: 1,
    textAlign: 'center',
  },
  authButton: {
    width: '100%',
    marginBottom: Spacing.lg,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    ...Shadows.medium,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    ...Typography.button,
    color: Colors.text.white,
    marginLeft: Spacing.sm,
  },
  loadingIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.text.white,
    opacity: 0.8,
  },
  fallbackButton: {
    paddingVertical: Spacing.sm,
  },
  fallbackText: {
    ...Typography.caption,
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
});

export default BiometricAuthScreen;