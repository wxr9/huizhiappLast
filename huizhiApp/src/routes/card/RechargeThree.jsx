import { Steps, WingBlank, WhiteSpace, List, Button, Radio } from 'antd-mobile';
import { createForm } from 'rc-form';
import React from 'react';
import { Link } from 'react-router';

const Step = Steps.Step;

// 充值（第3步）
class RechargeThree extends React.Component {
  render() {
    const { getFieldProps } = this.props.form;
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
        <Steps current={2} direction="horizontal">{steps}</Steps>
        <div className="btn-container" style={{ marginTop: '10px' }}>
          <Link to="/index/MyXiaozhi">
            <Button
              className="btn" type="primary" onClick={() => {
              }}
              style={{
                background: '#259dda',
                fontSize: '1em',
              }}
            >确定</Button>
          </Link>
        </div>
      </div>
    );
  }
}

const RechargeThreeWrapper = createForm()(RechargeThree);
export default RechargeThreeWrapper;
