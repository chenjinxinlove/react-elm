require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import { Router, Route,IndexRoute,hashHistory} from 'react-router';
import { connect } from 'react-redux'


import { fetchWxInfo} from '../actions'

import URI from 'urijs';
import {generateGetCodeUrl} from '../libs';

import Index from './index/index';
import Sort from './sort/index';
import Vote from './vote/index';


class AppComponent extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {

  }

  _wechatAuth(nextState, replace, next){
    const uri = new URI(document.location.href);
    const query = uri.query(true);
    const {code} = query;


    if(!code) {
      const { dispatch , userInfo, error} = this.props;
      dispatch(fetchWxInfo(code));
      next()
    } else {
      document.location = generateGetCodeUrl(document.location.href);
    }
  }


  render() {
    return (
      <Router history = {hashHistory} >
        <Route name='index' path ="/"  component={Index} onEnter={this._wechatAuth.bind(this)} />
        <Route name="sort" path ="/sort" component={Sort} />
        <Route name="vote" path ="/vote" component={Vote} />
      </Router>
    );
  }
}

AppComponent.defaultProps = {
};

function mapStateToProps(state) {

  const { wxInfo } = state;

  return {
    userInfo: wxInfo.userInfo,
    error: wxInfo.error
  }
}

export default connect(mapStateToProps)(AppComponent )
