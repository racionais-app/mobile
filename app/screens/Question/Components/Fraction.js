import React, { useRef, useState, useEffect } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

import Markdown from './Markdown';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center'
  },
  textInput: {
    marginTop: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    textAlign: 'center',
    width: 44,
    height: 44,
    fontSize: 16
  },
  separator: {
    width: 64,
    height: 1,
    marginTop: 8,
    backgroundColor: 'black'
  }
});

const Fraction = ({ element, onChange }) => {
  const numerator = useRef();
  const denominator = useRef();
  const [data, setData] = useState({});

  const onSubmit = () => {
    denominator.current?.focus?.();
  }

  const onChangeText = (key, value) => {
    setData(oldData => ({ ...oldData, [key]: value }));
  }

  useEffect(() => {
    if (data.numerator && data.denominator) {
      onChange(element.id, `${data.numerator}/${data.denominator}`);
    }
  }, [
    data.numerator,
    data.denominator
  ]);

  return (
    <>
      <Markdown>{element.label}</Markdown>
      <View style={styles.container}>
        <TextInput
          ref={numerator}
          style={styles.textInput}
          onChangeText={text => onChangeText('numerator', text)}
          onEndEditing={onSubmit}
          onSubmitEditing={onSubmit}
          keyboardType='numeric'
        />
        <View style={styles.separator} />
        <TextInput
          ref={denominator}
          style={styles.textInput}
          onChangeText={text => onChangeText('denominator', text)}
          keyboardType='numeric'
        />
      </View>
    </>
  );
}

export default Fraction;
