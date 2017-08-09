import { List, InputItem, WingBlank, Button , Modal, Toast} from 'antd-mobile';
import { createForm } from 'rc-form';
import React from 'react';
import { Link } from 'react-router';
import '../RegisterStepOne/register.less';
import crypto from  'crypto';
import axios from 'axios';
import Qs from 'qs';
import request from '../../../utils/requestGET';
import config from '../../../config';
const alert = Modal.alert;
// 修改密码页内部组件
class ChangePwdInner extends React.Component {
  validateNewPassword = (rule, value, callback) => {
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

  onSubmit = () => {
    //轻提示，1秒后消失
      this.props.form.validateFields({force: true}, (error) => {
        if (!error) {
          var info = this.props.form.getFieldsValue();
          console.log(info);
          var oldPassword = info.oldPassword;
          var oldPassword = crypto.createHash('md5').update(oldPassword, '').digest('hex');
          var newPassword = info.newPassword;
          var newPassword = crypto.createHash('md5').update(newPassword, '').digest('hex');
          var newRePassword = info.newRePassword;
          var newRePassword = crypto.createHash('md5').update(newRePassword, '').digest('hex');
          //从缓存中读取
          var userInfo = localStorage.userInfo;
          //json转换为Object对象
          var reData = JSON.parse(userInfo);
          //读取用户ID
          // console.log(reData.username);
          var username = reData.username;
          var password;
          if (newPassword == newRePassword) {
            password = newPassword;
          } else {
            alert("新密码和确认密码不相同！");
            return;
          }
          var params = "username=" + username + "&oldpassword=" + oldPassword + "&password=" + password;
          console.log(params);
          var data = {
            username: username,
            password: password,
            oldpassword: oldPassword
          };
          Toast.loading('提交中...', 0);
          axios.post(config.changePasswordUrl, Qs.stringify(data)).then(function (response) {//从配置文件中读取url，GET请求
            console.log("changePhoneUrl response", response);
            if (response.data.success) {
              var logininfo = localStorage.loginInfo;
              //json转换为Object对象
              var reData = JSON.parse(logininfo);
              var userloginInfo = {"username": reData.username};
              userloginInfo = JSON.stringify(userloginInfo);
              localStorage.userloginInfo = userloginInfo;//保存用户的账号密码
              localStorage.removeItem("userInfo");
              localStorage.removeItem("loginInfo");
              localStorage.removeItem("lastUrl");
              Toast.hide();
              alert(response.data.msg, '', [
                {text: '确认', onPress: () => window.location.href = "#login", style: {fontWeight: 'bold'}},
              ]);
            } else {
              Toast.hide();
              //pc端为写死的，此处同样写死
              alert("原密码错误，修改失败!");
            }
          });
        } else {
          alert('校验失败');
        }
      });
  }
  render() {
    // const { getFieldProps } = this.props.form;
    const {getFieldProps, getFieldError} = this.props.form;
    return (
      <form>
          <List className="register-as-list">
            <InputItem className="register-list-item"
              {...getFieldProps('oldPassword')}
              type="password"
              placeholder="请输入原密码"
              maxLength = "20"
            />
          </List>
          <List className="register-as-list">
            <InputItem className="register-list-item"
                       {...getFieldProps('newPassword',{
                         rules: [
                           { required: true, message: '密码长度不小于8位' },
                           { validator: this.validateNewPassword },
                         ],
                       })}
                       clear
                       error={!!getFieldError('newPassword')}
                       onErrorClick={() => {
                         alert(getFieldError('newPassword').join('、'));
                       }}
                       maxLength = "20"
              type="password"
              placeholder="请输入新密码"
            />
          </List>
          <List className="register-as-list">
            <div>
              <InputItem className="register-list-item"
                         {...getFieldProps('newRePassword',{
                           rules: [
                             { required: true, message: '两次密码不相等' },
                             { validator: this.validateNewPassword },
                           ],
                         })}
                         clear
                         error={!!getFieldError('newRePassword')}
                         onErrorClick={() => {
                           alert(getFieldError('newRePassword').join('、'));
                         }}
                         maxLength = "20"
                type="password"
                placeholder="再次确认修改密码"
              />
            </div>
          </List>
        <WingBlank>
          <div className="btn-container">
            {/*<Link to="index/personinfo">*/}
              <Button
                className="btn-next-step" type="primary" onClick={this.onSubmit}
              >提交</Button>
            {/*</Link>*/}
          </div>
        </WingBlank>
      </form>
    );
  }
}

const ChangePwdInnerWrapper = createForm()(ChangePwdInner);
export default ChangePwdInnerWrapper;
