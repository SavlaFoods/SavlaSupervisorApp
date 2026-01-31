import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './HomeScreen';
import CollectionEntryScreen from './FeildCollection/CollectionEntryScreen';

export type RootStackParamList = {
  Home: undefined;
  FieldCollectionEntry: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const MainApp = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="FieldCollectionEntry"
          component={CollectionEntryScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainApp;
