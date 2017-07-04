import { createForm } from 'rc-form';
import React from 'react';
import ForgetPwdTwoInner from '../../components/main/ForgetPwdTwo/ForgetPwdTwoInner';

// 忘记密码（步骤二）
class ForgetPwdTwo extends React.Component {
  render() {
    const { getFieldProps } = this.props.form;
    return (
      <div>
        <ForgetPwdTwoInner/>
      </div>
    );
  }
}

const ForgetPwdTwoWrapper = createForm()(ForgetPwdTwo);
export default ForgetPwdTwoWrapper;
