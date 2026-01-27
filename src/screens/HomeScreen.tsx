// // // import React, { useState } from 'react';
// // // import {
// // //   View,
// // //   Text,
// // //   ScrollView,
// // //   StyleSheet,
// // //   TouchableOpacity,
// // //   Alert,
// // //   Image,
// // //   Dimensions,
// // // } from 'react-native';
// // // import Header from '../components/Header';
// // // import Drawer from '../components/Drawer';
// // // import BottomTabNavigator from '../components/BottomTabNavigator';

// // // const { width } = Dimensions.get('window');

// // // const HomeScreen: React.FC = () => {
// // //   const [drawerVisible, setDrawerVisible] = useState(false);
// // //   const [activeTab, setActiveTab] = useState('home');

// // //   const handleLogout = () => {
// // //     Alert.alert('Logout', 'Are you sure you want to logout?', [
// // //       { text: 'Cancel', style: 'cancel' },
// // //       {
// // //         text: 'Logout',
// // //         style: 'destructive',
// // //         onPress: () => {
// // //           setDrawerVisible(false);
// // //           console.log('User logged out');
// // //         },
// // //       },
// // //     ]);
// // //   };

// // //   const handleTabChange = (tabId: string) => {
// // //     setActiveTab(tabId);
// // //     console.log('Tab changed to:', tabId);
// // //   };

// // //   // Your warehouse images (keep 3–5 max for clean look)
// // //   const warehouseImages = [
// // //     require('../assets/s1.jpeg'),
// // //     require('../assets/s2.jpeg'),
// // //     require('../assets/s3.jpeg'),
// // //     require('../assets/s4.jpeg'),
// // //   ];

// // //   const renderHomeContent = () => {
// // //     return (
// // //       <>
// // //         {/* Very compact header – no image background */}
// // //         <View style={styles.headerSection}>
// // //           <Text style={styles.welcomeName}>Welcome</Text>
// // //           <Text style={styles.welcomeSubtitle}>
// // //             Warehouse Supervisor • {new Date().toLocaleDateString('en-IN')}
// // //           </Text>

// // //           <View style={styles.miniStats}>
// // //             <View style={styles.miniStatItem}>
// // //               <Text style={styles.miniValue}>92%</Text>
// // //               <Text style={styles.miniLabel}>Utilization</Text>
// // //             </View>
// // //             <View style={styles.miniStatItem}>
// // //               <Text style={styles.miniValue}>248</Text>
// // //               <Text style={styles.miniLabel}>SKUs</Text>
// // //             </View>
// // //             <View style={styles.miniStatItem}>
// // //               <Text style={styles.miniValue}>11</Text>
// // //               <Text style={styles.miniLabel}>On Duty</Text>
// // //             </View>
// // //           </View>
// // //         </View>

// // //         {/* Slim image gallery strip – eye-soft & compact */}
// // //         <View style={styles.galleryStrip}>
// // //           <Text style={styles.galleryTitle}>Facility Snapshot</Text>
// // //           <ScrollView
// // //             horizontal
// // //             showsHorizontalScrollIndicator={false}
// // //             contentContainerStyle={styles.galleryContent}
// // //           >
// // //             {warehouseImages.map((imgSrc, idx) => (
// // //               <View key={idx} style={styles.galleryItem}>
// // //                 <Image
// // //                   source={imgSrc}
// // //                   style={styles.galleryImage}
// // //                   resizeMode="cover"
// // //                 />
// // //               </View>
// // //             ))}
// // //           </ScrollView>
// // //         </View>

// // //         {/* Main content starts right away */}
// // //         <View style={styles.section}>
// // //           <Text style={styles.sectionTitle}>Quick Actions</Text>

// // //           <View style={styles.cardsGrid}>
// // //             <TouchableOpacity style={styles.card}>
// // //               <Text style={styles.cardIcon}>📦</Text>
// // //               <Text style={styles.cardLabel}>Inventory</Text>
// // //             </TouchableOpacity>

// // //             <TouchableOpacity style={styles.card}>
// // //               <Text style={styles.cardIcon}>🚚</Text>
// // //               <Text style={styles.cardLabel}>Receiving</Text>
// // //             </TouchableOpacity>

