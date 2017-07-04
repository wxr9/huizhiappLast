import { List, InputItem, WingBlank, Button } from 'antd-mobile';
import { createForm } from 'rc-form';
import React from 'react';
import { Link } from 'react-router';

// 注册（步骤二）页内部组件
class RegisterStepTwoInner extends React.Component {
  render() {
    const { getFieldProps } = this.props.form;
    return (
      <div>
          <List style={{ marginTop: '20px' }}>
            <InputItem
              style={{ borderBottom: '1px solid #e1e1e5' }}
              {...getFieldProps('username')}
              placeholder="请填写用户名"
            />
          </List>
          <List>
            <div style={{ bottom: '0' }}>
              <InputItem
                {...getFieldProps('password')}
                type="password"
                placeholder="请填写密码"
              />
            </div>
          </List>
          <WingBlank>
          <div className="btn-container" style={{ marginTop: '10px' }}>
            <Link to="index/Index">
              <Button
                className="btn" type="primary" onClick={() => {
                }}
                style={{
                  background: '#259dda',
                  fontSize: '1em',
                }}
              >注册</Button>
            </Link>
          </div>
        </WingBlank>
      </div>
    );
  }
}

const RegisterStepTwoInnerWrapper = createForm()(RegisterStepTwoInner);
export default RegisterStepTwoInnerWrapper;