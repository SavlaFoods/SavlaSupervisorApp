import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
  ActivityIndicator,
  StatusBar,
} from 'react-native';

import Header from '../components/Header';
import Drawer from '../components/Drawer';
import BottomTabNavigator from '../components/BottomTabNavigator';
import { getUserData } from '../utils/storage';
import {
  allowedHomeActionsByRole,
  allowedTabsByRole,
} from '../config/roleConfig';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './MainApp';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');

interface HomeScreenProps {
  roleId: string;
  setActiveTab: (tab: string) => void;
}

const HomeScreen = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    const initialize = async () => {
      try {
        const storedUser = await getUserData();
        console.log('[HomeScreen] Loaded user from storage:', storedUser);
        setUser(storedUser);
      } catch (err) {
        console.error('[HomeScreen] Error reading user data:', err);
      } finally {
        setLoading(false);
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ]).start();
      }
    };

    initialize();
  }, []);

  const displayName = user?.DisplayName || 'User';
  const roleDescription = user?.OperationalRole?.Description || 'Staff';
  const roleId = String(user?.RoleOpId ?? user?.OperationalRole?.RoleId ?? '0');
  const allowedActions = allowedHomeActionsByRole[roleId] || [];
  const allowedTabs = allowedTabsByRole[roleId] ||
    allowedTabsByRole.default || ['home'];

  const warehouseImages = [
    require('../assets/s1.jpeg'),
    require('../assets/s2.jpeg'),
    require('../assets/s3.jpeg'),
    require('../assets/s4.jpeg'),
  ];

  const handleLogout = () => {
    console.log('Logout requested');
    setDrawerVisible(false);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    console.log('[HomeScreen] Tab changed to:', tab);

    // Navigate based on tab selection
    switch (tab) {
      case 'home':
        // Already on home, just update state
        break;
      case 'reports':
        navigation.navigate('OutstandingReportScreen');
        break;
      case 'team':
        // Navigate to team screen if you have one
        // navigation.navigate('TeamScreen');
        break;
      case 'profile':
        // Navigate to profile screen if you have one
        // navigation.navigate('ProfileScreen');
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#1a5fb4" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <Header
        onMenuPress={() => setDrawerVisible(true)}
        title="Supervisor Dashboard"
      />

      <Drawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        onLogout={handleLogout}
        userName={displayName}
        userRole={roleDescription}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* Compact Header */}
          <View style={styles.headerSection}>
            <View>
              <Text style={styles.greetingText}>
                Welcome, {displayName.split(' ')[0]}
              </Text>
              <Text style={styles.roleText}>{roleDescription}</Text>
            </View>
            <View style={styles.dateChip}>
              <Text style={styles.dateText}>
                {new Date().toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                })}
              </Text>
            </View>
          </View>

          {/* Key Metrics - Compact */}
          <View style={styles.metricsRow}>
            <View style={styles.metricItem}>
              <View style={styles.metricIconBlue}>
                <Text style={styles.metricIconText}>📊</Text>
              </View>
              <View style={styles.metricContent}>
                <Text style={styles.metricValue}>92%</Text>
                <Text style={styles.metricLabel}>Utilization</Text>
              </View>
            </View>

            <View style={styles.metricDivider} />

            <View style={styles.metricItem}>
              <View style={styles.metricIconOrange}>
                <Text style={styles.metricIconText}>📦</Text>
              </View>
              <View style={styles.metricContent}>
                <Text style={styles.metricValue}>248</Text>
                <Text style={styles.metricLabel}>Active SKUs</Text>
              </View>
            </View>

            <View style={styles.metricDivider} />

            <View style={styles.metricItem}>
              <View style={styles.metricIconBlue}>
                <Text style={styles.metricIconText}>👥</Text>
              </View>
              <View style={styles.metricContent}>
                <Text style={styles.metricValue}>11</Text>
                <Text style={styles.metricLabel}>On Duty</Text>
              </View>
            </View>
          </View>

          {/* Warehouse Zones - Grid View */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Warehouse Zones</Text>
              <TouchableOpacity>
                <Text style={styles.linkText}>View All →</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.zoneGrid}>
              {warehouseImages.map((img, idx) => (
                <TouchableOpacity key={idx} style={styles.zoneCard}>
                  <Image
                    source={img}
                    style={styles.zoneImage}
                    resizeMode="cover"
                  />
                  <View style={styles.zoneInfo}>
                    <Text style={styles.zoneName}>
                      Zone {String.fromCharCode(65 + idx)}
                    </Text>
                    <View style={styles.zoneStatus}>
                      <View style={styles.statusDot} />
                      <Text style={styles.zoneStatusText}>Active</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Quick Actions - Compact Grid */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>

            <View style={styles.actionsCompactGrid}>
              <TouchableOpacity style={styles.actionCompact}>
                <View style={[styles.actionCompactIcon, styles.iconBlue]}>
                  <Text style={styles.actionIconText}>📦</Text>
                </View>
                <Text style={styles.actionCompactText}>Inventory</Text>
              </TouchableOpacity>

              {allowedActions.includes('outstanding-report') && (
                <TouchableOpacity
                  style={styles.actionCompact}
                  onPress={() => navigation.navigate('OutstandingReportScreen')}
                >
                  <View style={[styles.actionCompactIcon, styles.iconOrange]}>
                    <Text style={styles.actionIconText}>📊</Text>
                  </View>
                  <Text style={styles.actionCompactText}>Reports</Text>
                </TouchableOpacity>
              )}

              {allowedActions.includes('new-collection') && (
                <TouchableOpacity
                  style={styles.actionCompact}
                  onPress={() => {
                    navigation.navigate('FieldCollectionEntry');
                  }}
                >
                  <View style={[styles.actionCompactIcon, styles.iconBlue]}>
                    <Text style={styles.actionIconText}>💰</Text>
                  </View>
                  <Text style={styles.actionCompactText}>Collection</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity style={styles.actionCompact}>
                <View style={[styles.actionCompactIcon, styles.iconOrange]}>
                  <Text style={styles.actionIconText}>📋</Text>
                </View>
                <Text style={styles.actionCompactText}>Tasks</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionCompact}>
                <View style={[styles.actionCompactIcon, styles.iconBlue]}>
                  <Text style={styles.actionIconText}>🚚</Text>
                </View>
                <Text style={styles.actionCompactText}>Shipments</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionCompact}>
                <View style={[styles.actionCompactIcon, styles.iconOrange]}>
                  <Text style={styles.actionIconText}>⚙️</Text>
                </View>
                <Text style={styles.actionCompactText}>Settings</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Recent Activity - Compact */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <TouchableOpacity>
                <Text style={styles.linkText}>View All →</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.activityList}>
              <View style={styles.activityCompactItem}>
                <View
                  style={[styles.activityIndicator, styles.indicatorBlue]}
                />
                <View style={styles.activityCompactContent}>
                  <Text style={styles.activityCompactTitle}>
                    Inventory Updated
                  </Text>
                  <Text style={styles.activityCompactTime}>2h ago</Text>
                </View>
              </View>

              <View style={styles.activityCompactItem}>
                <View
                  style={[styles.activityIndicator, styles.indicatorOrange]}
                />
                <View style={styles.activityCompactContent}>
                  <Text style={styles.activityCompactTitle}>
                    New Order Received
                  </Text>
                  <Text style={styles.activityCompactTime}>5h ago</Text>
                </View>
              </View>

              <View style={styles.activityCompactItem}>
                <View
                  style={[styles.activityIndicator, styles.indicatorBlue]}
                />
                <View style={styles.activityCompactContent}>
                  <Text style={styles.activityCompactTitle}>
                    Report Generated
                  </Text>
                  <Text style={styles.activityCompactTime}>Yesterday</Text>
                </View>
              </View>

              <View style={styles.activityCompactItem}>
                <View
                  style={[styles.activityIndicator, styles.indicatorOrange]}
                />
                <View style={styles.activityCompactContent}>
                  <Text style={styles.activityCompactTitle}>
                    Team Check-in Complete
                  </Text>
                  <Text style={styles.activityCompactTime}>2d ago</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Extra padding for bottom tab navigator */}
          <View style={{ height: 100 }} />
        </Animated.View>
      </ScrollView>

      {/* Bottom Tab Navigator - Now Enabled */}
      <BottomTabNavigator
        activeTab={activeTab}
        onTabChange={handleTabChange}
        allowedTabs={allowedTabs}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    marginTop: 16,
    color: '#666666',
    fontSize: 15,
    fontWeight: '500',
  },

  // Compact Header
  headerSection: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  greetingText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  roleText: {
    fontSize: 13,
    color: '#666666',
    fontWeight: '500',
  },
  dateChip: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dateText: {
    fontSize: 12,
    color: '#1a1a1a',
    fontWeight: '600',
  },

  // Compact Metrics Row
  metricsRow: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  metricItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricIconBlue: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  metricIconOrange: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#fff3e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  metricIconText: {
    fontSize: 18,
  },
  metricContent: {
    flex: 1,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    lineHeight: 20,
  },
  metricLabel: {
    fontSize: 10,
    color: '#666666',
    fontWeight: '500',
    marginTop: 1,
  },
  metricDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 8,
  },

  // Sections
  section: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  linkText: {
    fontSize: 13,
    color: '#1a5fb4',
    fontWeight: '600',
  },

  // Warehouse Zones Grid
  zoneGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  zoneCard: {
    width: (width - 42) / 2,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  zoneImage: {
    width: '100%',
    height: 90,
  },
  zoneInfo: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  zoneName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  zoneStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4caf50',
    marginRight: 4,
  },
  zoneStatusText: {
    fontSize: 11,
    color: '#4caf50',
    fontWeight: '600',
  },

  // Compact Actions Grid
  actionsCompactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 12,
  },
  actionCompact: {
    width: (width - 52) / 3,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  actionCompactIcon: {
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconBlue: {
    backgroundColor: '#e3f2fd',
  },
  iconOrange: {
    backgroundColor: '#fff3e0',
  },
  actionIconText: {
    fontSize: 20,
  },
  actionCompactText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
  },

  // Compact Activity
  activityList: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  activityCompactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  activityIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 10,
  },
  indicatorBlue: {
    backgroundColor: '#1a5fb4',
  },
  indicatorOrange: {
    backgroundColor: '#ef6c00',
  },
  activityCompactContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityCompactTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
  },
  activityCompactTime: {
    fontSize: 11,
    color: '#999999',
    fontWeight: '500',
  },
});

export default HomeScreen;
