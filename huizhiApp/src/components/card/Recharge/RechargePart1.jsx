import { Steps, WhiteSpace } from 'antd-mobile';
import { createForm } from 'rc-form';
import React from 'react';
import './recharge1.less';

const Step = Steps.Step;

// 充值
class RechargePart1 extends React.Component {
  render() {
    const { getFieldProps } = this.props.form;
    const num = 0;
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
        <Steps className="recharge-steps" current={num} direction="horizontal">{steps}</Steps>
      </div>
    );
  }
}

const RechargePart1Wrapper = createForm()(RechargePart1);
export default RechargePart1Wrapper;
