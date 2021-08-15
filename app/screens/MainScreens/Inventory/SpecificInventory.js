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
  const {
    permittedShelves,
    permittedSessions,
    fetchingCount,
    errorMessageCount,
  } = useSelector(state => state.counting);
  const [shelf, setShelf] = useState('');
  const [session, setSession] = useState('');
  const [round, setRound] = useState('');

  const startCount = () => {
    if (shelf === '') {
      toast.show({title: 'Please input shelf code'});
    } else {
      let sessionId;
      let shelfId;
      for (let item of permittedShelves) {
        if (item.shelf?.code === shelf) {
          shelfId = item.shelf.id;
        }
      }
      for (let item of permittedSessions) {
        if (item.code === session) {
          sessionId = item.id;
        }
      }
      navigation.navigate('specific-panel', {
        shelfCode: shelf,
        shelfId: shelfId,
        sessionId: sessionId,
        round: round,
        type: 'SPECIFIC',
      });
    }
  };

  useEffect(() => {
    dispatch(fetchingPermittedSessions());
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
            placeholder="Please select shelf"
            selectedValue={shelf}
            defaultValue="select shelf"
            onValueChange={e => {
              setShelf(e);
            }}
            data={permittedShelves.map(item => {
              return item.shelf?.code;
            })}
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
    </Screen>
  );
};

export default SpecificInventory;
