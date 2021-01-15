import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import auth from '@react-native-firebase/auth';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textInput: {

  }
})

const LoginView = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const onPress = async() => {
    try {
      await auth().createUserWithEmailAndPassword(email, password);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder='E-mail'
        style={styles.textInput}
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        placeholder='Senha'
        style={styles.textInput}
        onChangeText={setPassword}
        value={password}
      />
      <TouchableOpacity onPress={onPress}>
        <Text>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

export default LoginView;
