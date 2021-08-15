import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import InventoryHome from '../screens/MainScreens/Inventory/index';
import GeneralInventory from '../screens/MainScreens/Inventory/GeneralInventory';
import GeneralPanel from '../screens/MainScreens/Inventory/GeneralPanel';
import SpecificInventory from '../screens/MainScreens/Inventory/SpecificInventory';
import SpecificPanel from '../screens/MainScreens/Inventory/SpecificPanel';

const Stack = createStackNavigator();

const GeneralNavigation = props => {
  return (
    <Stack.Navigator initialRouteName="general-home">
      <Stack.Screen
        name="general-home"
        component={GeneralInventory}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="general-panel"
        component={GeneralPanel}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

const SpecificNavigation = props => {
  return (
    <Stack.Navigator initialRouteName="specific-home">
      <Stack.Screen
        name="specific-home"
        component={SpecificInventory}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="specific-panel"
        component={SpecificPanel}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

const InventoryNavigation = props => {
  return (
    <Stack.Navigator initialRouteName="inventory-count-home">
      <Stack.Screen
        name="inventory-count-home"
        component={InventoryHome}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="general-inventory"
        component={GeneralNavigation}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="specific-inventory"
        component={SpecificNavigation}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default InventoryNavigation;
