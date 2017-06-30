import { List, InputItem, WingBlank, Button } from 'antd-mobile';
import { Form, Input, Icon, Row, Col } from 'antd';
import { createForm } from 'rc-form';
import React from 'react';
import { Link } from 'react-router';

const FormItem = Form.Item;

// 注册（步骤一）
class RegisterStepOne extends React.Component {
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
            <Link to="RegisterStepTwo">
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

const RegisterStepOneWrapper = createForm()(RegisterStepOne);
export default RegisterStepOneWrapper;
