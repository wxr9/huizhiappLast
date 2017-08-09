import { createForm } from 'rc-form';
import React from 'react';
import ChangePwdInner from '../../components/main/ChangePwd/ChangePwdInner';
import autoLoginUtil from '../../utils/autoLoginUtil';
// 修改密码
class ChangePwd extends React.Component {
  componentWillMount () {
    //判断登录是否超时
    autoLoginUtil();
  }
  render() {
    const { getFieldProps } = this.props.form;
    return (
      <div>
        <ChangePwdInner/>
      </div>
    );
  }
}

const ChangePwdWrapper = createForm()(ChangePwd);
export default ChangePwdWrapper;
