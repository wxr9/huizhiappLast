import { WingBlank, List, Button, Radio, Modal, Toast } from 'antd-mobile';
import { createForm } from 'rc-form';
import React from 'react';
import { Link } from 'react-router';

import './recharge2.less';
import request from '../../../utils/requestGET';
import config from '../../../config';
import axios from 'axios';
import Qs from 'qs';

const RadioItem = Radio.RadioItem;
const alert = Modal.alert;

// 充值（第2步）
class RechargeTwoPart2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      RedPacketId:this.props.content.RedPacketId,
      reMoney:this.props.content.reMoney,
    }
  }
  onChange = (value) => {
    this.setState({
      value,
    });
  };
  onSubmit=()=>{
    //轻提示，1秒后消失
      console.log(this.state.RedPacketId);
      console.log(this.state.reMoney);
      //从缓存中读取
      var userInfo = localStorage.userInfo;
      //json转换为Object对象
      var userData = JSON.parse(userInfo);
      //解绑的post请求参数
      var rechargeData = {
        cardNo: userData.cardid,
        memberNo: userData.username,
        orderAmtCount: this.state.RedPacketId,
        orderAmt: this.state.reMoney,
        extend: 'app',
      };
      Toast.loading('提交中...', 0);
      //post请求
      axios.post(config.recharge, Qs.stringify(rechargeData)).then(function (response) {
        var reData = response.data;
        console.log(reData);
        // alert(reData.msg);
        console.log(reData.url);
        if (reData.msg === "成功") {//成功
          console.log("成功！");
          Toast.hide();
          //跳转页面
          window.location.href = reData.url;
        } else {
          Toast.hide();
          alert(reData.msg);
        }
      });
  }
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
        <WingBlank className="recharge-wingBlank">
          <List renderHeader={() => '请选择支付方式'} className="my-list">
            <div>
              {data}
            </div>
          </List>
        </WingBlank>
        <div className="btn-container">
          {/*<Link to="RechargeThree">*/}
            <WingBlank>
                <Button
                  className="recharge-btn-next" type="primary" onClick={this.onSubmit} inline
                >确定</Button>
            </WingBlank>
          {/*</Link>*/}
        </div>
      </div>
    );
  }
}

const RechargeTwoPart2Wrapper = createForm()(RechargeTwoPart2);
export default RechargeTwoPart2Wrapper;