// // //             <TouchableOpacity style={styles.card}>
// // //               <Text style={styles.cardIcon}>📤</Text>
// // //               <Text style={styles.cardLabel}>Dispatch</Text>
// // //             </TouchableOpacity>

// // //             <TouchableOpacity style={styles.card}>
// // //               <Text style={styles.cardIcon}>👷</Text>
// // //               <Text style={styles.cardLabel}>Staff</Text>
// // //             </TouchableOpacity>

// // //             {/* <TouchableOpacity style={styles.card}>
// // //               <Text style={styles.cardIcon}>📊</Text>
// // //               <Text style={styles.cardLabel}>Reports</Text>
// // //             </TouchableOpacity> */}

// // //             {/* Add more cards here */}
// // //           </View>
// // //         </View>

// // //         <View style={styles.bottomSafeArea} />
// // //       </>
// // //     );
// // //   };

// // //   const renderContent = () => {
// // //     if (activeTab === 'home') return renderHomeContent();

// // //     return (
// // //       <View style={styles.section}>
// // //         <Text style={styles.sectionTitle}>
// // //           {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
// // //         </Text>
// // //         <Text style={styles.placeholderText}>
// // //           Content for {activeTab} coming soon...
// // //         </Text>
// // //       </View>
// // //     );
// // //   };

// // //   return (
// // //     <View style={styles.container}>
// // //       <Header onMenuPress={() => setDrawerVisible(true)} title="Dashboard" />

// // //       <Drawer
// // //         visible={drawerVisible}
// // //         onClose={() => setDrawerVisible(false)}
// // //         onLogout={handleLogout}
// // //         userName="Vaishnavi"
// // //         userRole="Warehouse Supervisor"
// // //       />

// // //       <ScrollView
// // //         style={styles.scrollView}
// // //         showsVerticalScrollIndicator={false}
// // //       >
// // //         {renderContent()}
// // //       </ScrollView>

// // //       {/* <BottomTabNavigator activeTab={activeTab} onTabChange={handleTabChange} /> */}
// // //     </View>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //   container: {
// // //     flex: 1,
// // //     backgroundColor: '#f9fafb', // very soft light gray
// // //   },
// // //   scrollView: {
// // //     flex: 1,
// // //   },

// // //   headerSection: {
// // //     paddingHorizontal: 20,
// // //     paddingTop: 16,
// // //     paddingBottom: 20,
// // //     backgroundColor: '#ffffff',
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: '#e5e7eb',
// // //   },
// // //   welcomeName: {
// // //     fontSize: 22,
// // //     fontWeight: '700',
// // //     color: '#111827',
// // //   },
// // //   welcomeSubtitle: {
// // //     fontSize: 14,
// // //     color: '#6b7280',
// // //     marginTop: 4,
// // //     marginBottom: 16,
// // //   },
// // //   miniStats: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     maxWidth: 320,
// // //   },
// // //   miniStatItem: {
// // //     alignItems: 'center',
// // //     flex: 1,
// // //   },
// // //   miniValue: {
// // //     fontSize: 20,
// // //     fontWeight: '600',
// // //     color: '#2563eb',
// // //   },
// // //   miniLabel: {
// // //     fontSize: 12,
// // //     color: '#6b7280',
// // //     marginTop: 4,
// // //   },

// // //   galleryStrip: {
// // //     paddingHorizontal: 20,
// // //     paddingVertical: 12,
// // //   },
// // //   galleryTitle: {
// // //     fontSize: 15,
// // //     fontWeight: '600',
// // //     color: '#374151',
// // //     marginBottom: 8,
// // //   },
// // //   galleryContent: {
// // //     paddingRight: 20,
// // //   },
// // //   galleryItem: {
// // //     marginRight: 12,
// // //     borderRadius: 10,
// // //     overflow: 'hidden',
// // //     borderWidth: 1,
// // //     borderColor: '#e5e7eb',
// // //     backgroundColor: '#f3f4f6',
// // //   },
// // //   galleryImage: {
// // //     width: 110, // small & compact
// // //     height: 70, // slim aspect
// // //   },

