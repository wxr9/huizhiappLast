import { List, InputItem, WingBlank, Button } from 'antd-mobile';
import { createForm } from 'rc-form';
import React from 'react';
import { Link } from 'react-router';

// 修改密码
class ChangePwd extends React.Component {
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
              {...getFieldProps('oldPassword')}
              type="password"
              placeholder="请输入原密码"
            />
          </List>
          <List style={{ marginTop: '20px' }}>
            <InputItem
              style={{ borderBottom: '1px solid white' }}
              {...getFieldProps('newPassword')}
              type="password"
              placeholder="请输入修改密码"
            />
          </List>
          <List style={{ marginTop: '10px' }}>
            <div style={{ bottom: '0' }}>
              <InputItem
                {...getFieldProps('newPassword')}
                type="password"
                placeholder="再次确认修改密码"
              />
            </div>
          </List>

          <div className="btn-container" style={{ marginTop: '10px' }}>
            <Link to="index/personinfo">
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

const ChangePwdWrapper = createForm()(ChangePwd);
export default ChangePwdWrapper;
