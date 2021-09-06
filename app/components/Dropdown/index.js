import React from 'react';
import {
  Actionsheet,
  CheckIcon,
  ChevronDownIcon,
  Input,
  Pressable,
  View,
  useDisclose,
  Badge,
} from 'native-base';

const Dropdown = props => {
  const {isOpen, onOpen, onClose} = useDisclose();
  const getAllEntries = shelfCode => {
    if (shelfCode && props.originData.length > 0) {
      const entries = props.originData.filter(
        e => e.shelf?.code === shelfCode,
      )[0];
      return entries;
    } else {
      return {};
    }
  };

  return (
    <View w="100%">
      <Pressable onPress={onOpen}>
        <Input
          w="100%"
          isReadOnly={true}
          value={props.selectedValue}
          placeholder={props.placeholder}
          InputRightElement={
            <ChevronDownIcon size={6} mr={3} color="gray.500" />
          }
        />
      </Pressable>
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <Actionsheet.Item
            onPress={() => {
              props.onValueChange('');
              onClose();
            }}>
            {props.defaultValue}
          </Actionsheet.Item>
          {props.data.map((item, index) => (
            <Actionsheet.Item
              key={`item_${index}`}
              endIcon={
                props.selectedValue === item && (
                  <CheckIcon size={6} mr={3} color="gray.500" />
                )
              }
              startIcon={
                props.icon &&
                props.originData &&
                (getAllEntries(item).counted
                  ? [
                      <Badge
                        colorScheme="success"
                        variant="outline"
                        key={`BADGE_${index}`}>
                        counted
                      </Badge>,
                      <Badge
                        colorScheme="primary"
                        variant="solid"
                        borderRadius={200}
                        key={`COUNT_BADGE_${index}`}>
                        {getAllEntries(item).round?.toString()}
                      </Badge>,
                    ]
                  : [
                      <Badge
                        colorScheme="danger"
                        variant="outline"
                        key={`BADGE_${index}`}>
                        uncounted
                      </Badge>,
                      <Badge
                        colorScheme="primary"
                        variant="solid"
                        borderRadius={200}
                        key={`COUNT_BADGE_${index}`}>
                        {getAllEntries(item).round?.toString()}
                      </Badge>,
                    ])
              }
              onPress={() => {
                props.onValueChange(item);
                onClose();
              }}>
              {item}
            </Actionsheet.Item>
          ))}
        </Actionsheet.Content>
      </Actionsheet>
    </View>
  );
};

export default Dropdown;
