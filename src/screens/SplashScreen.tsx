import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Animation } from '../constants/theme';
import { RootStackParamList } from '../types';

const { width, height } = Dimensions.get('window');

type SplashScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Splash'>;

interface Props {
  navigation: SplashScreenNavigationProp;
}

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const translateYAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: Animation.timing.long,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: Animation.timing.long,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: Animation.timing.long,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to AuthSelection after 3 seconds
    const timer = setTimeout(() => {
      navigation.replace('AuthSelection');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation, fadeAnim, scaleAnim, translateYAnim]);

  return (
    <LinearGradient
      colors={Colors.gradients.primary}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: translateYAnim }
            ]
          }
        ]}
      >
        <View style={styles.logoContainer}>
          <Ionicons 
            name="shield-checkmark" 
            size={60} 
            color={Colors.text.white} 
          />
        </View>
        
        <Text style={styles.title}>Pehchan</Text>
        <Text style={styles.subtitle}>Digital Identity • Secure Authentication</Text>
        
        <View style={styles.loadingContainer}>
          <Animated.View style={styles.loadingDot} />
          <Animated.View style={[styles.loadingDot, { marginLeft: 8 }]} />
          <Animated.View style={[styles.loadingDot, { marginLeft: 8 }]} />
        </View>
      </Animated.View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Government of India</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  title: {
    ...Typography.h1,
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text.white,
    textAlign: 'center',
    marginBottom: Spacing.sm,
    letterSpacing: 0.5,
  },
  subtitle: {
    ...Typography.body,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  loadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.text.white,
    opacity: 0.6,
  },
  footer: {
    position: 'absolute',
    bottom: Spacing.xl,
    alignItems: 'center',
  },
  footerText: {
    ...Typography.small,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    fontSize: 11,
  },
});

export default SplashScreen;