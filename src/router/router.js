/**
 * Created by chenjinxin on 2017/3/25.
 */
import React from 'react';
import { Route, IndexRedirect} from 'react-router';
import App from '../pages/app';

import Home from '../pages/home/home';

// const home = (location, cb) => {
//   require.ensure([], require => {
//     cb(null, require('../pages/home/home').default)
//   },'home')
// }


const routes = (
  <Route>
    <Route path="/" component={App}>
      <IndexRedirect from="/" to='/home'/>
    </Route>
    <Route path="/home" component={ Home }></Route>

  </Route>
);
export default routes;
