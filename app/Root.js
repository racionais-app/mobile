import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeView from './screens/Home';
import LoginView from './screens/Login';
import QuestionView from './screens/Question';
import ModuleView from './screens/Module';
import OnboardingView from './screens/Onboarding';
// import SettingsView from './screens/Settings';

enableScreens();

const ROOT = {
	OUTSIDE: 'OUTSIDE',
	INSIDE: 'INSIDE',
	ONBOARDING: 'ONBOARDING'
};

const defaultScreenOptions = {
	headerStyle: {
		backgroundColor: '#122b61'
	},
	headerTintColor: 'white'
};

const homeScreenOptions = {
	...defaultScreenOptions,
	headerLargeTitle: true
};

// QuestionStack
const Question = createStackNavigator();
const QuestionStack = () => (
	<Question.Navigator screenOptions={defaultScreenOptions}>
		<Question.Screen
			name='QuestionView'
			component={QuestionView}
			options={{ gestureEnabled: false }}
		/>
	</Question.Navigator>
);

// LoginStack
const Login = createStackNavigator();
const LoginStack = () => (
	<Login.Navigator screenOptions={{ headerShown: false }}>
		<Login.Screen
			name='LoginView'
			component={LoginView}
		/>
	</Login.Navigator>
);

// HomeStack
const Home = createNativeStackNavigator();
const HomeStack = () => (
	<Home.Navigator screenOptions={homeScreenOptions}>
		<Home.Screen
			name='HomeView'
			component={HomeView}
		/>
		<Home.Screen
			name='ModuleView'
			component={ModuleView}
			options={{
				headerLargeTitle: false,
				headerBackTitle: ''
			}}
		/>
	</Home.Navigator>
);

// OnboardingStack
const Onboarding = createStackNavigator();
const OnboardingStack = () => (
	<Onboarding.Navigator screenOptions={{ headerShown: false }}>
		<Onboarding.Screen
			name='OnboardingView'
			component={OnboardingView}
		/>
	</Onboarding.Navigator>
);

// InsideTab
const App = createNativeStackNavigator();
const AppStack = () => (
	<App.Navigator mode='modal' screenOptions={{ headerShown: false }}>
		<App.Screen
			name='Home'
			component={HomeStack}
		/>
		<App.Screen
			name='QuestionView'
			component={QuestionView}
			options={{
				gestureEnabled: false,
				headerShown: true,
				headerBackTitleVisible: false,
				...defaultScreenOptions
			}}
		/>
	</App.Navigator>
);

const Root = ({ root, login, onboarding }) => {

	React.useEffect(() => {
		(async() => {
			await AsyncStorage.removeItem('onboardingStep');
			const intro = await AsyncStorage.getItem('onboarding');
			const name = await AsyncStorage.getItem('authentication');
			if (name) {
				if (intro) {
					return login({ name });
				}
				onboarding();
			}
		})();
	}, []);

	return (
		<NavigationContainer>
			{
				root === ROOT.OUTSIDE
					? <LoginStack />
					: (
						root === ROOT.ONBOARDING
							? <OnboardingStack />
							: <AppStack />
					)
			}
		</NavigationContainer>
	);
};
Root.propTypes = {
  root: PropTypes.string
};

const mapStateToProps = (state) => ({
	root: state.app.root
});
const mapDispatchToProps = (dispatch) => ({
	onboarding: () => dispatch({ type: 'ONBOARDING' }),
	login: (user) => dispatch({ type: 'LOGIN', payload: user }),
	logout: () => dispatch({ type: 'LOGOUT' }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Root);
