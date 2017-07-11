import { List, InputItem, WingBlank, Button ,Modal} from 'antd-mobile';
import { createForm } from 'rc-form';
import React from 'react';
import { Link } from 'react-router';
import '../RegisterStepOne/register.less';
import crypto from  'crypto';
import request from '../../../utils/request';
import config from '../../../config';
const alert = Modal.alert;
// 修改密码页内部组件
class ChangePwdInner extends React.Component {
  validateNewPassword = (rule, value, callback) => {
    var rn = /\d+/g; //数字测试
    var ra = /[a-zA-Z]/g; //字母测试
    if (value && value.length >= 8) {
      if(!(rn.test(value) && ra.test(value))) {
        callback();
      }else{
        callback(new Error('密码需包含数字和字母'));
      }
    }else{
      callback(new Error('新密码至少8个字符'));
    }
  }
  onSubmit = () => {
    this.props.form.validateFields({ force: true }, (error) => {
      if (!error) {
        var info = this.props.form.getFieldsValue();
        console.log(info);
        var oldPassword = info.oldPassword;
        var oldPassword = crypto.createHash('md5').update(oldPassword,'').digest('hex');
        var newPassword = info.newPassword;
        var newPassword = crypto.createHash('md5').update(newPassword,'').digest('hex');
        var newRePassword = info.newRePassword;
        var newRePassword = crypto.createHash('md5').update(newRePassword,'').digest('hex');
        //从缓存中读取
        var userInfo = sessionStorage.userInfo;
        //json转换为Object对象
        var  reData = JSON.parse(userInfo);
        //读取用户ID
        // console.log(reData.username);
        var username = reData.username;
        var password;
        if(newPassword == newRePassword){
          password =  newPassword;
        }else{
          alert("两次输入的密码不相等！");
        }
        var params = "username="+username+"&oldpassword="+oldPassword+"&password="+password+"&confirmPassword="+newRePassword;
        console.log(params);
        //post请求
        request(config.changePasswordUrl,params).then((data) => {//从配置文件中读取url
          var reData = data;
          console.log(reData);
          if(reData.success){//登陆成功
            // window.location.href="#index/Index";
          }else{//x修改密码失败
            alert(reData.msg);
            this.props.form.resetFields();
          }
        });
      }else{
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
              type="password"
              placeholder="请输入修改密码"
            />
          </List>
          <List className="register-as-list">
            <div>
              <InputItem className="register-list-item"
                         {...getFieldProps('newRePassword',{
                           rules: [
                             { required: true, message: '两次密码不相等' },
                             { validator: this.validateNewRePassword },
                           ],
                         })}
                         clear
                         error={!!getFieldError('newRePassword')}
                         onErrorClick={() => {
                           alert(getFieldError('newRePassword').join('、'));
                         }}
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
