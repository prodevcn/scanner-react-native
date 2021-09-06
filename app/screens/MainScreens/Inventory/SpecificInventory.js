/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  useToast,
  HStack,
  Button,
  FormControl,
  VStack,
  Heading,
  AlertDialog,
  Text,
  Input,
} from 'native-base';
import {useNavigation} from '@react-navigation/native';

import {
  fetchingPermittedShelves,
  fetchingPermittedSessions,
} from '../../../redux/actions/countingAction';
import Dropdown from '../../../components/Dropdown';
import Screen from '../../../layouts/Screen';

const SpecificInventory = props => {
  const navigation = useNavigation();
  const toast = useToast();
  const dispatch = useDispatch();
  const [openDlg, setOpenDlg] = useState(false);
  const onCloseDlg = () => setOpenDlg(false);
  const {
    permittedShelves,
    permittedSessions,
    fetchingCount,
    errorMessageCount,
  } = useSelector(state => state.counting);
  const [shelf, setShelf] = useState('');
  const [session, setSession] = useState('');
  const [round, setRound] = useState('');
  const [alertErrorMessage, setErrorMessage] = useState(null);
  const [securityCode, setSecurityCode] = useState('');
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [selectedShelfId, setSelectedShelfId] = useState(null);

  const processCount = value => {
    if (value === '') {
      setErrorMessage('Security code is empty, please input it.');
      setSecurityCode('');
    }
    if (value !== '123456') {
      setErrorMessage('Security code is incorrect, please input correct code.');
      setSecurityCode('');
    }
    if (value === '123456') {
      onCloseDlg();
      setErrorMessage(null);
      setSecurityCode('');
      navigation.navigate('specific-panel', {
        shelfCode: shelf,
        shelfId: selectedShelfId,
        sessionId: selectedSessionId,
        round: round,
        type: 'SPECIFIC',
      });
    }
  };

  const startCount = () => {
    if (shelf === '') {
      toast.show({title: 'Please input shelf code'});
    } else {
      let sessionId;
      let shelfId;
      let countedStatus = false;
      for (let item of permittedShelves) {
        if (item.shelf?.code === shelf) {
          shelfId = item.shelf.id;
          countedStatus = item.counted;
        }
      }
      for (let item of permittedSessions) {
        if (item.code === session) {
          sessionId = item.id;
        }
      }
      setSelectedSessionId(sessionId);
      setSelectedShelfId(shelfId);
      if (countedStatus) {
        setOpenDlg(true);
      } else {
        navigation.navigate('specific-panel', {
          shelfCode: shelf,
          shelfId: shelfId,
          sessionId: sessionId,
          round: round,
          type: 'SPECIFIC',
        });
      }
    }
  };

  const clearAll = () => {
    setSelectedSessionId(null);
    setSelectedShelfId(null);
    setErrorMessage(null);
    setShelf('');
    setSession('');
    setRound('');
    setSecurityCode('');
  };

  useEffect(() => {
    clearAll();
    dispatch(fetchingPermittedSessions());
    navigation.addListener('focus', () => {
      setShelf('');
      setSession('');
    });
    return () => {
      setShelf('');
      setSession('');
    };
  }, []);

  useEffect(() => {
    if (shelf !== '') {
      for (let item of permittedShelves) {
        if (item.shelf?.code === shelf) {
          setRound(item.round);
        }
      }
    } else {
      setRound('');
    }
  }, [shelf]);

  useEffect(() => {
    if (session !== '') {
      let sessionId;
      for (let item of permittedSessions) {
        if (item.code === session) {
          sessionId = item.id;
        }
      }
      dispatch(fetchingPermittedShelves({session_id: sessionId}));
    }
    setShelf('');
  }, [session]);

  return (
    <Screen
      hasBackButton
      title="SPECIFIC INVENTORY"
      hasHeader
      errorMessage={errorMessageCount}
      isLoading={fetchingCount}>
      <VStack flex={1} mt="10" space={2}>
        <Heading size="xs" my={2} color="gray.400">
          SELECT SESSION
        </Heading>
        <FormControl isRequired>
          <Dropdown
            key="session"
            placeholder="Please select session"
            defaultValue="select session"
            selectedValue={session}
            onValueChange={e => {
              setSession(e);
            }}
            data={permittedSessions.map(item => {
              return item.code;
            })}
          />
          <FormControl.ErrorMessage>
            Please select shelf
          </FormControl.ErrorMessage>
        </FormControl>
        <Heading size="xs" my={2} color="gray.400">
          SELECT SHELF
        </Heading>
        <FormControl isRequired>
          <Dropdown
            key="shelf"
            icon
            placeholder="Please select shelf"
            selectedValue={shelf}
            defaultValue="select shelf"
            onValueChange={e => {
              setShelf(e);
            }}
            data={permittedShelves.map(item => {
              return item.shelf?.code;
            })}
            originData={permittedShelves}
          />
          <FormControl.ErrorMessage>
            Please select shelf
          </FormControl.ErrorMessage>
        </FormControl>
        <Heading size="xs" my={2} color="gray.400">
          Round: {round}
        </Heading>
        <HStack space={2} my={10} w="100%" justifyContent="space-between">
          <Button
            variant="outline"
            w="40%"
            onPress={() => {
              setShelf('');
            }}>
            Cancel
          </Button>
          <Button
            w="40%"
            disabled={shelf !== '' ? false : true}
            onPress={() => {
              startCount();
            }}>
            Start count
          </Button>
        </HStack>
      </VStack>
      <AlertDialog isOpen={openDlg} onClose={onCloseDlg} motionPreset={'fade'}>
        <AlertDialog.Content>
          <AlertDialog.Header fontSize="lg" fontWeight="bold">
            Do you want to count again ?
          </AlertDialog.Header>
          <AlertDialog.Body>
            Please input security code.
            <Input
              w="100%"
              mt={10}
              value={securityCode}
              onChangeText={e => {
                setSecurityCode(e);
              }}
            />
            <Text color="red.700">{alertErrorMessage}</Text>
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button
              variant="ghost"
              onPress={() => {
                setErrorMessage(null);
                setSecurityCode('');
                onCloseDlg();
              }}>
              Cancel
            </Button>
            <Button
              variant="ghost"
              onPress={() => {
                processCount(securityCode);
              }}>
              OK
            </Button>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </Screen>
  );
};

export default SpecificInventory;
