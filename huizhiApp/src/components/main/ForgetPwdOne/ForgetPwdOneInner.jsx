import {List, InputItem, WingBlank, Button} from 'antd-mobile';
import {createForm} from 'rc-form';
import React from 'react';
import {Link} from 'react-router';
import '../RegisterStepOne/register.less';

// 忘记密码（步骤一）页内部组件
class ForgetPwdOneInner extends React.Component {
  render() {
    const {getFieldProps} = this.props.form;
    return (
      <div>
        <List className="register-as-list">
          <InputItem className="register-list-item"
                     {...getFieldProps('phoneNo')}
                     placeholder="请输入手机号"
          />
        </List>
        <Button
          className="forget-btn-getCode" type="primary" inline size="small" onClick={() => {
        }}
        >获取验证码</Button>
        <List className="register-input-code">
          <InputItem className="register-list-item"
                     {...getFieldProps('code')}
                     placeholder="请输入验证码"
          />
        </List>
        <WingBlank>
          <div className="btn-container">
            <Link to="ForgetPwdTwo">
              <Button
                className="btn-next-step" type="primary" onClick={() => {
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
