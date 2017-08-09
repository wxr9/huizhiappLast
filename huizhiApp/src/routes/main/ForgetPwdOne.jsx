import { createForm } from 'rc-form';
import React from 'react';
import ForgetPwdOneInner from '../../components/main/ForgetPwdOne/ForgetPwdOneInner';
// import autoLoginUtil from '../../utils/autoLoginUtil';
// 忘记密码（步骤一）
class ForgetPwdOne extends React.Component {
  /*在未登录的时候操作忘记密码，不能提示登录超时*/
  // componentWillMount () {
  //   //判断登录是否超时
  //   autoLoginUtil();
  // }
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
