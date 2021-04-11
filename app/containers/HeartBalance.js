import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import DeviceInfo from 'react-native-device-info';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  text: {
    fontSize: 14,
    color: 'black',
    fontWeight: 'bold',
    marginLeft: 2
  }
});

const HeartBalance = ({ style }) => {
  const [lifes, setLifes] = React.useState(0);

  React.useEffect(() => {
    const subscriber = firestore()
      .collection('users')
      .doc(DeviceInfo.getUniqueId())
      .onSnapshot(documentSnapshot => {
        const data = documentSnapshot.data();
        setLifes(data.lifes ?? 0);
      });

    return () => subscriber();
  }, []);

  return (
    <View style={[styles.container, style]}>
      <MaterialCommunityIcons name='heart' size={24} color='#E31B23' />
      <Text style={styles.text}>{lifes}</Text>
    </View>
  );
};

export default HeartBalance;
