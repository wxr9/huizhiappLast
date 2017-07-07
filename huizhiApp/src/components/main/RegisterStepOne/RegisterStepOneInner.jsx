import { List, InputItem, WingBlank, Button } from 'antd-mobile';
import { createForm } from 'rc-form';
import React from 'react';
import { Link } from 'react-router';
import './register.less'
import crypto from  'crypto';
import config from '../../../config';
import requestGET from '../../../utils/requestGET';
import request from '../../../utils/request';

const codeImg = "http://222.73.203.71:8080/WiseAuth/AuthImageServlet";
// 注册页内部组件
class RegisterStepOneInner extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      imgUrl: config.codeImgUrl
    };
  }

  changeImg = () =>{
    var nowDate = new Date().getTime();
    console.log(nowDate);
    var ImgUrl = codeImg + "?" +nowDate;
    this.setState({
      imgUrl : ImgUrl
    })
  }
  //验证用户名的格式是否正确
  validateAccount = (rule, value, callback) => {
    if (value && value.length >= 8) {
      callback();
    } else {
      callback(new Error('用户名至少8个字符'));
    }
  }
  getMessageCode = () =>{
    this.props.form.validateFields({ force: true }, (error) => {
      if(!error){
        var registerInfo = this.props.form.getFieldsValue();
        var code = registerInfo.code;
        var phone = registerInfo.phoneNo;
        phone=phone.replace(" ","").replace(" ","");
        var url = config.getPhoneCode + phone + '/' + code;
        // console.log(code+phone);
        console.log(url);
        requestGET(url).then((data) => {//从配置文件中读取url
          console.log(data);
        });
      }
    });
  }
  onSubmit = () => {
    this.props.form.validateFields({ force: true }, (error) => {
      if (!error) {
        var registerInfo = this.props.form.getFieldsValue();
        console.log(registerInfo);
        var username = registerInfo.username;
        var password = registerInfo.password;
        var repassword = registerInfo.repassword;
        var phone = registerInfo.phoneNo;
        phone=phone.replace(" ","").replace(" ","");
        var code = registerInfo.messageCode;
        var params = "username="+username+"&password="+password+"&phone="+phone+"&code="+code;
        console.log(params);
        //post请求
        request(config.registerUrl,params).then((data) => {//从配置文件中读取url
          console.log(data);
        });
      } else {
        alert('校验失败');
      }
    });
  }
  render() {
    const {imgUrl} = this.state;
    const { getFieldProps, getFieldError } = this.props.form;
    return (
      <form>
        <List className="register-as-list">
          {/*用户名输入栏，并添加验证*/}
          <InputItem className="register-list-item"
            {...getFieldProps('username',{
              rules:[
                { required: true, message: '请填写用户名' },
                { validator: this.validateAccount },
              ]
            })}
            clear
            error={!!getFieldError('username')}
            onErrorClick={() => {
              alert(getFieldError('username').join('、'));
            }}
            placeholder="请填写用户名"
          />
        </List>
        <List className="register-as-list">
          <InputItem className="register-list-item"
            {...getFieldProps('password')}
            type="password"
            placeholder="请填写密码"
          />
        </List>
        <List className="register-as-list">
          <InputItem className="register-list-item"
                     {...getFieldProps('repassword',{
                       rules:[
                         { required: true, message: '请确认密码' },
                         { validator: this.validateRepassword },
                       ]
                     })}
                     clear
                     error={!!getFieldError('repassword')}
                     onErrorClick={() => {
                       alert(getFieldError('repassword').join('、'));
                     }}
            type="password"
            placeholder="请确认密码"
          />
        </List>
          <List className="register-as-list">
            <InputItem className="register-list-item"
              type="phone"
              {...getFieldProps('phoneNo')}
              placeholder="请输入手机号"
            />
          </List>
        <div className="register-verify-code-right">
          <Link>
            <img
              src={imgUrl} className="register-verify-code-image"
              style={{ }} alt="image"
              onClick={this.changeImg}
            />

          </Link>
        </div>
        <List className="register-input-code">
          <InputItem className="register-list-item"
            {...getFieldProps('code')}
            placeholder="请输入验证码"
          />
        </List>
          <Button
            className="register-btn-getCode" type="primary" inline size="small" onClick={this.getMessageCode}
          >获取验证码</Button>
          <List className="register-input-code">
            <InputItem className="register-list-item"
              {...getFieldProps('messageCode')}
              placeholder="请输入短信验证码"
            />
          </List>
        <WingBlank>
          <div className="btn-container">
              <Button
                className="btn-next-step" type="primary" onClick={this.onSubmit}
              >注册</Button>
          </div>
        </WingBlank>
      </form>
    );
  }
}

const RegisterStepOneInnerWrapper = createForm()(RegisterStepOneInner);
export default RegisterStepOneInnerWrapper;
