import {List, InputItem, WingBlank, Button, Modal, Toast} from 'antd-mobile';
import {createForm} from 'rc-form';
import React from 'react';
import {Link} from 'react-router';
import '../RegisterStepOne/register.less';
import config from '../../../config';
import axios from 'axios';
import requestGET from '../../../utils/requestGET';
import Qs from 'qs';
import request from '../../../utils/requestPOST';

const alert = Modal.alert;

// 忘记密码（步骤一）页内部组件
class ForgetPwdOneInner extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      imgUrl: config.codeImgUrl,
      noSend:true,//是否点击了发送验证码
      count: 60,//倒计时60
    };
  }
  componentWillMount () {
    var nowDate = new Date().getTime();
    var ImgUrl = config.codeImgUrl + "?" +nowDate;
    this.setState({
      imgUrl : ImgUrl
    })
  }

  changeImg = () =>{
    var nowDate = new Date().getTime();
    console.log(nowDate);
    var ImgUrl = config.codeImgUrl + "?" +nowDate;
    this.setState({
      imgUrl : ImgUrl
    })
  }
  //获取短信验证码
  getMessageCode = () =>{
    if(!this.state.noSend&&this.state.count>=1){
      alert("操作频繁，请稍后重试");
      return;
    }
    this.props.form.validateFields({ force: true }, (error) => {
      if(!error){
        var Info = this.props.form.getFieldsValue();
        console.log(Info);
        var code = Info.code;
        var userName = Info.userName;
        if(userName == undefined || userName == undefined){
          alert("请先输入用户名和图形验证码！");
          return;
        }
        userName=userName.replace(" ","").replace(" ","");
        var url = config.forgetPwdSendCodeUrl + userName + '/' + code;
        // var url = config.getPhoneCode + phone;
        // console.log(code+phone);
        console.log(url);
        requestGET(url).then((data) => {//从配置文件中读取url，GET请求
          console.log(url);
          console.log("getPhoneCode response",data);
          if(data.success){
            alert("验证码发送成功！");
            if(this.state.noSend){
              console.log(this.state.noSend+this.state.count);
              var count = this.state.count;
              this.timer = setInterval(function () {
                this.state.noSend = false;
                count -= 1;
                if (count < 1) {
                  this.setState({
                    noSend: true
                  });
                  count = 60;
                  clearTimeout(this.timer);
                }
                this.setState({
                  count: count
                });
              }.bind(this), 1000);
            }
          }else{
            alert(data.msg);
          }
        });
      }
    });
  }
  //表单提交
  onSubmit = () => {
    //轻提示，1秒后消失
      this.props.form.validateFields({force: true}, (error) => {
        if (!error) {
          var info = this.props.form.getFieldsValue();
          console.log(info);
          var userName = info.userName;
          var code = info.messageCode;
          if (userName == undefined || code == undefined) {
            alert("请先输入手机号和手机验证码！");
            return;
          }
          userName = userName.replace(" ", "").replace(" ", "");
          var data = {
            username: userName,
            code: code,
            authCode: info.code
          };
          console.log(data);
          Toast.loading('提交中...', 0);
          request(config.forgetPasswordStepOneUrl, data).then((data) => {//从配置文件中读取url
            console.log("forgetPasswordStepOneUrl data", data);
            if (data.success) {
              Toast.hide();
              var changePwd = {"username": userName, "vcode": code};
              changePwd = JSON.stringify(changePwd);
              localStorage.changePwd = changePwd;//用户信息（用户名，验证码）存入缓存
              window.location.href = "#/ForgetPwdTwo";//验证成功跳转到第二步
            } else {
              Toast.hide();
              alert(data.msg);
            }
          });
        } else {
          alert('校验失败');
        }
      });
  }
  render() {
    var text = this.state.noSend ? '获取验证码' : '重新发送'+this.state.count + 's';
    const {getFieldProps} = this.props.form;
    const {imgUrl} = this.state;
    return (
      <div>
        <List className="register-as-list">
          <InputItem className="register-list-item"
                     {...getFieldProps('userName')}
                     placeholder="请输入用户名/手机号"
          />
        </List>
        <div className="contact-verify-code-right">
          <Link>
            <img
              src={imgUrl} className="contact-verify-code-image"
              alt="image"
              onClick={this.changeImg}
            />

          </Link>
        </div>
        <List className="contact-input-code">
          <InputItem className="register-list-item"
                     {...getFieldProps('code')}
                     placeholder="请输入图形验证码"
          />
        </List>
        <Button
          className="forget-btn-getCode1" type="primary" inline size="small" onClick={this.getMessageCode}
        >{text}</Button>
        <List className="register-input-code">
          <InputItem className="register-list-item"
                     {...getFieldProps('messageCode')}
                     placeholder="请输入验证码"
          />
        </List>
        <WingBlank>
          <div className="btn-container">
            {/*<Link to="ForgetPwdTwo">*/}
              <Button
                className="btn-next-step" type="primary" onClick={this.onSubmit}
              >下一步</Button>
            {/*</Link>*/}
          </div>
        </WingBlank>
      </div>
    );
  }
}

const ForgetPwdOneInnerWrapper = createForm()(ForgetPwdOneInner);
export default ForgetPwdOneInnerWrapper;
