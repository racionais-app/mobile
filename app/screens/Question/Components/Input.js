import React, { useRef, useState } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import Popover, { PopoverPlacement } from 'react-native-popover-view';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Markdown from './Markdown';

const styles = StyleSheet.create({
  textInput: {
    marginTop: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    height: 44,
    fontSize: 16
  },
  arrow: {
    backgroundColor: '#e6e6e6'
  },
  popover: {
    padding: 16,
    backgroundColor: '#e6e6e6',
    shadowOffset: {
      width: 0,
      height: -1,
    },
    shadowColor: 'gray',
    shadowOpacity: 0.5,
    elevation: 1
  },
  background: {
    backgroundColor: 'transparent'
  }
});

const Input = ({ element, onChange, items, index, onContinue }) => {
  const input = useRef();
  const [showPopover, setShowPopover] = useState(false);

  React.useEffect(() => {
    if (index === items.map(i => i.type).indexOf('input')) {
      (async() => {
        const onboardingStepString = await AsyncStorage.getItem('onboardingStep');
        if (onboardingStepString === '3') {
          setTimeout(() => setShowPopover(true), 500);
        }
      })();
    }
  }, []);

  const onClose = async() => {
    setShowPopover(false);
    await AsyncStorage.setItem('onboardingStep', '4');
    setTimeout(() => input.current.focus(), 500);
  }

  const onEndEditing = () => {
    if (index === items.map(i => i.type).indexOf('input')) {
      onContinue();
    }
  }

  let content = (
    <>
      <Markdown>{element.label}</Markdown>
      <TextInput
        ref={input}
        style={styles.textInput}
        onChangeText={text => onChange(element.id, text)}
        defaultValue={element.defaultValue ?? ''}
        placeholder={element.placeholder ?? ''}
        placeholderTextColor='gray'
        onEndEditing={onEndEditing}
      />
    </>
  );

  if (index === items.map(i => i.type).indexOf('input')) {
    content = (
      <>
        {content}
        <Popover
          from={input}
          placement={PopoverPlacement.BOTTOM}
          isVisible={showPopover}
          onRequestClose={onClose}
          backgroundStyle={styles.background}
          arrowStyle={styles.arrow}
        >
          <View style={styles.popover}>
            <Text>Digite sua resposta neste campo.</Text>
          </View>
        </Popover>
      </>
    );
  }

  return content;
}

export default Input;
