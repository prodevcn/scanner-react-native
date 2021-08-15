import React from 'react';
import {
  Actionsheet,
  CheckIcon,
  ChevronDownIcon,
  Input,
  Pressable,
  View,
  useDisclose,
} from 'native-base';

const Dropdown = props => {
  const {isOpen, onOpen, onClose} = useDisclose();

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
