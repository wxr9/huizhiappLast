import { createForm } from 'rc-form';
import React from 'react';
import RegisterTwoInner from '../../components/main/RegisterStepTwo/RegisterStepTwoInner';

// 注册（步骤二）
class RegisterStepTwo extends React.Component {
  render() {
    const { getFieldProps } = this.props.form;
    return (
      <div>
        <RegisterTwoInner/>
      </div>
    );
  }
}

const RegisterStepTwoWrapper = createForm()(RegisterStepTwo);
export default RegisterStepTwoWrapper;
