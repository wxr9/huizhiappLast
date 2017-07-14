import {WingBlank, SegmentedControl, Checkbox, Picker, List, Button, Tag} from 'antd-mobile';
import {createForm} from 'rc-form';
import React from 'react';
import {Link} from 'react-router';

import './recharge1.less';
import request from '../../../utils/request';
import config from '../../../config';
const Item = List.Item;
const AgreeItem = Checkbox.AgreeItem;

// var money = 50;
//折扣金额
var discount = 0;
const hongbao = [
  {
    label: '49.7元（2017-7-20到期）',
    value: 49.7,
  },
  {
    label: '86.7元（2017-7-20到期）',
    value: 86.7,
  }
];
// 充值
class RechargePart2 extends React.Component {
  state = {
    checked: false,
    disabled: false,
    money : 50,
    reMoney:50,
    selectedIndex:0
  }

  onChange = (e) => {
    var selectedIndex = e.nativeEvent.selectedSegmentIndex;
    this.setState({
      selectedIndex: selectedIndex
    })
  }

  //金额选择后将支付的实际金额改变
  onValueChange = (value) => {
    var money = 0;
    var reMoney = parseInt(value.trim().substring(1,value.length));
    money = (reMoney * 100 - discount * 100) / 100;
    this.setState({
      reMoney: reMoney,
      money:money
    })
  }
  //使用红包的checkbox
  useHongbao(e) {
    if (e.target.checked) {
      this.state.disabled = false;
      console.log("使用红包" + this.state.disabled);
    } else {
      this.state.disabled = true;
      console.log(this.state.disabled);
    }
  }
//选择器点击确定
  onOk(e) {
    discount = e;
    var actMoney = (this.state.reMoney*100-discount*100)/100;
    this.setState({
      money: actMoney
    })
  }


  render() {
    const {getFieldProps} = this.props.form;
    const {money,selectedIndex} = this.state;

    //选择红包金额
    const rechanrgeMoneys = ['￥50', '￥100', '￥200', '￥500'];
	//红包列表
    const hongbao = [
      {
        label: '49.7元（2017-7-20到期）',
        value: 49.7,
      },
      {
        label: '86.7元（2017-7-20到期）',
        value: 86.7,
      }
    ];
    return (
      <form>
        <WingBlank className="recharge-wingBlank">
          <div className="recharge-wingBlank-card">用户名：</div>
          <List>
            <Item className="recharge-list-item" disabled="true">ptyh</Item>
          </List>
          <div>充值金额：</div>
          <SegmentedControl className="recharge-segment"
                            selectedIndex={selectedIndex}
                            values={rechanrgeMoneys}
                            onChange={this.onChange}
                            onValueChange={this.onValueChange}
          />
          <AgreeItem className="recharge-checkbox-agree"
                     data-seed="logId"
                     onChange={(e) => this.useHongbao(e)}>
            使用红包
          </AgreeItem>
          <Picker
            disabled={this.state.disabled}
            data={hongbao}
            cols={1}
            onOk={(e) => this.onOk(e)}
            {...getFieldProps('district3')}
            className="forss">
            <List.Item className="recharge-list-item" arrow="horizontal">选择红包</List.Item>
          </Picker>
          <div className="recharge-wingBlank-money">实际金额：{money}元</div>
        </WingBlank>
        <div className="recharge-btn-container">
          <Link to={{pathname:"RechargeTwo",query:{money:money,hongbao:hongbao}}}>
            <WingBlank>
                <Button
                  className="recharge-btn-next" type="primary" onClick={this.onSubmit} inline
                >下一步</Button>
            </WingBlank>
          </Link>
        </div>
      </form>
    );
  }
}
const RechargePart2Wrapper = createForm()(RechargePart2);
export default RechargePart2Wrapper;