// // //   section: {
// // //     paddingHorizontal: 20,
// // //     paddingVertical: 16,
// // //   },
// // //   sectionTitle: {
// // //     fontSize: 18,
// // //     fontWeight: '700',
// // //     color: '#111827',
// // //     marginBottom: 16,
// // //   },
// // //   cardsGrid: {
// // //     flexDirection: 'row',
// // //     flexWrap: 'wrap',
// // //     gap: 16,
// // //   },
// // //   card: {
// // //     width: (width - 68) / 2,
// // //     backgroundColor: '#ffffff',
// // //     borderRadius: 14,
// // //     padding: 20,
// // //     alignItems: 'center',
// // //     borderWidth: 1,
// // //     borderColor: '#e5e7eb',
// // //     elevation: 1,
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 1 },
// // //     shadowOpacity: 0.05,
// // //     shadowRadius: 3,
// // //   },
// // //   cardIcon: {
// // //     fontSize: 28,
// // //     marginBottom: 10,
// // //     color: '#3b82f6',
// // //   },
// // //   cardLabel: {
// // //     fontSize: 14,
// // //     fontWeight: '600',
// // //     color: '#374151',
// // //     textAlign: 'center',
// // //   },

// // //   bottomSafeArea: {
// // //     height: 80,
// // //   },
// // //   placeholderText: {
// // //     fontSize: 15,
// // //     color: '#6b7280',
// // //     textAlign: 'center',
// // //     marginTop: 40,
// // //   },
// // // });

// // // export default HomeScreen;

// // // src/screens/HomeScreen.tsx

// // import React, { useState, useEffect, useRef } from 'react';

// // import {
// //   View,
// //   Text,
// //   ScrollView,
// //   TouchableOpacity,
// //   Image,
// //   StyleSheet,
// //   Dimensions,
// //   Animated,
// //   ActivityIndicator,
// // } from 'react-native';

// // import Header from '../components/Header';

// // import Drawer from '../components/Drawer';

// // import BottomTabNavigator from '../components/BottomTabNavigator';

// // import { getUserData } from '../utils/storage';

// // import {
// //   allowedHomeActionsByRole,
// //   allowedTabsByRole,
// // } from '../config/roleConfig';

// // const { width } = Dimensions.get('window');

// // const HomeScreen = () => {
// //   const [user, setUser] = useState<any>(null);

// //   const [loading, setLoading] = useState(true);

// //   const [drawerVisible, setDrawerVisible] = useState(false);

// //   const [activeTab, setActiveTab] = useState('home');

// //   const fadeAnim = useRef(new Animated.Value(0)).current;

// //   useEffect(() => {
// //     const initialize = async () => {
// //       try {
// //         const storedUser = await getUserData();

// //         console.log('[HomeScreen] Loaded user from storage:', storedUser);

// //         setUser(storedUser);
// //       } catch (err) {
// //         console.error('[HomeScreen] Error reading user data:', err);
// //       } finally {
// //         setLoading(false);

// //         Animated.timing(fadeAnim, {
// //           toValue: 1,

// //           duration: 600,

// //           useNativeDriver: true,
// //         }).start();
// //       }
// //     };

// //     initialize();
// //   }, []);

// //   // Safe fallbacks

// //   const displayName = user?.DisplayName || 'User';

// //   const roleDescription = user?.OperationalRole?.Description || 'Staff';

// //   const roleId = String(user?.RoleOpId ?? user?.OperationalRole?.RoleId ?? '0');

// //   const allowedActions = allowedHomeActionsByRole[roleId] || [];

// //   const allowedTabs = allowedTabsByRole[roleId] ||
// //     allowedTabsByRole.default || ['home'];

// //   const warehouseImages = [
// //     require('../assets/s1.jpeg'),

// //     require('../assets/s2.jpeg'),

// //     require('../assets/s3.jpeg'),

// //     require('../assets/s4.jpeg'),
// //   ];

// //   const handleLogout = () => {
// //     console.log('Logout requested');

// //     setDrawerVisible(false);

// //     // Add real logout here later (clear storage + navigate to login)
// //   };

// //   if (loading) {
// //     return (
// //       <View style={styles.loading}>
// //         <ActivityIndicator size="large" color="#007AFF" />

// //         <Text style={styles.loadingText}>Loading dashboard...</Text>
// //       </View>
// //     );
// //   }

