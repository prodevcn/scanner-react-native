import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/core';
import {
  AlertDialog,
  Button,
  HStack,
  Heading,
  VStack,
  useToast,
} from 'native-base';

/** import utils */

import Screen from '../../../layouts/Screen';
import Session from '../../../../assets/images/svg/bookmark.svg';

import {createNewSession} from '../../../redux/actions/sessionAction';

const BarcodePreparing = props => {
  const [isOpen, setIsOpen] = useState(false);
  const navigation = useNavigation();
  const toast = useToast();
  const {currentSessionId, savedItems} = useSelector(state => state.session);
  const dispatch = useDispatch();

  const newSessionProcess = async () => {
    if (currentSessionId) {
      setIsOpen(true);
    } else {
      dispatch(createNewSession(null, []));
      navigation.navigate('new-session');
    }
  };

  const savePrevSessionAndCreateNewSession = () => {
    console.log('[PROCESS]:[SAVE_PRE_SESSION]');
    onClose();
    dispatch(createNewSession(currentSessionId, savedItems));
    navigation.navigate('new-session');
  };

  const onClose = () => setIsOpen(false);

  return (
    <Screen hasHeader hasBackButton title="BARCODE PREPARING">
      <VStack space={4} w="100%" flex={1} mt={10}>
        <HStack w="100%" justifyContent="center">
          <Session width={60} height={60} color="#06b6d4" />
        </HStack>
        <Heading size={'xs'} alignSelf="center" color="primary.600">
          SESSION MANAGEMENT
        </Heading>
        <Button
          py={5}
          onPress={() => {
            newSessionProcess();
          }}>
          New session
        </Button>
        <Button
          py={5}
          onPress={() => {
            if (!currentSessionId) {
              toast.show({
                title: 'There is no cached Session, Please create new Session',
              });
            } else {
              navigation.navigate('edit-session');
            }
          }}>
          Continue the last session
        </Button>
        <Button
          py={5}
          onPress={() => {
            navigation.navigate('share-session');
          }}>
          Share a session
        </Button>
        <AlertDialog isOpen={isOpen} onClose={onClose} motionPreset={'fade'}>
          <AlertDialog.Content>
            <AlertDialog.Header fontSize="lg" fontWeight="bold">
              Session already exists!
            </AlertDialog.Header>
            <AlertDialog.Body>
              {savedItems.length === 0
                ? 'There is no items to save, please continue with previous session'
                : 'Do you want to save previous session ?'}
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button variant="outline" onPress={onClose}>
                Cancel
              </Button>
              <Button
                variant="solid"
                onPress={() => {
                  savedItems.length === 0
                    ? onClose()
                    : savePrevSessionAndCreateNewSession();
                }}
                ml={3}>
                Yes
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog>
      </VStack>
    </Screen>
  );
};

export default BarcodePreparing;
