import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

const styles = StyleSheet.create({
  submit: {
    height: 64,
    backgroundColor: 'white',
    justifyContent: 'center',
    shadowOffset: {
      width: 0,
      height: -1,
    },
    shadowColor: 'gray',
    shadowOpacity: 0.5,
    elevation: 1
  },
  button: {
    backgroundColor: '#122b61',
    padding: 8,
    paddingHorizontal: 32,
    position: 'absolute',
    right: 16,
    borderRadius: 4
  },
  text: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white'
  }
});

const Footer = ({ text, onSubmit }) => (
  <View style={styles.submit}>
    <TouchableOpacity style={styles.button} onPress={onSubmit}>
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  </View>
);

export default Footer;
