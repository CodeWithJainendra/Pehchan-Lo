export type RootStackParamList = {
  Splash: undefined;
  AuthSelection: undefined;
  OTPAuth: undefined;
  BiometricAuth: { type: 'fingerprint' | 'face' };
  Dashboard: { 
    user: UserProfile;
    authMethod: string;
  };
};

export interface AuthMethod {
  id: 'otp' | 'fingerprint' | 'face';
  title: string;
  subtitle: string;
  icon: string;
  color: readonly string[];
  description: string;
}

export interface UserProfile {
  id: string;
  name: string;
  aadharNumber?: string;
  authMethod: 'otp' | 'fingerprint' | 'face';
  lastLogin: Date;
}

export interface OTPAuthState {
  aadharNumber: string;
  otp: string;
  generatedOTP: string;
  step: 'aadhar' | 'otp' | 'verification';
  isLoading: boolean;
  error: string | null;
}

export interface BiometricAuthProps {
  type: 'fingerprint' | 'face';
  onSuccess: () => void;
  onError: (error: string) => void;
}

export interface AuthenticationSession {
  sessionId: string;
  userId: string;
  authMethod: AuthMethod['id'];
  timestamp: Date;
  isActive: boolean;
  expiresAt: Date;
}

export interface AadharValidation {
  number: string;
  isValid: boolean;
  maskedNumber: string;
}

export interface OTPSession {
  aadharNumber: string;
  generatedOTP: string;
  attempts: number;
  maxAttempts: number;
  expiresAt: Date;
  isVerified: boolean;
}

export type BiometricType = 'fingerprint' | 'face';

export interface AuthResult {
  success: boolean;
  error?: string;
  biometricType?: BiometricType;
}

export interface BiometricCapabilities {
  isAvailable: boolean;
  hasHardware: boolean;
  isEnrolled: boolean;
  supportedTypes: BiometricType[];
}