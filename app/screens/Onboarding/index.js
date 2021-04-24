import React from 'react';
import Onboarding from 'react-native-onboarding-swiper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import analytics from '@react-native-firebase/analytics';
import { connect } from 'react-redux';

const OnboardingView = ({ login }) => {
  const onDone = async() => {
    try {
      await AsyncStorage.setItem('onboarding', 'done');
      const name = await AsyncStorage.getItem('authentication');
      login({ name });
    } catch {
      // Do nothing
    }
  }

  return (
    <Onboarding
      bottomBarColor='#fff'
      onDone={async() => {
        try {
          await analytics().logEvent('onboarding_done');
        } catch (e) {
          // Do nothing
        }
        onDone();
      }}
      onSkip={async() => {
        try {
          await analytics().logEvent('onboarding_skip');
        } catch (e) {
          // Do nothing
        }
        onDone();
      }}
      nextLabel='Próximo'
      skipLabel='Pular'
      pages={[
        {
          backgroundColor: '#fff',
          image: <MaterialCommunityIcons name='star' size={240} color='#FFD700' />,
          title: 'Estrelas',
          subtitle: 'A cada questão com a resposta correta você irá ganhar uma estrela.',
        },
        {
          backgroundColor: '#fff',
          image: <MaterialCommunityIcons name='calendar-month' size={240} color='#FEA55B' />,
          title: 'Diário',
          subtitle: 'A cada dia consecutivo de estudos você terá um ...',
        },
        {
          backgroundColor: '#fff',
          image: <MaterialCommunityIcons name='heart' size={240} color='#E31B23' />,
          title: 'Vidas',
          subtitle: 'Os corações são as chances de resolução de questões, se você perder todos poderá ganhar mais reassistindo ao vídeo de explicação de um módulo.',
        },
      ]}
    />
  );
};

const mapDispatchToProps = (dispatch) => ({
  login: (payload) => dispatch({ type: 'LOGIN', payload })
});
export default connect(null, mapDispatchToProps)(OnboardingView);
