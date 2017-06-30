import { Steps, WingBlank, WhiteSpace, List, Button, Tag } from 'antd-mobile';
import { createForm } from 'rc-form';
import React from 'react';
import { Link } from 'react-router';

const Step = Steps.Step;
const Item = List.Item;

// 充值
class Recharge extends React.Component {
  render() {
    const { getFieldProps } = this.props.form;
    const money = '475';
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
        <Steps current={0} direction="horizontal">{steps}</Steps>
        <List>
          <Item wrap>卡号：13265646469865321<br />金额：<span style={{ color: '#f00' }}>{money}元</span></Item>
        </List>
        <div className="tag-container">
          <WingBlank>
            <Tag ><b>50元</b></Tag>
            <Tag><b>100元</b><br />售价：95元</Tag>
            <Tag><b>200元</b><br />售价：190元</Tag>
            <Tag><b>500元</b><br />售价：475元</Tag>
          </WingBlank>
        </div>
        <div className="btn-container" style={{ marginTop: '10px' }}>
          <Link to="RechargeTwo">
            <Button
              className="btn" type="primary" onClick={() => {
            }}
              style={{
                background: '#259dda',
                fontSize: '1em',
              }}
            >下一步</Button>
          </Link>
        </div>
      </div>
    );
  }
}

const RechargeWrapper = createForm()(Recharge);
export default RechargeWrapper;
