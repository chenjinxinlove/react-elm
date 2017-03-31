/**
 * Created by chen on 2017/3/31.
 */
import './index.scss';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
class FootGuide extends Component {
  constructor(props){
    super(props);
  }
  render () {
    let geohash = this.props.state.geohash;
    return (
      <section id="foot_guide">
        <section  className="guide_item">
          <Link to={{pathname: '/msite', query: {geohash}}}>
            <span>外卖</span>
          </Link>
        </section>
        <section className="guide_item">
          <Link to={{pathname: '/search/' + geohash}}>
            <span>搜索</span>
          </Link>
        </section>
        <section  className="guide_item">
          <Link to="/order">
            <span>订单</span>
          </Link>
        </section>
        <section className="guide_item">
          <Link to="/profile">
            <span>我的</span>
          </Link>
        </section>
      </section>
    )
  }
}
function mapStateToProps(state) {
  return { state }
}

export default connect( mapStateToProps)(FootGuide);

