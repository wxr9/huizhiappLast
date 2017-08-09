import {List, InputItem, WingBlank, Button, Modal, Toast } from 'antd-mobile';
import {createForm} from 'rc-form';
import React from 'react';
import {Link} from 'react-router';
import config from '../../../config';
import './contact.less';
import requestGET from '../../../utils/requestGET';
import axios from 'axios';
import Qs from 'qs';

const alert = Modal.alert;
// 联系方式修改
class ChangePhoneNoInner extends React.Component {

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
    var ImgUrl = config.codeImgUrl + "?" + nowDate;
    this.setState({
      imgUrl: ImgUrl
    })
  }

  changeImg = () => {
    var nowDate = new Date().getTime();
    console.log(nowDate);
    var ImgUrl = config.codeImgUrl + "?" + nowDate;
    this.setState({
      imgUrl: ImgUrl
    })
  }
  /*验证手机号*/
  validatePhoneNo = (rule, value, callback) => {
    // value = value.replace(" ", "").replace(" ", "");
    var re = /^1[34578]\d{9}$/;
    if (re.test(value)) {
      callback();
    } else {
      callback(new Error('手机号格式错误！'));
    }
  }
  //获取短信验证码
  getMessageCode = () => {
    if (!this.state.noSend && this.state.count >= 1) {
      alert("操作频繁，请稍后重试");
      return;
    }
    this.props.form.validateFields({force: true}, (error) => {
      if (!error) {
        var Info = this.props.form.getFieldsValue();
        console.log(Info);
        var code = Info.code;
        var phone = Info.phoneNo;
        if (phone == undefined || code == undefined) {
          alert("请先输入手机号和图形验证码！");
          return;
        }
        // phone = phone.replace(" ", "").replace(" ", "");
        var url = config.getPhoneCode + phone + '/' + code;
        console.log(url);
        requestGET(url).then((data) => {//从配置文件中读取url
          console.log(url);
          console.log("getPhoneCode data", data);
          if (data.success) {
            alert("验证码发送成功！");
            if(this.state.noSend){
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
  onSubmit = () => {
    //轻提示，1秒后消失
      this.props.form.validateFields({force: true}, (error) => {
        if (!error) {
          var info = this.props.form.getFieldsValue();
          console.log(info);
          //从缓存中读取
          var userInfo = localStorage.userInfo;
          //json转换为Object对象
          var reData = JSON.parse(userInfo);
          //读取用户ID
          // console.log(reData.username);
          var username = reData.username;
          var phone = info.phoneNo;
          var code = info.messageCode;
          if (phone == undefined || code == undefined) {
            alert("请先输入手机号和手机验证码！");
            return;
          }
          phone = phone.replace(" ", "").replace(" ", "");

          var params = "username=" + username + "&phone=" + phone + "&code=" + code;
          console.log(params);
          var data = {
            username: username,
            phone: phone,
            code: code
          };
          Toast.loading('提交中...', 0);
          axios.post(config.changePhoneUrl, Qs.stringify(data)).then(function (response) {//从配置文件中读取url，GET请求
            console.log("changePhoneUrl response", response);
            if (response.data.success) {
              Toast.hide();
              reData.phone = phone;
              var userInfo = JSON.stringify(reData);
              localStorage.userInfo = userInfo;
              window.location.href = "#index/Index";
            } else {
              Toast.hide();
              alert(response.data.msg);
            }
          });
        } else {
          alert('校验失败');
        }
      });
  }
  render() {
    var text = this.state.noSend ? '获取验证码' : '重新发送'+this.state.count + 's';
    const {imgUrl} = this.state;
    const { getFieldProps, getFieldError } = this.props.form;
    return (
      <div>
        <List className="contact-as-list">
          <InputItem className="contact-list-item"
                     type="number"
                     {...getFieldProps('phoneNo', {
                       rules: [
                         {required: true, message: '请输入手机号'},
                         {validator: this.validatePhoneNo},
                       ]
                     })}
                     clear
                     error={!!getFieldError('phoneNo')}
                     onErrorClick={() => {
                       alert(getFieldError('phoneNo').join('、'));
                     }}
                     maxLength="11"
                     placeholder="手机号"
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
          <InputItem className="contact-list-item"
                     {...getFieldProps('code')}
                     placeholder="请输入验证码"
          />
        </List>
        <Button
          className="contact-btn-getCode" type="primary" inline size="small" onClick={this.getMessageCode}
        >{text}</Button>
        <List className="contact-input-code">
          <InputItem className="contact-list-item"
                     {...getFieldProps('messageCode')}
                     placeholder="请输入短信验证码"
          />
        </List>
        <WingBlank>
          <div className="contact-btn-container">
            <Button className="btn-next-step"
                    type="primary" onClick={this.onSubmit}
            >确定</Button>
          </div>
        </WingBlank>
      </div>
    );
  }
}

const ChangePhoneNoInnerWrapper = createForm()(ChangePhoneNoInner);
export default ChangePhoneNoInnerWrapper;
