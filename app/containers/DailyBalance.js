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

const DailyBalance = ({ style }) => {
  const [daily, setDaily] = React.useState(0);

  React.useEffect(() => {
    const subscriber = firestore()
      .collection('users')
      .doc(DeviceInfo.getUniqueId())
      .onSnapshot(documentSnapshot => {
        const data = documentSnapshot.data();
        setDaily(data.daily ?? 0);
      });

    return () => subscriber();
  }, []);

  return (
    <View style={[styles.container, style]}>
      <MaterialCommunityIcons name='calendar-month' size={24} color='#FEA55B' />
      <Text style={styles.text}>{daily}</Text>
    </View>
  );
};

export default DailyBalance;
