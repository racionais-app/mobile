import React from 'react';
import { Provider } from 'react-redux';

import Root from './Root';

import store from './core/store';

const App = () => (
  <Provider store={store}>
    <Root />
  </Provider>
);

export default App;
