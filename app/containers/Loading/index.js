import React from 'react';
import PropTypes from 'prop-types';
import { View, Modal, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  opacity: {
    backgroundColor: '#00000050'
  },
  animation: {
    width: 100,
    height: 100
  }
});

const Loading = ({ visible }) => (
  <Modal visible={visible} style={styles.container} transparent>
    <View style={[styles.container, styles.centered, styles.opacity]}>
      <LottieView source={require('./loading.json')} autoPlay loop style={styles.animation} />
    </View>
  </Modal>
);
Loading.propTypes = {
  visible: PropTypes.bool
};

export default Loading;
