import { createForm } from 'rc-form';
import React from 'react';
import ChangePhoneNoInner from '../../components/user/ChangePhoneNo/ChangePhoneNoInner';

// 联系方式修改
class ChangePhoneNo extends React.Component {
  render() {
    const { getFieldProps } = this.props.form;
    return (
      <div>
        <ChangePhoneNoInner/>
      </div>
    );
  }
}

const ChangePhoneNoWrapper = createForm()(ChangePhoneNo);
export default ChangePhoneNoWrapper;
