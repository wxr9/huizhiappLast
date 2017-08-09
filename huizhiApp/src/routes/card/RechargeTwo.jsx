import { createForm } from 'rc-form';
import React from 'react';
import RechargeTwoPart1 from '../../components/card/RechargeTwo/RechargeTwoPart1';
import RechargeTwoPart2 from '../../components/card/RechargeTwo/RechargeTwoPart2';
import autoLoginUtil from '../../utils/autoLoginUtil';
// 充值（第2步）
class RechargeTwo extends React.Component {
  componentWillMount () {
    //判断登录是否超时
    autoLoginUtil();
  }
  constructor(props) {
    super(props);
    console.log(this.props.location.query);
    this.state={
      RedPacketId:this.props.location.query.RedPacketId,
      reMoney:this.props.location.query.reMoney,
    }
  }

  render() {
    const { getFieldProps } = this.props.form;
    return (
      <div>
        <RechargeTwoPart1/>
        <RechargeTwoPart2 content={this.state}/>
      </div>
    );
  }
}

const RechargeTwoWrapper = createForm()(RechargeTwo);
export default RechargeTwoWrapper;
