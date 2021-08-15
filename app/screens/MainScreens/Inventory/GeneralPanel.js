/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {CameraKitCameraScreen} from 'react-native-camera-kit';
import {StyleSheet, Platform, PermissionsAndroid} from 'react-native';
import {
  View,
  useToast,
  HStack,
  Button,
  FormControl,
  VStack,
  Input,
  Fab,
  ArrowBackIcon,
  Heading,
  useDisclose,
  Actionsheet,
  ScrollView,
  Box,
  Text,
  Pressable,
  Spinner,
  Center,
} from 'native-base';
import {useNavigation} from '@react-navigation/core';

import ScanIcon from '../../../../assets/images/svg/maximize.svg';
import Screen from '../../../layouts/Screen';
import Plus from '../../../../assets/images/svg/plus.svg';
import Item from '../../../../assets/images/svg/item.svg';
import Edit from '../../../../assets/images/svg/edit.svg';
import Trash from '../../../../assets/images/svg/trash.svg';
import SearchIcon from '../../../../assets/images/svg/search.svg';
import Next from '../../../../assets/images/svg/next.svg';
import Prev from '../../../../assets/images/svg/prev.svg';

import {
  createGeneralReport,
  getBalance,
  saveGeneralItems,
} from '../../../redux/actions/countingAction';
import {
  inventoryGeneralFetching,
  clearSearchHistory,
} from '../../../redux/actions/queryAction';
import {GENERAL_FETCHING} from '../../../constants/actions';

