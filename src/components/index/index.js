/**
 * Created by chen on 2017/3/1.
 */
/**
 * 首页组件
 */
require('./index.sass');
let zxImg = require('./zx.png');
let xxImg = require('./xx.png');
let topbarIMG = require('./topbar_02.png');

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { selectAction, getListDataAction } from '../../actions'



class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: ''
    }
    this.selectFun = this.selectFun.bind(this);
  }

  handleInputChange(e) {
    this.state({
      inputValue: e.target.value
    })
  }

  componentDidMount() {
    this.refs.button.addEndEventListener('click', e => {
      this.clickkk()
    })
  }

  componentWillUnmount() {
    this.refs.button.removeEndEventListener('click')
  }
  selectFun (e) {
    const { onSelctClick, onGetListData} = this.props;
    let selectName = e.target.getAttribute("data-name");
    onSelctClick(selectName);
  }
  clickkk () {
    console.log('ssss')
  }

  render() {
    return (
      <div className="main">
        <img src={topbarIMG} alt="" className="topbar"/>
        <div className="title">
          我爱家乡的云摄影大赛
        </div>
        <div className="info">
          <p>投票时间：3月20日08:00-3月27日08:00</p>
          <p>投票规则：每位微信用户投票作品个数不限，</p>
          <p className="textIndex">但每日限投票一次。</p>
        </div>
        <input type="radio" value="mail" onChange={this.handleInputChange} checked={this.state.inputValue}/>
        <Link to="/vote">
          <img src={zxImg} alt="" className="zxImg" onClick={ this.selectFun } data-name="zx"/>
        </Link>
        <Link to="/vote">
          <img src={xxImg} alt="" className="zxImg" onClick={ this.selectFun } data-name="xx"/>
        </Link>
      </div>
    )
  }
}

function mapStateToProps(state) {

  const { wxInfo } = state;

  return {
    userInfo: wxInfo.userInfo,
    error: wxInfo.error
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onSelctClick: (selected) => dispatch(selectAction(selected)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Index)

