import { List, InputItem, WhiteSpace, WingBlank, Checkbox, Toast, Card, Button } from 'antd-mobile';
import { createForm } from 'rc-form';
import React from 'react';
import { Link } from 'react-router';
import {Icon} from 'antd';

const AgreeItem = Checkbox.AgreeItem;

// 申请汇智卡
class ApplyCard extends React.Component {
  render() {
    const { getFieldProps } = this.props.form;
    return (
      <div>
        <WhiteSpace size="lg" />
        <WingBlank>
          <Card>
            <Card.Body>
              <p>
                <b>个人汇智卡配置须知</b><br />
                1.领取汇智卡时需要提交汇智卡办理证明纸质版并加盖公司公章（个人信息须正确）。<br />
                2.办卡工本费现金人民币20元/张（工本费不退）。
              </p>
            </Card.Body>
          </Card>
          <AgreeItem>同意须知</AgreeItem>
        </WingBlank>
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

const ApplyCardWrapper = createForm()(ApplyCard);
export default ApplyCardWrapper;
