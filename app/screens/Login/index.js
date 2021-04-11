import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import auth from '@react-native-firebase/auth';

import Loading from '../../containers/Loading';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textInput: {
    width: '100%',
    borderRadius: 4,
    borderColor: '#000',
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 8,
    padding: 8
  },
  button: {
    width: '100%',
    borderRadius: 4,
    borderColor: '#000',
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    padding: 8
  }
});

const ERROR = {
  EMAIL_ALREADY_IN_USE: 'auth/email-already-in-use'
};

const LoginView = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const onPress = async() => {
    setLoading(true);
    try {
      await auth().createUserWithEmailAndPassword(email, password);
    } catch (e) {
      if (e.code === ERROR.EMAIL_ALREADY_IN_USE) {
        try {
          await auth().signInWithEmailAndPassword(email, password);
          return;
        } catch (e) {
          console.error(e);
        }
      }
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder='E-mail'
        style={styles.textInput}
        keyboardType='email-address'
        autoCapitalize='none'
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        placeholder='Senha'
        style={styles.textInput}
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />
      <TouchableOpacity onPress={onPress} style={styles.button}>
        <Text>Login</Text>
      </TouchableOpacity>
      <Loading visible={loading} />
    </View>
  );
}

export default LoginView;
