import React from 'react';
import PropTypes from 'prop-types';
import Popover from 'react-native-popover-view';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image
} from 'react-native';
import data from '../../core/data';

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

const Submit = ({ onSubmit, isAccepted }) => {
  const [showPopover, setShowPopover] = React.useState(false);

  React.useEffect(() => {
    if (isAccepted) {
      setShowPopover(true);
    }
  }, [isAccepted]);

  return (
    <Popover
      isVisible={showPopover}
      onRequestClose={() => setShowPopover(false)}
      from={(
        <View style={styles.submit}>
          <TouchableOpacity style={styles.button} onPress={onSubmit}>
            <Text style={styles.check}>Checar</Text>
          </TouchableOpacity>
        </View>
      )}>
      <View style={styles.popover}>
        <Text style={styles.title}>Parabéns!</Text>
        <Text style={styles.subtitle}>Você conseguiu!</Text>
      </View>
    </Popover>
  );
}

const Question = ({ question }) => (
  <Text
    style={{
      marginBottom: 16,
      fontSize: question.format.size,
      fontWeight: question.format.weight
    }}
  >
    {question.text}
  </Text>
);
Question.propTypes = {
  question: PropTypes.object
};

const Answer = ({ answer, onChangeText }) => {
  switch(answer.type) {
    case 'input':
      return (
        <>
          <Text>{answer.label}</Text>
          <TextInput
            onChangeText={text => onChangeText(text, answer.id)}
            style={styles.input}
          />
        </>
      );
  }
};

const QuestionView = () => {
  const [answers, setAnswers] = React.useState({});
  const [isAccepted, setIsAccepted] = React.useState(false);

  const onChangeText = (text, id) => {
    const answersCopy = answers;
    answersCopy[id] = text;
    setAnswers(answersCopy);
  };

  const onSubmit = () => {
    const validResponse = data.answers.filter(answer => answer.value !== answers[answer.id]).length === 0;
    setIsAccepted(validResponse);
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          {data.question.map(question => <Question question={question} />)}
          <Image
            source={{ uri: data.image }}
            style={{ height: 250, width: 250 }}
            resizeMode='contain'
          />
          {data.answers.map(answer => <Answer answer={answer} answers={answers} onChangeText={onChangeText} />)}
        </View>
      </ScrollView>
      <Submit onSubmit={onSubmit} isAccepted={isAccepted} />
    </View>
  );
};

export default QuestionView;
