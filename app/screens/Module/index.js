import React, { useState, useCallback } from 'react';
import YoutubePlayer from 'react-native-youtube-iframe';
import { View, StyleSheet, Text } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

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
  }
});

const Item = ({ items, index, item, onPress }) => (
  <TouchableOpacity onPress={() => onPress(item)} disabled={index === 0 ? false : !items[index - 1]?.completed}>
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

const ModuleView = ({ route, navigation }) => {
  const playerRef = React.useRef();
  const [playing, setPlaying] = useState(false);
  const [items, setItems] = useState([]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: route.params?.title ?? ''
    });
  }, [navigation]);

  const onStateChange = (state) => {
    if (state === 'ended') {
      setPlaying(false);
      const videoIdx = items.findIndex(item => item.type === 'video');
      const newItems = items;
      newItems[videoIdx].completed = true;
      setItems(newItems);
    }
  };

  React.useEffect(() => {
    (async() => {
      setItems([
        { id: 1, type: 'video', videoId: 'iee2TATGMyI', completed: false, name: 'Introdução a Frações' },
        { id: 2, type: 'survey', surveyId: 'FsIN1B3G0f7GYqJCshZ1', completed: false, name: 'Dividir formas em partes iguais' }
      ])
    })();
  }, []);

  const onPress = (item) => {
    if (item.type === 'video') {
      setPlaying(true);
    } else {
      console.log({ surveyId: item.surveyId });
      navigation.navigate('QuestionStack', {
        name: 'QuestionView',
        params: {
          surveyId: item.surveyId
        }
      })
    }
  }

  return (
    <View style={styles.container}>
      <YoutubePlayer
        ref={playerRef}
        height={211}
        play={playing}
        videoId={items.find(item => item.type === 'video')?.videoId}
        onChangeState={onStateChange}
      />
      <FlatList
        data={items}
        renderItem={({ item, index }) => <Item items={items} index={index} item={item} onPress={onPress} />}
        keyExtractor={item => item.id?.toString?.()}
      />
    </View>
  );
};

export default ModuleView;