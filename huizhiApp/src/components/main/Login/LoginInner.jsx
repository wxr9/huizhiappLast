import { Modal,List, InputItem, WingBlank, Button, Checkbox, Flex, Toast } from 'antd-mobile';
import { createForm } from 'rc-form';
import React from 'react';
import { Link } from 'react-router';
import axios from 'axios';
import Qs from 'qs';

import './Login.less';
import crypto from  'crypto';
import config from '../../../config';

const alert = Modal.alert;
const CheckboxItem = Checkbox.CheckboxItem;
const AgreeItem = Checkbox.AgreeItem;
// 登录页内部组件
class LoginInner extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      userloginInfo: [],
      rememberPwd: true,
    };
  }
  componentWillMount () {
    //从缓存中读取用户登录信息
    if(localStorage.userloginInfo != undefined){
      var userloginInfo = JSON.parse(localStorage.userloginInfo);
      if(userloginInfo != undefined){
        this.setState({
          userloginInfo : userloginInfo,
        })
      }
    }
  }
  //记住密码
  // rememberPwd(e) {
  //   if (e.target.checked) {
  //     this.state.rememberPwd = true;
  //     console.log(this.state.rememberPwd);
  //   } else {
  //     this.state.rememberPwd = false;
  //     console.log(this.state.rememberPwd);
  //   }
  // }
  onSubmit = () => {
      this.props.form.validateFields({ force: true }, (error) => {
        var logInfo = this.props.form.getFieldsValue();
        var userName = logInfo.username;
        var pwd = logInfo.password;
        if (userName === null||userName === ""||userName === undefined ){
          alert("请输入用户名");
          return;
        }else if(pwd === null|| pwd === ""||pwd === undefined ){
          alert("请输入密码");
          return;
        }else {
          var rememberPwd = this.state.rememberPwd;
          //MD5加密
          var sign = crypto.createHash('md5').update(pwd,'').digest('hex');
          var data = {
            j_password: sign,
            j_username: userName,
            lgtp: "front"
          };
          Toast.loading('正在登录...', 0)
          //post请求
          axios.post(config.loginUrl,Qs.stringify(data)).then(function(response){//从配置文件中读取url，POST请求
            var reData = response.data;
            if(reData.success) {//登陆成功
              //获取用户的个人信息并存入缓存
              axios.get(config.userInfoUrl).then(function (response) {//从配置文件中读取url，GET请求
                var userInfo = response.data;
                userInfo = JSON.stringify(userInfo);
                var login = {"username": userName};//判断用户登录状态
                var userloginInfo = {"username": userName};//存用户信息，注销时候用到
                //判断是否记住密码
                if (rememberPwd) {
                  login = {"username": userName, "pwd": sign};
                  userloginInfo = {"username": userName};
                }
                var loginInfo = JSON.stringify(login);
                userloginInfo = JSON.stringify(userloginInfo);
                localStorage.userInfo = userInfo;//个人信息存入缓存
                localStorage.loginInfo = loginInfo;//用户登录信息（用户名，MD5加密后的密码）存入缓存
                localStorage.userloginInfo = userloginInfo;//保存用户的账号
                if (localStorage.lastUrl != undefined && localStorage.lastUrl != "undefined") {
                  var lastUrl = localStorage.lastUrl;
                  var userInfo = localStorage.userInfo;
                  //json转换为Object对象
                  var reData = JSON.parse(userInfo);
                  if (lastUrl == "index/Bound" || lastUrl == "index/MyXiaozhi") {
                    if (reData.cardid == undefined || reData.cardid == null || reData.cardid == "") {
                      // console.log(reData.cardid);
                      lastUrl = "index/unbound";
                    }
                  }
                  Toast.hide();
                  //跳转到上一个状态
                  // window.location.href="#"+lastUrl;
                  alert("登录成功！", '', [
                    {text: '确认', onPress: () => window.location.href = "#" + lastUrl, style: {fontWeight: 'bold'}},
                  ]);

                } else {
                  //跳转首页
                  Toast.hide();
                  // window.location.href="#index/Index";
                  alert("登录成功！", '', [
                    {text: '确认', onPress: () => window.location.href = "#index/Index", style: {fontWeight: 'bold'}},
                  ]);
                }
              });

            }else{//登录验证失败
              Toast.hide()
              alert(reData.msg);
              this.props.form.resetFields();

            }
          }).catch(function(error){
            console.log(error);
          });
        }
    });
  }
  // validateAccount = (rule, value, callback) => {
  //   if (value && value.length > 0) {
  //     callback();
  //   } else {
  //     callback(new Error('帐号至少4个字符'));
  //   }
  // }

  render() {
    const {getFieldProps, getFieldError} = this.props.form;
    const {userloginInfo} = this.state;
    return (
      <form>
        <div className="login-wrap">
              <List className="listTop">
                <InputItem className="login-list-item"
                  {...getFieldProps('username',{
                    initialValue: userloginInfo.username,
                    rules: [
                  // { required: true, message: '请输入帐号' },
                  // { validator: this.validateAccount },
                    ],
                  })}
                  clear
                  error={!!getFieldError('username')}
                  onErrorClick={() => {
                    alert(getFieldError('username').join('、'));
                  }}
                  placeholder="请输入您的手机号/用户名"
                />
              </List>
              <List className="listTop">
                <InputItem className="login-list-item"
                  {...getFieldProps('password',{
                    rules: [
                      // { required: true, message: '请输入密码' },
                      // { validator: this.validateAccount },
                    ],
                  })}
                  clear
                  error={!!getFieldError('password')}
                  onErrorClick={() => {
                    alert(getFieldError('password').join('、'));
                  }}
                  type="password"
                  placeholder="请输入密码"
                />
              </List>
              {/*<List className="listTop login-am-list-body">*/}
                {/*<AgreeItem className="login-rem-pwd"*/}
                           {/*data-seed="logId"*/}
                           {/*onChange={(e) => this.rememberPwd(e)}>*/}
                  {/*<span className="login-rem-pwd_font">记住密码</span>*/}
                {/*</AgreeItem>*/}
              {/*</List>*/}
              <WingBlank>
                <div>
                    <Button
                      className="btn-login" type="primary" onClick={this.onSubmit} inline
                    >登录</Button>
                </div>

                <div className="login-pwd-text">
                  <a href="#ForgetPwdOne">忘记密码</a>
                  <a className="login-pwd-text-register" href="#RegisterStepOne">立即注册</a>
                </div>
              </WingBlank>
        </div>
      </form>
    );
  }
}

const LoginInnerWrapper = createForm()(LoginInner);
export default LoginInnerWrapper;
