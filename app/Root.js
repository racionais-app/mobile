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
import ModuleView from './screens/Module';
// import SettingsView from './screens/Settings';

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
			options={{ gestureEnabled: false, headerShown: true, ...defaultScreenOptions }}
		/>
	</App.Navigator>
);

const Root = ({ root, login }) => {

	React.useEffect(() => {
		(async() => {
			const name = await AsyncStorage.getItem('authentication');
			if (name) {
				login({ name });
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
	login: (user) => dispatch({ type: 'LOGIN', payload: user }),
	logout: () => dispatch({ type: 'LOGOUT' }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Root);
