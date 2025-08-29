import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows, Animation } from '../constants/theme';
import { AuthMethod } from '../types';

const { width } = Dimensions.get('window');

interface AuthCardProps {
  method: AuthMethod;
  onPress: () => void;
  isLoading?: boolean;
  index: number;
}

const AuthCard: React.FC<AuthCardProps> = ({ method, onPress, isLoading = false, index }) => {
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Staggered animation entrance
    const delay = index * 150;
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: Animation.timing.medium,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: Animation.timing.medium,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: Animation.timing.medium,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim, translateYAnim, index]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const getIconName = (id: string): keyof typeof Ionicons.glyphMap => {
    switch (id) {
      case 'otp':
        return 'phone-portrait-outline';
      case 'fingerprint':
        return 'finger-print-outline';
      case 'face':
        return 'scan-outline';
      default:
        return 'shield-checkmark-outline';
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [
            { scale: scaleAnim },
            { translateY: translateYAnim }
          ]
        }
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isLoading}
        style={styles.touchable}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={method.color as [string, string, ...string[]]}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <Ionicons
                name={getIconName(method.id)}
                size={28}
                color={Colors.text.white}
              />
            </View>
            
            <View style={styles.textContainer}>
              <Text style={styles.title}>{method.title}</Text>
              <Text style={styles.subtitle}>{method.subtitle}</Text>
            </View>
            
            <View style={styles.arrowContainer}>
              <Ionicons
                name="chevron-forward"
                size={18}
                color="rgba(255, 255, 255, 0.8)"
              />
            </View>
          </View>
          
          {/* Loading overlay */}
          {isLoading && (
            <View style={styles.loadingOverlay}>
              <Animated.View style={styles.loadingIndicator} />
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.sm,
    marginHorizontal: Spacing.lg,
  },
  touchable: {
    borderRadius: BorderRadius.lg,
    ...Shadows.medium,
  },
  gradient: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    minHeight: 80,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  textContainer: {
    flex: 1,
    paddingRight: Spacing.sm,
  },
  title: {
    ...Typography.body,
    color: Colors.text.white,
    fontWeight: 'bold',
    marginBottom: 2,
    fontSize: 16,
  },
  subtitle: {
    ...Typography.caption,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 0,
    fontSize: 12,
  },
  description: {
    display: 'none',
  },
  arrowContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
  },
  loadingIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.text.white,
    opacity: 0.8,
  },
});

export default AuthCard;