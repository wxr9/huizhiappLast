import { createForm } from 'rc-form';
import React from 'react';
import RechargeTwoPart1 from '../../components/card/RechargeTwo/RechargeTwoPart1';
import RechargeTwoPart2 from '../../components/card/RechargeTwo/RechargeTwoPart2';

// 充值（第2步）
class RechargeTwo extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props.location.query);
  }

  render() {
    const { getFieldProps } = this.props.form;
    return (
      <div>
        <RechargeTwoPart1/>
        <RechargeTwoPart2/>
      </div>
    );
  }
}

const RechargeTwoWrapper = createForm()(RechargeTwo);
export default RechargeTwoWrapper;
