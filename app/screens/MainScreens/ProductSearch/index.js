/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  ArrowBackIcon,
  Box,
  Button,
  Divider,
  Fab,
  FormControl,
  HStack,
  Heading,
  Input,
  Modal,
  Pressable,
  ScrollView,
  Text,
  VStack,
  View,
  useToast,
} from 'native-base';
import {StyleSheet, Platform, PermissionsAndroid} from 'react-native';
import {CameraKitCameraScreen} from 'react-native-camera-kit';

import Screen from '../../../layouts/Screen';

import Next from '../../../../assets/images/svg/next.svg';
import Prev from '../../../../assets/images/svg/prev.svg';
import ScanIcon from '../../../../assets/images/svg/maximize.svg';
import SearchIcon from '../../../../assets/images/svg/search.svg';

import {
  inventoryGeneralFetching,
  clearSearchHistory,
} from '../../../redux/actions/queryAction';

const Queries = props => {
  const [onCamera, setOnCamera] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [page, setPage] = useState(1);
  const [code, setCode] = useState('');
  const toast = useToast();
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.user);
  const {queryData, fetching, errorMessage} = useSelector(state => state.query);

  useEffect(() => {
    return () => {
      dispatch(clearSearchHistory());
    };
  }, []);

  const printTag = tag => {
    switch (tag) {
      case 'Part_Cod':
        return 'Part code';
      case 'Part_Nam':
        return 'Part name';
      case 'Cur_Balan':
        return 'Balance';
      case 'Cur_Cost':
        return 'Cost';
      default:
        return tag;
    }
  };

  const onSubmit = () => {
    if (code === '') {
      toast.show({title: 'Please input code'});
    } else {
      dispatch(
        inventoryGeneralFetching({
          code: code,
          show_cost: user.show_cost,
          show_balance: user.show_balance,
          page: 1,
        }),
      );
    }
  };

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs permission for camera access',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setOnCamera(true);
      } else {
        toast.show({title: 'CAMERA permission denied'});
      }
    } catch (err) {
      toast.show({title: 'Camera permission error'});
    }
  };

  const openCamera = () => {
    if (Platform.OS === 'android') {
      requestCameraPermission();
    } else {
      setOnCamera(true);
    }
  };

  const onBarcodeScan = scanResult => {
    setCode(scanResult);
    setOnCamera(false);
    dispatch(
      inventoryGeneralFetching({
        code: scanResult,
        show_cost: user.show_cost,
        show_balance: user.show_balance,
        page: 1,
      }),
    );
  };

  const fetchingNextPage = type => {
    dispatch(
      inventoryGeneralFetching({
        code: code,
        show_cost: user.show_cost,
        page: type === 'prev' ? page - 1 : page + 1,
      }),
    );
    if (type === 'prev') {
      setPage(prev => prev - 1);
    } else {
      setPage(prev => prev + 1);
    }
  };

  const default_data = [
    'Part code',
    'Part name',
    'Cost',
    'Balance',
    'Location',
    'Location 2',
    'Location 3',
    'Location 4',
  ];

  return (
    <Screen
      hasBackButton
      title="PRODUCT SEARCH"
      errorMessage={errorMessage}
      fullScreen={onCamera ? true : false}
      hasHeader={onCamera ? false : true}
      isLoading={fetching}>
      {onCamera ? (
        <View style={styles.cameraScreen}>
          <CameraKitCameraScreen
            showFrame={true}
            scanBarcode={true}
            laserColor={'#06b6d4'}
            frameColor={'#06b6d4'}
            colorForScannerFrame={'black'}
            onReadCode={e => {
              onBarcodeScan(e.nativeEvent.codeStringValue);
            }}
          />
          <Fab
            placement="top-left"
            onPress={() => {
              setOnCamera(false);
            }}
            icon={<ArrowBackIcon size={6} color="white" />}
            size={10}
          />
        </View>
      ) : (
        <VStack flex={1} mt="10" space={2}>
          <HStack space={2} w="100%" justifyContent="space-between">
            <Button variant="ghost" p={0}>
              <ScanIcon
                width={24}
                height={24}
                color="#06b6d4"
                onPress={() => {
                  openCamera();
                }}
              />
            </Button>
            <FormControl
              isRequired
              isInvalid={code === '' ? true : false}
              w="70%">
              <Input
                placeholder="Please input code"
                onChangeText={text => {
                  setCode(text);
                }}
                value={code}
                autoCapitalize="none"
                type="text"
              />
            </FormControl>
            <Button
              variant="ghost"
              onPress={() => {
                onSubmit();
              }}
              p={0}>
              <SearchIcon width={24} height={24} color="#06b6d4" />
            </Button>
          </HStack>
          <VStack flex={1} space={2}>
            <HStack w="100%" justifyContent="space-between" alignItems="center">
              <Heading size="sm" my={3} color="primary.600">
                Details
              </Heading>
              {queryData.length === 10 && (
                <HStack w="50%" justifyContent="space-around">
                  {page > 1 && (
                    <Button
                      p={0}
                      variant="ghost"
                      onPress={() => {
                        fetchingNextPage('prev');
                      }}>
                      <Prev width={20} height={20} color="#000" />
                    </Button>
                  )}
                  <Heading size="sm">Page : {page}</Heading>
                  <Button
                    p={0}
                    variant="ghost"
                    onPress={() => {
                      fetchingNextPage('next');
                    }}>
                    <Next width={20} height={20} color="#000" />
                  </Button>
                </HStack>
              )}
            </HStack>
            <ScrollView
              flex={1}
              mt={2}
              mx={5}
              pb={2}
              showsVerticalScrollIndicator={false}>
              {queryData.length === 0 &&
                default_data.map((e, index) => {
                  if (!user.show_cost && e === 'Cost') {
                    return null;
                  }
                  if (!user.show_balance && e === 'Balance') {
                    return null;
                  }
                  return (
                    <Box w="100%" key={`DEFAULT_VALUE_${index}`}>
                      <HStack w="100%" p={3}>
                        <Text color="primary.700" w="50%">
                          {e}
                        </Text>
                        <Text color="primary.700" w="50%">
                          .............
                        </Text>
                      </HStack>
                      <Divider borderColor="primary.500" />
                    </Box>
                  );
                })}
              {queryData.length === 1 &&
                Object.keys(queryData[0]).map((key, index) => (
                  <Box w="100%" key={`DEFAULT_VALUE_${index}`}>
                    <HStack w="100%" p={3}>
                      <Text color="primary.700" w="50%">
                        {printTag(key)}
                      </Text>
                      <Text color="primary.700" w="50%">
                        {queryData[0][key]}
                      </Text>
                    </HStack>
                    <Divider borderColor="primary.500" />
                  </Box>
                ))}
              {queryData.length > 1 &&
                queryData.map((item, index) => (
                  <Pressable
                    w="100%"
                    key={`PRESS_${index}`}
                    onPress={() => {
                      setModalContent(item);
                      setShowModal(true);
                    }}>
                    <HStack
                      alignItems="center"
                      rounded="md"
                      key={`GENERAL_DATA_${index}`}
                      w="100%"
                      bg={index % 2 === 0 && 'primary.600'}
                      p={3}>
                      <Text
                        color={index % 2 === 0 ? 'white' : 'primary.600'}
                        w="50%">
                        {item.Part_Cod}
                      </Text>
                      <Text
                        w="50%"
                        color={index % 2 === 0 ? 'white' : 'primary.600'}>
                        {item.Part_Nam}
                      </Text>
                    </HStack>
                  </Pressable>
                ))}
            </ScrollView>
            <Modal
              isOpen={showModal}
              onClose={() => {
                setShowModal(false);
                setModalContent({});
              }}>
              <Modal.Content maxWidth="400px">
                <Modal.CloseButton />
                <Modal.Header>Detail</Modal.Header>
                <Modal.Body>
                  <ScrollView>
                    {modalContent !== {} &&
                      Object.keys(modalContent).map((key, index) => (
                        <Box w="100%" key={`DEFAULT_VALUE_${index}`}>
                          <HStack w="100%" p={3}>
                            <Text color="primary.700" w="50%">
                              {printTag(key)}
                            </Text>
                            <Text color="primary.700" w="50%">
                              {modalContent[key]}
                            </Text>
                          </HStack>
                          <Divider borderColor="primary.500" />
                        </Box>
                      ))}
                  </ScrollView>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="ghost"
                    onPress={() => {
                      setShowModal(false);
                      setModalContent({});
                    }}>
                    CLOSE
                  </Button>
                </Modal.Footer>
              </Modal.Content>
            </Modal>
          </VStack>
        </VStack>
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  preview: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  cameraScreen: {
    flex: 1,
  },
});

export default Queries;
