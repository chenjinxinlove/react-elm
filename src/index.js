import 'core-js/fn/object/assign';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from './components/Main';


import configureStore from './stores/configureStore';

let store = configureStore();


function mapStateToProps(state) {
  return {
    value: state.count
  }
}

ReactDOM.render(
    <Provider store={store}>
     <App />
    </Provider>,
     document.getElementById('app')
);
