import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';

import routes from './routes';
import configureStore from './store/configureStore';

import 'font-awesome/css/font-awesome.css';

const store = configureStore();

render(
  <Provider store={ store }>
    <Router history={ browserHistory } routes={ routes } />
  </Provider>, document.getElementById('dashboard')
);
