import { List, InputItem, WingBlank, Button } from 'antd-mobile';
import { createForm } from 'rc-form';
import React from 'react';
import { Link } from 'react-router';

// 忘记密码（步骤一）页内部组件
class ForgetPwdOneInner extends React.Component {
  render() {
    const { getFieldProps } = this.props.form;
    return (
      <div>
          <List style={{ marginTop: '20px' }}>
            <InputItem
              style={{ borderBottom: '1px solid #e1e1e5'}}
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
              marginTop: '7px',
            }}
          >获取验证码</Button>
          <List style={{ width: '67%' }}>
            <InputItem
              {...getFieldProps('code')}
              placeholder="请输入验证码"
            />
          </List>
        <WingBlank>
          <div className="btn-container" style={{ marginTop: '10px' }}>
            <Link to="ForgetPwdTwo">
              <Button
                className="btn" type="primary" onClick={() => {
                }}
                style={{
                  background: '#259dda',
                  fontSize: '1em',
                }}
              >下一步</Button>
            </Link>
          </div>
        </WingBlank>
      </div>
    );
  }
}

const ForgetPwdOneInnerWrapper = createForm()(ForgetPwdOneInner);
export default ForgetPwdOneInnerWrapper;
