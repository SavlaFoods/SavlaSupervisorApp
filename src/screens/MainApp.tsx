import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CompanySelectionScreen from './CompanySelectionScreen';
import HomeScreen from './HomeScreen';
import CollectionEntryScreen from './FeildCollection/CollectionEntryScreen';
import OutstandingReportScreen from './FeildCollection/OutstandingReportScreen';

import LotSearchResultsScreen from './LotSearchResultsScreen';
import LotHistoryScreen from './LotHistoryScreen';
import CustomerOrderScreen from './CustomerOrderScreen';
import ItemSearchResultsScreen from './ItemSearchResultsScreen';

export type RootStackParamList = {
  CompanySelection: undefined;
  Home: undefined;
  FieldCollectionEntry: undefined;
  OutstandingReportScreen: undefined;
  LotSearchResultsScreen: { initialQuery?: string } | undefined;
  LotHistoryScreen: { lotNo: string; companyId: number };
  CustomerOrderScreen: { unitName?: string; unitId?: number };

  ItemSearchResultsScreen: {
    customerId?: number;
    customerName?: string;
    unitId?: string | number;
    unitName?: string;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const MainApp = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="CompanySelection"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen
          name="CompanySelection"
          component={CompanySelectionScreen}
        />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="FieldCollectionEntry"
          component={CollectionEntryScreen}
        />
        <Stack.Screen
          name="OutstandingReportScreen"
          component={OutstandingReportScreen}
        />
        <Stack.Screen
          name="LotSearchResultsScreen"
          component={LotSearchResultsScreen}
        />
        <Stack.Screen
          name="CustomerOrderScreen"
          component={CustomerOrderScreen}
        />
        <Stack.Screen name="LotHistoryScreen" component={LotHistoryScreen} />
        <Stack.Screen
          name="ItemSearchResultsScreen"
          component={ItemSearchResultsScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainApp;
