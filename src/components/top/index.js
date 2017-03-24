/**
 * Created by chen on 2017/3/9.
 */
let topImg = require('./top.jpg');
require('./top.sass');
import React from 'react';


class Top extends React.Component{
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <img src={topImg} alt="" className="top"/>
      </div>
    )
  }
}


export default Top;


