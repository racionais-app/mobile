import React, {
  useState,
  useEffect
} from 'react';
import {
  Text,
  View,
  FlatList,
  StyleSheet
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

import Loading from '../../containers/Loading';
import { connect } from 'react-redux';
import Header from './Header';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F0F0F5'
  },
  container: {
    flex: 1,
    marginTop: 16,
    padding: 16,
    borderTopWidth: 2,
    borderColor: '#E6E6E9',
    backgroundColor: '#FFF'
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
    navigation.navigate('QuestionStack', {
      screen: 'QuestionView',
      params: {
        moduleId: item.id
      }
    });
  }

  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.text}>{item.name}</Text>
    </TouchableOpacity>
  );
};

const Home = ({ navigation, user }) => {
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
          .map(doc => ({ id: doc.id, ...doc.data() }));

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
      title: `Olá, ${user?.name}`
    });
  }, [navigation, user]);

  return (
    <View style={styles.screen}>
      <Header />
      <FlatList
        data={modules}
        renderItem={({ item }) => <Module item={item} />}
        keyExtractor={item => item.name}
        contentContainerStyle={styles.container}
      />
      <Loading
        visible={loading}
      />
    </View>
  );
};

const mapStateToProps = (state) => ({
  user: state.user
});
export default connect(mapStateToProps)(Home);
