import React from 'react';
import { View, StyleSheet } from 'react-native';

import StarBalance from '../../containers/StarBalance';
import DailyBalance from '../../containers/DailyBalance';
import HeartBalance from '../../containers/HeartBalance';

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: 48,
    borderBottomWidth: 2,
    borderColor: '#E6E6E9',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: '#fff'
  }
});

const Header = () => {
  return (
    <View style={styles.header}>
      <StarBalance />
      <DailyBalance />
      <HeartBalance />
    </View>
  );
};

export default Header;
