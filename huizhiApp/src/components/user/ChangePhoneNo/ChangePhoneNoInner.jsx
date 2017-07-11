import { List, InputItem, WingBlank, Button,Modal } from 'antd-mobile';
import { createForm } from 'rc-form';
import React from 'react';
import { Link } from 'react-router';
import config from '../../../config';
import './contact.less';

import requestGET from '../../../utils/requestGET';
import request from '../../../utils/request';

const alert = Modal.alert;

// 联系方式修改
class ChangePhoneNoInner extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      imgUrl: config.codeImgUrl
    };
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
    this.props.form.validateFields({ force: true }, (error) => {
      if(!error){
        var Info = this.props.form.getFieldsValue();
        console.log(Info);
        var code = Info.code;
        var phone = Info.phoneNo;
        phone=phone.replace(" ","").replace(" ","");
        var url = config.getPhoneCode + phone + '/' + code;
        // var url = config.getPhoneCode + phone;
        // console.log(code+phone);
        console.log(url);
        requestGET(url).then((data) => {//从配置文件中读取url
          console.log(url);
          console.log(data);
          var reData = data.msg;
          if(!reData.success){
            alert(reData.msg);
          }
        });
      }
    });
  }
  onSubmit = () => {
    this.props.form.validateFields({ force: true }, (error) => {
      if (!error) {
        var info = this.props.form.getFieldsValue();
        console.log(info);
        //从缓存中读取
        var userInfo = sessionStorage.userInfo;
        //json转换为Object对象
        var  reData = JSON.parse(userInfo);
        //读取用户ID
        // console.log(reData.username);
        var username = reData.username;
        var phone = info.phoneNo;
        phone=phone.replace(" ","").replace(" ","");
        var code = info.code;
        var params = "username="+username+"&phone="+phone+"&code="+code;
        console.log(params);
        //post请求
        request(config.changePhoneUrl,params).then((data) => {//从配置文件中读取url
          console.log(data);
          var rsData = data.msg;
          // if(rsData.success){//修改联系方式成功
          //   //跳转首页
          //   window.location.href="#index/Index";
          // }else{//修改联系方式失败
          //   alert(reData.msg);
          //   this.props.form.resetFields();
          // }
        });
      } else {
        alert('校验失败');
      }
    });
  }
  render() {
    const {imgUrl} = this.state;
    const { getFieldProps } = this.props.form;
    return (
      <div>
        <List className="contact-as-list">
          <InputItem className="contact-list-item"
                     type="phone"
                     {...getFieldProps('phoneNo')}
                     placeholder="请输入手机号"
          />
        </List>
        <div className="contact-verify-code-right">
          <Link>
            <img
              src={imgUrl} className="contact-verify-code-image"
              style={{ }} alt="image"
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
        >获取验证码</Button>
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
