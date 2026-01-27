// // App.tsx
// import React, { useState, useEffect } from 'react';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import SplashScreen from './src/screens/SplashScreen';
// import LoginScreen from './src/screens/LoginScreen';
// import HomeScreen from './src/screens/HomeScreen';
// import OutstandingReportScreen from './src/screens/OutstandingReportScreen';

// const App: React.FC = () => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     setTimeout(() => setIsLoading(false), 2000);
//   }, []);

//   if (isLoading)
//     return (
//       <SplashScreen
//         onFinish={function (): void {
//           throw new Error('Function not implemented.');
//         }}
//       />
//     );

//   return (
//     <SafeAreaProvider>
//       {!isLoggedIn ? (
//         <LoginScreen onLoginSuccess={() => setIsLoggedIn(true)} />
//       ) : (
//         <HomeScreen userRole={'admin'} />
//       )}
//     </SafeAreaProvider>
//   );
// };

// export default App;

// App.tsx
import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import MainApp from './src/screens/MainApp';
import { AuthProvider } from './src/context/AuthContext';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  if (isLoading) {
    return <SplashScreen onFinish={() => setIsLoading(false)} />;
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        {!isLoggedIn ? (
          <LoginScreen onLoginSuccess={() => setIsLoggedIn(true)} />
        ) : (
          <MainApp />
        )}
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default App;
