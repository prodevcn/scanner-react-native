import React from 'react';
import {VStack, Input, Button, FormControl, Image, useToast} from 'native-base';
import {StyleSheet, Dimensions} from 'react-native';
import {Formik} from 'formik';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import {changePassword} from '../../../redux/actions/authAction';
import Screen from '../../../layouts/Screen';

const validate = values => {
  const errors = {};
  if (!values.current_password) {
    errors.current_password = 'Required';
  }
  if (!values.new_password) {
    errors.new_password = 'Required';
  }
  if (values.new_password === values.current_password) {
    errors.new_password = 'Please use different password from previous.';
  }
  if (values.confirm_password !== values.new_password) {
    errors.confirm_password = 'Confirm password must be same with new password';
  }
  if (!values.confirm_password) {
    errors.confirm_password = 'Required';
  }
  return errors;
};

const ChangePassword = props => {
  const dispatch = useDispatch();
  const toast = useToast();
  const navigation = useNavigation();
  const {fetching} = useSelector(state => state.auth);

  const onSubmit = data => {
    dispatch(changePassword(data))
      .then(res => {
        toast.show({title: 'Changed password successfully!'});
        navigation.goBack();
      })
      .catch(err => {
        console.log('[ERROR]:[CHANGE_PASSWORD]', err);
      });
  };

  return (
    <Screen
      title="CHANGE PASSWORD"
      hasBackButton
      hasHeader
      hasScroll
      isLoading={fetching}>
      <Image
        source={require('../../../../assets/images/logo.png')}
        alt="App Logo"
        my={10}
        alignSelf="center"
        style={styles.logo}
      />
      <Formik
        initialValues={{
          current_password: '',
          new_password: '',
          confirm_password: '',
        }}
        onSubmit={onSubmit}
        validate={validate}>
        {({handleChange, handleBlur, handleSubmit, values, errors}) => (
          <VStack flex={1} space={4}>
            <FormControl isRequired isInvalid={'current_password' in errors}>
              <FormControl.Label>Current Password</FormControl.Label>
              <Input
                onBlur={handleBlur('current_password')}
                placeholder="current_password"
                onChangeText={handleChange('current_password')}
                value={values.current_password}
                type="password"
              />
              <FormControl.ErrorMessage>
                {errors.current_password}
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl isRequired isInvalid={'new_password' in errors}>
              <FormControl.Label>New Password</FormControl.Label>
              <Input
                onBlur={handleBlur('new_password')}
                placeholder="new_password"
                onChangeText={handleChange('new_password')}
                value={values.new_password}
                type="password"
              />
              <FormControl.ErrorMessage>
                {errors.new_password}
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl isRequired isInvalid={'confirm_password' in errors}>
              <FormControl.Label>New Password</FormControl.Label>
              <Input
                onBlur={handleBlur('confirm_password')}
                placeholder="confirm_password"
                onChangeText={handleChange('confirm_password')}
                value={values.confirm_password}
                type="password"
              />
              <FormControl.ErrorMessage>
                {errors.confirm_password}
              </FormControl.ErrorMessage>
            </FormControl>
            <Button
              onPress={handleSubmit}
              colorScheme="cyan"
              size="lg"
              isLoading={fetching ? true : false}>
              Submit
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
    width: width * 0.2,
    height: width * 0.2,
  },
});

export default ChangePassword;
