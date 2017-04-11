/**
 * Created by chen on 2017/4/7.
 */

import './forget.scss';

import React, { Component } from 'react';
import Header from 'components/header/index.js';
import AlertTip from '../../components/common/AlertTip';
import {mobileCode, checkExsis, sendMobile} from '../../service/getData';

class Forget extends Component {
  constructor (props) {
    super(props);
    this.state = {
      phoneNumber: null, //电话号码
      newPassWord: null, //新密码
      rightPhoneNumber: false, //输入的手机号码是否符合要求
      confirmPassWord: null, //确认密码
      captchaCodeImg: null, //验证码地址
      mobileCode: null, //短信验证码
      computedTime: 0, //倒数记时
      showAlert: false, //显示提示组件
      alertText: null, //提示的内容
      accountType: 'mobile',//注册方式
    }
    this.getPhoneNumber = this.getPhoneNumber.bind(this);
    this.getVerifyCode = this.getVerifyCode.bind(this);
    this.getNewPassWord = this.getNewPassWord.bind(this);
    this.getConfirmPassWord = this.getConfirmPassWord.bind(this);
    this.getMobileCode = this.getMobileCode.bind(this);
    this.resetButton = this.getMobileCode.bind(this);
    this.closeTip = this.closeTip.bind(this);
  }
  //提交修改
  async resetButton (e) {
    e.preventDefault();
    if (!this.state.rightPhoneNumber) {
      this.setState({
        showAlert: true,
        alertText: '请输入正确的手机号'
      });
      return
    }else if(!this.state.newPassWord){
      this.setState({
        showAlert: true,
        alertText: '输入新密码'
      });
      return
    }else if(!this.state.confirmPassWord){
      this.setState({
        showAlert: true,
        alertText: '请输确认密码'
      });
      return
    }else if(this.state.newPassWord !== this.state.confirmPassWord){
      this.setState({
        showAlert: true,
        alertText: '两次输入的密码不一致'
      });
      return
    }else if(!this.state.mobileCode){
      this.setState({
        showAlert: true,
        alertText: '请输验证码'
      });
      return
    }
    // 发送重置信息
    let res = await sendMobile(this.state.phoneNumber, this.state.mobileCode, this.state.accountType, this.state.newPassWord);
    if (res.message) {
      this.setState({
        showAlert: true,
        alertText: res.message
      });
      return
    }else{
      this.setState({
        showAlert: true,
        alertText: '密码修改成功'
      });
    }
  }

  closeTip(){
    this.setState({
      showAlert : false
    })
  }
  //取验证码
  getMobileCode (e) {
    let code = e.target.value;
    this.setState({
      obileCode: code
    })
  }

  //取新密码
  getNewPassWord (e) {
    let newPassword  = e.target.value;
    this.setState({
      newPassWord: newPassword
    })
  }

  //取再次输入密码
  getConfirmPassWord (e) {
    let confirmPassword = e.target.value;
    this.setState({
      confirmPassWord: confirmPassword
    })
  }

  //获取手机号
  getPhoneNumber (e) {
    let phoneNum = e.target.value;
    let rightPhoneNumber = /^1\d{10}$/gi.test(phoneNum);
    this.setState = {
      phoneNumber: phoneNum,
      rightPhoneNumber: rightPhoneNumber
    }
  }
  //短信验证码
  async getVerifyCode(e) {
    e.preventDefault();
    if (this.state.isShowV) {
      //倒计时30秒
      this.setState({
        computedTime: 30
      });
      let timer = setInterval( () => {
        let computedTime = this.state.computedTime;
        computedTime --;
        this.setState({
          computedTime: computedTime
        })
        if(this.state.computedTime === 0) {
          clearInterval(timer)
        }
      }, 1000);
      //判断用户是否存在
      let exsis = await checkExsis(this.state.phoneNumber, 'mobile');
      if (exsis && exsis.message) {
        this.setState({
          showAlert: true,
          alertText: exsis.message
        })
      } else if (!exsis.is_exists) {
        this.setState({
          showAlert: true,
          alertText: '你输入的手机号尚未绑定'
        })
      }
      //发送短信验证码
      let res = await mobileCode(this.state.phoneNumber);
      if (res && res.validate_token) {
        this.setState({
          validate_token: res.validate_token
        });
      }
    }
  }
  render() {
    return (
      <div className="restContainer">
        <Header headTitle='重置密码' goBack='true' goBackFun={ this.props.router }></Header>
        <div className="restForm">
          <section className="input_container phone_number">
            <input type="text" placeholder="手机号" name="phone" onChange={ this.getPhoneNumber }/>
            {
              !this.state.computedTime ?
                <button  onClick={ this.getVerifyCode } className={ this.state.isShowV ? 'right_phone_number': ''} >获取验证码</button>
                :<button onClick="">已发送（{ this.state.computedTime }）</button>
            }
          </section>
          <section className="input_container">
            <input type="text" placeholder="请输入新密码" name="newPassWord" onChange={this.getNewPassWord}/>
          </section>
          <section className="input_container">
            <input type="text" placeholder="请确认密码" name="confirmPassWord" onChange={this.getConfirmPassWord}/>
          </section>
          <section className="input_container">
            <input type="text" placeholder="验证码" name="mobileCode"  onChange={this.getMobileCode}/>
          </section>
        </div>
        <div className="login_container" onClick={this.resetButton}>确认修改</div>
        {
          this.state.showAlert ? <AlertTip alertText={ this.state.alertText } closeTip={ this.closeTip }></AlertTip> : ''
        }
      </div>
    )
  }
}

export default Forget;
