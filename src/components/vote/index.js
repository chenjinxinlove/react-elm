/**
 * Created by chen on 2017/3/9.
 */
require('./vote.sass');
let voteImg = require('./tj.png');
let checkboxImg = require('./checkbox.png');
let dgImg = require('./dg.png');
import React from 'react';
import { connect } from 'react-redux';


import md5 from 'md5';
import uuid from 'uuid';
import Top from '../top';
import { requstGet } from '../../libs';
import configApi from '../../config/apiConfig'
import {hashHistory} from 'react-router'

class Vote extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      userInfo:  this.props.wxInfo.userInfo,
      showCheck:{},
      list: [],
      sfOptions: [],
      ysData:　{},
      votes: []
    }
  }

  componentDidMount() {
    let selected = this.props.selectXz;

    let params = {"t": selected};
    requstGet(configApi['list'], params)
      .then((data) => {
        let result = data.data;
        if (data.status = "success") {
          let data = result.result;
          let showCheck = {};
          let list = [];
          let sfOptions = Object.keys(data);
          for (let i = 0; i < sfOptions.length; i++) {
            data[sfOptions[i]].forEach((value) => {
              showCheck[value._id] = false;
              list.push(value)
            })

          }
          this.setState({
            showCheck: showCheck,
            list: list,
            sfOptions: sfOptions,
            ysData: data
          })

        }
      })
  }

  handleChange (e) {
    let pro = e.target.value;
    let data = this.state.ysData;
    let list = [];
    data[pro].forEach(value => {
      list.push(value)
    });
    let sfOptions = this.state.sfOptions;
    for (let i= 0; i< sfOptions.length; i ++) {
      if(sfOptions[i] === pro) {
        continue
      }
      data[sfOptions[i]].forEach((value) => {
        list.push(value)
      })
    }
    this.setState({
      list: list
    })

  }

  changeCheck (e) {
    let {checked, value} =  e.target;
    let { votes }  = this.state
    let showCheck = this.state.showCheck;
    showCheck[value] = !showCheck[value];

    if(checked &&　votes.indexOf(value) === -1) {
      votes.push(value);
    } else {
      votes = votes.filter( i => i !== value)
    }

    this.setState({
      showCheck:  showCheck,
      votes: votes
    })
  }

  onSubmit() {
    let openid = this.state.userInfo.openid;
    let name = this.state.userInfo.nickname;
    let only = md5(openid + name) + uuid.v1();

    if(openid) {
      sessionStorage.setItem("openid", openid);
      sessionStorage.setItem("uuonly", only);
    } else{
      openid = sessionStorage.getItem('openid');
      only = sessionStorage.getItem('uuonly');
    }

    let votes = this.state.votes;
    if(votes.length === 0) {
      alert('请选择作品，在提交！');
      return;
    }
    let uid = votes.join('|');
    requstGet(configApi.vote,{
      'openid': openid,
      'uuonly': only,
      'uid': uid,
      't':this.props.selectXz
    }).then((data) => {
      let result = data.data;
      if(data.status = "success") {
        alert(JSON.parse(result.result).msg);
        hashHistory.push('/sort')
      } else {
        alert('投票失败')
      }

    })
      .catch((err) =>{
        alert('投票失败')
      })


  }
  render() {
    let openid = this.state.userInfo.openid;
    let name = this.state.userInfo.nickname;
    let only = md5(openid + name) + uuid.v1();

    if(openid) {
      sessionStorage.setItem("openid", openid);
      sessionStorage.setItem("uuonly", only);
    } 
    return (
      <div className="vote">
        <Top></Top>
        <div className="selectPro">
          <span className="title">选择省市区</span>
          <select name="pro" id="pro" className="pro" onChange={this.handleChange.bind(this)}>
            {
              this.state.sfOptions.map((value, index) => {
                return (
                  <option value={value} key={index}>{value}</option>
                )
              })
            }
          </select>
          <div className="production">候选作品（{ this.props.selectXz === 'zx' ? '中学' : '小学' }组）</div>
        </div>

        {
          this.state.list.map((value) => {
            return (
              <div key={value._id} >
                <div className="item" onClick={this.changeCheck.bind(this)}>
                  <label htmlFor={value._id}>
                    <img src={value.fileInput} alt="" className="item-img"/>
                    <div className="show-info">
                      <div className="text-wrapper">
                        <p>
                          <span className="school">{value.yid}号作品 </span>
                          <span className="school">{value.title}</span>
                        </p>
                        <p>
                          <span className="school">{value.author} </span>
                          <span className="school">{value.school} </span>
                        </p>



                        <p className="info">{value.info}</p>
                      </div>
                      <div className="vote-button">
                        <input type="checkbox" id={value._id}class="chk_1" name="vote" value={value._id} hidden />
                        <img src={checkboxImg} alt="" className="checkBox"/>
                        <img src={dgImg} alt="" className={this.state.showCheck[value._id] ? "dg" : "dgn"}/>
                      </div>
                    </div>
                  </label>
                </div>
                <div className="interval"></div>
              </div>
            )
          })
        }
      <div className="footer"></div>
      <div className="submit">

          <img src={voteImg} alt="" className="submit-img" onClick={this.onSubmit.bind(this)}/>

      </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return state;
}


export default connect(mapStateToProps)(Vote)


