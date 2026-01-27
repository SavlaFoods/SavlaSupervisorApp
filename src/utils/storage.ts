// // src/utils/storage.ts

// import AsyncStorage from '@react-native-async-storage/async-storage';

// // Store user token
// export const storeToken = async (token: string): Promise<void> => {
//   try {
//     await AsyncStorage.setItem('userToken', token);
//   } catch (error) {
//     console.error('Error storing token:', error);
//     throw error;
//   }
// };

// // Get user token
// export const getToken = async (): Promise<string | null> => {
//   try {
//     return await AsyncStorage.getItem('userToken');
//   } catch (error) {
//     console.error('Error getting token:', error);
//     return null;
//   }
// };

// // Store user data
// export const storeUserData = async (userData: any): Promise<void> => {
//   try {
//     await AsyncStorage.setItem('userData', JSON.stringify(userData));
//   } catch (error) {
//     console.error('Error storing user data:', error);
//     throw error;
//   }
// };

// // Get user data
// export const getUserData = async (): Promise<any | null> => {
//   try {
//     const data = await AsyncStorage.getItem('userData');
//     return data ? JSON.parse(data) : null;
//   } catch (error) {
//     console.error('Error getting user data:', error);
//     return null;
//   }
// };

// // Clear all storage (logout)
// export const clearStorage = async (): Promise<void> => {
//   try {
//     await AsyncStorage.multiRemove(['userToken', 'userData']);
//   } catch (error) {
//     console.error('Error clearing storage:', error);
//     throw error;
//   }
// };

import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeToken = async (token: string) => {
  await AsyncStorage.setItem('token', token);
};

export const getToken = async () => {
  return await AsyncStorage.getItem('token');
};

export const storeUserData = async (userData: any) => {
  await AsyncStorage.setItem('userData', JSON.stringify(userData));
};

export const getUserData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('userData');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Error reading user data', e);
    return null;
  }
};

export const clearAuth = async () => {
  await AsyncStorage.multiRemove(['token', 'userData']);
};
