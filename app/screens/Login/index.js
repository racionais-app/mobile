import React from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import { connect } from 'react-redux';

import Loading from '../../containers/Loading';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    backgroundColor: '#1C375B',
    justifyContent: 'center'
  },
  image: {
    width: 156,
    height: 156,
    alignSelf: 'center',
    marginBottom: 24
  },
  title: {
    fontSize: 36,
    color: 'white'
  },
  titleBox: {
    marginBottom: 24
  },
  bold: {
    fontWeight: 'bold'
  },
  textInput: {
    width: '100%',
    borderRadius: 4,
    borderColor: '#000',
    backgroundColor: 'white',
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 16,
    fontSize: 16,
    padding: 8
  },
  button: {
    width: '100%',
    borderRadius: 4,
    borderColor: '#000',
    backgroundColor: 'white',
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    padding: 8
  },
  buttonText: {
    fontWeight: '600'
  }
});

const LoginView = ({ onboarding }) => {
  const [name, setName] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const onPress = async() => {
    setLoading(true);
    try {
      const id = DeviceInfo.getUniqueId();
      await AsyncStorage.setItem('authentication', name);
      await firestore().collection('users').doc(id).set({ name });
    } catch (e) {
      // Do nothing
    }
    setLoading(false);
    onboarding();
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('../../resources/onboarding.png')}
        style={styles.image}
      />
      <Text style={styles.titleBox}>
        <Text style={styles.title}>Aprenda</Text>
        <Text style={[styles.title, styles.bold]}>{'\nMatemática\n'}</Text>
        <Text style={styles.title}>e se divirta</Text>
      </Text>
      <TextInput
        placeholder='Digite seu nome'
        style={styles.textInput}
        autoCapitalize='words'
        onChangeText={setName}
        value={name}
      />
      <TouchableOpacity onPress={onPress} style={styles.button}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
      <Loading visible={loading} />
    </View>
  );
}

const mapDispatchToProps = (dispatch) => ({
	onboarding: () => dispatch({ type: 'ONBOARDING' })
});

export default connect(null, mapDispatchToProps)(LoginView);
