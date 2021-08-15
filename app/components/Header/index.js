import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {
  AlertDialog,
  ArrowBackIcon,
  Button,
  HStack,
  Heading,
  Image,
  View,
} from 'native-base';

import {logout} from '../../redux/actions/authAction';
import LogoutIcon from '../../../assets/images/svg/logout.svg';

const Header = props => {
  const [isOpen, setIsOpen] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {authenticated} = useSelector(state => state.auth);
  const onClose = () => setIsOpen(false);
  return (
    <HStack space={3} alignItems="center">
      {props.hasBackButton && (
        <Button
          size="xs"
          variant="ghost"
          p={0}
          onPress={() => {
            navigation.goBack();
          }}>
          <ArrowBackIcon size={6} color="primary.500" />
        </Button>
      )}
      {props.hasLogo && (
        <Image
          source={require('../../../assets/images/logo.png')}
          alt="App Logo"
          size={'xs'}
        />
      )}
      <View>
        <Heading size="lg" color="primary.500">
          Scanner
        </Heading>
        <Heading size="xs" color="muted.400">
          {props.title}
        </Heading>
      </View>
      {authenticated && (
        <Button
          siz="xs"
          variant="ghost"
          p={0}
          position="absolute"
          right={0}
          onPress={() => {
            // dispatch(logout());
            setIsOpen(true);
          }}>
          <LogoutIcon width={24} height={24} color="#06b6d4" />
        </Button>
      )}
      <AlertDialog isOpen={isOpen} onClose={onClose} motionPreset={'fade'}>
        <AlertDialog.Content>
          <AlertDialog.Header fontSize="lg" fontWeight="bold">
            Notification
          </AlertDialog.Header>
          <AlertDialog.Body>
            Are you sure? Do you want to logout ?
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button variant="ghost" onPress={onClose}>
              Cancel
            </Button>
            <Button
              variant="ghost"
              onPress={() => {
                onClose();
                setTimeout(() => {
                  dispatch(logout());
                }, 1000);
              }}
              ml={3}>
              Ok
            </Button>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </HStack>
  );
};

export default Header;
