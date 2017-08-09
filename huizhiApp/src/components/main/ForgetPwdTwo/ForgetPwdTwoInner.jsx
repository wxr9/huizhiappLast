import { List, InputItem, WingBlank, Button, Modal, Toast } from 'antd-mobile';
import { createForm } from 'rc-form';
import React from 'react';
import { Link } from 'react-router';
import '../RegisterStepOne/register.less';
import crypto from  'crypto';
import request from '../../../utils/requestPOST';
import config from '../../../config';
const alert = Modal.alert;

// 忘记密码（步骤二）页内部组件
class ForgetPwdTwoInner extends React.Component {
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
          var newPassword = info.newPassword;
          var newPassword = crypto.createHash('md5').update(newPassword, '').digest('hex');
          var newRePassword = info.newRePassword;
          var newRePassword = crypto.createHash('md5').update(newRePassword, '').digest('hex');
          var password;
          if (newPassword == newRePassword) {
            password = newPassword;
          } else {
            alert("两次输入的密码不一致！");
            return;
          }
          //从缓存中读取
          console.log(localStorage.changePwd);
          var username, vcode;
          if (localStorage.changePwd != undefined) {
            var changePwd = localStorage.changePwd;
            //json转换为Object对象
            var reData = JSON.parse(changePwd);
            //读取用户ID
            if (reData.username != undefined && reData.vcode != undefined) {
              username = reData.username;
              vcode = reData.vcode;
            } else {
              window.location.href = "#/ForgetPwdOne";//验证成功跳转到第一步
              return;
            }
          }
          var data = {
            username: username,
            password: password,
            confirmpassword: password,
            vcode: vcode
          };
          console.log(data);
          Toast.loading('提交中...', 0);
          request(config.forgetPasswordStepTwoUrl, data).then((data) => {//从配置文件中读取url
            console.log("forgetPasswordStepTwoUrl data", data);
            if (data.success) {
              localStorage.removeItem("changePwd");
              Toast.hide();
              alert("密码修改成功！", '', [
                {text: '确认', onPress: () => window.location.href = "#login", style: {fontWeight: 'bold'}},
              ]);
              // window.location.href = "#/login";//修改成功跳转到登录界面
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
    const {getFieldProps, getFieldError} = this.props.form;
    return (
      <div>
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
                       placeholder="设置密码"
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
                         placeholder="确认密码"
              />
            </div>
          </List>
        <WingBlank>
          <div className="btn-container">
            {/*<Link to="index/Index">*/}
              <Button
                className="btn-next-step" type="primary" onClick={this.onSubmit}
              >确定</Button>
            {/*</Link>*/}
          </div>
        </WingBlank>
      </div>
    );
  }
}

const ForgetPwdTwoInnerWrapper = createForm()(ForgetPwdTwoInner);
export default ForgetPwdTwoInnerWrapper;
