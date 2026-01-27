// Header.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface HeaderProps {
  onMenuPress: () => void;
  title?: string;
}

const Header: React.FC<HeaderProps> = ({
  onMenuPress,
  title = 'Supervisor Dashboard',
}) => {
  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#007AFF"
        translucent={Platform.OS === 'android'}
      />

      <SafeAreaView
        style={styles.safeArea}
        edges={['top']} // ← Only apply top inset (important!)
      >
        <View style={styles.header}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/SavlaLogo.jpg')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Title */}
          <Text style={styles.headerTitle} numberOfLines={1}>
            {title}
          </Text>

          {/* Menu button */}
          <TouchableOpacity
            onPress={onMenuPress}
            style={styles.menuButton}
            hitSlop={{ top: 12, bottom: 12, left: 16, right: 16 }}
          >
            <View style={styles.hamburger}>
              <View style={styles.bar} />
              <View style={styles.bar} />
              <View style={styles.bar} />
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#007AFF',
  },
  header: {
    height: Platform.select({
      ios: 50, // Standard iOS nav bar height
      android: 56,
    }),
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: { elevation: 4 },
    }),
  },
  logoContainer: {
    flex: 1,
  },
  logo: {
    height: 38,
    width: 100,
    marginLeft: -30, // ← Adjust based on your actual logo aspect ratio
  },
  headerTitle: {
    flex: 3,
    textAlign: 'center',
    color: '#fff',
    fontSize: Platform.select({ ios: 17, default: 18 }),
    fontWeight: '600',
    marginRight: 30,
  },
  menuButton: {
    padding: 8,
  },
  hamburger: {
    width: 28,
    height: 22,
    justifyContent: 'space-between',
  },
  bar: {
    height: 3.5,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
});

export default Header;
