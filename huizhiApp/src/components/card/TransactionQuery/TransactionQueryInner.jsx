import {Table, WingBlank, Card, List, Tabs, Modal, Toast } from 'antd-mobile';
import {createForm} from 'rc-form';
import React from 'react';
import './TransactionQueryInner.less';
import config from '../../../config';
import request from '../../../utils/requestPOST';
import requestGet from '../../../utils/requestGET';

const alert = Modal.alert;
var tabNO = '02';
// 交易明细
class TransactionQueryInner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal1: false,
      hasResult:true,
      queryList: [],
      mainAccount_border:'none',
      recharge_border:'none',
      ele_border:'none',
      online_border:'none',
      mainAccount_color:'#333',
      recharge_color:'#333',
      ele_color:'#333',
      online_color:'#333'
      // mainCountRechargeList: [],
      // eWalletList: [],
    };
  }
  changeTab(tabNo){
    if(tabNo=="02"){
      this.setState({
        mainAccount_border:'4px solid #259dda',
        mainAccount_color:'#259dda',
        recharge_border:'none',
        ele_border:'none',
        online_border:'none',
        recharge_color:'#333',
        ele_color:'#333',
        online_color:'#333',
      });
      tabNO = tabNo;
      this.getTranContent(tabNo);
    }else if(tabNo=="01"){
      this.setState({
        recharge_border:'4px solid #259dda',
        recharge_color:'#259dda',
        mainAccount_border:'none',
        ele_border:'none',
        online_border:'none',
        mainAccount_color:'#333',
        ele_color:'#333',
        online_color:'#333'
      });
      tabNO = tabNo;
      this.getTranContent(tabNo);
    }else if(tabNo=="07"){
      this.setState({
        mainAccount_border:'none',
        mainAccount_color:'#333',
        recharge_border:'none',
        ele_border:'4px solid #259dda',
        online_border:'none',
        recharge_color:'#333',
        ele_color:'#259dda',
        online_color:'#333'
      });
      tabNO = tabNo;
      this.getTranContent(tabNo);
    }else if(tabNo=="00"){
      this.setState({
        mainAccount_border:'none',
        mainAccount_color:'#333',
        recharge_border:'none',
        ele_border:'none',
        online_border:'4px solid #259dda',
        recharge_color:'#333',
        ele_color:'#333',
        online_color:'#259dda',
      });
      tabNO = tabNo;
      this.getPayLog();
    }
  }
//交易明细查询之在线充值查询
  getPayLog(){
    //轻提示
    Toast.loading('加载中...', 0);
    requestGet(config.onlinePayLogUrl).then((data) => {
      console.log(data);
      if(data.total>0){
        for(var i = 0;i<data.result.length;i++){
          if(data.result[i].type=='1'){
            data.result[i].type = '充值成功';
          }
        }
        //关闭轻提示
        Toast.hide();
        this.setState({
          queryList: data.result,
          hasResult: true,
        });

      }else {
        //关闭轻提示
        Toast.hide();
        this.setState({
          hasResult:false,
        });
        alert("无记录！");
      }
    });
  }

  //交易明细查询前三项
  getTranContent(tabNo){
    //轻提示
    Toast.loading('加载中...', 0);
    //从缓存中读取
    var userInfo = localStorage.userInfo;
    //json转换为Object对象
    var userData = JSON.parse(userInfo);
    var mainCountData = {
      startDate: '',
      cardNo: userData.cardid,
      endDate:'',
      memberNo:userData.username,
      merchantNo: "000006666666666",
      queryNum:'',
      tranType:tabNo
    };
    request(config.queryTransDetails,mainCountData).then((data) => {//从配置文件中读取url
      console.log("queryTransDetails response",data);
      // var reData = response.data;
      if(data.msg==='成功'){
        for(var i=0;i< data.details.length;i++){
          if(data.details[i].tranType=='02'){
            data.details[i].tranType = '圈存';
          }else if(data.details[i].tranType=='01'){
            data.details[i].tranType = '充值';
          }else if(data.details[i].tranType=='07'){
            data.details[i].tranType = '电子钱包脱机消费';
          }
        }
        //关闭轻提示
        Toast.hide();
        // setTimeout(()=>{
          this.setState({
            queryList: data.details,
            hasResult: true,
          });
        // },500);
      }else{
        //关闭轻提示
        Toast.hide();
        this.setState({
          hasResult: false,
        });
        alert(data.msg);
      }
    });
  }

  componentWillMount () {
    this.changeTab('02');
  }
  render() {
    var tranQueryContent;
    if(this.state.hasResult){
      if(tabNO=='00'){
        tranQueryContent = this.state.queryList.map((s) => <Card>
          <List className="transaction-list">
            <p>订单号 : {s.orderNo}</p>
            <p>汇智卡号 : {s.cardNo}</p>
            <p>交易金额 : {s.orderAmt}</p>
            <p>充值时间 : {s.tranTime}</p>
            <p>交易状态 : {s.type}</p>
          </List>
        </Card>);
      }else{
        tranQueryContent = this.state.queryList.map((s) => <Card>
          <List className="transaction-list">
            <p>流 水 号 : {s.tranNo}</p>
            <p>交易时间 : {s.tranDate}</p>
            <p>交易金额 : {s.tranAmount}</p>
            <p>交易类型 : {s.tranType}</p>
            <p>商户名称 : {s.merchantName}</p>
          </List>
        </Card>);
      }
    }else{
      tranQueryContent = "暂无此记录！";
    }


    return (
      <div>
        <div className="transaction_line">
          <div className="transaction_detail"
               style={{borderBottom:this.state.mainAccount_border,color:this.state.mainAccount_color}}
               onClick={() =>this.changeTab('02')}>主账户记录</div>
          <div className="transaction_detail"
               style={{borderBottom:this.state.recharge_border,color:this.state.recharge_color}}
               onClick={() =>this.changeTab('01')}>充值记录</div>
          <div className="transaction_detail"
               style={{borderBottom:this.state.ele_border,color:this.state.ele_color}}
               onClick={() =>this.changeTab('07')}>电子钱包</div>
          <div className="transaction_detail"
               style={{borderBottom:this.state.online_border,color:this.state.online_color}}
               onClick={() =>this.changeTab('00')}>在线充值</div>
        </div>
        <div className="transaction-wingBlank-tab">
            { tranQueryContent }
            <span className="transaction_tishi">*交易记录为近期30笔交易</span>
        </div>
      </div>
    );
  }
}

const TransactionQueryInnerWrapper = createForm()(TransactionQueryInner);
export default TransactionQueryInnerWrapper;
