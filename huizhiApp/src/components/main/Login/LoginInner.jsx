import { List, InputItem, WingBlank, Button } from 'antd-mobile';
import { createForm } from 'rc-form';
import React from 'react';
import { Link } from 'react-router';
import './Login.less'

// 登录页内部组件
class LoginInner extends React.Component {
  render() {
    const { getFieldProps } = this.props.form;
    return (
      <div>
        <List classname="listTop">
          <InputItem
            style={{ borderBottom: '1px solid #e1e1e5' }}
            {...getFieldProps('username')}
            placeholder="请输入您的手机号/用户名"
          />
        </List>
        <List>
          <InputItem
            {...getFieldProps('password')}
            type="password"
            placeholder="请输入6-20位密码"
          />
        </List>
        <WingBlank>
          <div className="btn-container" style={{ marginTop: '10px' }}>
            <Link to="/index/Index">
              <Button
                className="btn" type="primary" onClick={() => {
                }}
                style={{
                  background: '#259dda',
                  fontSize: '1em',
                }}
              >登录</Button>
            </Link>
          </div>

          <div>
            <a href="#ForgetPwdOne">忘记密码</a>
            <a style={{float:'right'}} href="#RegisterStepOne">立即注册</a>
          </div>
        </WingBlank>
      </div>
    );
  }
}

const LoginInnerWrapper = createForm()(LoginInner);
export default LoginInnerWrapper;
