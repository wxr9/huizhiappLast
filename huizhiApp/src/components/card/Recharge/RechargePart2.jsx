import { WingBlank, SegmentedControl, Checkbox, Picker, List, Button, Tag } from 'antd-mobile';
import { createForm } from 'rc-form';
import React from 'react';
import { Link } from 'react-router';

const Item = List.Item;
const AgreeItem = Checkbox.AgreeItem;

var money = 50;
const hongbao = [
  {
    label: '49.7元（2017-7-20到期）',
    value: '49.7',
  },
  {
    label: '86.7元（2017-7-20到期）',
    value: '86.7',
  }
];

// 充值
class RechargePart2 extends React.Component {
  onValueChange = (value) => {
    if (value=='￥50'){
      money = 50;
    }else if (value=='￥100'){
      money = 100;
    }else if (value=='￥200'){
      money = 200;
    }else{
      money = 500;
    }
    console.log(money);
  }
  useHongbao(){

  }
  render() {
    const { getFieldProps } = this.props.form;
    return (
      <div>
        <WingBlank style={{marginTop:'10px'}}>
          <div>用户名：</div>
          <List>
            <Item disabled="true">ptyh</Item>
          </List>
          <div>充值金额：</div>
          <SegmentedControl
            values={['￥50', '￥100', '￥200', '￥500']}
            style={{ height: '0.8rem'}}
            onValueChange={this.onValueChange}
          />
          <AgreeItem data-seed="logId" onChange={this.useHongbao()}>
            使用红包
          </AgreeItem>
          <Picker disabled={false} data={hongbao} cols={1} {...getFieldProps('district3')} className="forss">
            <List.Item arrow="horizontal">选择红包（单列）</List.Item>
          </Picker>
          <div>实际金额：{money}元</div>
        </WingBlank>
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

const RechargePart2Wrapper = createForm()(RechargePart2);
export default RechargePart2Wrapper;
