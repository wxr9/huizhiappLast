import { WingBlank, List, Button, Radio } from 'antd-mobile';
import { createForm } from 'rc-form';
import React from 'react';
import { Link } from 'react-router';

const RadioItem = Radio.RadioItem;

// 充值（第2步）
class RechargeTwoPart2 extends React.Component {
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
    const { value } = this.state;
    const data = [
      { value: 0, label: '银行卡支付' },
    ].map(i => (
      <RadioItem key={i.value} checked={value === i.value} onChange={() => this.onChange(i.value)}>
        {i.label}
      </RadioItem>
    ));
    return (
      <div>
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

const RechargeTwoPart2Wrapper = createForm()(RechargeTwoPart2);
export default RechargeTwoPart2Wrapper;
