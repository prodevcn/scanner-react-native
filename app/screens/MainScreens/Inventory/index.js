import React from 'react';
import {Button, VStack, Heading, HStack} from 'native-base';
import {useNavigation} from '@react-navigation/core';

import Screen from '../../../layouts/Screen';
import InventoryIcon from '../../../../assets/images/svg/inventory.svg';

const Inventory = props => {
  const navigation = useNavigation();
  return (
    <Screen hasHeader hasBackButton title="INVENTORY COUNT">
      <VStack space={4} w="100%" flex={1} mt={10}>
        <HStack w="100%" justifyContent="center">
          <InventoryIcon width={60} height={60} color="#06b6d4" />
        </HStack>
        <Heading size={'xs'} alignSelf="center" color="primary.600">
          INVENTORY MANAGEMENT
        </Heading>
        <Button
          py={5}
          onPress={() => {
            navigation.navigate('general-inventory');
          }}>
          General Inventory
        </Button>
        <Button
          py={5}
          onPress={() => {
            navigation.navigate('specific-inventory');
          }}>
          Specific Inventory
        </Button>
      </VStack>
    </Screen>
  );
};

export default Inventory;
