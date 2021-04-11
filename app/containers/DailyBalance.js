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

const datesAreOnSameDay = (first, second) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

const DailyBalance = ({ style }) => {
  const [streak, setStreak] = React.useState(0);

  React.useEffect(() => {
    (async() => {
      const user = await firestore()
        .collection('users')
        .doc(DeviceInfo.getUniqueId())
        .get();
      
      const data = user.data();

      let lastAnswer = data.lastAnswer;
      if (lastAnswer?.seconds) {
        let lastdate = new Date(lastAnswer.seconds * 1000);
        let yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
        if (!datesAreOnSameDay(lastdate, yesterday) && !datesAreOnSameDay(lastdate, new Date())) {
          await firestore()
            .collection('users')
            .doc(DeviceInfo.getUniqueId())
            .set({
              streak: 0
            }, {
              merge: true
            });
        }
      }
    })();
      
    const subscriber = firestore()
      .collection('users')
      .doc(DeviceInfo.getUniqueId())
      .onSnapshot(documentSnapshot => {
        const data = documentSnapshot.data();
        setStreak(data.streak ?? 0);
      });

    return () => subscriber();
  }, []);

  return (
    <View style={[styles.container, style]}>
      <MaterialCommunityIcons name='calendar-month' size={24} color='#FEA55B' />
      <Text style={styles.text}>{streak}</Text>
    </View>
  );
};

export default DailyBalance;
