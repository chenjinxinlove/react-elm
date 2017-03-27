/**
 * Created by chenjinxin on 2017/3/25.
 */
import React from 'react';
import { Route, IndexRedirect} from 'react-router';
import App from '../pages/app';

const Home = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('../pages/home/home').default)
  },'Home')
};
const City = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('../pages/city/city').default)
  },'City')
};


const routes = (
  <Route>
    <Route path="/" component={App}>
      <IndexRedirect from="/" to='/home'/>
    </Route>
    <Route path="/home" getComponent={ Home }></Route>
    <Route path="/city/:cityid" getComponent={ City } ></Route>
  </Route>
);
export default routes;
