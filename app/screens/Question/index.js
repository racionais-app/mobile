import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import KeyboardSpacer from 'react-native-keyboard-spacer';
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

const question = [
  { id: 1, type: 'text', text: 'Olá eu sou um **texto**.' },
  { id: 2, type: 'text', text: 'E eu um *sub-texto*.' },
  { id: 3, type: 'image', url: 'https://i.imgur.com/FhwD6Ct.png', size: 250 },
  { id: 4, type: 'select', label: 'Escolha uma', options: [{ id: 1, text: 'Opção 1' }, { id: 2, text: 'Opção 2' }], answer: [2] },
  { id: 5, type: 'input', label: '**Fração**', data: { id: 1, defaultValue: 'DJ'}, answer: 'djorkaeff' },
  { id: 6, type: 'text', text: 'E eu um **outro** sub-texto.' },
  { id: 7, type: 'multi-select', label: 'Escolha múltiplas', options: [{ id: 1, text: 'Opção 1' }, { id: 2, text: 'Opção 2' }], answer: [1, 2] }
];

const QuestionView = () => {
  const [data, setData] = useState({});

  const onChange = (itemId, value) => {
    setData({ ...data, [itemId]: value });
  }

  const onSubmit = () => {
    const answers = question.filter(item => item.answer);
    const accepted = answers.filter(item => !isEqual(item.answer, data[item.id])).length === 0;
    console.warn(accepted ? 'Acertou' : 'Errou');
  }

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
        onSubmit={onSubmit}
      />
      <KeyboardSpacer />
    </SafeAreaView>
  );
}

export default QuestionView;
