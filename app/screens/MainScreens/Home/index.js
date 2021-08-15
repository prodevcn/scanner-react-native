import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {Button, VStack, Heading, HStack} from 'native-base';
import Screen from '../../../layouts/Screen';
/** import svg */
import HomeIcon from '../../../../assets/images/svg/menu.svg';

const Home = props => {
  const navigation = useNavigation();
  return (
    <Screen title="HOME" hasLogo hasHeader>
      <VStack space={4} w="100%" flex={1} mt={10}>
        <HStack w="100%" justifyContent="center">
          <HomeIcon width={60} height={60} color="#06b6d4" />
        </HStack>
        <Heading color="primary.600" size={'xs'} alignSelf="center">
          SELECT A TASK TO START
        </Heading>
        <Button
          py={5}
          onPress={() => {
            navigation.navigate('product-search');
          }}>
          Search Product
        </Button>
        <Button
          py={5}
          onPress={() => {
            navigation.navigate('barcode-preparing');
          }}>
          Prepare Barcode
        </Button>
        <Button
          py={5}
          onPress={() => {
            navigation.navigate('inventory-count');
          }}>
          Count Inventory
        </Button>
        <Button
          variant="outline"
          onPress={() => {
            navigation.navigate('change-password');
          }}>
          Change Password
        </Button>
      </VStack>
    </Screen>
  );
};

export default Home;
