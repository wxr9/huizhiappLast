import { Steps, WhiteSpace } from 'antd-mobile';
import { createForm } from 'rc-form';
import React from 'react';
import './recharge3.less';
const Step = Steps.Step;

// 充值
class RechargeThreePart1 extends React.Component {
  render() {
    const { getFieldProps } = this.props.form;
    const num = 2;
    const steps = [{
      title: '金额',
      description: '金额描述',
    }, {
      title: '支付方式',
      description: '描述',
    }, {
      title: '支付成功',
      description: '描述',
    }].map((s, i) => <Step key={i} title={s.title} description={s.description} />);
    return (
      <div>
        <WhiteSpace />
        <Steps current={num} direction="horizontal">{steps}</Steps>
      </div>
    );
  }
}

const RechargeThreePart1Wrapper = createForm()(RechargeThreePart1);
export default RechargeThreePart1Wrapper;