const GeneralPanel = props => {
  const [onCamera, setOnCamera] = useState(false);
  const [page, setPage] = useState(1);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const {isOpen, onOpen, onClose} = useDisclose();
  const toast = useToast();
  const dispatch = useDispatch();
  const {savedGeneralItems, fetchingCount} = useSelector(
    state => state.counting,
  );
  const {queryData, fetching, errorMessage} = useSelector(state => state.query);
  const {user} = useSelector(state => state.user);
  const navigate = useNavigation();

  useEffect(() => {
    return () => {
      dispatch(clearSearchHistory());
    };
  }, []);

  const onSubmit = () => {
    if (code === '') {
      toast.show({title: 'Please input code'});
    } else {
      dispatch(
        inventoryGeneralFetching({
          code: code,
          show_cost: false,
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
        show_cost: false,
        page: 1,
      }),
    );
  };

  const fetchingNextPage = type => {
    dispatch(
      inventoryGeneralFetching({
        code: code,
        show_cost: false,
        page: type === 'prev' ? page - 1 : page + 1,
      }),
    );
    if (type === 'prev') {
      setPage(prev => prev - 1);
    } else {
      setPage(prev => prev + 1);
    }
  };

  const addItem = async () => {
    const items = savedGeneralItems;
    onClose();
    const balance = await dispatch(getBalance(code));
    const newItem = {
      name: name,
      part_code: code,
      count: quantity,
      system_qty: balance?.system_qty,
    };
    if (editIndex === null) {
      items.push(newItem);
      dispatch(saveGeneralItems(items));
    } else {
      const editedItems = items.map((e, index) => {
        if (index === editIndex) {
          return newItem;
        } else {
          return e;
        }
      });
      dispatch(saveGeneralItems(editedItems));
      setEditIndex(null);
    }
    onClear();
  };

  const onRemove = index => {
    const items = savedGeneralItems;
    const editedItems = [];
    if (items.length > 1) {
      for (let i = 0; i < items.length; i++) {
        if (i !== index) {
          editedItems.push(items[i]);
        }
      }
    }
    dispatch(saveGeneralItems(editedItems));
  };

  const onClear = () => {
    setQuantity(0);
    setCode('');
    setName('');
  };

  const onEdit = index => {
    setEditIndex(index);
    onOpen();
    setCode(savedGeneralItems[index].part_code);
    setName(savedGeneralItems[index].name);
    setQuantity(savedGeneralItems[index].count);
  };

  const doCreateReport = () => {
    if (!savedGeneralItems[0]) {
      toast.show({title: 'No item to create counting !'});
    } else {
      const data = savedGeneralItems;
      dispatch(
        createGeneralReport({
          items: data,
          mode: 'general',
          shelf_code: props.route.params.shelfCode,
        }),
      ).then(res => {
        if (res.message) {
          toast.show({title: 'Create report successfully!'});
        }
      });
    }
  };

  return (
    <Screen
      hasBackButton
      errorMessage={errorMessage}
      isLoading={fetching}
      title={props.route.params.type + 'COUNTING'}
      fullScreen={onCamera ? true : false}
      hasScroll={onCamera ? false : true}
      hasHeader={onCamera ? false : true}>
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
            <Heading size="xs" color="primary.600">
              GENERAL
            </Heading>
            <Heading size="xs">
              SHELF CODE : {props.route.params.shelfCode}
            </Heading>
          </HStack>
          <VStack flex={1}>
            <HStack>
              <Button variant="ghost" onPress={onOpen}>
                <HStack>
                  <Plus
                    width={24}
                    height={24}
                    color="#06b6d4"
                    alignSelf="flex-start"
                  />
                  <Text color="#06b6d4">Add new item</Text>
                </HStack>
              </Button>
            </HStack>
            <ScrollView showsVerticalScrollIndicator={false}>
              {savedGeneralItems.map((item, index) => (
                <Box
                  key={`SAVED_ITEM_${index}`}
                  my={2}
                  bg={index % 2 === 0 ? 'gray.200' : 'gray.300'}
                  rounded="md"
                  py={1}
                  px={1}>
                  <HStack alignItems="center" justifyContent="space-between">
                    <Item width={32} height={32} color="#06b6d4" />
                    <VStack space={1} flex={1} px={5}>
                      <Heading size="xs">Part Code : {item.part_code}</Heading>
                      <Heading size="xs">Part Name : {item.name}</Heading>
                      <Heading size="xs">Quantity: {item.count}</Heading>
                      {user.show_balance && (
                        <Heading size="xs">Balance: {item.system_qty}</Heading>
                      )}
                    </VStack>
                    <Button
                      variant="ghost"
                      p={1}
                      mr={2}
                      onPress={() => {
                        onRemove(index);
                      }}>
                      <Trash
                        width={24}
                        height={24}
                        color="#06b6d4"
                        alignSelf="flex-start"
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      p={1}
                      onPress={() => {
                        onEdit(index);
                      }}>
                      <Edit
                        width={24}
                        height={24}
                        color="#06b6d4"
                        alignSelf="flex-start"
                      />
                    </Button>
                  </HStack>
                </Box>
              ))}
              <VStack my={2} />
            </ScrollView>
            <HStack w="100%">
              <HStack space={2} w="100%" justifyContent="space-between">
                <Button
                  variant="outline"
                  w="40%"
                  onPress={() => {
                    navigate.goBack();
                  }}>
                  Cancel
                </Button>
                <Button
                  w="40%"
                  disabled={savedGeneralItems.length < 1 ? true : false}
                  onPress={() => {
                    doCreateReport();
                  }}>
                  Save
                </Button>
              </HStack>
            </HStack>
          </VStack>
          <Actionsheet
            isOpen={isOpen}
            onClose={() => {
              setPage(1);
              dispatch(dispatchController =>
                dispatchController({
                  type: GENERAL_FETCHING.SUCCESS,
                  payload: [],
                }),
              );
              onClose();
            }}>
            <Actionsheet.Content>
              {fetchingCount ? (
                <Center flex={1}>
                  <Spinner accessibilityLabel="is Loading" />
                </Center>
              ) : (
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  mb={2}
                  w="100%">
                  <VStack space={2} width="100%">
                    <Heading
                      my={2}
                      color="primary.500"
                      size="xs"
                      alignSelf="center"
                      textAlign="center">
                      Enter part of item code or part name or scan barcode
                    </Heading>
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
                    <VStack space={2} w="100%">
                      {(queryData.length === 10 ||
                        (page > 1 && queryData.length > 1)) && (
                        <HStack w="40%" justifyContent="space-around">
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
                          {queryData.length === 10 && (
                            <Button
                              p={0}
                              variant="ghost"
                              onPress={() => {
                                fetchingNextPage('next');
                              }}>
                              <Next width={20} height={20} color="#000" />
                            </Button>
                          )}
                        </HStack>
                      )}
                      {queryData.length < 1 && (
                        <Box width="100%">
                          <FormControl isRequired w="100%">
                            <FormControl.Label>Part Code</FormControl.Label>
                            <Input
                              placeholder="Please input code"
                              onChangeText={text => {
                                setCode(text);
                              }}
                              value={code}
                              autoCapitalize="none"
                              type="text"
                              isReadOnly={true}
                            />
                          </FormControl>
                          <FormControl isRequired w="100%">
                            <FormControl.Label>Part Name</FormControl.Label>
                            <Input
                              placeholder="Please input name"
                              onChangeText={text => {
                                setName(text);
                              }}
                              value={name}
                              autoCapitalize="none"
                              type="text"
                              isReadOnly={true}
                            />
                          </FormControl>
                          <FormControl isRequired w="100%">
                            <FormControl.Label>Quantity</FormControl.Label>
                            <Input
                              placeholder="Please input Quantity"
                              onChangeText={text => {
                                setQuantity(Number(text));
                              }}
                              value={quantity.toString()}
                              autoCapitalize="none"
                              keyboardType="numeric"
                              type="text"
                            />
                          </FormControl>
                          <HStack w="100%" my={2}>
                            <HStack
                              space={2}
                              w="100%"
                              justifyContent="space-between">
                              <Button
                                variant="outline"
                                w="40%"
                                onPress={() => {
                                  onClear();
                                  onClose();
                                }}>
                                Cancel
                              </Button>
                              <Button
                                w="40%"
                                disabled={
                                  code !== '' && name !== '' ? false : true
                                }
                                onPress={() => {
                                  setPage(1);
                                  addItem();
                                }}>
                                Save
                              </Button>
                            </HStack>
                          </HStack>
                        </Box>
                      )}
                      {queryData.length >= 1 &&
                        queryData.map((item, index) => (
                          <Pressable
                            w="100%"
                            key={`PRESS_${index}`}
                            onPress={() => {
                              setCode(item.Part_Cod);
                              setName(item.Part_Nam);
                              dispatch(dispatchController =>
                                dispatchController({
                                  type: GENERAL_FETCHING.SUCCESS,
                                  payload: [],
                                }),
                              );
                            }}>
                            <HStack
                              alignItems="center"
                              rounded="md"
                              key={`GENERAL_DATA_${index}`}
                              w="100%"
                              bg={index % 2 === 0 && 'primary.600'}
                              p={3}>
                              <Text
                                color={
                                  index % 2 === 0 ? 'white' : 'primary.600'
                                }
                                w="50%">
                                {item.Part_Cod}
                              </Text>
                              <Text
                                w="50%"
                                color={
                                  index % 2 === 0 ? 'white' : 'primary.600'
                                }>
                                {item.Part_Nam}
                              </Text>
                            </HStack>
                          </Pressable>
                        ))}
                    </VStack>
                  </VStack>
                </ScrollView>
              )}
            </Actionsheet.Content>
          </Actionsheet>
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

export default GeneralPanel;
