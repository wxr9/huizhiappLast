import { createForm } from 'rc-form';
import React from 'react';
import RegisterOneInner from '../../components/main/RegisterStepOne/RegisterStepOneInner';

// 注册（步骤一）
class RegisterStepOne extends React.Component {
  render() {
    const { getFieldProps } = this.props.form;
    return (
      <div>
        <RegisterOneInner/>
      </div>
    );
  }
}

const RegisterStepOneWrapper = createForm()(RegisterStepOne);
export default RegisterStepOneWrapper;
