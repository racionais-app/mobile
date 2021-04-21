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
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const moduleId = route.params?.moduleId;
  const itemId = route.params?.itemId;
  const title = route.params?.title ?? '';
  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState([]);

  const [data, setData] = useState({});
  const [visible, setVisible] = useState(false);

  const [showPopover, setShowPopover] = useState(false);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title
    });
  }, [navigation]);

  React.useEffect(() => {
    (async() => {
      const items = await firestore()
          .collection('modules')
          .doc(moduleId)
          .collection('items')
          .doc(itemId)
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
    setShowPopover(false);
    const answers = question.filter(item => item.answer);
    const accepted = answers.filter(item => !isEqual(item.answer, data[item.id])).length === 0;

    if (!question.filter(item => item.answer).find(item => data[item.id])) {
      return;
    }
    
    const onboardingStep = await AsyncStorage.getItem('onboardingStep');
    if (onboardingStep === '4') {
      setTimeout(() => setVisible(true), 500);
    } else {
      setVisible(true);
    }
    const onboardingStepString = await AsyncStorage.getItem('onboardingStep');
    if (onboardingStepString === '4') {
      await AsyncStorage.setItem('onboardingStep', '5');
    }

    try {
      await onUserConfirm(DeviceInfo.getUniqueId(), accepted ? 1 : -1);
    } catch (e) {
      console.error(e);
    }
  }

  const onContinue = async() => {
    const onboardingStep = await AsyncStorage.getItem('onboardingStep');
    if (onboardingStep === '4') {
      setShowPopover(true);
    }
  }

  const animationCallback = async() => {
    setVisible(false);
    if (index < questions.length - 1) {
      navigation.push('QuestionView', {
        moduleId: moduleId,
        itemId: itemId,
        questions,
        index: index + 1,
        title: title
      });
    } else {
      navigation.navigate('ModuleView');
      try {
        const userRef = firestore()
          .collection('users')
          .doc(DeviceInfo.getUniqueId());

        await userRef.update({
          done: firestore.FieldValue.arrayUnion(itemId)
        });
      } catch (e) {
        console.error(e);
      }
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareFlatList
        data={question}
        renderItem={({ item, index }) => (
          <Element
            items={question}
            element={item}
            onChange={onChange}
            onContinue={onContinue}
            index={index}
          />
        )}
        ItemSeparatorComponent={() => <Separator />}
        keyExtractor={item => item.id?.toString?.()}
        contentContainerStyle={styles.contentContainerStyle}
        style={styles.content}
        enableAutomaticScroll={false}
      />
      <Footer
        showPopover={showPopover}
        text={index === questions.length - 1 ? 'Finalizar' : 'Continuar'}
        onSubmit={onSubmit}
        disabled={!question.filter(item => item.answer).find(item => data[item.id])}
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
