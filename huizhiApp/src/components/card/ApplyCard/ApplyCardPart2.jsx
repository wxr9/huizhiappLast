import { List, InputItem, WingBlank, Checkbox, Card, Button } from 'antd-mobile';
import { createForm } from 'rc-form';
import React from 'react';
import { Link } from 'react-router';

// 申请汇智卡
class ApplyCardPart2 extends React.Component {
  render() {
    const { getFieldProps } = this.props.form;
    return (
      <div>
        <WingBlank
          style={{
            marginTop: '10px',
          }}
        >
          <List style={{ marginTop: '10px' }}>
            <InputItem
              style={{ borderBottom: '1px solid white' }}
              {...getFieldProps('username')}
              placeholder="请输入用户名"
            ><span style={{ color: '#f00' }}>*</span>申请人</InputItem>
          </List>
          <List style={{ marginTop: '10px' }}>
            <InputItem
              style={{ borderBottom: '1px solid white' }}
              {...getFieldProps('username')}
              placeholder="请输入邮箱"
            ><span style={{ color: '#f00' }}>*</span>E-mail</InputItem>
          </List>
          <List style={{ marginTop: '10px' }}>
            <InputItem
              style={{ borderBottom: '1px solid white' }}
              {...getFieldProps('username')}
              placeholder="请输入公司名称"
            ><span style={{ color: '#f00' }}>*</span>公司名称</InputItem>
          </List>
          <List style={{ marginTop: '10px' }}>
            <InputItem
              style={{ borderBottom: '1px solid white' }}
              {...getFieldProps('username')}
              placeholder="请输入手机号"
            ><span style={{ color: '#f00' }}>*</span>联系方式</InputItem>
          </List>
          <List style={{ marginTop: '10px' }}>
            <InputItem
              style={{ borderBottom: '1px solid white' }}
              {...getFieldProps('username')}
              placeholder="请输入真实姓名"
            ><span style={{ color: '#f00' }}>*</span>真实姓名</InputItem>
          </List>
          <List style={{ marginTop: '10px' }}>
            <InputItem
              style={{ borderBottom: '1px solid white' }}
              {...getFieldProps('username')}
              placeholder="请输入身份证号"
            ><span style={{ color: '#f00' }}>*</span>身份证</InputItem>
          </List>

          <div className="btn-container" style={{ marginTop: '10px', textAlign:'center' }}>
            <Link to="index/unbound">
              <Button
                className="btn" type="primary" inline onClick={() => {
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

const ApplyCardPart2Wrapper = createForm()(ApplyCardPart2);
export default ApplyCardPart2Wrapper;
