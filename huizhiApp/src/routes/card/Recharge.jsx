import { createForm } from 'rc-form';
import React from 'react';
import RechargePart1 from '../../components/card/Recharge/RechargePart1';
import RechargePart2 from '../../components/card/Recharge/RechargePart2';

// 充值
class Recharge extends React.Component {
  render() {
    const { getFieldProps } = this.props.form;
    return (
      <div>
        <RechargePart1 {...this.props} />
        <RechargePart2 {...this.props} />
      </div>
    );
  }
}

const RechargeWrapper = createForm()(Recharge);
export default RechargeWrapper;