// //   return (
// //     <View style={styles.container}>
// //       {/* Header shows real DisplayName */}

// //       <Header
// //         onMenuPress={() => setDrawerVisible(true)}
// //         title={`${displayName}'s Dashboard`}
// //       />

// //       <Drawer
// //         visible={drawerVisible}
// //         onClose={() => setDrawerVisible(false)}
// //         onLogout={handleLogout}
// //         userName={displayName}
// //         userRole={roleDescription}
// //       />

// //       <Animated.ScrollView
// //         style={styles.scrollView}
// //         contentContainerStyle={styles.scrollContent}
// //         showsVerticalScrollIndicator={false}
// //       >
// //         <Animated.View style={{ opacity: fadeAnim }}>
// //           {/* Welcome */}

// //           <View style={styles.welcomeSection}>
// //             <Text style={styles.welcome}>
// //               Hello, {displayName.split(' ')[0]}!
// //             </Text>

// //             <Text style={styles.date}>
// //               {new Date().toLocaleDateString('en-IN', {
// //                 weekday: 'long',

// //                 year: 'numeric',

// //                 month: 'long',

// //                 day: 'numeric',
// //               })}
// //             </Text>

// //             <View style={styles.stats}>
// //               <View style={styles.stat}>
// //                 <Text style={styles.statNum}>92%</Text>

// //                 <Text style={styles.statTxt}>Utilization</Text>
// //               </View>

// //               <View style={styles.stat}>
// //                 <Text style={styles.statNum}>248</Text>

// //                 <Text style={styles.statTxt}>SKUs</Text>
// //               </View>

// //               <View style={styles.stat}>
// //                 <Text style={styles.statNum}>11</Text>

// //                 <Text style={styles.statTxt}>On Duty</Text>
// //               </View>
// //             </View>
// //           </View>

// //           {/* Gallery */}

// //           <View style={styles.gallerySection}>
// //             <Text style={styles.sectionTitle}>Warehouse Snapshot</Text>

// //             <ScrollView
// //               horizontal
// //               showsHorizontalScrollIndicator={false}
// //               contentContainerStyle={styles.galleryContent}
// //             >
// //               {warehouseImages.map((img, idx) => (
// //                 <View key={idx} style={styles.galleryCard}>
// //                   <Image
// //                     source={img}
// //                     style={styles.galleryImg}
// //                     resizeMode="cover"
// //                   />
// //                 </View>
// //               ))}
// //             </ScrollView>
// //           </View>

// //           {/* Quick Actions */}

// //           <View style={styles.actionsSection}>
// //             <Text style={styles.sectionTitle}>Quick Actions</Text>

// //             <View style={styles.grid}>
// //               <TouchableOpacity style={styles.card}>
// //                 <Text style={styles.cardIcon}>📦</Text>

// //                 <Text style={styles.cardText}>Inventory</Text>
// //               </TouchableOpacity>

// //               {allowedActions.includes('outstanding-report') && (
// //                 <TouchableOpacity
// //                   style={styles.card}
// //                   onPress={() => setActiveTab('reports')}
// //                 >
// //                   <Text style={styles.cardIcon}>📊</Text>

// //                   <Text style={styles.cardText}>Outstanding Report</Text>
// //                 </TouchableOpacity>
// //               )}

// //               {allowedActions.includes('new-collection') && (
// //                 <TouchableOpacity style={[styles.card, styles.specialCard]}>
// //                   <Text style={styles.cardIcon}>💰</Text>

// //                   <Text style={styles.cardText}>New Collection</Text>
// //                 </TouchableOpacity>
// //               )}
// //             </View>
// //           </View>

// //           <View style={{ height: 120 }} />
// //         </Animated.View>
// //       </Animated.ScrollView>

// //       {/*

// //       <BottomTabNavigator

// //         activeTab={activeTab}

// //         onTabChange={setActiveTab}

// //         allowedTabs={allowedTabs}

// //       /> */}
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: '#f8f9fa' },

// //   scrollView: { flex: 1 },

// //   scrollContent: { paddingBottom: 60 },

// //   loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },

// //   loadingText: { marginTop: 16, color: '#666', fontSize: 16 },

// //   welcomeSection: {
// //     backgroundColor: '#fff',

// //     padding: 20,

