import { Steps, WingBlank, WhiteSpace, List, Button, Radio } from 'antd-mobile';
import { createForm } from 'rc-form';
import React from 'react';
import { Link } from 'react-router';

const Step = Steps.Step;
const RadioItem = Radio.RadioItem;

// 充值（第2步）
class RechargeTwo extends React.Component {
  state = {
    value: 0,
    value2: 0,
    value3: 0,
    value4: 0,
  };
  onChange = (value) => {
    console.log('checkbox');
    this.setState({
      value,
    });
  };
  render() {
    const { getFieldProps } = this.props.form;
    const { value, value2, value3, value4 } = this.state;
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
    const data = [
      { value: 0, label: '银行卡支付' },
      { value: 1, label: '支付宝支付' },
      { value: 2, label: '微信支付' },
    ].map(i => (
      <RadioItem key={i.value} checked={value === i.value} onChange={() => this.onChange(i.value)}>
        {i.label}
      </RadioItem>
    ));
    return (
      <div>
        <WhiteSpace />
        <Steps current={1} direction="horizontal">{steps}</Steps>
        <WingBlank>
          <List renderHeader={() => '请选择支付方式'} className="my-list">
            <div>
              {data}
            </div>
          </List>
        </WingBlank>
        <div className="btn-container" style={{ marginTop: '10px' }}>
          <Link to="RechargeThree">
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

const RechargeTwoWrapper = createForm()(RechargeTwo);
export default RechargeTwoWrapper;
