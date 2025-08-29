import { AadharValidation, OTPSession } from '../types';

export class OTPGenerator {
  static generate(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  
  static logToConsole(aadharNumber: string, otp: string): void {
    console.log(`
==========================================
🔐 OTP GENERATED FOR AUTHENTICATION 🔐
==========================================
Aadhar Number: ${this.maskAadhar(aadharNumber)}
Generated OTP: ${otp}
Timestamp: ${new Date().toISOString()}
Valid for: 5 minutes
==========================================
    `);
  }
  
  private static maskAadhar(aadhar: string): string {
    if (aadhar.length !== 12) return aadhar;
    return aadhar.replace(/(\d{4})(\d{4})(\d{4})/, '****-****-$3');
  }
}

export class AadharValidator {
  static validate(aadharNumber: string): AadharValidation {
    const cleanNumber = aadharNumber.replace(/\s/g, '');
    
    // Basic validation: should be 12 digits
    const isValid = /^\d{12}$/.test(cleanNumber);
    
    return {
      number: cleanNumber,
      isValid,
      maskedNumber: this.maskAadhar(cleanNumber)
    };
  }
  
  static maskAadhar(aadhar: string): string {
    if (aadhar.length !== 12) return aadhar;
    return aadhar.replace(/(\d{4})(\d{4})(\d{4})/, '****-****-$3');
  }
  
  static formatAadhar(aadhar: string): string {
    const cleanNumber = aadhar.replace(/\D/g, '');
    if (cleanNumber.length <= 4) return cleanNumber;
    if (cleanNumber.length <= 8) return `${cleanNumber.slice(0, 4)} ${cleanNumber.slice(4)}`;
    return `${cleanNumber.slice(0, 4)} ${cleanNumber.slice(4, 8)} ${cleanNumber.slice(8, 12)}`;
  }
}

export class AuthenticationService {
  private static otpSessions: Map<string, OTPSession> = new Map();
  
  static async generateOTP(aadharNumber: string): Promise<string> {
    const otp = OTPGenerator.generate();
    const session: OTPSession = {
      aadharNumber,
      generatedOTP: otp,
      attempts: 0,
      maxAttempts: 3,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      isVerified: false
    };
    
    this.otpSessions.set(aadharNumber, session);
    OTPGenerator.logToConsole(aadharNumber, otp);
    
    return otp;
  }
  
  static async validateOTP(aadharNumber: string, otp: string): Promise<{ success: boolean; error?: string }> {
    const session = this.otpSessions.get(aadharNumber);
    
    if (!session) {
      return { success: false, error: 'No OTP session found. Please generate OTP first.' };
    }
    
    if (new Date() > session.expiresAt) {
      this.otpSessions.delete(aadharNumber);
      return { success: false, error: 'OTP has expired. Please generate a new one.' };
    }
    
    if (session.attempts >= session.maxAttempts) {
      this.otpSessions.delete(aadharNumber);
      return { success: false, error: 'Maximum attempts reached. Please generate a new OTP.' };
    }
    
    session.attempts++;
    
    if (session.generatedOTP === otp) {
      session.isVerified = true;
      this.otpSessions.delete(aadharNumber);
      return { success: true };
    } else {
      const remainingAttempts = session.maxAttempts - session.attempts;
      return { 
        success: false, 
        error: `Invalid OTP. ${remainingAttempts} attempts remaining.` 
      };
    }
  }
  
  static clearOTPSession(aadharNumber: string): void {
    this.otpSessions.delete(aadharNumber);
  }
}

export const generateUniqueId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const formatTimestamp = (date: Date): string => {
  return date.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};