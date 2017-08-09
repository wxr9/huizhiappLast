import { createForm } from 'rc-form';
import React from 'react';
import RechargeThreePart1 from '../../components/card/RechargeThree/RechargeThreePart1';
import RechargeThreePart2 from '../../components/card/RechargeThree/RechargeThreePart2'
import autoLoginUtil from '../../utils/autoLoginUtil';
// 充值（第3步）
class RechargeThree extends React.Component {
  componentWillMount () {
    //判断登录是否超时
    autoLoginUtil();
  }
  render() {
    const { getFieldProps } = this.props.form;
    return (
      <div>
        <RechargeThreePart1/>
        <RechargeThreePart2/>
      </div>
    );
  }
}

const RechargeThreeWrapper = createForm()(RechargeThree);
export default RechargeThreeWrapper;
