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
          <List className="ApplyCard_List">
            <InputItem
              className="ApplyCard_InputItem"
              {...getFieldProps('username')}
              placeholder="请输入用户名"
            ><span className="ApplyCard_label_color">*</span> 申请人</InputItem>
          </List>
          <List className="ApplyCard_List">
            <InputItem
              className="ApplyCard_InputItem"
              {...getFieldProps('username')}
              placeholder="请输入邮箱"
            ><span className="ApplyCard_label_color">*</span> E-mail</InputItem>
          </List>
          <List className="ApplyCard_List">
            <InputItem
              className="ApplyCard_InputItem"
              {...getFieldProps('username')}
              placeholder="请输入公司名称"
            ><span className="ApplyCard_label_color">*</span> 公司名称</InputItem>
          </List>
          <List className="ApplyCard_List">
            <InputItem
              className="ApplyCard_InputItem"
              {...getFieldProps('username')}
              placeholder="请输入手机号"
            ><span className="ApplyCard_label_color">*</span> 联系方式</InputItem>
          </List>
          <List className="ApplyCard_List">
            <InputItem
              className="ApplyCard_InputItem"
              {...getFieldProps('username')}
              placeholder="请输入真实姓名"
            ><span className="ApplyCard_label_color">*</span> 真实姓名</InputItem>
          </List>
          <List className="ApplyCard_List">
            <InputItem
              className="ApplyCard_InputItem"
              {...getFieldProps('username')}
              placeholder="请输入身份证号"
            ><span className="ApplyCard_label_color">*</span> 身份证</InputItem>
          </List>

          <div className="ApplyCard_div_btn">
            <Link to="index/unbound">
              <Button
                className="ApplyCard_btn" type="primary" inline onClick={() => {
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
