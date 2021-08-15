/* eslint-disable no-alert */
import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import {Platform, StatusBar, PermissionsAndroid} from 'react-native';
import {NativeBaseProvider} from 'native-base';
import SplashScreen from 'react-native-splash-screen';

import store from './app/redux/store';
import AppNavigation from './app/navigations';

const App = props => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <Provider store={store}>
      <NativeBaseProvider>
        {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}
        <AppNavigation />
      </NativeBaseProvider>
    </Provider>
  );
};

export default App;
