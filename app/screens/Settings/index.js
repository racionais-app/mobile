import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { connect } from 'react-redux';

const SettingsView = ({ logout }) => {
  const onLogout = async() => {
    try {
      await AsyncStorage.removeItem('authentication');
    } catch {
      // Do nothing
    }
    logout();
  }
  return (
    <TouchableOpacity onPress={onLogout}>
      <Text>Sair</Text>
    </TouchableOpacity>
  )
}

const mapDispatchToProps = (dispatch) => ({
	logout: () => dispatch({ type: 'LOGOUT' })
});

export default connect(null, mapDispatchToProps)(SettingsView);