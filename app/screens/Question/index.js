import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-native-modal';
import LottieView from 'lottie-react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
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

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false
};

const wrong = require('../../core/wrong.json');
const check = require('../../core/check.json');

const Feedback = ({ feedback }) => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    if (feedback) {
      setIsVisible(true);
      if (feedback !== 'acertou') {
        ReactNativeHapticFeedback.trigger('notificationError', options);
      }
    }
  }, [feedback]);

  return (
    <Modal isVisible={isVisible}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <LottieView
          source={feedback === 'acertou' ? check : wrong}
          autoPlay
          loop={false}
          style={{ height: 200, width: 200 }}
          onAnimationFinish={() => setIsVisible(false)}
        />
      </View>
    </Modal>
  );
}

const Submit = ({
  onSubmit,
  onNext,
  text,
  feedback,
  style
}) => {
  return (
    <View style={styles.submit}>
      <TouchableOpacity style={[styles.button, style]} onPress={feedback ? onNext : onSubmit}>
        <Text style={styles.check}>{text}</Text>
      </TouchableOpacity>
    </View>
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

const Answer = ({ answer, onChangeText, feedback }) => {
  let style = {};
  if (feedback === 'acertou') {
    style = { borderColor: '#00ff00' };
  }
  if (feedback === 'errou') {
    style = { borderColor: '#cc0000' };
  }
  switch(answer.type) {
    case 'input':
      return (
        <>
          <Text>{answer.label}</Text>
          <TextInput
            editable={!feedback}
            onChangeText={text => onChangeText(text, answer.id)}
            style={[styles.input, style]}
          />
        </>
      );
  }
};

const QuestionView = ({ route, navigation }) => {
  const itemId = route.params?.itemId ?? 0;
  const [answers, setAnswers] = React.useState({});
  const [feedback, setFeedback] = React.useState(false);

  const onChangeText = (text, id) => {
    const answersCopy = answers;
    answersCopy[id] = text;
    setAnswers(answersCopy);
  };

  const onSubmit = () => {
    const validResponse = data[itemId].answers.filter(answer => answer.value !== answers[answer.id]).length === 0;
    setFeedback(validResponse ? 'acertou' : 'errou');
  }
  
  const onNext = () => {
    if (data.length - 1 > itemId) {
      navigation?.push?.('QuestionView', { itemId: itemId + 1 })
    }
  }

  let style = {};
  if (feedback === 'acertou') {
    style = { backgroundColor: '#00ff00' };
  }
  if (feedback === 'errou') {
    style = { backgroundColor: '#cc0000' };
  }

  let text = 'Checar';
  if (feedback) {
    text = 'Próximo';
    if (data.length - 1 === itemId) {
      text = 'Finalizar';
      style = {};
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          {data[itemId].question.map(question => <Question question={question} />)}
          <Image
            source={{ uri: data[itemId].image }}
            style={{ height: 250, width: 250 }}
            resizeMode='contain'
          />
          {data[itemId].answers.map(answer => (
            <Answer
              answer={answer}
              answers={answers}
              onChangeText={onChangeText}
              feedback={feedback}
            />
          ))}
        </View>
      </ScrollView>
      <Submit
        onSubmit={onSubmit}
        onNext={onNext}
        feedback={feedback}
        text={text}
        style={style}
      />
      <Feedback feedback={feedback} />
    </View>
  );
};

export default QuestionView;