// //     borderBottomWidth: 1,

// //     borderBottomColor: '#eee',
// //   },

// //   welcome: { fontSize: 26, fontWeight: '700', color: '#111' },

// //   date: { fontSize: 14, color: '#666', marginTop: 4, marginBottom: 20 },

// //   stats: { flexDirection: 'row', justifyContent: 'space-between' },

// //   stat: { alignItems: 'center', flex: 1 },

// //   statNum: { fontSize: 22, fontWeight: 'bold', color: '#007AFF' },

// //   statTxt: { fontSize: 12, color: '#666', marginTop: 4 },

// //   gallerySection: { padding: 20 },

// //   sectionTitle: {
// //     fontSize: 18,

// //     fontWeight: '700',

// //     marginBottom: 12,

// //     color: '#111',
// //   },

// //   galleryContent: { paddingRight: 20 },

// //   galleryCard: {
// //     marginRight: 12,

// //     borderRadius: 12,

// //     overflow: 'hidden',

// //     borderWidth: 1,

// //     borderColor: '#eee',
// //   },

// //   galleryImg: { width: 140, height: 100 },

// //   actionsSection: { paddingHorizontal: 20, paddingBottom: 30 },

// //   grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },

// //   card: {
// //     width: (width - 56) / 2,

// //     backgroundColor: '#fff',

// //     borderRadius: 16,

// //     paddingVertical: 24,

// //     alignItems: 'center',

// //     borderWidth: 1,

// //     borderColor: '#eee',

// //     shadowColor: '#000',

// //     shadowOffset: { width: 0, height: 2 },

// //     shadowOpacity: 0.08,

// //     shadowRadius: 6,

// //     elevation: 3,
// //   },

// //   specialCard: { backgroundColor: '#e6f0ff', borderColor: '#cce0ff' },

// //   cardIcon: { fontSize: 36, marginBottom: 12, color: '#007AFF' },

// //   cardText: {
// //     fontSize: 14,

// //     fontWeight: '600',

// //     color: '#333',

// //     textAlign: 'center',
// //   },
// // });

// // export default HomeScreen;

// // src/screens/HomeScreen.tsx

// import React, { useState, useEffect, useRef } from 'react';

// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   Image,
//   StyleSheet,
//   Dimensions,
//   Animated,
//   ActivityIndicator,
// } from 'react-native';

// import Header from '../components/Header';

// import Drawer from '../components/Drawer';

// import BottomTabNavigator from '../components/BottomTabNavigator';

// import { getUserData } from '../utils/storage';

// import {
//   allowedHomeActionsByRole,
//   allowedTabsByRole,
// } from '../config/roleConfig';

// const { width } = Dimensions.get('window');

// const HomeScreen = () => {
//   const [user, setUser] = useState<any>(null);

//   const [loading, setLoading] = useState(true);

//   const [drawerVisible, setDrawerVisible] = useState(false);

//   const [activeTab, setActiveTab] = useState('home');

//   const fadeAnim = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     const initialize = async () => {
//       try {
//         const storedUser = await getUserData();

//         console.log('[HomeScreen] Loaded user from storage:', storedUser);

//         setUser(storedUser);
//       } catch (err) {
//         console.error('[HomeScreen] Error reading user data:', err);
//       } finally {
//         setLoading(false);

//         Animated.timing(fadeAnim, {
//           toValue: 1,

//           duration: 600,

//           useNativeDriver: true,
//         }).start();
//       }
//     };

//     initialize();
//   }, []);

//   // Safe fallbacks

//   const displayName = user?.DisplayName || 'User';

//   const roleDescription = user?.OperationalRole?.Description || 'Staff';

//   const roleId = String(user?.RoleOpId ?? user?.OperationalRole?.RoleId ?? '0');

//   const allowedActions = allowedHomeActionsByRole[roleId] || [];

//   const allowedTabs = allowedTabsByRole[roleId] ||
//     allowedTabsByRole.default || ['home'];

//   const warehouseImages = [
//     require('../assets/s1.jpeg'),

//     require('../assets/s2.jpeg'),

//     require('../assets/s3.jpeg'),

//     require('../assets/s4.jpeg'),
//   ];

//   const handleLogout = () => {
//     console.log('Logout requested');

