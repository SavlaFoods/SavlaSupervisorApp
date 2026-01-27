// // src/screens/MainApp.tsx
// import React, { useState } from 'react';
// import { View, StyleSheet } from 'react-native';
// import HomeScreen from './HomeScreen';
// import OutstandingReportScreen from './OutstandingReportScreen';
// import BottomTabNavigator from '../components/BottomTabNavigator';

// interface MainAppProps {
//   userRole: string;
// }

// const MainApp: React.FC<MainAppProps> = ({ userRole }) => {
//   const [activeTab, setActiveTab] = useState('home');

//   const renderScreen = () => {
//     switch (activeTab) {
//       case 'home':
//         return <HomeScreen />;
//       case 'reports':
//         return <OutstandingReportScreen />;
//       case 'team':
//         return <HomeScreen />; // Replace with TeamScreen
//       case 'profile':
//         return <HomeScreen />; // Replace with ProfileScreen
//       default:
//         return <HomeScreen />;
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.content}>{renderScreen()}</View>
//       <BottomTabNavigator activeTab={activeTab} onTabChange={setActiveTab} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   content: {
//     flex: 1,
//   },
// });

// export default MainApp;

// src/screens/MainApp.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getUserData } from '../utils/storage';
import HomeScreen from './HomeScreen';
import OutstandingReportScreen from './OutstandingReportScreen';
import BottomTabNavigator from '../components/BottomTabNavigator';
import { allowedTabsByRole, allowedScreensByRole } from '../config/roleConfig';

const MainApp = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await getUserData();
      setUser(data);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading user...</Text>
      </View>
    );
  }

  const roleId = String(user?.RoleOpId ?? '0');
  const allowedTabs = allowedTabsByRole[roleId] || allowedTabsByRole.default;
  const allowedScreens =
    allowedScreensByRole[roleId] || allowedScreensByRole.default;

  const canAccessReports = allowedScreens.includes('OutstandingReportScreen');

  const renderContent = () => {
    if (activeTab === 'home') {
      return <HomeScreen roleId={roleId} />;
    }

    if (activeTab === 'reports') {
      if (!canAccessReports) {
        return (
          <View style={styles.center}>
            <Text>Access denied – Reports not allowed for your role</Text>
          </View>
        );
      }
      return <OutstandingReportScreen />;
    }

    // fallback
    return <HomeScreen roleId={roleId} />;
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>{renderContent()}</View>

      <BottomTabNavigator
        activeTab={activeTab}
        onTabChange={setActiveTab}
        allowedTabs={allowedTabs}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MainApp;
