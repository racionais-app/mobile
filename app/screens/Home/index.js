import React, {
  useState,
  useEffect
} from 'react';
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  Image
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

import Loading from '../../containers/Loading';
import { connect } from 'react-redux';
import Header from './Header';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    // backgroundColor: '#122b61',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16
  },
  text: {
    marginTop: 12,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1C375B'
  },
  image: {
    width: 100,
    height: 100
  }
});

const Module = ({ item }) => {
  const navigation = useNavigation();

  const onPress = () => {
    navigation.navigate('ModuleView', { moduleId: item.id, title: item.name });
  }

  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Image source={require('../../resources/module.png')} style={styles.image} />
      <Text style={styles.text}>{item.name}</Text>
    </TouchableOpacity>
  );
};

const Home = ({ navigation, user, logout }) => {
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

  const onLogout = async() => {
    try {
      await AsyncStorage.removeItem('authentication');
      await AsyncStorage.removeItem('onboarding');
    } catch {
      // Do nothing
    }
    logout();
  }

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: `Olá, ${user?.name}`,
      headerRight: () => (
        <TouchableOpacity onPress={onLogout}>
          <MaterialCommunityIcons name='logout' size={24} color='#fff' />
        </TouchableOpacity>
      ),
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
        horizontal={false}
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
const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch({ type: 'LOGOUT' })
});
export default connect(mapStateToProps, mapDispatchToProps)(Home);
