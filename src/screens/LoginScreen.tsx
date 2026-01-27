// import React, { useState, useRef, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Image,
//   StyleSheet,
//   StatusBar,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   Animated,
//   ActivityIndicator,
//   Alert,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import apiService from '../services/apiService';
// import { storeToken, storeUserData } from '../utils/storage';
// import { ApiError } from '../config/apiConfig';

// const LoginScreen: React.FC<{ onLoginSuccess: () => void }> = ({
//   onLoginSuccess,
// }) => {
//   const [loginName, setLoginName] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('');

//   // Animations for form
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const slideAnim = useRef(new Animated.Value(40)).current;

//   useEffect(() => {
//     Animated.parallel([
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 900,
//         useNativeDriver: true,
//       }),
//       Animated.spring(slideAnim, {
//         toValue: 0,
//         friction: 8,
//         tension: 40,
//         useNativeDriver: true,
//       }),
//     ]).start();
//   }, []);

//   const handleLogin = async () => {
//     // Validate inputs
//     if (!loginName.trim()) {
//       setErrorMessage('Please enter your login name');
//       return;
//     }

//     if (!password.trim()) {
//       setErrorMessage('Please enter your password');
//       return;
//     }

//     setErrorMessage('');
//     setIsLoading(true);

//     try {
//       // Call login API
//       const response = await apiService.login({
//         login_name: loginName.trim(),
//         user_password: password,
//       });

//       // ────────────────────────────────────────────────
//       // NEW RESPONSE STRUCTURE (flat inside output)
//       // ────────────────────────────────────────────────
//       const userData = response.output;

//       console.log(userData);
//       // Store token and user data
//       await storeToken(userData.token);

//       // Remove token from the object before storing user data (cleaner)
//       const { token, ...userWithoutToken } = userData;
//       await storeUserData(userWithoutToken);

//       // Show success message
//       Alert.alert('Success', `Welcome back, ${userData.DisplayName}!`, [
//         {
//           text: 'OK',
//           onPress: () => onLoginSuccess(),
//         },
//       ]);
//     } catch (error) {
//       const apiError = error as ApiError;
//       console.error('Login error:', apiError);

//       const errorMsg = apiError.message || 'Login failed. Please try again.';
//       setErrorMessage(errorMsg);

//       Alert.alert('Login Failed', errorMsg);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

//       <KeyboardAvoidingView
//         style={styles.container}
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       >
//         <ScrollView
//           contentContainerStyle={styles.scrollContainer}
//           keyboardShouldPersistTaps="handled"
//           showsVerticalScrollIndicator={false}
//         >
//           {/* Original Banner */}
//           <View style={styles.bannerContainer}>
//             <Image
//               source={require('../assets/Loginimg.png')}
//               style={styles.banner}
//               resizeMode="cover"
//             />
//           </View>

//           {/* Modern Glassmorphism Login Form */}
//           <Animated.View
//             style={[
//               styles.formContainer,
//               {
//                 opacity: fadeAnim,
//                 transform: [{ translateY: slideAnim }],
//               },
//             ]}
//           >
//             <Text style={styles.title}>Welcome Back</Text>
//             <Text style={styles.subtitle}>Sign in to continue</Text>

//             {/* Error Message */}
//             {errorMessage ? (
//               <View style={styles.errorContainer}>
//                 <Text style={styles.errorText}>{errorMessage}</Text>
//               </View>
//             ) : null}

//             {/* Login Name Input */}
//             <View style={styles.inputWrapper}>
//               <Text style={styles.label}>Login Name</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Enter your login name"
//                 placeholderTextColor="#aaa"
//                 value={loginName}
//                 onChangeText={text => {
//                   setLoginName(text);
//                   setErrorMessage('');
//                 }}
//                 autoCapitalize="characters"
//                 autoCorrect={false}
//                 editable={!isLoading}
//               />
//             </View>

//             {/* Password Input */}
//             <View style={styles.inputWrapper}>
//               <Text style={styles.label}>Password</Text>
//               <View style={styles.passwordContainer}>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Enter your password"
//                   placeholderTextColor="#aaa"
//                   value={password}
//                   onChangeText={text => {
//                     setPassword(text);
//                     setErrorMessage('');
//                   }}
//                   secureTextEntry={!showPassword}
//                   autoCapitalize="none"
//                   editable={!isLoading}
//                 />
//                 <TouchableOpacity
//                   style={styles.eyeIcon}
//                   onPress={() => setShowPassword(!showPassword)}
//                   disabled={isLoading}
//                 >
//                   <Text style={styles.eyeText}>
//                     {showPassword ? '🙈' : '👁️'}
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             </View>

//             {/* Forgot Password */}
//             <TouchableOpacity
//               style={styles.forgotContainer}
//               disabled={isLoading}
//             >
//               <Text style={styles.forgotText}>Forgot Password?</Text>
//             </TouchableOpacity>

