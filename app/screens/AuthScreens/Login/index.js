import React from 'react';
import {
  Button,
  CheckIcon,
  FormControl,
  Image,
  Input,
  Select,
  VStack,
} from 'native-base';
import {Formik} from 'formik';
import {useDispatch, useSelector} from 'react-redux';
import {StyleSheet, Dimensions} from 'react-native';

import Screen from '../../../layouts/Screen';
import {login} from '../../../redux/actions/authAction';

const validate = values => {
  const errors = {};
  if (!values.email) {
    errors.email = 'Required';
  }
  if (!values.password) {
    errors.password = 'Required';
  }
  if (!values.branch) {
    errors.branch = 'Required';
  }
  return errors;
};

const Login = props => {
  const dispatch = useDispatch();
  const {fetching, errorMessage} = useSelector(state => state.auth);

  const onSubmit = data => {
    dispatch(login(data));
  };

  return (
    <Screen
      title="LOGIN"
      hasHeader
      isLoading={fetching}
      errorMessage={errorMessage}>
      <Image
        source={require('../../../../assets/images/logo.png')}
        alt="App Logo"
        my={5}
        alignSelf="center"
        style={styles.logo}
      />
      <Formik
        initialValues={{email: '', password: ''}}
        onSubmit={onSubmit}
        validate={validate}>
        {({handleChange, handleBlur, handleSubmit, values, errors}) => (
          <VStack flex={1} space={4}>
            <FormControl isRequired isInvalid={'email' in errors}>
              <FormControl.Label>Email</FormControl.Label>
              <Input
                onBlur={handleBlur('email')}
                placeholder="email"
                onChangeText={handleChange('email')}
                value={values.email}
                autoCapitalize="none"
                keyboardType="email-address"
                type="email"
              />
              <FormControl.ErrorMessage>
                {errors.email}
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl isRequired isInvalid={'password' in errors}>
              <FormControl.Label>Password</FormControl.Label>
              <Input
                onBlur={handleBlur('password')}
                placeholder="password"
                onChangeText={handleChange('password')}
                value={values.password}
                type="password"
              />
              <FormControl.ErrorMessage>
                {errors.password}
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl isRequired isInvalid={'branch' in errors}>
              <FormControl.Label>Select branch</FormControl.Label>
              <Select
                selectedValue={values.branch}
                minWidth={200}
                accessibilityLabel="Select your branch"
                placeholder="Select you branch"
                onValueChange={handleChange('branch')}
                onBlur={handleBlur('branch')}
                _selectedItem={{
                  bg: 'cyan.600',
                  endIcon: <CheckIcon size={4} />,
                }}>
                <Select.Item label="branch1" value="1" />
                <Select.Item label="branch2" value="2" />
              </Select>
              <FormControl.ErrorMessage>
                {errors.branch}
              </FormControl.ErrorMessage>
            </FormControl>
            <Button
              onPress={handleSubmit}
              colorScheme="cyan"
              size="lg"
              isLoading={fetching ? true : false}>
              Login
            </Button>
          </VStack>
        )}
      </Formik>
    </Screen>
  );
};

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  logo: {
    width: width * 0.3,
    height: width * 0.3,
  },
});

export default Login;
