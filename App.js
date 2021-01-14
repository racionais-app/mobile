import React, { useState } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  TextInput,
} from 'react-native';
import auth from '@react-native-firebase/auth';

const App = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const register = async () => {
    try {
      const response = await auth().createUserWithEmailAndPassword(email, password);
      if (response) {
        console.log(response)
      }
    } catch (e) {
      console.error(e.message);
    }
  }

  return (
    <View style={{ margin: 36 }}>
      <TextInput placeholder='email' value={email} onChangeText={setEmail} style={{ backgroundColor: 'gray' }} />
      <TextInput placeholder='senha' value={password} onChangeText={setPassword} style={{ backgroundColor: 'gray' }} />
      <TouchableOpacity onPress={register}>
        <Text>Registrar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
});

export default App;
