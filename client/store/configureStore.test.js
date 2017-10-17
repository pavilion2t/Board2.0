import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';

import handlePromiseMiddleware from './middlewares/handlePromiseMiddleware';
import alertMiddleware from './middlewares/alertMiddleware';
import rootReducer from './reducers';

export default function configureStore(initialState) {
  let enhancer = compose(
    applyMiddleware(handlePromiseMiddleware, alertMiddleware, thunkMiddleware),
  );

  let store = createStore(rootReducer, initialState, enhancer);

  return store;
}
