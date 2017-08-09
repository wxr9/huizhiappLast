import { createForm } from 'rc-form';
import React from 'react';
import ForgetPwdTwoInner from '../../components/main/ForgetPwdTwo/ForgetPwdTwoInner';
// import autoLoginUtil from '../../utils/autoLoginUtil';
// 忘记密码（步骤二）
class ForgetPwdTwo extends React.Component {

  /*在未登录的时候操作忘记密码，不能提示登录超时*/
  // componentWillMount () {
  //   //判断登录是否超时
  //   autoLoginUtil();
  // }
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
