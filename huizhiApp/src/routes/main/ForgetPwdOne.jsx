import { List, InputItem, WingBlank, Button } from 'antd-mobile';
import { createForm } from 'rc-form';
import React from 'react';
import { Link } from 'react-router';

// 忘记密码（步骤一）
class ForgetPwdOne extends React.Component {
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
              style={{ borderBottom: '1px solid white', backgroundColor: '#0f0' }}
              {...getFieldProps('phoneNo')}
              placeholder="请输入手机号"
            />
          </List>
          <Button
            className="btn" type="primary" inline size="small" onClick={() => {
            }}
            style={{
              background: '#259dda',
              fontSize: '1em',
              float: 'right',
              marginTop: '17px',
            }}
          >获取验证码</Button>
          <List style={{ marginTop: '10px', width: '67%' }}>
            <InputItem
              {...getFieldProps('code')}
              placeholder="请输入验证码"
            />
          </List>

          <div className="btn-container" style={{ marginTop: '10px' }}>
            <Link to="ForgetPwdTwo">
              <Button
                className="btn" type="primary" onClick={() => {
                }}
                style={{
                  background: '#259dda',
                  fontSize: '1em',
                }}
              >提交</Button>
            </Link>
          </div>
        </WingBlank>
      </div>
    );
  }
}

const ForgetPwdOneWrapper = createForm()(ForgetPwdOne);
export default ForgetPwdOneWrapper;
