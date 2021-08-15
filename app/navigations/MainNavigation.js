import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
/** import sub navigation */
import BarcodePreparingNavigation from './BarcodePrepareNavigation';
import InventoryNavigation from './InventoryNavigation';
/** import screens */
import Home from '../screens/MainScreens/Home';
import ChangePassword from '../screens/MainScreens/ChangePassword';
import ProductSearch from '../screens/MainScreens/ProductSearch';

const Stack = createStackNavigator();

const AppNavigation = () => {
  return (
    <Stack.Navigator initialRouteName="home">
      <Stack.Screen
        name="home"
        component={Home}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="product-search"
        component={ProductSearch}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="barcode-preparing"
        component={BarcodePreparingNavigation}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="inventory-count"
        component={InventoryNavigation}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="change-password"
        component={ChangePassword}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default AppNavigation;
