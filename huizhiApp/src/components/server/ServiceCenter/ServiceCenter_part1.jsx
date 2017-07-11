import React from 'react';
import { Link } from 'react-router';
import './server.less';

class ServiceCenter_part1 extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      url1: "index/propertyRepair",
      url2: "index/instruction",
      url3: "index/Bound",
      url4: "index/itRepair",
      url5: "Recharge",
      url6: "index/unbound",
    };
  }

  componentWillMount () {
    //缓存中无用户登录信息则需先登录
    if(sessionStorage.loginInfo == undefined) {
      //跳转登录界面
      var login = "login";
      this.setState({
        url1: login,
        url2: login,
        url3: login,
        url4: login,
        url5: login,
        url6: login
      })
    }else {
      var url3 =  "index/Bound";
      //从缓存中读取用户个人信息
      if(sessionStorage.userInfo != undefined){
        var userInfo = JSON.parse(sessionStorage.userInfo);
        var cardId = userInfo.cardid;

        if(cardId == "" || cardId.length == 0 || cardId == undefined){
          url3 = "index/unbound";
        }
      }
      this.setState({
        url3 : url3
      })
    }
  }

  render() {
    const { url1,url2,url3,url4,url5,url6 } = this.state;

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
          <Link to={url5}>
            <img
              className="server-right-image" src={require('../../../assets/service/service-p4.jpg')} alt="image"
              onClick={() => {
              }}
            />
          </Link>
          <Link to={url6}>
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

