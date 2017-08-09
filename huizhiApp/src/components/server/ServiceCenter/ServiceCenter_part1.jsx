import React from 'react';
import { Link } from 'react-router';
import { Modal } from 'antd-mobile';
import './server.less';

const alert = Modal.alert;

class ServiceCenter_part1 extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      url1: "index/propertyRepair",
      url2: "index/instruction",
      url3: "index/Bound",
      url4: "index/itRepair",
      url6: "index/pay",
    };
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

  componentWillMount () {
    //缓存中无用户登录信息则需先登录
    if(localStorage.loginInfo == undefined) {
      //跳转登录界面
      var login = "login";
      this.setState({
        url1: login+"?url=index/propertyRepair",
        url2: login+"?url=index/instruction",
        url3: login+"?url=index/Bound",
        url4: login+"?url=index/itRepair",
        url6: login+"?url=index/pay"
      })
    }else {
      var url3 =  "index/Bound";
      //从缓存中读取用户个人信息
      if(localStorage.userInfo != undefined){
        var userInfo = JSON.parse(localStorage.userInfo);
        var cardId = userInfo.cardid;

        if( cardId == null|| cardId == "" || cardId == undefined){
          url3 = "index/Bound";
        }
      }
      this.setState({
        url3 : url3
      })
    }
  }

  render() {
    const { url1,url2,url3,url4,url6 } = this.state;

    return (
      <div className="server-center-bg">
        {/* 左边部分*/}
        <div className="server-center-left">
          <Link to={url1}>
            <img
              className="server-left-image" src={require('../../../assets/service/service-p1.jpg')} alt="image"
              onClick={() => {
              }}
            />
          </Link>
          <Link to={url2}>
            <img
              className="server-left-image" src={require('../../../assets/service/service-p3.jpg')} alt="image"
              onClick={() => {
              }}
            />
          </Link>
          <Link to={url3}>
            <img
              className="server-left-image" src={require('../../../assets/service/service-p5.jpg')} alt="image"
              onClick={() => {
              }}
            />
          </Link>
        </div>

        {/* 右边部分*/}
        <div className="server-center-right">
          <Link to={url4}>
            <img
              className="server-right-image" src={require('../../../assets/service/service-p2.jpg')} alt="image"
              onClick={() => {
              }}
            />
          </Link>
          <Link onClick={() =>this.rechargeUrl()}>
            <img
              className="server-right-image" src={require('../../../assets/service/service-p4.jpg')} alt="image"
              onClick={() => {
              }}
            />
          </Link>
          <Link onClick={() =>this.payUrl()}>
            <img
              className="server-right-image" src={require('../../../assets/service/service-p6.jpg')} alt="image"
              onClick={() => {
              }}
            />
          </Link>
        </div>
      </div>
    );
  }
}
export default ServiceCenter_part1;

