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
const Msite = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('../pages/msite/msite').default)
  },'Msite')
};

const Search = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('../pages/search/search').default)
  },'Search')
};


const routes = (
  <Route>
    <Route path="/" component={App}>
      <IndexRedirect from="/" to='/home'/>
    </Route>
    <Route path="/home" getComponent={ Home }></Route>
    <Route path="/city/:cityid" getComponent={ City } ></Route>
    <Route path="/msite" getComponent= { Msite }></Route>
    <Route path="/search/:geohash" getComponent= { Search }></Route>
  </Route>
);
export default routes;
