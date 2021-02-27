import React, {
  useState,
  useEffect
} from 'react';
import {
  Text,
  FlatList,
  StyleSheet
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

import Loading from '../../containers/Loading';
import StarBalance from '../../containers/StarBalance';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    width: '100%',
    backgroundColor: '#122b61',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white'
  }
});

const Module = ({ item }) => {
  const navigation = useNavigation();

  const onPress = () => {
    if (item.questions.length > 0) {
      navigation.navigate('QuestionStack', {
        screen: 'QuestionView',
        params: {
          questions: item.questions
        }
      });
    }
  }

  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.text}>{item.name}</Text>
    </TouchableOpacity>
  );
};

const Home = ({ navigation }) => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    (async() => {
      try {
        const remoteModules = await firestore()
          .collection('modules')
          .get();

        const data = remoteModules
          .docs
          .map(doc => doc.data());

        setTimeout(() => {
          setLoading(false);
          setModules(data);
        }, 1000);
      } catch (e) {
        setLoading(false);
        console.error(e);
      }
    })();
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <StarBalance />
    });
  }, [navigation]);

  return (
    <>
      <FlatList
        data={modules}
        renderItem={({ item }) => <Module item={item} />}
        keyExtractor={item => item.name}
        contentContainerStyle={styles.container}
      />
      <Loading
        visible={loading}
      />
    </>
  );
};

export default Home;
