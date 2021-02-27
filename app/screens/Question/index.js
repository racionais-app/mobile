import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import firestore from '@react-native-firebase/firestore';
import LottieView from 'lottie-react-native';
import Modal from 'react-native-modal';
import isEqual from 'lodash/isEqual';

import Separator from './Components/Separator';
import Element from './Components/Element';
import Footer from './Components/Footer';

import {
  Item,
  HeaderButtons
} from '../../containers/HeaderButton';
import StarBalance from '../../containers/StarBalance';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  content: {
    flex: 1,
    padding: 16
  },
  contentContainerStyle: {
    paddingBottom: 64
  }
});

const QuestionView = ({ navigation, route }) => {
  const index = route.params?.index ?? 0;
  const questions = route.params?.questions;
  const question = questions[index].items;

  const [data, setData] = useState({});
  const [visible, setVisible] = useState(false);

  const onChange = (itemId, value) => {
    setData({ ...data, [itemId]: value });
  }

  const onUserConfirm = (userId, value) => {
    const userReference = firestore().doc(`users/${userId}`);
  
    return firestore().runTransaction(async transaction => {
      const userSnapshot = await transaction.get(userReference);
  
      if (!userSnapshot.exists) {
        throw 'User does not exist!';
      }

      let newValue = userSnapshot.data().stars + value;
      if (newValue < 0) {
        newValue = 0;
      }
  
      await transaction.update(userReference, {
        stars: newValue
      });
    });
  }

  const onSubmit = async() => {
    const answers = question.filter(item => item.answer);
    const accepted = answers.filter(item => !isEqual(item.answer, data[item.id])).length === 0;
    console.log(answers);
    setVisible(true);

    try {
      await onUserConfirm('CMEHDWOQeCbiCozYSewT', accepted ? 1 : -1);
    } catch (e) {
      console.error(e);
    }
  }

  const animationCallback = () => {
    setVisible(false);
    if (index < questions.length - 1) {
      navigation.push('QuestionView', { questions, index: index + 1 });
    } else {
      navigation.navigate('HomeView');
    }
  }

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderButtons>
          <Item
            iconName='close'
            iconSize={24}
            color='white'
            onPress={() => navigation.navigate('HomeView')}
          />
        </HeaderButtons>
      ),
      headerRight: () => <StarBalance style={{ marginHorizontal: 16 }} />
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareFlatList
        data={question}
        renderItem={({ item }) => <Element element={item} onChange={onChange} />}
        ItemSeparatorComponent={() => <Separator />}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.contentContainerStyle}
        style={styles.content}
        enableAutomaticScroll={false}
      />
      <Footer
        text={index === questions.length - 1 ? 'Finalizar' : 'Continuar'}
        onSubmit={onSubmit}
      />
      <KeyboardSpacer />
      <Modal
        isVisible={visible}
        hideModalContentWhileAnimating
        animationInTiming={0}
        animationOutTiming={0}
      >
        <LottieView
          source={require('./../../core/check.json')}
          autoPlay
          loop={false}
          style={styles.animation}
          onAnimationFinish={animationCallback}
        />
      </Modal>
    </SafeAreaView>
  );
}

export default QuestionView;
