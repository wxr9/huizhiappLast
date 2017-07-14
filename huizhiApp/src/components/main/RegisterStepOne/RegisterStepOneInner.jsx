import { List, InputItem, WingBlank, Button, Modal} from 'antd-mobile';
import { createForm } from 'rc-form';
import React from 'react';
import { Link } from 'react-router';
import './register.less'
import crypto from  'crypto';
import config from '../../../config';
import requestGET from '../../../utils/requestGET';
import request from '../../../utils/request';
import axios from 'axios';
import Qs from 'qs';

const alert = Modal.alert;
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
    var reg = /^[a-zA-Z][a-zA-Z0-9]{7,19}$/i;
    var r = reg.test(value);
    if(r==null){
      callback(new Error('用户名,字母开头，长度为为8-20位，且只能含有字母和数字'));
    }{
      callback();
    }
  }
  /*验证密码*/
  validatePassword = (rule, value, callback) => {
    var rn = /\d+/g; //数字测试
    var ra = /[a-zA-Z]/g; //字母测试
    if (value && value.length >= 8) {
      if(rn.test(value) && ra.test(value)) {
        callback();
      }else{
        callback(new Error('密码需包含数字和字母'));
      }
    }else{
      callback(new Error('新密码至少8个字符'));
    }
  }
  /*验证手机号*/
  validatePhoneNo = (rule, value, callback) => {
    value = value.replace(" ","").replace(" ","");
    var re = /^1[34578]\d{9}$/;
    if(re.test(value)){
      callback();
    }else{
      callback(new Error('手机号格式错误！'));
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
        axios.get(url).then(function(response){//从配置文件中读取url，GET请求
          console.log(url);
          console.log("Register response",response);
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
        // var password = registerInfo.password;
        var password = crypto.createHash('md5').update(registerInfo.password,'').digest('hex');
        // var repassword = registerInfo.repassword;
        var repassword = crypto.createHash('md5').update(registerInfo.repassword,'').digest('hex');
        var phone = registerInfo.phoneNo;
        phone=phone.replace(" ","").replace(" ","");
        var code = registerInfo.messageCode;
        var params = "username="+username+"&password="+password+"&phone="+phone+"&code="+code;
        var data = {
          username: username,
          password: password,
          phone:phone,
          code:code
        };
        console.log(params);
        //post请求
        // request(config.registerUrl,params).then((data) => {//从配置文件中读取url
        //   console.log(data);
        // });
        axios.post(config.registerUrl,Qs.stringify(data)).then(function(response){//从配置文件中读取url，GET请求
          console.log("registerUrl response",response);
          if(response.data.success){
            window.location.href = "#index/Index";
          }else{
            alert(response.data.msg);
          }
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
                     maxLength = "20"
            placeholder="请填写用户名"
          />
        </List>
        <List className="register-as-list">
          <InputItem className="register-list-item"
                     {...getFieldProps('password',{
                       rules:[
                         { required: true, message: '请填写密码' },
                         { validator: this.validatePassword },
                       ]
                     })}
                     clear
                     error={!!getFieldError('password')}
                     onErrorClick={() => {
                       alert(getFieldError('password').join('、'));
                     }}
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
              {...getFieldProps('phoneNo',{
                          rules:[
                            { required: true, message: '请确认密码' },
                            { validator: this.validatePhoneNo },
                          ]
                        })}
                       clear
                       error={!!getFieldError('phoneNo')}
                       onErrorClick={() => {
                         alert(getFieldError('phoneNo').join('、'));
                       }}
              placeholder="请输入手机号"
            />
          </List>
        <div className="register-verify-code-right">
          <Link>
            <img
              src={imgUrl} className="register-verify-code-image"
             alt="image"
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
