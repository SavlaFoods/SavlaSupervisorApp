// Drawer.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = Math.min(width * 0.78, 320);

interface DrawerProps {
  visible: boolean;
  onClose: () => void;
  onLogout: () => void;
  userName?: string;
  userRole?: string;
}

const Drawer: React.FC<DrawerProps> = ({
  visible,
  onClose,
  onLogout,
  userName = 'Supervisor',
  userRole = 'Supervisor',
}) => {
  const translateX = React.useRef(new Animated.Value(DRAWER_WIDTH)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.timing(translateX, {
        toValue: 0,
        duration: 280,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateX, {
        toValue: DRAWER_WIDTH,
        duration: 220,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.drawer,
                {
                  transform: [{ translateX }],
                },
              ]}
            >
              {/* User Info */}
              <View style={styles.userSection}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {userName.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.userName}>{userName}</Text>
                <Text style={styles.userRole}>{userRole}</Text>
              </View>

              <View style={styles.divider} />

              {/* Menu Items */}
              <View style={styles.menuSection}>
                {[
                  { icon: '🏠', text: 'Home' },
                  { icon: '👥', text: 'Team Management' },
                  { icon: '📊', text: 'Reports' },
                  { icon: '⚙️', text: 'Settings' },
                  { icon: 'ℹ️', text: 'Help & Support' },
                ].map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.menuItem}
                    onPress={() => {
                      // Add navigation later
                      console.log(`${item.text} pressed`);
                    }}
                  >
                    <Text style={styles.menuIcon}>{item.icon}</Text>
                    <Text style={styles.menuText}>{item.text}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.divider} />

              {/* Logout */}
              <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
                <Text style={styles.logoutIcon}>🚪</Text>
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>

              {/* Version */}
              <View style={styles.versionContainer}>
                <Text style={styles.versionText}>Version 1.0.0</Text>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    flexDirection: 'row-reverse', // ← This makes drawer appear from right
  },
  drawer: {
    width: DRAWER_WIDTH,
    backgroundColor: '#fff',
    height: '100%',
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 12,
  },
  userSection: {
    padding: 28,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: '#e6f2ff',
  },
  divider: {
    height: 1,
    backgroundColor: '#e8e8e8',
    marginVertical: 6,
  },
  menuSection: {
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 20,
    width: 32,
    textAlign: 'center',
  },
  menuText: {
    fontSize: 16,
    color: '#222',
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: '#fff5f5',
    borderRadius: 10,
  },
  logoutIcon: {
    fontSize: 24,
    marginRight: 18,
    width: 32,
    textAlign: 'center',
  },
  logoutText: {
    fontSize: 16,
    color: '#d32f2f',
    fontWeight: '600',
  },
  versionContainer: {
    position: 'absolute',
    bottom: 24,
    left: 24,
  },
  versionText: {
    fontSize: 12,
    color: '#aaa',
  },
});

export default Drawer;
