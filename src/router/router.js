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

const Food = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('../pages/food/food').default)
  },'Food')
};

const Profile = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('../pages/profile/profile').default)
  },'profile')
};

const Login = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('../pages/login/login').default)
  },'login')
};

const Forget = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('../pages/forget/forget').default)
  },'forget')
};

const Download = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('../pages/download/download').default)
  },'download')
};

const Service = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('../pages/service/service').default)
  },'service')
};

const Shop = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('../pages/shop/shop').default)
  },'shop')
};

const Order = (location, cb) => {
  require.ensure([], require => {
    cb(null, require('../pages/order/order').default)
  },'order')
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
    <Route path="/food" getComponent= { Food }></Route>
    <Route path="/profile" getComponent= { Profile }></Route>
    <Route path="/login" getComponent= { Login }></Route>
    <Route path="/forget" getComponent= { Forget }></Route>
    <Route path="/download" getComponent= { Download }></Route>
    <Route path="/service" getComponent= { Service }></Route>
    <Route path="/shop" getComponent= { Shop }></Route>
    <Route path="/order" getComponent= { Order }></Route>
  </Route>
);
export default routes;
