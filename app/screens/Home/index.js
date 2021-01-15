import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

const Home = () => {

  const onPress = async() => {
    try {
      await auth().signOut()
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;
