import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
/** import screen */
import Login from '../screens/AuthScreens/Login';

const Stack = createStackNavigator();

const AuthNavigation = props => {
  return (
    <Stack.Navigator initialRouteName="login">
      <Stack.Screen
        name="login"
        component={Login}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigation;
