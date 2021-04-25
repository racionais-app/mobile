import React, { useRef, useState } from 'react';
import YouTube from 'react-native-youtube';
import { View, StyleSheet, Text } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import Popover from 'react-native-popover-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import analytics from '@react-native-firebase/analytics';
import DeviceInfo from 'react-native-device-info';
import ModuleModel from '../../core/Module';
import YoutubeKey from '../../core/youtube.json';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  item: {
    height: 96,
    padding: 16,
    alignItems: 'center',
    borderColor: '#E6E6E9',
    borderBottomWidth: 2,
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    // flex: 1,
    width: '50%'
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
  video: {
    alignSelf: 'stretch',
    height: 300
  }
});

const compare = (a, b) => {
  if (a.order < b.order){
    return -1;
  }
  if (a.order > b.order){
    return 1;
  }
  return 0;
}

const Item = ({ items, index, item, onPress, step }) => {
  const touchable = useRef();
  const [showPopover, setShowPopover] = useState(false);

  React.useEffect(() => {
    (async() => {
      const onboardingStepString = await AsyncStorage.getItem('onboardingStep');
      if (onboardingStepString === '1' && item.type === 'video') {
        setTimeout(() => setShowPopover(true), 500);
      }
      if (onboardingStepString === '2' && item.type === 'survey') {
        setTimeout(() => setShowPopover(true), 500);
      }
    })();
  }, [step]);

  const onTouch = async(item) => {
    setShowPopover(false);
    if (item.type !== 'video') {
      const onboardingStepString = await AsyncStorage.getItem('onboardingStep');
      if (onboardingStepString === '2') {
        await AsyncStorage.setItem('onboardingStep', '3');
      }
    }
    onPress(item);
  }

  let content = (
    <TouchableOpacity
      ref={touchable}
      onPress={() => onTouch(item)}
      disabled={index === 0 ? false : !items[index - 1]?.completed}
    >
      <View style={[styles.item, { backgroundColor: '#F5F5F5' }]}>
        <MaterialCommunityIcons
          name={item.type === 'video' ? 'youtube' : 'pencil-outline'}
          size={48}
          color={item.completed ? '#1C375B' : 'black'}
        />
        <Text style={[styles.name, { color: item.completed ? '#1C375B' : 'black' }]}>{item.name}</Text>
        <MaterialCommunityIcons
          name={`check-circle${ !item.completed ? '-outline' : ''}`}
          size={24}
          color={item.completed ? '#2DE0A5' : 'black'}
        />
      </View>
    </TouchableOpacity>
  );

  let text;
  if (item.type === 'video') {
    text = 'Você deverá assistir um vídeo explicativo antes de iniciar os exercícios de cada módulo. Clique aqui para iniciar.';
  } else {
    text = 'Agora você poderá resolver exercícios relacionados a esse módulo. Clique aqui para iniciar.';
  }

  if (index === 0 || index === items.map(i => i.type).indexOf('survey')) {
    content = (
      <>
        {content}
        <Popover
          from={touchable}
          isVisible={showPopover}
          onRequestClose={() => onTouch(item)}
          backgroundStyle={styles.background}
          arrowStyle={styles.arrow}
        >
          <View style={styles.popover}>
            <Text>{text}</Text>
          </View>
        </Popover>
      </>
    );
  }

  return content;
}

const ModuleView = ({ route, navigation }) => {
  const playerRef = React.useRef();
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(0);
  const [items, setItems] = useState([]);
  const moduleId = route.params?.moduleId;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: route.params?.title ?? ''
    });
  }, [navigation]);

  const onGiveLifes = async() => {
    const userRef = firestore()
      .collection('users')
      .doc(DeviceInfo.getUniqueId());

    const videoIdx = items.findIndex(item => item.type === 'video');
    await userRef.update({
      done: firestore.FieldValue.arrayRemove(items[videoIdx].id),
      lifes: 3
    });

    setTimeout(() => setPlaying(true), 700);
  }

  const onStateChange = async({ state }) => {
    if (state === 'ended') {
      setPlaying(false);
      const onboardingStepString = await AsyncStorage.getItem('onboardingStep');
      if (onboardingStepString === '1') {
        await AsyncStorage.setItem('onboardingStep', '2');
      }
      const videoIdx = items.findIndex(item => item.type === 'video');
      const newItems = items;
      newItems[videoIdx].completed = true;
      setItems(newItems);
      setStep(old => (old + 1));
      try {
        const userRef = firestore()
          .collection('users')
          .doc(DeviceInfo.getUniqueId());

        await userRef.update({
          done: firestore.FieldValue.arrayUnion(items[videoIdx].id)
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  React.useEffect(() => {
    let model = new ModuleModel(moduleId, (data) => {
      setItems(data);
    });

    return model.unsubscribe;
  }, []);

  const onPress = async(item) => {
    try {
      await analytics().logEvent('item_view', { itemId: item.id });
    } catch (e) {
      // Do nothing
    }
    if (item.type === 'video') {
      setPlaying(true);
    } else {
      navigation.navigate('QuestionView', {
        itemId: item.id,
        moduleId,
        title: item.name,
        onGiveLifes
      });
    }
  }

  return (
    <View style={styles.container}>
      <YouTube
        apiKey={YoutubeKey.apiKey}
        videoId={items.find(item => item.type === 'video')?.videoId}
        play={playing}
        fullscreen={playing}
        onChangeState={onStateChange}
        onError={e => console.error(e.error)}
        style={styles.video}
      />
      <FlatList
        data={items}
        renderItem={({ item, index }) => <Item step={step} items={items} index={index} item={item} onPress={onPress} />}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

export default ModuleView;
