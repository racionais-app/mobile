import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import Popover from 'react-native-popover-view';

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
  },
  disabled: {
    backgroundColor: '#E6E6E6'
  }
});

const Footer = ({ text, onSubmit, showPopover, disabled }) => {
  const touchable = useRef();

  return (
    <>
      <View style={styles.submit}>
        <TouchableOpacity
          ref={touchable}
          style={[styles.button, disabled && styles.disabled]}
          onPress={onSubmit}
          disabled={disabled}
        >
          <Text style={styles.text}>{text}</Text>
        </TouchableOpacity>
      </View>
      <Popover
        from={touchable}
        isVisible={showPopover}
        onRequestClose={onSubmit}
        backgroundStyle={styles.background}
        arrowStyle={styles.arrow}
      >
        <View style={styles.popover}>
          <Text>Clique aqui para prosseguir.</Text>
        </View>
      </Popover>
    </>
  );
}

export default Footer;
