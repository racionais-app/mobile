import React, { useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Button
} from 'react-native';
import YoutubePlayer from "react-native-youtube-iframe";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white'
    },
    content: {
      flex: 1,
      padding: 16,
      backgroundColor: 'white'
    },
    input: {
      borderWidth: 1,
      borderRadius: 4,
      borderColor: 'gray',
      marginBottom: 16,
      padding: 8,
      height: 36
    },
    submit: {
      width: '100%',
      height: 64,
      backgroundColor: 'white',
      justifyContent: 'center',
      shadowOffset: {
        width: 0,
        height: -1,
      },
      shadowColor: 'gray',
      shadowOpacity: 0.5,
      elevation: 1
    },
    button: {
      backgroundColor: '#122b61',
      padding: 8,
      paddingHorizontal: 32,
      position: 'absolute',
      right: 16,
      borderRadius: 4
    },
    check: {
      fontWeight: 'bold',
      fontSize: 16,
      color: 'white'
    },
    popover: {
      padding: 16
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold'
    },
    subtitle: {
      fontSize: 16,
      fontWeight: 'normal'
    }
});

const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false
};

const ExplanationView = ({ route, navigation }) => {
  const [playing, setPlaying] = useState(false);
  const onStateChange = useCallback((state) => {
    if (state === "ended") {
      setPlaying(false);
      console.log("video has finished playing!");
    }
  }, []);

  const togglePlaying = useCallback(() => {
    console.log("au")
    setPlaying((prev) => !prev);
  }, []);

    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.container}>
          <View>
            <YoutubePlayer
              height={300}
              play={playing}
              videoId={"iee2TATGMyI"}
              onChangeState={onStateChange}
            />
            <Button title={playing ? "pause" : "play"} onPress={togglePlaying} />
          </View>
        </ScrollView>
      </View>
    );
};

export default ExplanationView;