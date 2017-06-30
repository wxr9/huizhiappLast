import { List, InputItem, WingBlank, Button } from 'antd-mobile';
import { createForm } from 'rc-form';
import React from 'react';
import { Link } from 'react-router';

// 忘记密码（步骤二）
class ForgetPwdTwo extends React.Component {
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
              {...getFieldProps('password')}
              type="password"
              placeholder="设置密码"
            />
          </List>
          <List style={{ marginTop: '10px' }}>
            <div style={{ bottom: '0' }}>
              <InputItem
                {...getFieldProps('password')}
                type="password"
                placeholder="确认密码"
              />
            </div>
          </List>

          <div className="btn-container" style={{ marginTop: '10px' }}>
            <Link to="index/Index">
              <Button
                className="btn" type="primary" onClick={() => {
                }}
                style={{
                  background: '#259dda',
                  fontSize: '1em',
                }}
              >确定</Button>
            </Link>
          </div>
        </WingBlank>
      </div>
    );
  }
}

const ForgetPwdTwoWrapper = createForm()(ForgetPwdTwo);
export default ForgetPwdTwoWrapper;