//     setDrawerVisible(false);

//     // Add real logout here later (clear storage + navigate to login)
//   };

//   if (loading) {
//     return (
//       <View style={styles.loading}>
//         <ActivityIndicator size="large" color="#007AFF" />

//         <Text style={styles.loadingText}>Loading dashboard...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {/* Header shows real DisplayName */}

//       <Header
//         onMenuPress={() => setDrawerVisible(true)}
//         title={`${displayName}'s Dashboard`}
//       />

//       <Drawer
//         visible={drawerVisible}
//         onClose={() => setDrawerVisible(false)}
//         onLogout={handleLogout}
//         userName={displayName}
//         userRole={roleDescription}
//       />

//       <Animated.ScrollView
//         style={styles.scrollView}
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//         <Animated.View style={{ opacity: fadeAnim }}>
//           {/* Welcome */}

//           <View style={styles.welcomeSection}>
//             <Text style={styles.welcome}>
//               Hello, {displayName.split(' ')[0]}!
//             </Text>

//             <Text style={styles.date}>
//               {new Date().toLocaleDateString('en-IN', {
//                 weekday: 'long',

//                 year: 'numeric',

//                 month: 'long',

//                 day: 'numeric',
//               })}
//             </Text>

//             <View style={styles.stats}>
//               <View style={styles.stat}>
//                 <Text style={styles.statNum}>92%</Text>

//                 <Text style={styles.statTxt}>Utilization</Text>
//               </View>

//               <View style={styles.stat}>
//                 <Text style={styles.statNum}>248</Text>

//                 <Text style={styles.statTxt}>SKUs</Text>
//               </View>

//               <View style={styles.stat}>
//                 <Text style={styles.statNum}>11</Text>

//                 <Text style={styles.statTxt}>On Duty</Text>
//               </View>
//             </View>
//           </View>

//           {/* Gallery */}

//           <View style={styles.gallerySection}>
//             <Text style={styles.sectionTitle}>Warehouse Snapshot</Text>

//             <ScrollView
//               horizontal
//               showsHorizontalScrollIndicator={false}
//               contentContainerStyle={styles.galleryContent}
//             >
//               {warehouseImages.map((img, idx) => (
//                 <View key={idx} style={styles.galleryCard}>
//                   <Image
//                     source={img}
//                     style={styles.galleryImg}
//                     resizeMode="cover"
//                   />
//                 </View>
//               ))}
//             </ScrollView>
//           </View>

//           {/* Quick Actions */}

//           <View style={styles.actionsSection}>
//             <Text style={styles.sectionTitle}>Quick Actions</Text>

//             <View style={styles.grid}>
//               <TouchableOpacity style={styles.card}>
//                 <Text style={styles.cardIcon}>📦</Text>

//                 <Text style={styles.cardText}>Inventory</Text>
//               </TouchableOpacity>

//               {allowedActions.includes('outstanding-report') && (
//                 <TouchableOpacity
//                   style={styles.card}
//                   onPress={() => setActiveTab('reports')}
//                 >
//                   <Text style={styles.cardIcon}>📊</Text>

//                   <Text style={styles.cardText}>Outstanding Report</Text>
//                 </TouchableOpacity>
//               )}

//               {allowedActions.includes('new-collection') && (
//                 <TouchableOpacity style={[styles.card, styles.specialCard]}>
//                   <Text style={styles.cardIcon}>💰</Text>

//                   <Text style={styles.cardText}>New Collection</Text>
//                 </TouchableOpacity>
//               )}
//             </View>
//           </View>

//           <View style={{ height: 120 }} />
//         </Animated.View>
//       </Animated.ScrollView>

//       {/*

//       <BottomTabNavigator

//         activeTab={activeTab}

//         onTabChange={setActiveTab}

//         allowedTabs={allowedTabs}

