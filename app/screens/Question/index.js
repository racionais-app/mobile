import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Image,
  View,
  Text
} from 'react-native';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import firestore from '@react-native-firebase/firestore';
import LottieView from 'lottie-react-native';
import Modal from 'react-native-modal';
import DeviceInfo from 'react-native-device-info';
import analytics from '@react-native-firebase/analytics';
import isEqual from 'lodash/isEqual';

import Separator from './Components/Separator';
import Element from './Components/Element';
import Footer from './Components/Footer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native-gesture-handler';

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

const IMAGES = {
  'check': require('./../../core/check.json'),
  'wrong': require('./../../core/wrong.json')
};

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
  const [visible, setVisible] = useState({});
  const [lifesVisible, setLifesVisible] = useState(false);

  const [showPopover, setShowPopover] = useState(false);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title
    });
  }, [navigation]);

  React.useEffect(() => {
    (async () => {
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

      let newValue = userSnapshot.data().stars ?? 0;
      if (value > 0) {
        newValue += value;
      }

      let lifes = userSnapshot.data().lifes ?? 0;
      if (value < 0) {
        lifes -= 1;
        if (lifes < 0) {
          lifes = 0;
        }
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
        lifes: lifes,
        lastAnswer: new Date()
      });
    });
  }

  const onSubmit = async () => {
    setShowPopover(false);
    try {
      await analytics().logEvent('answer');
    } catch (e) {
      // Do nothing
    }
    const answers = question.filter(item => item.answer);
    const accepted = answers.filter(item => !isEqual(item.answer, data[item.id])).length === 0;

    if (answers.length > 0 && !question.filter(item => item.answer).find(item => data[item.id])) {
      return;
    }

    const userRef = firestore()
      .collection('users')
      .doc(DeviceInfo.getUniqueId());

    const userData = await userRef.get();
    const user = userData.data();
    const lifes = user.lifes ?? 0;
    const operation = accepted ? 1 : -1;

    if (lifes + operation <= 0) {
      setLifesVisible(true);
    } else {
      const onboardingStep = await AsyncStorage.getItem('onboardingStep');
      if (onboardingStep === '4') {
        setTimeout(() => setVisible({ visible: true, accepted }), 500);
      } else {
        setVisible({ visible: true, accepted });
      }
      const onboardingStepString = await AsyncStorage.getItem('onboardingStep');
      if (onboardingStepString === '4') {
        await AsyncStorage.setItem('onboardingStep', '5');
      }
    }

    try {
      await onUserConfirm(DeviceInfo.getUniqueId(), accepted ? 1 : -1);
    } catch (e) {
      console.error(e);
    }
  }

  const onContinue = async () => {
    const onboardingStep = await AsyncStorage.getItem('onboardingStep');
    if (onboardingStep === '4') {
      setShowPopover(true);
    }
  }

  const resetLifes = () => {
    navigation.navigate('ModuleView');
    route.params?.onGiveLifes?.();
  }

  const animationCallback = async () => {
    setVisible({});
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
        disabled={question.filter(item => item.answer).length > 0 && !question.filter(item => item.answer).find(item => data[item.id])}
      />
      <Modal
        isVisible={visible?.visible && visible?.accepted}
        hideModalContentWhileAnimating
        animationInTiming={0}
        animationOutTiming={0}
      >
        <LottieView
          source={IMAGES.check}
          autoPlay
          loop={false}
          style={styles.animation}
          onAnimationFinish={animationCallback}
        />
      </Modal>
      <Modal
        isVisible={visible?.visible && !visible?.accepted}
        hideModalContentWhileAnimating
        animationInTiming={0}
        animationOutTiming={0}
      >
        <LottieView
          source={IMAGES.wrong}
          autoPlay
          loop={false}
          style={styles.animation}
          onAnimationFinish={animationCallback}
        />
      </Modal>
      <Modal
        isVisible={lifesVisible}
        hideModalContentWhileAnimating
        animationInTiming={0}
        animationOutTiming={0}
      >
        <View style={{ backgroundColor: 'white', padding: 16, borderRadius: 16, alignItems: 'center' }}>
          <Text style={{ fontWeight: 'bold', fontSize: 16, marginVertical: 8 }}>Parece que você perdeu todas as suas vidas.</Text>
          <Image
            source={require('../../resources/hearth.png')}
            style={{ height: 100, width: 100 }}
            resizeMode='contain'
          />
          <Text style={{ fontWeight: '600', fontSize: 18, marginBottom: 8 }}>Para ganhar mais vidas você deverá assistir ao vídeo do módulo novamente.</Text>
          <TouchableOpacity onPress={resetLifes} style={{ backgroundColor: '#1C375B', padding: 8, alignItems: 'center', borderRadius: 8 }}>
            <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 18 }}>Ganhar mais vidas!</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

export default QuestionView;
