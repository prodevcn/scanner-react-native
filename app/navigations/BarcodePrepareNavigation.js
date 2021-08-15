import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import BarcodePreparing from '../screens/MainScreens/BarcodePreparing';
import NewSession from '../screens/MainScreens/BarcodePreparing/NewSession';
import EditSession from '../screens/MainScreens/BarcodePreparing/EditSession';
import ShareSession from '../screens/MainScreens/BarcodePreparing/ShareSession';

const Stack = createStackNavigator();

const BarcodePreparingNavigation = props => {
  return (
    <Stack.Navigator initialRouteName="barcode-preparing-home">
      <Stack.Screen
        name="barcode-preparing-home"
        component={BarcodePreparing}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="new-session"
        component={NewSession}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="edit-session"
        component={EditSession}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="share-session"
        component={ShareSession}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default BarcodePreparingNavigation;
