import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  Alert,
  ArrowBackIcon,
  Box,
  Center,
  Fab,
  HStack,
  NativeBaseProvider,
  ScrollView,
  Spinner,
  View,
} from 'native-base';
import {Platform} from 'react-native';

import Header from '../../components/Header';

const Screen = props => {
  const navigation = useNavigation();

  return (
    <NativeBaseProvider>
      <Box
        flex={1}
        w="100%"
        px={props.fullScreen ? '0%' : '5%'}
        safeAreaTop={Platform.OS === 'ios' && !props.fullScreen ? 8 : 0}
        style={props.innerStyle}>
        {props.fullScreen && (
          <Fab
            placement="top-left"
            onPress={() => {
              navigation.goBack();
            }}
            icon={<ArrowBackIcon size={6} color="white" />}
            size={10}
          />
        )}
        {props.hasHeader && (
          <Header
            title={props.title}
            hasLogo={props.hasLogo}
            hasBackButton={props.hasBackButton}
          />
        )}
        {props.hasScroll ? (
          <ScrollView
            _contentContainerStyle={props.innerStyle}
            mb={10}
            showsVerticalScrollIndicator={false}>
            {props.children}
          </ScrollView>
        ) : (
          <View flex={1}>{props.children}</View>
        )}
      </Box>
      {props.errorMessage !== null && props.errorMessage !== undefined && (
        <HStack position="absolute" w="100%" bottom={0}>
          <Alert status="error" w="100%">
            <Alert.Icon />
            <Alert.Title flexShrink={1}>{props.errorMessage}</Alert.Title>
          </Alert>
        </HStack>
      )}
      {props.isLoading && (
        <Box position="absolute" w="100%" h="100%" bg="black" opacity={0.8}>
          <Center flex={1}>
            <Spinner accessibilityLabel="Loading posts" />
          </Center>
        </Box>
      )}
    </NativeBaseProvider>
  );
};

export default Screen;
