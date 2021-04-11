import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import firestore from '@react-native-firebase/firestore';
import LottieView from 'lottie-react-native';
import Modal from 'react-native-modal';
import DeviceInfo from 'react-native-device-info';
import isEqual from 'lodash/isEqual';

import Separator from './Components/Separator';
import Element from './Components/Element';
import Footer from './Components/Footer';

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

const datesAreOnSameDay = (first, second) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

const QuestionView = ({ navigation, route }) => {
  const index = route.params?.index ?? 0;
  const surveyId = route.params?.surveyId;
  const title = route.params?.title ?? '';
  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState([]);

  const [data, setData] = useState({});
  const [visible, setVisible] = useState(false);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title
    });
  }, [navigation]);

  React.useEffect(() => {
    (async() => {
      const items = await firestore()
          .collection('modules')
          .doc(surveyId)
          .collection('questions')
          .get();
      setQuestions(items.docs.map(doc => doc.data()));
    })();
  }, []);

  React.useEffect(() => {
    if (questions?.length) {
      setQuestion(questions[index].items);
    }
  }, [questions]);

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

      let newValue = (userSnapshot.data().stars ?? 0) + value;
      if (newValue < 0) {
        newValue = 0;
      }

      let streak = userSnapshot.data().streak;
      let lastAnswer = userSnapshot.data().lastAnswer;
      if (lastAnswer?.seconds) {
        let lastdate = new Date(lastAnswer.seconds * 1000);
        let yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
        if (datesAreOnSameDay(lastdate, yesterday)) {
          streak += 1;
        } else {
          streak = 1;
        }
      } else {
        streak = 1;
      }
  
      await transaction.update(userReference, {
        stars: newValue,
        streak: streak,
        lastAnswer: new Date()
      });
    });
  }

  const onSubmit = async() => {
    const answers = question.filter(item => item.answer);
    const accepted = answers.filter(item => !isEqual(item.answer, data[item.id])).length === 0;
    setVisible(true);

    try {
      await onUserConfirm(DeviceInfo.getUniqueId(), accepted ? 1 : -1);
    } catch (e) {
      console.error(e);
    }
  }

  const animationCallback = () => {
    setVisible(false);
    if (index < questions.length - 1) {
      navigation.push('QuestionView', { surveyId: surveyId, questions, index: index + 1, title: title });
    } else {
      navigation.navigate('ModuleView');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareFlatList
        data={question}
        renderItem={({ item }) => <Element element={item} onChange={onChange} />}
        ItemSeparatorComponent={() => <Separator />}
        keyExtractor={item => item.id?.toString?.()}
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
