import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import KeyboardSpacer from 'react-native-keyboard-spacer';
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
  const questions = route.params?.questions;
  const question = questions[0].items;

  const [data, setData] = useState({});

  const onChange = (itemId, value) => {
    setData({ ...data, [itemId]: value });
  }

  const onSubmit = () => {
    const answers = question.filter(item => item.answer);
    const accepted = answers.filter(item => !isEqual(item.answer, data[item.id])).length === 0;
    console.warn(accepted ? 'Acertou' : 'Errou');
    setTimeout(() => {
      questions.pop();
      if (questions.length) {
        navigation.push('QuestionView', { questions });
      } else {
        navigation.navigate('HomeView');
      }
    }, 1000);
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
        text={questions.length === 1 ? 'Finalizar' : 'Continuar'}
        onSubmit={onSubmit}
      />
      <KeyboardSpacer />
    </SafeAreaView>
  );
}

export default QuestionView;
