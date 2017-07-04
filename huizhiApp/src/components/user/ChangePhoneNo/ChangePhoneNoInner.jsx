import { List, InputItem, WingBlank, Button } from 'antd-mobile';
import { createForm } from 'rc-form';
import React from 'react';
import { Link } from 'react-router';

// 联系方式修改
class ChangePhoneNoInner extends React.Component {
  render() {
    const { getFieldProps } = this.props.form;
    return (
      <div>
          <List style={{ marginTop: '20px' }}>
            <InputItem
              style={{ borderBottom: '1px solid #e1e1e5' }}
              {...getFieldProps('newPhoneNo')}
              placeholder="请输入新的手机号"
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
          <List style={{ width: '67%' }}>
            <InputItem
              {...getFieldProps('code')}
              placeholder="请输入验证码"
            />
          </List>
        <WingBlank>
          <div className="btn-container" style={{ marginTop: '10px' }}>
            <Link to="index/personinfo">
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

const ChangePhoneNoInnerWrapper = createForm()(ChangePhoneNoInner);
export default ChangePhoneNoInnerWrapper;
