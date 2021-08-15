import React, {useState} from 'react';
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
} from 'native-base';
import {useNavigation} from '@react-navigation/native';

import ScanIcon from '../../../../assets/images/svg/maximize.svg';
import Screen from '../../../layouts/Screen';

const GeneralInventory = props => {
  const navigation = useNavigation();
  const [onCamera, setOnCamera] = useState(false);
  const [code, setCode] = useState('');
  const toast = useToast();

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
  };

  const startCount = () => {
    if (code === '') {
      toast.show({title: 'Please input shelf code'});
    } else {
      setCode('');
      navigation.navigate('general-panel', {shelfCode: code, type: 'GENERAL'});
    }
  };

  return (
    <Screen
      hasBackButton
      title="GENERAL INVENTORY"
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
          <Heading size="sm" alignSelf="center" my={5} color="primary.600">
            Enter shelf code or scan it
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
              w="80%">
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
          </HStack>
          <HStack space={2} my={10} w="100%" justifyContent="space-between">
            <Button
              variant="outline"
              w="40%"
              onPress={() => {
                setCode('');
              }}>
              Cancel
            </Button>
            <Button
              w="40%"
              disabled={code !== '' ? false : true}
              onPress={() => {
                startCount();
              }}>
              Start count
            </Button>
          </HStack>
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

export default GeneralInventory;
