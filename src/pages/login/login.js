/**
 * Created by chen on 2017/4/6.
 */
import './login.scss';
import React, { Component } from 'react';

import { Link } from 'react-router';
import { connect } from 'react-redux';

import AlertTip from '../../components/common/AlertTip';
import { saveUserInfoActions } from '../../actions';

import Header from 'components/header/index.js';
import {mobileCode, checkExsis, sendLogin, getcaptchas, accountLogin} from '../../service/getData'
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginWay: true, //登录方式，默认短信登录
      computedTime: 0, //倒数记时
      phoneNumber: null,//手机号
      isShowV: false,//是否展示获取验证码
      showAlert: false,//显示提示组件
      alertText: null,//提示内容
      validate_token: null,//获取短信是返回的验证值，登录是需要
      mobileCode:null,//验证码
      userInfo: null, //获取到的用户信息
      userAccount:null,//用户名
      showPassword: false,//是否显示密码
      captchaCodeImg: null,//验证码地址
      codeNumber: null,//图片验证码
      passWord: null, //密码
    };
    this.getPhoneNumber = this.getPhoneNumber.bind(this);
    this.getVerifyCode = this.getVerifyCode.bind(this);
    this.closeTip = this.closeTip.bind(this);
    this.getMoblileCode = this.getMoblileCode.bind(this);
    this.mobileLogin = this. mobileLogin.bind(this);
    this.getUserAccount = this.getUserAccount.bind(this);
    this.changePassWordType = this.changePassWordType.bind(this);
    this.captchaCodeImg = this.captchaCodeImg.bind(this);
    this.getPassword = this.getPassword.bind(this);
    this.getCodeNumber = this.getCodeNumber.bind(this);
  }
  //获取并校验密码
  getPassword (e) {
    let pass = e.target.value;
    this.setState({
      passWord: pass
    })
  }

  //获取并验证图片验证码
  getCodeNumber (e) {
    let codeNum = e.target.value;
    this.setState({
      codeNumber: codeNum
    })
  }

  componentDidMount (){
    this.captchaCodeImg()
  }

  //获取验证码
  async captchaCodeImg () {
    let res = await getcaptchas();
    this.setState({
      captchaCodeImg: 'https://mainsite-restapi.ele.me/v1/captchas/' + res.code
    })
  }

  //改变密码显示方式
  changePassWordType (e) {
    e.stopPropagation()
    this.setState({
      showPassword: !this.state.showPassword
    })
  }
  //获取用户名
  getUserAccount (e) {
    let userAccount = e.target.value;
    this.setState({
      userAccount: userAccount
    })

  }
  //手机验证码登录
  async mobileLogin (){
    let userInfo;
    if (this.state.loginWay) {
      if (!this.state.isShowV) {
        this.setState({
          showAlert: true,
          alertText: '手机号码不正确'
        })
      } else if (!(/^\d{6}$/gi.test(this.state.mobileCode))) {
        this.setState({
          showAlert: true,
          alertText: '短信验证码不正确'
        })
      }
      userInfo = await sendLogin(this.state.mobileCode, this.state.phoneNumber, this.state.validate_token);
    } else{
      if (!this.state.userAccount) {
        this.setState({
          showAlert: true,
          alertText: '请输入手机号/邮箱/用户名'
        });
        return
      }else if(!this.state.passWord){
        this.setState({
          showAlert: true,
          alertText: '请输入密码'
        });
        return
      }else if(!this.state.codeNumber){
        this.setState({
          showAlert: true,
          alertText: '请输入验证码'
        });
        return
      }
      //用户名登录
      userInfo = await accountLogin(this.state.userAccount, this.state.passWord, this.state.codeNumber);
    }
    this.setState({
      userInfo: userInfo
    });
    //如果返回的值不正确，则弹出提示框，返回的值正确则返回上一页
    if (!this.state.userInfo.user_id) {
      this.setState({
        showAlert : true,
        alertText : userInfo.message
      });
      if (!this.state.loginWay) this.captchaCodeImg();
    }else{
      this.props.saveUserInfo(userInfo);
      this.props.router.go(-1);

    }
  }
  //获取手机验证码与校验
  getMoblileCode (e) {
    let code = e.target.value;
    this.setState({
      mobileCode: code
    })
  }
  //关闭tip提示框
  closeTip () {
    this.setState({
      showAlert:false
    })
  }
  //获取与校验手机号
  getPhoneNumber(e) {
    let pnum = e.target.value;
    let isShowV = /^1\d{10}$/gi.test(pnum);
    this.setState({
      phoneNumber: pnum,
      isShowV: isShowV
    })
  }
  //获取与校验验证码
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
      <div className="loginContainer">
        <Header signinUp='home' headTitle='ddd' goBack='ddd' userInfo="ddd"></Header>
        {
          this.state.loginWay ?
            <div className="loginForm">
              <section className="input_container phone_number">
                <input type="text" placeholder="手机号" name="phone" onChange={ this.getPhoneNumber } />
                {
                  !this.state.computedTime ?
                    <button  onClick={ this.getVerifyCode } className={ this.state.isShowV ? 'right_phone_number': ''} >获取验证码</button>
                    :<button onClick="">已发送（{ this.state.computedTime }）</button>
                }
              </section>
              <section className="input_container">
                <input type="text" placeholder="验证码" name="moblileCode" onChange={ this.getMoblileCode }/>
              </section>
            </div>
            :
            <div className="loginForm">
              <section className="input_container">
                <input type="text" placeholder="手机号/邮箱/用户名" onChange={ this.getUserAccount }/>
              </section>
              <section className="input_container">
                {
                  !this.state.showPassword ? <input type="password" placeholder="密码" onChange={ this.getPassword }/>
                    : <input type="text" placeholder="密码" onChange={ this.getPassword }/>
                }
                <div className={ !this.state.showPassword ? 'button_switch' : 'change_to_text button_switch' }>
                  <div className={ !this.state.showPassword ? 'circel_button' : 'trans_to_right circel_button' } onClick={ this.changePassWordType }>
                    <span>abc</span>
                    <span>...</span>
                  </div>
                </div>
              </section>
              <section className="input_container captcha_code_container">
                <input type="text" placeholder="验证码" onChange={ this.getCodeNumber }/>
                <div className="img_change_img">
                  {
                    this.state.captchaCodeImg ? <img src={this.state.captchaCodeImg}/> : ''
                  }
                  <div className="change_img" onClick={this.captchaCodeImg}>
                    <p>看不清</p>
                    <p>换一张</p>
                  </div>
                </div>
              </section>
            </div>
        }
        <p className="login_tips">
          温馨提示：未注册饿了么账号的手机号，登录时将自动注册，且代表您已同意
          <a href="https://h5.ele.me/service/agreement/">《用户服务协议》</a>
        </p>
        <div className="login_container" onClick={this.mobileLogin}>登录</div>
        {
          !this.state.loginWay ? <Link to="/forget" className="to_forget">忘记密码？</Link> : ''
        }
        {
          this.state.showAlert ? <AlertTip alertText={ this.state.alertText } closeTip={ this.closeTip }></AlertTip> : ''
        }
      </div>
    )
  }
}

function mapStateToProps() {
 return {}
}

function mapDispatchToProps(dispatch) {
  return {
    saveUserInfo: (userInfo) => dispatch(saveUserInfoActions(userInfo))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
