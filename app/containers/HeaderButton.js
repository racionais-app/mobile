import React from 'react';
import {
  Item,
  HeaderButton,
  HeaderButtons as RNHeaderButtons
} from 'react-navigation-header-buttons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const MaterialHeaderButton = (props) => (
  <HeaderButton IconComponent={MaterialIcons} iconSize={24} color='white' {...props} />
);

const HeaderButtons = ({ children }) => (
  <RNHeaderButtons HeaderButtonComponent={MaterialHeaderButton}>
    {children}
  </RNHeaderButtons>
);

export {
  HeaderButtons,
  Item
};