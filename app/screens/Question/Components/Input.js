import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

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
  }
});

const Input = ({ element, onChange }) => (
  <>
    <Markdown>{element.label}</Markdown>
    <TextInput
      style={styles.textInput}
      onChangeText={text => onChange(element.id, text)}
      defaultValue={element.defaultValue ?? ''}
      placeholder={element.placeholder ?? ''}
      placeholderTextColor='gray'
    />
  </>
);

export default Input;