//       /> */}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#f8f9fa' },
//   scrollView: { flex: 1 },
//   scrollContent: { paddingBottom: 60 },
//   loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   loadingText: { marginTop: 16, color: '#666', fontSize: 16 },
//   welcomeSection: {
//     backgroundColor: '#fff',
//     padding: 20;
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   welcome: { fontSize: 26, fontWeight: '700', color: '#111' },
//   date: { fontSize: 14, color: '#666', marginTop: 4, marginBottom: 20 },
//   stats: { flexDirection: 'row', justifyContent: 'space-between' },
//   stat: { alignItems: 'center', flex: 1 },
//   statNum: { fontSize: 22, fontWeight: 'bold', color: '#007AFF' },
//   statTxt: { fontSize: 12, color: '#666', marginTop: 4 },
//   gallerySection: { padding: 20 },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     marginBottom: 12,
//     color: '#111',
//   },
//   galleryContent: { paddingRight: 20 },
//   galleryCard: {
//     marginRight: 12,
//     borderRadius: 12,
//     overflow: 'hidden',
//     borderWidth: 1,
//     borderColor: '#eee',
//   },
//   galleryImg: { width: 140, height: 100 },
//   actionsSection: { paddingHorizontal: 20, paddingBottom: 30 },
//   grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
//   card: {
//     width: (width - 56) / 2,
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     paddingVertical: 24,
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#eee',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.08,
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   specialCard: { backgroundColor: '#e6f0ff', borderColor: '#cce0ff' },
//   cardIcon: { fontSize: 36, marginBottom: 12, color: '#007AFF' },
//   cardText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#333',
//     textAlign: 'center',
//   },
// });

// export default HomeScreen;

