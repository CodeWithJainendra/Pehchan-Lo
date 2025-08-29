import React, { useState, useRef, useEffect } from 'react';
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Animated
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { RootStackParamList, OTPAuthState, UserProfile } from '../types';
import { AadharValidator, AuthenticationService, generateUniqueId } from '../utils/authUtils';

type OTPAuthScreenNavigationProp = StackNavigationProp<RootStackParamList, 'OTPAuth'>;

interface Props {
  navigation: OTPAuthScreenNavigationProp;
}

const OTPAuthScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [authState, setAuthState] = useState<OTPAuthState>({
    aadharNumber: '',
    otp: '',
    generatedOTP: '',
    step: 'aadhar',
    isLoading: false,
    error: null
  });

  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);
  
  const aadharInputRef = useRef<TextInput>(null);
  const otpInputRefs = useRef<(TextInput | null)[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (authState.step === 'otp' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer, authState.step]);

  const handleAadharChange = (text: string) => {
    // Remove non-numeric characters and limit to 12 digits
    const numericText = text.replace(/\D/g, '').slice(0, 12);
    const formattedText = AadharValidator.formatAadhar(numericText);
    
    setAuthState(prev => ({
      ...prev,
      aadharNumber: numericText,
      error: null
    }));
  };

  const handleSendOTP = async () => {
    const validation = AadharValidator.validate(authState.aadharNumber);
    
    if (!validation.isValid) {
      setAuthState(prev => ({
        ...prev,
        error: 'Please enter a valid 12-digit Aadhar number'
      }));
      return;
    }

    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const otp = await AuthenticationService.generateOTP(authState.aadharNumber);
      
      setAuthState(prev => ({
        ...prev,
        generatedOTP: otp,
        step: 'otp',
        isLoading: false
      }));
      
      setTimer(300); // 5 minutes
      setCanResend(false);
      
      // Focus on first OTP input
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
      
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to send OTP. Please try again.'
      }));
    }
  };

  const handleOTPChange = (text: string, index: number) => {
    const numericText = text.replace(/\D/g, '');
    
    if (numericText.length <= 1) {
      const newOTP = authState.otp.split('');
      newOTP[index] = numericText;
      const updatedOTP = newOTP.join('');
      
      setAuthState(prev => ({
        ...prev,
        otp: updatedOTP,
        error: null
      }));

      // Auto-focus next input
      if (numericText && index < 5) {
        otpInputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleOTPKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !authState.otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    if (authState.otp.length !== 6) {
      setAuthState(prev => ({
        ...prev,
        error: 'Please enter the complete 6-digit OTP'
      }));
      return;
    }

    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await AuthenticationService.validateOTP(authState.aadharNumber, authState.otp);
      
      if (result.success) {
        const user: UserProfile = {
          id: generateUniqueId(),
          name: 'User', // In real app, this would come from Aadhar verification
          aadharNumber: authState.aadharNumber,
          authMethod: 'otp',
          lastLogin: new Date()
        };

        navigation.navigate('Dashboard', { user, authMethod: 'OTP Authentication' });
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: result.error || 'Invalid OTP. Please try again.'
        }));
      }
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Verification failed. Please try again.'
      }));
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;
    
    setAuthState(prev => ({ ...prev, otp: '', error: null }));
    await handleSendOTP();
  };

  const handleGoBack = () => {
    if (authState.step === 'otp') {
      setAuthState(prev => ({
        ...prev,
        step: 'aadhar',
        otp: '',
        generatedOTP: '',
        error: null
      }));
      setTimer(0);
      setCanResend(false);
    } else {
      navigation.goBack();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderAadharInput = () => (
    <Animated.View 
      style={[
        styles.stepContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <View style={styles.iconContainer}>
        <Ionicons name="card-outline" size={40} color={Colors.primary} />
      </View>
      
      <Text style={styles.stepTitle}>Enter Aadhar Number</Text>
      <Text style={styles.stepSubtitle}>
        Please enter your 12-digit Aadhar number to receive OTP
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          ref={aadharInputRef}
          style={styles.aadharInput}
          value={AadharValidator.formatAadhar(authState.aadharNumber)}
          onChangeText={handleAadharChange}
          placeholder="0000 0000 0000"
          placeholderTextColor={Colors.text.light}
          keyboardType="numeric"
          maxLength={14} // Including spaces
          autoFocus
        />
        <Ionicons 
          name="card" 
          size={20} 
          color={Colors.text.secondary} 
          style={styles.inputIcon}
        />
      </View>

      {authState.error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={16} color={Colors.error} />
          <Text style={styles.errorText}>{authState.error}</Text>
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.primaryButton,
          authState.isLoading && styles.buttonDisabled
        ]}
        onPress={handleSendOTP}
        disabled={authState.isLoading || authState.aadharNumber.length !== 12}
      >
        <LinearGradient
          colors={Colors.gradients.otp}
          style={styles.buttonGradient}
        >
          {authState.isLoading ? (
            <Animated.View style={styles.loadingIndicator} />
          ) : (
            <>
              <Ionicons name="send" size={20} color={Colors.text.white} />
              <Text style={styles.buttonText}>Send OTP</Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderOTPInput = () => (
    <Animated.View 
      style={[
        styles.stepContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <View style={styles.iconContainer}>
        <Ionicons name="shield-checkmark" size={40} color={Colors.primary} />
      </View>
      
      <Text style={styles.stepTitle}>Enter OTP</Text>
      <Text style={styles.stepSubtitle}>
        We've sent a 6-digit OTP to {AadharValidator.maskAadhar(authState.aadharNumber)}
      </Text>

      <View style={styles.otpContainer}>
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              otpInputRefs.current[index] = ref;
            }}
            style={[
              styles.otpInput,
              authState.otp[index] && styles.otpInputFilled
            ]}
            value={authState.otp[index] || ''}
            onChangeText={(text) => handleOTPChange(text, index)}
            onKeyPress={({ nativeEvent }) => handleOTPKeyPress(nativeEvent.key, index)}
            placeholder="0"
            placeholderTextColor={Colors.text.light}
            keyboardType="numeric"
            maxLength={1}
            textAlign="center"
          />
        ))}
      </View>

      {timer > 0 && (
        <View style={styles.timerContainer}>
          <Ionicons name="time-outline" size={16} color={Colors.text.secondary} />
          <Text style={styles.timerText}>
            Resend OTP in {formatTime(timer)}
          </Text>
        </View>
      )}

      {authState.error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={16} color={Colors.error} />
          <Text style={styles.errorText}>{authState.error}</Text>
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.primaryButton,
          authState.isLoading && styles.buttonDisabled
        ]}
        onPress={handleVerifyOTP}
        disabled={authState.isLoading || authState.otp.length !== 6}
      >
        <LinearGradient
          colors={Colors.gradients.otp}
          style={styles.buttonGradient}
        >
          {authState.isLoading ? (
            <Animated.View style={styles.loadingIndicator} />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={20} color={Colors.text.white} />
              <Text style={styles.buttonText}>Verify OTP</Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>

      {canResend && (
        <TouchableOpacity style={styles.resendButton} onPress={handleResendOTP}>
          <Text style={styles.resendText}>Didn't receive OTP? </Text>
          <Text style={styles.resendLink}>Resend</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <LinearGradient
          colors={Colors.gradients.background}
          style={styles.gradientContainer}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
              <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>OTP Authentication</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {authState.step === 'aadhar' ? renderAadharInput() : renderOTPInput()}
          </ScrollView>
        </LinearGradient>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardContainer: {
    flex: 1,
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  stepContainer: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    ...Shadows.medium,
  },
  stepTitle: {
    ...Typography.h2,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
    fontWeight: 'bold',
  },
  stepSubtitle: {
    ...Typography.body,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
    lineHeight: 24,
  },
  inputContainer: {
    position: 'relative',
    width: '100%',
    marginBottom: Spacing.lg,
  },
  aadharInput: {
    ...Typography.body,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingRight: 50,
    textAlign: 'center',
    fontSize: 18,
    letterSpacing: 2,
    ...Shadows.small,
  },
  inputIcon: {
    position: 'absolute',
    right: Spacing.md,
    top: '50%',
    marginTop: -10,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.sm,
  },
  otpInput: {
    width: 45,
    height: 55,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
    ...Shadows.small,
  },
  otpInputFilled: {
    backgroundColor: Colors.primary,
    color: Colors.text.white,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  timerText: {
    ...Typography.caption,
    color: Colors.text.secondary,
    marginLeft: Spacing.xs,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
  },
  errorText: {
    ...Typography.caption,
    color: Colors.error,
    marginLeft: Spacing.xs,
    flex: 1,
  },
  primaryButton: {
    width: '100%',
    marginBottom: Spacing.md,
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
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.text.white,
    opacity: 0.8,
  },
  resendButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.md,
  },
  resendText: {
    ...Typography.caption,
    color: Colors.text.secondary,
  },
  resendLink: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
  },
});

export default OTPAuthScreen;