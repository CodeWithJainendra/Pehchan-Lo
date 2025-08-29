import React, { useEffect, useRef, useState } from 'react';
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Animated,
  Alert,
  Dimensions,
  BackHandler
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Shadows, Animation } from '../constants/theme';
import { RootStackParamList } from '../types';
import { formatTimestamp } from '../utils/authUtils';

const { width } = Dimensions.get('window');

type DashboardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Dashboard'>;
type DashboardScreenRouteProp = RouteProp<RootStackParamList, 'Dashboard'>;

interface Props {
  navigation: DashboardScreenNavigationProp;
  route: DashboardScreenRouteProp;
}

interface QuickAction {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string[];
  onPress: () => void;
}

const DashboardScreen: React.FC<Props> = ({ navigation, route }) => {
  const { user, authMethod } = route.params;
  const insets = useSafeAreaInsets();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const cardAnimations = useRef(Array(6).fill(0).map(() => new Animated.Value(0))).current;

  // Handle hardware back button when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        handleBackPress();
        return true;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription?.remove();
    }, [])
  );

  useEffect(() => {
    startEntranceAnimations();
    
    // Update time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => {
      clearInterval(timeInterval);
    };
  }, []);

  const startEntranceAnimations = () => {
    // Main content animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: Animation.timing.medium,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: Animation.timing.medium,
        useNativeDriver: true,
      }),
    ]).start();

    // Staggered card animations
    const cardStaggerDelay = 100;
    cardAnimations.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: Animation.timing.medium,
        delay: cardStaggerDelay * index,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleBackPress = (): boolean => {
    Alert.alert(
      'Exit App',
      'Are you sure you want to exit the application?',
      [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {
          text: 'Exit',
          onPress: () => BackHandler.exitApp(),
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
    return true; // Prevent default back action
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout and exit the app?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            // Clear any stored authentication data here if needed
            BackHandler.exitApp();
          },
        },
      ]
    );
  };

  const quickActions: QuickAction[] = [
    {
      id: 'profile',
      title: 'Profile',
      subtitle: 'View details',
      icon: 'person-outline',
      color: ['#64748B', '#94A3B8'], // Subtle gray-blue
      onPress: () => Alert.alert('Profile', 'Profile feature coming soon!')
    },
    {
      id: 'security',
      title: 'Security',
      subtitle: 'Settings',
      icon: 'shield-checkmark-outline',
      color: ['#475569', '#64748B'], // Muted slate
      onPress: () => Alert.alert('Security', 'Security settings coming soon!')
    },
    {
      id: 'notifications',
      title: 'Notifications',
      subtitle: 'Manage alerts',
      icon: 'notifications-outline',
      color: ['#6B7280', '#9CA3AF'], // Soft gray
      onPress: () => Alert.alert('Notifications', 'Notification settings coming soon!')
    },
    {
      id: 'help',
      title: 'Help & Support',
      subtitle: 'Get assistance',
      icon: 'help-circle-outline',
      color: ['#52525B', '#71717A'], // Neutral zinc
      onPress: () => Alert.alert('Help', 'Help center coming soon!')
    },
    {
      id: 'settings',
      title: 'Settings',
      subtitle: 'Preferences',
      icon: 'settings-outline',
      color: ['#57534E', '#78716C'], // Warm stone
      onPress: () => Alert.alert('Settings', 'Settings coming soon!')
    },
    {
      id: 'feedback',
      title: 'Feedback',
      subtitle: 'Share thoughts',
      icon: 'chatbubble-outline',
      color: ['#4C4F69', '#6C6F85'], // Muted lavender
      onPress: () => Alert.alert('Feedback', 'Feedback form coming soon!')
    }
  ];

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getAuthMethodIcon = () => {
    switch (user.authMethod) {
      case 'otp':
        return 'phone-portrait';
      case 'fingerprint':
        return 'finger-print';
      case 'face':
        return 'scan';
      default:
        return 'shield-checkmark';
    }
  };

  const getAuthMethodColor = () => {
    switch (user.authMethod) {
      case 'otp':
        return ['#475569', '#64748B']; // Muted slate
      case 'fingerprint':
        return ['#52525B', '#71717A']; // Neutral zinc
      case 'face':
        return ['#57534E', '#78716C']; // Warm stone
      default:
        return ['#1E293B', '#334155']; // Professional dark
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section */}
        <LinearGradient
          colors={['#1E293B', '#334155']} // Subtle professional gradient
          style={styles.headerGradient}
        >
          <Animated.View
            style={[
              styles.headerContent,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={styles.headerTop}>
              <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                <Ionicons name="arrow-back" size={20} color={Colors.text.white} />
              </TouchableOpacity>
              
              <View style={styles.greetingContainer}>
                <Text style={styles.greeting}>{getGreeting()}</Text>
                <Text style={styles.userName}>{user.name}</Text>
              </View>
              
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={20} color={Colors.text.white} />
              </TouchableOpacity>
            </View>

            <View style={styles.authInfoCard}>
              <LinearGradient
                colors={getAuthMethodColor() as [string, string, ...string[]]}
                style={styles.authInfoGradient}
              >
                <View style={styles.authInfoContent}>
                  <View style={styles.authIconContainer}>
                    <Ionicons 
                      name={getAuthMethodIcon() as keyof typeof Ionicons.glyphMap} 
                      size={24} 
                      color={Colors.text.white} 
                    />
                  </View>
                  <View style={styles.authTextContainer}>
                    <Text style={styles.authMethodText}>{authMethod}</Text>
                    <Text style={styles.authTimeText}>
                      Authenticated at {formatTimestamp(user.lastLogin)}
                    </Text>
                    {user.aadharNumber && (
                      <Text style={styles.authDetailsText}>
                        Aadhar: ****-****-{user.aadharNumber.slice(-4)}
                      </Text>
                    )}
                  </View>
                  <View style={styles.statusIndicator}>
                    <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
                  </View>
                </View>
              </LinearGradient>
            </View>
          </Animated.View>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <Animated.View
                key={action.id}
                style={[
                  styles.actionCard,
                  {
                    opacity: cardAnimations[index],
                    transform: [{
                      translateY: cardAnimations[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [30, 0]
                      })
                    }]
                  }
                ]}
              >
                <TouchableOpacity onPress={action.onPress}>
                  <LinearGradient
                    colors={action.color as [string, string, ...string[]]}
                    style={styles.actionGradient}
                  >
                    <View style={styles.actionContent}>
                      <Ionicons 
                        name={action.icon as keyof typeof Ionicons.glyphMap} 
                        size={24} 
                        color={Colors.text.white} 
                      />
                      <Text style={styles.actionTitle}>{action.title}</Text>
                      <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Security Status */}
        <View style={styles.securityContainer}>
          <View style={styles.securityHeader}>
            <Ionicons name="shield-checkmark" size={20} color={Colors.success} />
            <Text style={styles.securityTitle}>Security Status</Text>
          </View>
          
          <View style={styles.securityItem}>
            <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
            <Text style={styles.securityText}>Authentication Successful</Text>
          </View>
          
          <View style={styles.securityItem}>
            <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
            <Text style={styles.securityText}>Session Active</Text>
          </View>
          
          <View style={styles.securityItem}>
            <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
            <Text style={styles.securityText}>Device Trusted</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Authentication App v1.0.0
          </Text>
          <Text style={styles.footerSubtext}>
            Built with Expo SDK 53
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerGradient: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    borderBottomLeftRadius: BorderRadius.lg,
    borderBottomRightRadius: BorderRadius.lg,
  },
  headerContent: {
    paddingHorizontal: Spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  greetingContainer: {
    flex: 1,
    alignItems: 'center',
  },
  greeting: {
    ...Typography.caption,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: Spacing.xs,
    fontSize: 13,
  },
  userName: {
    ...Typography.h3,
    color: Colors.text.white,
    fontWeight: 'bold',
    fontSize: 20,
  },
  logoutButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  authInfoCard: {
    borderRadius: BorderRadius.lg,
    ...Shadows.medium,
  },
  authInfoGradient: {
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  authInfoContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  authTextContainer: {
    flex: 1,
  },
  authMethodText: {
    ...Typography.body,
    color: Colors.text.white,
    fontWeight: 'bold',
    marginBottom: 2,
    fontSize: 16,
  },
  authTimeText: {
    ...Typography.small,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 2,
    fontSize: 11,
  },
  authDetailsText: {
    ...Typography.small,
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 10,
  },
  statusIndicator: {
    marginLeft: Spacing.sm,
  },
  quickActionsContainer: {
    padding: Spacing.md,
  },
  sectionTitle: {
    ...Typography.body,
    color: Colors.text.primary,
    fontWeight: 'bold',
    marginBottom: Spacing.md,
    fontSize: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (width - Spacing.lg * 3) / 2,
    marginBottom: Spacing.sm,
  },
  actionGradient: {
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    ...Shadows.small,
  },
  actionContent: {
    alignItems: 'center',
  },
  actionTitle: {
    ...Typography.caption,
    color: Colors.text.white,
    fontWeight: '600',
    marginTop: Spacing.xs,
    marginBottom: 2,
    textAlign: 'center',
    fontSize: 13,
  },
  actionSubtitle: {
    ...Typography.small,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontSize: 11,
  },
  securityContainer: {
    margin: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    ...Shadows.small,
  },
  securityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  securityTitle: {
    ...Typography.body,
    color: Colors.text.primary,
    fontWeight: 'bold',
    marginLeft: Spacing.xs,
    fontSize: 15,
  },
  securityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  securityText: {
    ...Typography.caption,
    color: Colors.text.secondary,
    marginLeft: Spacing.xs,
    fontSize: 13,
  },
  footer: {
    alignItems: 'center',
    padding: Spacing.md,
  },
  footerText: {
    ...Typography.small,
    color: Colors.text.light,
    marginBottom: 2,
    fontSize: 11,
  },
  footerSubtext: {
    ...Typography.small,
    color: Colors.text.light,
    fontSize: 10,
  },
});

export default DashboardScreen;