// src/screens/HomeScreen.tsx

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

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

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
  const scrollX = useRef(new Animated.Value(0)).current;

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

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <Header
        onMenuPress={() => setDrawerVisible(true)}
        title={`${displayName}'s Dashboard`}
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
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <View style={styles.greetingContainer}>
              <Text style={styles.greetingText}>Welcome back,</Text>
              <Text style={styles.nameText}>{displayName.split(' ')[0]}</Text>
            </View>
          </View>

          {/* Warehouse Gallery */}

          <View style={styles.gallerySection}>
            <Text style={styles.sectionTitle}>Warehouse Highlights</Text>

            <Animated.ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.galleryScrollContent}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                { useNativeDriver: true },
              )}
              scrollEventThrottle={16}
            >
              {warehouseImages.map((img, index) => {
                const position = Animated.subtract(scrollX, index * (160 + 16));

                const scale = position.interpolate({
                  inputRange: [-160, 0, 160],
                  outputRange: [0.9, 1.05, 0.9],
                  extrapolate: 'clamp',
                });

                const translateY = position.interpolate({
                  inputRange: [-160, 0, 160],
                  outputRange: [8, -6, 8],
                  extrapolate: 'clamp',
                });

                return (
                  <Animated.View
                    key={index}
                    style={{
                      width: 160, // Slightly larger for better visibility
                      height: 160,
                      marginHorizontal: 8,
                      borderRadius: 24,
                      overflow: 'hidden', // Crucial – clips image corners
                      backgroundColor: '#f1f5f9', // Fallback color if image fails
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.2,
                      shadowRadius: 8,
                      elevation: 5,
                      transform: [{ scale }, { translateY }],
                    }}
                  >
                    <Image
                      source={img}
                      style={{
                        width: '100%',
                        height: '90%',
                        borderRadius: 24, // Matches card
                      }}
                      resizeMode="cover" // Keeps this – fills without stretching
                    />
                  </Animated.View>
                );
              })}
            </Animated.ScrollView>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
            </View>

            <View style={styles.actionsGrid}>
              <TouchableOpacity style={styles.actionCard}>
                <View
                  style={[
                    styles.actionIconContainer,
                    { backgroundColor: '#dbeafe' },
                  ]}
                >
                  <Text style={styles.actionIcon}>📦</Text>
                </View>
                <Text style={styles.actionTitle}>Inventory</Text>
                <Text style={styles.actionSubtitle}>Manage stock</Text>
              </TouchableOpacity>

              {allowedActions.includes('outstanding-report') && (
                <TouchableOpacity
                  style={styles.actionCard}
                  onPress={() => setActiveTab('reports')}
                >
                  <View
                    style={[
                      styles.actionIconContainer,
                      { backgroundColor: '#fef3c7' },
                    ]}
                  >
                    <Text style={styles.actionIcon}>📊</Text>
                  </View>
                  <Text style={styles.actionTitle}>Reports</Text>
                  <Text style={styles.actionSubtitle}>Outstanding data</Text>
                </TouchableOpacity>
              )}

              {allowedActions.includes('new-collection') && (
                <TouchableOpacity style={styles.actionCard}>
                  <View
                    style={[
                      styles.actionIconContainer,
                      { backgroundColor: '#d1fae5' },
                    ]}
                  >
                    <Text style={styles.actionIcon}>💰</Text>
                  </View>
                  <Text style={styles.actionTitle}>Collection</Text>
                  <Text style={styles.actionSubtitle}>New entry</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity style={styles.actionCard}>
                <View
                  style={[
                    styles.actionIconContainer,
                    { backgroundColor: '#e9d5ff' },
                  ]}
                >
                  <Text style={styles.actionIcon}>📋</Text>
                </View>
                <Text style={styles.actionTitle}>Tasks</Text>
                <Text style={styles.actionSubtitle}>View pending</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionCard}>
                <View
                  style={[
                    styles.actionIconContainer,
                    { backgroundColor: '#fecaca' },
                  ]}
                >
                  <Text style={styles.actionIcon}>🚚</Text>
                </View>
                <Text style={styles.actionTitle}>Shipments</Text>
                <Text style={styles.actionSubtitle}>Track orders</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionCard}>
                <View
                  style={[
                    styles.actionIconContainer,
                    { backgroundColor: '#fde68a' },
                  ]}
                >
                  <Text style={styles.actionIcon}>⚙️</Text>
                </View>
                <Text style={styles.actionTitle}>Settings</Text>
                <Text style={styles.actionSubtitle}>Preferences</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Recent Activity */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
            </View>

            <View style={styles.activityCard}>
              <View style={styles.activityItem}>
                <View
                  style={[styles.activityDot, { backgroundColor: '#10b981' }]}
                />
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>Inventory Updated</Text>
                  <Text style={styles.activityTime}>2 hours ago</Text>
                </View>
              </View>

              <View style={styles.activityItem}>
                <View
                  style={[styles.activityDot, { backgroundColor: '#3b82f6' }]}
                />
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>New Order Received</Text>
                  <Text style={styles.activityTime}>5 hours ago</Text>
                </View>
              </View>

              <View style={styles.activityItem}>
                <View
                  style={[styles.activityDot, { backgroundColor: '#f59e0b' }]}
                />
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>Report Generated</Text>
                  <Text style={styles.activityTime}>Yesterday</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={{ height: 100 }} />
        </Animated.View>
      </ScrollView>

      {/* Uncomment when ready to use bottom navigation */}
      {/* 
      <BottomTabNavigator
        activeTab={activeTab}
        onTabChange={setActiveTab}
        allowedTabs={allowedTabs}
      />
      */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
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
    color: '#64748b',
    fontSize: 16,
    fontWeight: '500',
  },

  // Hero Section
  heroSection: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  greetingContainer: {
    marginBottom: 8,
  },
  greetingText: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  nameText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
  },
  dateContainer: {
    marginTop: 4,
  },
  dateText: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },

  // Stats Cards
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statCardPrimary: {
    backgroundColor: '#eff6ff',
    borderColor: '#dbeafe',
  },
  statCardSecondary: {
    backgroundColor: '#fef3c7',
    borderColor: '#fde68a',
  },
  statCardTertiary: {
    backgroundColor: '#ecfccb',
    borderColor: '#d9f99d',
  },
  statIconContainer: {
    marginBottom: 8,
  },
  statIcon: {
    fontSize: 24,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
    textAlign: 'center',
  },

  // Sections
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
  },
  seeAllText: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '600',
  },

  // Gallery
  galleryContainer: {
    paddingRight: 20,
  },
  galleryCard: {
    marginRight: 12,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  galleryImage: {
    width: 140,
    height: 100,
  },
  galleryOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },

  galleryLabel: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  gallerySection: {
    marginVertical: 20,
    paddingHorizontal: 20,
  },

  galleryScrollContent: {
    paddingRight: 40, // extra space at end
  },

  // Actions Grid
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: (width - 57) / 2,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionIcon: {
    fontSize: 24,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },

  // Activity
  activityCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#94a3b8',
  },
});

export default HomeScreen;
