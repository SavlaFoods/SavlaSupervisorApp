// // src/components/BottomTabNavigator.tsx
// import React from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Platform,
// } from 'react-native';

// interface TabItem {
//   id: string;
//   label: string;
//   icon: string;
// }

// interface BottomTabNavigatorProps {
//   activeTab: string;
//   onTabChange: (tabId: string) => void;
// }

// const tabs: TabItem[] = [
//   { id: 'home', label: 'Home', icon: '🏠' },
//   { id: 'reports', label: 'Reports', icon: '📊' },
//   { id: 'team', label: 'Team', icon: '👥' },
//   { id: 'profile', label: 'Profile', icon: '👤' },
// ];

// const BottomTabNavigator: React.FC<BottomTabNavigatorProps> = ({
//   activeTab,
//   onTabChange,
// }) => {
//   return (
//     <View style={styles.container}>
//       <View style={styles.tabBar}>
//         {tabs.map(tab => {
//           const isActive = activeTab === tab.id;
//           return (
//             <TouchableOpacity
//               key={tab.id}
//               style={styles.tabItem}
//               onPress={() => onTabChange(tab.id)}
//               activeOpacity={0.7}
//             >
//               <View
//                 style={[
//                   styles.iconContainer,
//                   isActive && styles.iconContainerActive,
//                 ]}
//               >
//                 <Text
//                   style={[styles.tabIcon, isActive && styles.tabIconActive]}
//                 >
//                   {tab.icon}
//                 </Text>
//               </View>
//               <Text
//                 style={[styles.tabLabel, isActive && styles.tabLabelActive]}
//               >
//                 {tab.label}
//               </Text>
//               {isActive && <View style={styles.activeIndicator} />}
//             </TouchableOpacity>
//           );
//         })}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: '#ffffff',
//     borderTopWidth: 1,
//     borderTopColor: '#e0e0e0',
//     paddingBottom: Platform.OS === 'ios' ? 20 : 0,
//     elevation: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: -2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   tabBar: {
//     flexDirection: 'row',
//     paddingTop: 8,
//     paddingHorizontal: 8,
//   },
//   tabItem: {
//     flex: 1,
//     alignItems: 'center',
//     paddingVertical: 8,
//     position: 'relative',
//   },
//   iconContainer: {
//     width: 40,
//     height: 40,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: 20,
//     marginBottom: 4,
//   },
//   iconContainerActive: {
//     backgroundColor: '#E3F2FD',
//   },
//   tabIcon: {
//     fontSize: 24,
//     opacity: 0.6,
//   },
//   tabIconActive: {
//     opacity: 1,
//   },
//   tabLabel: {
//     fontSize: 12,
//     color: '#666',
//     fontWeight: '500',
//   },
//   tabLabelActive: {
//     color: '#007AFF',
//     fontWeight: '600',
//   },
//   activeIndicator: {
//     position: 'absolute',
//     top: 0,
//     width: 32,
//     height: 3,
//     backgroundColor: '#007AFF',
//     borderRadius: 2,
//   },
// });

// export default BottomTabNavigator;

// src/components/BottomTabNavigator.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';

const allTabs = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'reports', label: 'Reports', icon: '📊' },
  { id: 'team', label: 'Team', icon: '👥' },
  { id: 'profile', label: 'Profile', icon: '👤' },
];

const BottomTabNavigator = ({ activeTab, onTabChange, allowedTabs }) => {
  const visibleTabs = allTabs.filter(tab => allowedTabs.includes(tab.id));

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {visibleTabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tabItem}
              onPress={() => onTabChange(tab.id)}
            >
              <View
                style={[styles.iconContainer, isActive && styles.iconActive]}
              >
                <Text
                  style={[styles.tabIcon, isActive && styles.tabIconActive]}
                >
                  {tab.icon}
                </Text>
              </View>
              <Text
                style={[styles.tabLabel, isActive && styles.tabLabelActive]}
              >
                {tab.label}
              </Text>
              {isActive && <View style={styles.indicator} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  tabBar: { flexDirection: 'row', paddingVertical: 6 },
  tabItem: { flex: 1, alignItems: 'center', paddingVertical: 6 },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconActive: { backgroundColor: '#e3f2fd' },
  tabIcon: { fontSize: 24, opacity: 0.7 },
  tabIconActive: { opacity: 1 },
  tabLabel: { fontSize: 11, color: '#666', marginTop: 2 },
  tabLabelActive: { color: '#007aff', fontWeight: '600' },
  indicator: {
    position: 'absolute',
    top: 0,
    width: 36,
    height: 3,
    backgroundColor: '#007aff',
    borderRadius: 2,
  },
});

export default BottomTabNavigator;
