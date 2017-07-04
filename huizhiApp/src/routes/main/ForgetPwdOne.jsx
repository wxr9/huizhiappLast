import { createForm } from 'rc-form';
import React from 'react';
import ForgetPwdOneInner from '../../components/main/ForgetPwdOne/ForgetPwdOneInner';

// 忘记密码（步骤一）
class ForgetPwdOne extends React.Component {
  render() {
    const { getFieldProps } = this.props.form;
    return (
      <div>
        <ForgetPwdOneInner/>
      </div>
    );
  }
}

const ForgetPwdOneWrapper = createForm()(ForgetPwdOne);
export default ForgetPwdOneWrapper;
