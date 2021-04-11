import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeView from './screens/Home';
import LoginView from './screens/Login';
import QuestionView from './screens/Question';
import SettingsView from './screens/Settings';

enableScreens();

const ROOT = {
	OUTSIDE: 'OUTSIDE',
	INSIDE: 'INSIDE'
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
	</Home.Navigator>
);

// SettingsStack
const Settings = createStackNavigator();
const SettingsStack = () => (
	<Settings.Navigator screenOptions={homeScreenOptions}>
		<Settings.Screen
			name='SettingsView'
			component={SettingsView}
		/>
	</Settings.Navigator>
);

// InsideTab
const Inside = createBottomTabNavigator();
const InsideTab = () => (
	<Inside.Navigator>
		<Inside.Screen
			name='Home'
			component={HomeStack}
		/>
		<Inside.Screen
			name='Settings'
			component={SettingsStack}
		/>
	</Inside.Navigator>
);

// InsideTab
const App = createStackNavigator();
const AppStack = () => (
	<App.Navigator mode='modal' screenOptions={{ headerShown: false }}>
		<App.Screen
			name='Inside'
			component={InsideTab}
		/>
		<App.Screen
			name='QuestionStack'
			component={QuestionStack}
		/>
	</App.Navigator>
);

const Root = ({ root, login }) => {

	React.useEffect(() => {
		(async() => {
			const auth = await AsyncStorage.getItem('authentication');
			if (auth) {
				login();
			}
		})();
	}, []);

	return (
		<NavigationContainer>
			{
				root === ROOT.OUTSIDE
					? <LoginStack />
					: <AppStack />
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
	login: () => dispatch({ type: 'LOGIN' }),
	logout: () => dispatch({ type: 'LOGOUT' }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Root);
