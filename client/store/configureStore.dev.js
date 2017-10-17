import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { persistStore, autoRehydrate } from 'redux-persist';

import handlePromiseMiddleware from './middlewares/handlePromiseMiddleware';
import alertMiddleware from './middlewares/alertMiddleware';
import rootReducer from './reducers';


export default function configureStore(initialState) {
  let store, enhancer;

  if (window.devToolsExtension) {
    //Enable Redux devtools if the extension is installed in developer's browser
    enhancer = compose(
      autoRehydrate(),
      applyMiddleware(handlePromiseMiddleware, alertMiddleware, thunkMiddleware),
      window.devToolsExtension()
    );
  } else {
    enhancer = compose(
      autoRehydrate(),
      applyMiddleware(handlePromiseMiddleware, alertMiddleware, thunkMiddleware),
    );
  }
  store = createStore(rootReducer, initialState, enhancer);
  persistStore(store, {
    whitelist: ['savedFilters', 'stores']
  });

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
      const nextReducer = require('./reducers/index').default;
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
