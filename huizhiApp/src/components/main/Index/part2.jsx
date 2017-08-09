import React from 'react';
import {Link} from 'react-router';
import { Carousel, WhiteSpace, WingBlank,Icon,Modal } from 'antd-mobile';

const alert = Modal.alert;
import './index.less'
/**
 * 首页第二部分--九宫格
 */
class part2 extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      url2: "index/Bound",
      url3: "index/pay",
      url4: "index/propertyRepair",
      url5: "index/itRepair",
      url6: "index/instruction",
      url7: "login",
      isBlock:""
    };
  }
  componentWillMount () {
    //缓存中无用户登录信息则需先登录
    if(localStorage.loginInfo == undefined) {
      //跳转登录界面
      var login = "login";
      this.setState({
        url2: login+"?url=index/Bound",
        url3: login+"?url=index/pay",
        url4: login+"?url=index/propertyRepair",
        url5: login+"?url=index/itRepair",
        url6: login+"?url=index/instruction",
        url7: login
      })
    }else {
      var url2 =  "index/Bound";
      //从缓存中读取用户个人信息
      if(localStorage.userInfo != undefined){
        var userInfo = JSON.parse(localStorage.userInfo);
        var cardId = userInfo.cardid;
        this.setState({
          isBlock:'none'
        });
        if( cardId == null|| cardId == "" || cardId == undefined){
          url2 = "index/Bound";
        }
      }
      this.setState({
        url2 : url2
      })
    }
  }

  rechargeUrl= () =>{
      if(localStorage.loginInfo === undefined) {
        //跳转登录界面
        window.location.href = "#login"
      }else if(localStorage.userInfo !== undefined){
        let userInfo = JSON.parse(localStorage.userInfo);
        let cardId = userInfo.cardid;
        if( cardId === null|| cardId === "" || cardId === undefined){
          alert("未绑卡，请先绑卡！","要去绑卡吗？", [
            { text: '去绑卡', onPress: () => window.location.href = "#index/Bound" },
            { text: '取消', onPress: () => console.log('cancel') },
          ]);
        }else{
          window.location.href = "#Recharge"
        }
      }
  };
  payUrl= () =>{
    if(localStorage.loginInfo === undefined) {
      //跳转登录界面
      window.location.href = "#login"
    }else if(localStorage.userInfo !== undefined){
      let userInfo = JSON.parse(localStorage.userInfo);
      let cardId = userInfo.cardid;
      if( cardId === null|| cardId === "" || cardId === undefined){
        alert("未绑卡，请先绑卡！","要去绑卡吗？", [
          { text: '去绑卡', onPress: () => window.location.href = "#index/Bound" },
          { text: '取消', onPress: () => console.log('cancel') },
        ]);
      }else{
        window.location.href = "#index/pay"
      }
    }
  };

  render() {
    const { url2,url3,url4,url5,url6,url7} = this.state;
    return (
      <div className="index_par2_div">
        <li>
          <Link className="index_link" onClick={() =>this.rechargeUrl()}>
            <Icon type={require('../../../assets/home/home-recharge.svg')} className="index_Icon"/>
            <p>充值</p>
          </Link>
        </li>
        <li>
          <Link className="index_link" to={url2}>
            <Icon type={require('../../../assets/home/home-balance.svg')} className="index_Icon"/>
            <p>余额查询</p>
          </Link>
        </li>
        <li>
          <Link className="index_link" onClick={() =>this.payUrl()}>
            <Icon type={require('../../../assets/home/home-payment.svg')} className="index_Icon"/>
            <p>扫码付款</p>
          </Link>
        </li>
        <li>
          <Link className="index_link" to={url4}>
            <Icon type={require('../../../assets/home/home-repair.svg')} className="index_Icon"/>
            <p>物业报修</p>
          </Link>
        </li>
        <li>
          <Link className="index_link" to={url5}>
            <Icon type={require('../../../assets/home/home-itrepair.svg')} className="index_Icon"/>
            <p>IT报修</p>
          </Link>
        </li>
        <li>
          <Link className="index_link" to={url6}>
            <Icon type={require('../../../assets/home/home-ship.svg')}  className="index_Icon"/>
            <p>游船预约</p>
          </Link>
        </li>
        <li>
          <Link className="index_link" to={url7} style={{display:this.state.isBlock}}>
            <Icon type={require('../../../assets/home/home-login.svg')} className="index_Icon"/>
            <p>登录</p>
          </Link>
        </li>
      </div>
    );
  }
}

export default part2;
