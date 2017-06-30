import { List, InputItem, WingBlank, Button } from 'antd-mobile';
import { createForm } from 'rc-form';
import React from 'react';
import { Link } from 'react-router';

// 登录
class Login extends React.Component {
  render() {
    const { getFieldProps } = this.props.form;
    return (
      <div>
        <WingBlank
          style={{
            marginTop: '50px',
          }}
        >
        <List style={{ marginTop: '20px' }}>
          <InputItem
            style={{ borderBottom: '1px solid white' }}
            {...getFieldProps('username')}
            placeholder="请输入您的手机号/用户名"
          />
        </List>
        <List style={{ marginTop: '10px' }}>
          <InputItem
            {...getFieldProps('password')}
            type="password"
            placeholder="请输入6-20位密码"
          />
        </List>
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

const LoginWrapper = createForm()(Login);
export default LoginWrapper;