//             {/* Login Button */}
//             <TouchableOpacity
//               style={[
//                 styles.loginButton,
//                 isLoading && styles.loginButtonDisabled,
//               ]}
//               onPress={handleLogin}
//               disabled={isLoading}
//               activeOpacity={0.8}
//             >
//               {isLoading ? (
//                 <ActivityIndicator color="#fff" size="small" />
//               ) : (
//                 <Text style={styles.loginButtonText}>Sign In</Text>
//               )}
//             </TouchableOpacity>

//             {/* Sign Up Link */}
//             <View style={styles.signupContainer}>
//               <Text style={styles.signupText}>Don't have an account? </Text>
//               <TouchableOpacity disabled={isLoading}>
//                 <Text style={styles.signupLink}>Sign Up</Text>
//               </TouchableOpacity>
//             </View>
//           </Animated.View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import apiService from '../services/apiService';
import { storeToken, storeUserData } from '../utils/storage';
import { ApiError } from '../config/apiConfig';

const LoginScreen: React.FC<{ onLoginSuccess: () => void }> = ({
  onLoginSuccess,
}) => {
  const [loginName, setLoginName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  // Animations for form
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    // Validate inputs
    if (!loginName.trim()) {
      setErrorMessage('Please enter your login name');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Please enter your password');
      return;
    }
    setErrorMessage('');
    setIsLoading(true);
    try {
      // Call login API
      const response = await apiService.login({
        login_name: loginName.trim(),
        user_password: password,
      });
      // ────────────────────────────────────────────────
      // NEW RESPONSE STRUCTURE (flat inside output)
      // ────────────────────────────────────────────────
      const userData = response.output;
      console.log(userData);
      // Store token and user data
      await storeToken(userData.token);
      // Remove token from the object before storing user data (cleaner)
      const { token, ...userWithoutToken } = userData;
      await storeUserData(userWithoutToken);
      // Show success message
      Alert.alert('Success', `Welcome back, ${userData.DisplayName}!`, [
        {
          text: 'OK',
          onPress: () => onLoginSuccess(),
        },
      ]);
    } catch (error) {
      const apiError = error as ApiError;
      console.error('Login error:', apiError);
      const errorMsg = apiError.message || 'Login failed. Please try again.';
      setErrorMessage(errorMsg);
      Alert.alert('Login Failed', errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Original Banner */}
          <View style={styles.bannerContainer}>
            <Image
              source={require('../assets/Loginimg.png')}
              style={styles.banner}
              resizeMode="cover"
            />
          </View>
          {/* Modern Glassmorphism Login Form */}
          <Animated.View
            style={[
              styles.formContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
            {/* Error Message */}
            {errorMessage ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}
            {/* Login Name Input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Login Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your login name"
                placeholderTextColor="#aaa"
                value={loginName}
                onChangeText={text => {
                  setLoginName(text);
                  setErrorMessage('');
                }}
                autoCapitalize="characters"
                autoCorrect={false}
                editable={!isLoading}
              />
            </View>
            {/* Password Input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="#aaa"
                  value={password}
                  onChangeText={text => {
                    setPassword(text);
                    setErrorMessage('');
                  }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  editable={!isLoading}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  <Text style={styles.eyeText}>
                    {showPassword ? '🙈' : '👁️'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* Forgot Password */}
            <TouchableOpacity
              style={styles.forgotContainer}
              disabled={isLoading}
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
            {/* Login Button */}
            <TouchableOpacity
              style={[
                styles.loginButton,
                isLoading && styles.loginButtonDisabled,
              ]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>
            {/* Sign Up Link */}
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity disabled={isLoading}>
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  bannerContainer: {
    width: '100%',
    height: 270,
    backgroundColor: '#f0f0f0',
  },
  banner: {
    width: '100%',
    height: '100%',
  },
  formContainer: {
    marginHorizontal: 24,
    marginTop: -40,
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderRadius: 28,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    marginBottom: 24,
  },
  errorContainer: {
    backgroundColor: '#fee',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#f44',
  },
  errorText: {
    color: '#c33',
    fontSize: 14,
    fontWeight: '500',
  },
  inputWrapper: {
    marginBottom: 22,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 8,
  },
  input: {
    height: 54,
    backgroundColor: '#fafafa',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  passwordContainer: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  eyeText: {
    fontSize: 22,
  },
  forgotContainer: {
    alignSelf: 'flex-end',
    marginBottom: 28,
  },
  forgotText: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 14,
  },
  loginButton: {
    height: 54,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  loginButtonDisabled: {
    backgroundColor: '#7ab0ff',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    color: '#666',
    fontSize: 14,
  },
  signupLink: {
    color: '#007AFF',
    fontWeight: '700',
    fontSize: 14,
  },
});

export default LoginScreen;
