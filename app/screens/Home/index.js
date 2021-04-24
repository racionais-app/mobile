import React, {
  useRef,
  useState,
  useEffect
} from 'react';
import {
  Text,
  View,
  Platform,
  FlatList,
  StyleSheet,
  Image
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import ProgressCircle from 'react-native-progress-circle'
import Popover from 'react-native-popover-view';
import analytics from '@react-native-firebase/analytics';

import Loading from '../../containers/Loading';
import { connect } from 'react-redux';
import Header from './Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModuleModel from '../../core/Module';

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
  },
  arrow: {
    backgroundColor: '#e6e6e6'
  },
  popover: {
    padding: 16,
    backgroundColor: '#e6e6e6',
    shadowOffset: {
      width: 0,
      height: -1,
    },
    shadowColor: 'gray',
    shadowOpacity: 0.5,
    elevation: 1
  },
  background: {
    backgroundColor: 'transparent'
  },
  percent: {
    position: 'absolute',
    borderRadius: 24,
    backgroundColor: 'white',
    padding: 4,
    right: -24,
    bottom: 40,
    borderWidth: 2,
    borderColor: '#6F8197'
  },
  percentage: {
    fontWeight: 'bold'
  },
  headerRight: {
    marginHorizontal: Platform.OS === 'android' ? 16 : 0
  }
});

const Module = ({ item, index }) => {
  const touchable = useRef();
  const navigation = useNavigation();
  const [showPopover, setShowPopover] = useState(false);
  const [percentage, setPercentage] = useState(0);

  React.useEffect(() => {
    (async () => {
      const onboardingStepString = await AsyncStorage.getItem('onboardingStep');
      if (!onboardingStepString) {
        setShowPopover(true);
      }
    })();

    let model = new ModuleModel(item.id, (data) => {
      const percent = data.filter(i => i.completed).length / data.length;
      setPercentage(percent * 100);
    });

    return model.unsubscribe;
  }, []);

  const onPress = async () => {
    setShowPopover(false);
    const onboardingStepString = await AsyncStorage.getItem('onboardingStep');
    if (!onboardingStepString) {
      await AsyncStorage.setItem('onboardingStep', '1');
    }
    try {
      await analytics().logEvent('module_view', { moduleId: item.id });
    } catch (e) {
      // Do nothing
    }
    navigation.navigate('ModuleView', { moduleId: item.id, title: item.name });
  }

  let content = (
    <View style={{ alignItems: 'center' }}>
      <View style={{ width: 128 }}>
        <TouchableOpacity ref={touchable} onPress={onPress} style={styles.button}>
          <ProgressCircle
            percent={percentage}
            radius={64}
            borderWidth={8}
            color='#1C375B'
            shadowColor='#6F8197'
            bgColor='#FFF'
          >
            <Image source={require('../../resources/module.png')} style={styles.image} />
          </ProgressCircle>
          <Text style={styles.text}>{item.name}</Text>
        </TouchableOpacity>
        <View style={styles.percent}>
          <Text style={styles.percentage}>{`${percentage}%`}</Text>
        </View>
      </View>
    </View>
  );

  if (index === 0) {
    content = (
      <>
        {content}
        <Popover
          from={touchable}
          isVisible={showPopover}
          onRequestClose={onPress}
          backgroundStyle={styles.background}
          arrowStyle={styles.arrow}
        >
          <View style={styles.popover}>
            <Text>Para começar, clique em um módulo</Text>
          </View>
        </Popover>
      </>
    );
  }

  return content;
};

const Home = ({ navigation, user, logout }) => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    (async () => {
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

  const onLogout = async () => {
    try {
      await analytics().logEvent('logout');
      await AsyncStorage.removeItem('authentication');
      await AsyncStorage.removeItem('onboardingStep');
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
        <TouchableOpacity onPress={onLogout} style={styles.headerRight}>
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
        renderItem={({ item, index }) => <Module index={index} item={item} />}
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
