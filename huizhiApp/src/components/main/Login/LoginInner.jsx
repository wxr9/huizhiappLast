import { Modal,List, InputItem, WingBlank, Button } from 'antd-mobile';
import { createForm } from 'rc-form';
import React from 'react';
import { Link } from 'react-router';

import './Login.less';
import request from '../../../utils/request';
import requestGET from '../../../utils/requestGET';
import crypto from  'crypto';
import config from '../../../config';

const alert = Modal.alert;

// 登录页内部组件
class LoginInner extends React.Component {
  onSubmit = () => {
    this.props.form.validateFields({ force: true }, (error) => {
      if (!error) {
        var logInfo = this.props.form.getFieldsValue();
        var userName = logInfo.username;
        var pwd = logInfo.password;

        //MD5加密
        var sign = crypto.createHash('md5').update(pwd,'').digest('hex');
        var params = "j_password=" + sign + "&j_username=" + userName + "&lgtp=front";
        //post请求
        request(config.loginUrl,params).then((data) => {//从配置文件中读取url
          var reData = data.msg;
          if(reData.success){//登陆成功
            //获取用户的个人信息并存入缓存
            // requestGET(config.userInfoUrl).then((data) => {//从配置文件中读取url
            var obj = {"username":"ptyh","name":"ptyh","realName":"普通用户","createDate":"2016-08-24 09:00:00","updateDate":"2017-07-06 16:54:26","sex":0,"birthday":null,"enterpriseInput":null,"workYears":0,"settingNation":null,"nation":0,"settingApartmentCity":null,"apartmentCity":0,"settingHometowntCity":null,"hometownCity":0,"settingDict":null,"education":0,"marital":1,"cardid":"00199000008989","phone":"18516518312","email":null,"memberCode":"814987924531250124","approved":false,"userFace":null,"department":555,"userFlag":1,"emailFlag":0,"accountNonExpired":true,"accountNonLocked":true,"credentialsNonExpired":true,"enabled":true};//data.msg;//待修改，数据获取
            var userInfo = JSON.stringify(obj);
            var login = {"username":userName,"pwd":sign};
            var loginInfo = JSON.stringify(login);

            sessionStorage.userInfo = userInfo;//个人信息存入缓存
            sessionStorage.loginInfo = loginInfo;//用户登录信息（用户名，MD5加密后的密码）存入缓存

            //跳转首页
            window.location.href="#index/Index";
          }else{//登录验证失败
            alert(reData.msg);
            this.props.form.resetFields();
          }
        });
      } else {
        alert('校验失败');
      }
    });
  }
  validateAccount = (rule, value, callback) => {
    if (value && value.length > 0) {
      callback();
    } else {
      callback(new Error('帐号至少4个字符'));
    }
  }

  render() {
    const {getFieldProps, getFieldError} = this.props.form;
    return (
      <form>
        <div className="login-wrap">
              <List className="listTop">
                <InputItem className="login-list-item"
                  {...getFieldProps('username',{
                    // initialValue: '小蚂蚁',
                    rules: [
                  { required: true, message: '请输入帐号' },
                  { validator: this.validateAccount },
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
                    // initialValue: '小蚂蚁',
                    rules: [
                      { required: true, message: '请输入密码' },
                      { validator: this.validateAccount },
                    ],
                  })}
                  clear
                  error={!!getFieldError('password')}
                  onErrorClick={() => {
                    alert(getFieldError('password').join('、'));
                  }}
                  type="password"
                  placeholder="请输入6-20位密码"
                />
              </List>
              <WingBlank className="login-wingBlank">
                <div className="btn-container">
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
