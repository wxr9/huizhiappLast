import { createForm } from 'rc-form';
import React from 'react';
import ChangePwdInner from '../../components/main/ChangePwd/ChangePwdInner';

// 修改密码
class ChangePwd extends React.Component {
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
