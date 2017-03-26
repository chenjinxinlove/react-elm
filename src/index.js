import 'core-js/fn/object/assign';
import './styles/common.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import FastClick from 'fastclick';
import { Router, hashHistory } from 'react-router';
import routes from './router/router';
import configureStore from './stores/configureStore';
import { syncHistoryWithStore } from 'react-router-redux';
import './config/rem';


const store = configureStore();
const history = syncHistoryWithStore(hashHistory, store);

history.listen(function (location) { return location });



if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', function () {
    FastClick.attach(document.body);
  }, false);
}


ReactDOM.render(
    <Provider store={store}>
      <Router history={history}>
        { routes }
      </Router>
    </Provider>,
     document.getElementById('app')
);
