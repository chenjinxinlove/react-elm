/**
 * Created by chen on 2017/3/1.
 */
/**
 * 内容组件
 */

require('./sort.sass');

let fhImg = require('./fh.png');
import React from 'react';
import { connect } from 'react-redux';

import configApi from '../../config/apiConfig';
import { requstGet } from '../../libs';
import { Link } from 'react-router';

import Top from '../top';
class Sort extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listSort: []
    }
  }


  componentDidMount(){
    let that = this;
    let params = {t: this.props.selected }
    requstGet(configApi.sort,params).then((data) => {
      if(data.data.status = "success") {
        that.setState({
          listSort: data.data.result
        })
      }
    })
  }

  render() {
    return (
      <div className="sort">
        <Top></Top>
        <div className="bt">
          <div className="text">投票结果（{ this.props.selected === 'zx' ? '中学' : '小学' }组）</div>
        </div>
        {
          this.state.listSort.map((value) => {
            let style = {
              width: value.per + '%'
            };
            return (
              <div className="itemS">
                <p className="sortName">第{value.index}名  {value.author} {value.yid}号作品</p>
                <div className="jdt-wrapper">
                  <div className="jdt" style={style}></div>
                </div>
                <div className="piao">{value.per}% ({value.num}票)</div>
              </div>
            )
          })
        }
        <div className="submit">
          <Link to="/">
            <img src={fhImg} alt="" className="submit-img" />
          </Link>
        </div>
      </div>

    );
  }
}

function mapStateToProps(state) {
  let selected = state.selectXz;
  return { selected }
}

export default  connect(mapStateToProps)(Sort);
