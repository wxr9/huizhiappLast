import { Steps, WhiteSpace } from 'antd-mobile';
import { createForm } from 'rc-form';
import React from 'react';
import './recharge2.less';
const Step = Steps.Step;
import { Link } from 'react-router'
import '../Recharge/RechargePart2';
// 充值
class RechargeTwoPart1 extends React.Component {

  render() {
    const { getFieldProps } = this.props.form;
    const num = 1;
    const steps = [{
      title: '金额',
      // description: '金额描述',
    }, {
      title: '支付方式',
      // description: '描述',
    }, {
      title: '支付成功',
      // description: '描述',
    }].map((s, i) => <Step key={i} title={s.title} description={s.description} />);
    return (
      <div>
        <WhiteSpace />
        <Steps current={num} direction="horizontal">{steps}</Steps>
      </div>
    );
  }
}
const RechargeTwoPart1Wrapper = createForm()(RechargeTwoPart1);
export default RechargeTwoPart1Wrapper;
