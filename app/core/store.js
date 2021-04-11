import { createStore } from 'redux';

function app(state = { root: 'OUTSIDE' }, action) {
  switch (action.type) {
    case 'LOGIN':
      return { app: { root: 'INSIDE' }, user: action.payload };
    case 'LOGOUT':
      return { app: { root: 'OUTSIDE' } };
    default:
      return state;
  }
}

export default createStore(app, { app: { root: 'OUTSIDE' } });
