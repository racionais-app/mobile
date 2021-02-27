import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import KeyboardSpacer from 'react-native-keyboard-spacer';
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

  const onSubmit = () => {
    const answers = question.filter(item => item.answer);
    const accepted = answers.filter(item => !isEqual(item.answer, data[item.id])).length === 0;
    setVisible(true);
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
