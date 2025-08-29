# Pehchan - Authentication App

Modern multi-method authentication for mobile devices built with React Native and Expo.

![React Native](https://img.shields.io/badge/React%20Native-0.79.6-blue.svg)
![Expo](https://img.shields.io/badge/Expo-~53.0.22-000020.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-~5.8.3-blue)
![Authentication](https://img.shields.io/badge/Authentication-Multi--Method-green)

## 🔐 Overview

Pehchan is a modern authentication application that provides multiple secure authentication methods including OTP verification, fingerprint authentication, and facial recognition. Built with React Native and Expo, it offers a seamless cross-platform experience with bank-grade security.

## ✨ Features

### Authentication Methods
- **🔢 OTP Authentication**: Aadhar-based SMS OTP verification
- **👆 Fingerprint Authentication**: Quick biometric access using device fingerprint sensors
- **🔍 Face Authentication**: Advanced facial recognition technology
- **🔄 Fallback Methods**: Multiple authentication options with seamless switching

### Security Features
- 🏦 Bank-grade encryption and security protocols
- 🔐 Secure device storage for sensitive data
- 🛡️ Industry-standard authentication validation
- 🔒 Biometric capability detection and enrollment status
- ⚡ Real-time OTP generation and validation

### User Experience
- 🎨 Modern, intuitive interface with smooth animations
- 📱 Cross-platform compatibility (iOS & Android)
- 🌟 Responsive design with accessibility support
- 💫 Gesture-based navigation and interactions
- 🔄 Automatic session management

## 🛠️ Technical Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | React Native 0.79.6, Expo ~53.0.22 |
| **Language** | TypeScript ~5.8.3 |
| **Navigation** | React Navigation 6.x |
| **Authentication** | Expo Local Authentication |
| **UI Components** | Expo Vector Icons, Linear Gradient |
| **State Management** | React Hooks |
| **Gesture Handling** | React Native Gesture Handler |
| **Development** | Expo CLI, Metro Bundler |

## 📱 Supported Platforms

- **iOS**: iPhone and iPad (iOS 11.0+)
- **Android**: Android devices (API 21+)
- **Development**: Expo Go for testing

## 🚀 Installation & Setup

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** 18.0 or higher
- **Expo CLI** (`npm install -g expo-cli`)
- **Git** for version control

### Clone Repository

```bash
git clone https://github.com/CodeWithJainendra/Pehchan-Lo.git
cd Pehchan-Lo
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
# Start Expo development server
npm start

# Or use specific platform commands
npm run android  # For Android
npm run ios      # For iOS
npm run web      # For web (limited features)
```

### Run on Device

1. **Using Expo Go App**:
   - Install Expo Go from App Store or Google Play
   - Scan the QR code displayed in terminal

2. **Using Expo Development Build**:
   ```bash
   expo install --fix  # Fix dependency versions
   expo run:android    # Build and run on Android
   expo run:ios        # Build and run on iOS (macOS only)
   ```

## 📂 Project Structure

```
Pehchan-Lo/
├── README.md                 # Project documentation
├── app.json                  # Expo configuration
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── App.tsx                  # Main application entry point
├── index.ts                 # Application bootstrap
├── src/
│   ├── components/          # Reusable UI components
│   │   └── AuthCard.tsx     # Authentication method cards
│   ├── screens/             # Application screens
│   │   ├── SplashScreen.tsx         # App launch screen
│   │   ├── AuthSelectionScreen.tsx  # Authentication method selection
│   │   ├── OTPAuthScreen.tsx        # OTP verification screen
│   │   ├── BiometricAuthScreen.tsx  # Biometric authentication
│   │   └── DashboardScreen.tsx      # Main dashboard
│   ├── navigation/          # Navigation configuration
│   │   └── AppNavigator.tsx # Stack navigator setup
│   ├── constants/           # App constants and themes
│   │   └── theme.ts         # Design system and styling
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts         # Global type exports
│   └── utils/              # Utility functions
│       └── authUtils.ts     # Authentication helpers
└── assets/                 # Static resources (icons, images)
    ├── icon.png            # App icon
    ├── splash-icon.png     # Splash screen icon
    ├── adaptive-icon.png   # Android adaptive icon
    └── favicon.png         # Web favicon
```

## 🔄 Authentication Flow

### OTP Authentication Process

1. **Aadhar Input**: User enters 12-digit Aadhar number
2. **Validation**: Format and checksum validation
3. **OTP Generation**: 6-digit OTP sent via SMS simulation
4. **Verification**: OTP validation with 5-minute expiry
5. **Dashboard Access**: Successful authentication redirects to dashboard

### Biometric Authentication Process

1. **Capability Check**: Verify device biometric hardware and enrollment
2. **Method Selection**: Fingerprint or Face ID based on device support
3. **Authentication**: Native biometric prompt with fallback options
4. **Validation**: Secure biometric validation through device APIs
5. **Dashboard Access**: Successful authentication grants access

## 🔧 Configuration

### Environment Variables

The app supports multiple environment configurations:

```typescript
// Development Configuration
{
  "expo": {
    "name": "Authentication App (Dev)",
    "slug": "auth-app-dev",
    "scheme": "authapp-dev"
  }
}

// Production Configuration
{
  "expo": {
    "name": "Pehchan",
    "slug": "pehchan-auth",
    "scheme": "pehchan"
  }
}
```

### Device Permissions

#### iOS Permissions (Info.plist)
- `NSFaceIDUsageDescription`: Face ID authentication access

#### Android Permissions (AndroidManifest.xml)
- `USE_FINGERPRINT`: Fingerprint sensor access
- `USE_BIOMETRIC`: Biometric authentication access

## 🧪 Testing

### Development Testing

```bash
# Run on iOS Simulator
npm run ios

# Run on Android Emulator  
npm run android

# Test on physical device via Expo Go
npm start
```

### Device Compatibility Testing

| Feature | iOS Testing | Android Testing |
|---------|------------|-----------------|
| **Fingerprint** | Touch ID devices | Fingerprint sensor devices |
| **Face Recognition** | Face ID devices | Face unlock supported devices |
| **OTP** | All iOS devices | All Android devices |
| **Navigation** | iOS 11.0+ | API 21+ |

### Security Testing

- Biometric authentication validation
- OTP generation and expiry testing
- Secure storage verification
- Authentication flow integrity

## 🔒 Security Features

### Data Protection
- **Local Storage**: Sensitive data stored in device keychain/keystore
- **Transmission**: All data transmission uses HTTPS encryption
- **Biometric Data**: Never stored locally, handled by device secure enclave
- **OTP Security**: Time-based expiry with single-use validation

### Authentication Validation
- **Aadhar Validation**: Format and checksum verification
- **Biometric Security**: Device-level biometric validation
- **Session Management**: Secure token handling and automatic expiry
- **Error Handling**: Secure error messages without sensitive data exposure

## 📚 API Reference

### AuthenticationService

```typescript
interface AuthenticationService {
  generateOTP(aadharNumber: string): Promise<string>;
  validateOTP(aadharNumber: string, otp: string): Promise<ValidationResult>;
  checkBiometricCapabilities(): Promise<BiometricCapabilities>;
  authenticateWithBiometrics(type: BiometricType): Promise<AuthResult>;
}
```

### Component Props

#### AuthCard Component
```typescript
interface AuthCardProps {
  method: AuthMethod;
  onPress: () => void;
  isLoading: boolean;
  index: number;
}
```

#### Navigation Types
```typescript
type RootStackParamList = {
  Splash: undefined;
  AuthSelection: undefined;
  OTPAuth: undefined;
  BiometricAuth: { type: 'fingerprint' | 'face' };
  Dashboard: { user: UserProfile; authMethod: string };
};
```

## 🎨 Design System

### Color Palette
```typescript
const Colors = {
  primary: '#1E3A8A',      // Deep blue
  secondary: '#3B82F6',    // Bright blue  
  success: '#10B981',      // Green
  error: '#EF4444',        // Red
  warning: '#F59E0B',      // Amber
  
  background: '#F8FAFC',   // Light gray
  surface: '#FFFFFF',      // White
  
  text: {
    primary: '#1F2937',    // Dark gray
    secondary: '#6B7280',  // Medium gray
    light: '#9CA3AF',      // Light gray
    white: '#FFFFFF'       // White
  }
};
```

### Typography Scale
```typescript
const Typography = {
  h1: { fontSize: 32, fontWeight: 'bold' },
  h2: { fontSize: 28, fontWeight: 'bold' },
  h3: { fontSize: 24, fontWeight: '600' },
  body: { fontSize: 16, fontWeight: 'normal' },
  caption: { fontSize: 14, fontWeight: 'normal' },
  small: { fontSize: 12, fontWeight: 'normal' }
};
```

## 🚀 Deployment

### Build for Production

#### iOS Build
```bash
# Using EAS Build (recommended)
eas build --platform ios --profile production

# Using Expo Build (legacy)
expo build:ios --type archive
```

#### Android Build
```bash
# Using EAS Build (recommended)  
eas build --platform android --profile production

# Using Expo Build (legacy)
expo build:android --type app-bundle
```

### Distribution

1. **App Store (iOS)**:
   - Upload .ipa file via Xcode or Application Loader
   - Configure app metadata and screenshots
   - Submit for App Store review

2. **Google Play Store (Android)**:
   - Upload .aab file to Google Play Console
   - Configure store listing and privacy policy
   - Submit for Play Store review

## 🤝 Contributing

We welcome contributions to improve Pehchan! Please follow these steps:

1. **Fork the Repository**
2. **Create Feature Branch**: `git checkout -b feature/amazing-feature`
3. **Commit Changes**: `git commit -m 'Add amazing feature'`
4. **Push to Branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use consistent code formatting (Prettier)
- Write meaningful commit messages
- Add proper type definitions
- Test on multiple devices

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support & Contact

- **Documentation**: [GitHub Wiki](https://github.com/CodeWithJainendra/Pehchan-Lo/wiki)
- **Issues**: [GitHub Issues](https://github.com/CodeWithJainendra/Pehchan-Lo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/CodeWithJainendra/Pehchan-Lo/discussions)

## 🙏 Acknowledgments

- [Expo](https://expo.dev) for the amazing development platform
- [React Navigation](https://reactnavigation.org) for navigation solutions
- [React Native Community](https://reactnative.dev/community/overview) for continuous support
- All contributors who help make this project better

---

**Built with ❤️ for secure mobile authentication**

*Pehchan - Recognizing security in simplicity*