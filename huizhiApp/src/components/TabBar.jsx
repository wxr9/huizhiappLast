import React from 'react';
import { Tabs, Icon, TabBar, Modal } from 'antd-mobile';
import { Link } from 'react-router';
import getUserInfo from '../utils/getUserInfo';
import requestGET from '../utils/requestGET';
import config from '../config';

const TabPane = Tabs.TabPane;
const alert = Modal.alert;

function callback(key) {
}

class Text extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      url1: "index/MyXiaozhi",
      url2:"index/pay",
      key:"1"
    };

  }

  componentWillMount () {
    //获取用户的个人信息并存入缓存
    requestGET(config.userInfoUrl).then((data) => {//从配置文件中读取url
      var userInfo = JSON.stringify(data);
      localStorage.userInfo = userInfo;//个人信息存入缓存
      //从缓存中读取用户个人信息
      if(localStorage.userInfo){
        var userInfo = JSON.parse(localStorage.userInfo);
        this.setState({
          userInfo: userInfo
        });
      }
    });
    if(this.props.location.pathname=="/index/Index"){
      this.setState({
        key :"1"
      });
    }else if(this.props.location.pathname=="/index/service"){
      this.setState({
        key : "2"
      })
    }else if(this.props.location.pathname=="/index/ActiveCenter"){
      this.setState({
        key : "3"
      })
    }else if(this.props.location.pathname=="/index/MyXiaozhi"){
      this.setState({
        key : "4"
      })
    }else if(this.props.location.pathname=="/index/pay"){
      this.setState({
        key : "5"
      })
    }
    //缓存中无用户登录信息则需先登录
    if(localStorage.loginInfo == undefined) {
      //跳转登录界面
      var login = "login";
      this.setState({
        url1: login+"?url=index/MyXiaozhi",
        url2:login+"?url=index/Index",
      })
    }else {
      var url1 =  "index/MyXiaozhi";
      //从缓存中读取用户个人信息
      // if(localStorage.userInfo != undefined){
      //   var userInfo = JSON.parse(localStorage.userInfo);
      //   var cardId = userInfo.cardid;
      //
      //   if( cardId == null|| cardId == "" || cardId == undefined){
      //     url1 = "index/unbound";
      //   }
      // }
      this.setState({
        url1 : url1
      })
    }
  }

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
    const { url1,url2 } = this.state;
    return (
      <div className="nav-tab">
        <Tabs
          defaultActiveKey= {this.state.key} animated={false} onChange={callback}
          style={{
            backgroundColor: 'white',
            position: 'fixed',
            width: '100%',
            bottom: '0',
            height: '1.2rem',
            fontSize: '20px',
            zIndex: '100',
            // borderTop: '1px solid #979797',
          }}
        >
          <TabPane
            tab={
              <Link className="tabSelect" to="index/Index">
                <Icon type={require('../assets/home/first.svg')} className="tabSelect-icon" />
                <div >首页</div>
              </Link>
            } key="1"
          />

          <TabPane
            tab={
              <Link className="tabSelect" to="index/service">
                <Icon type={require('../assets/home/server.svg')} className="tabSelect-icon" />
                <div >服务中心</div>
              </Link>
            } key="2"
          />


          <TabPane
            tab={
              <Link className="tabSelect" to="index/ActiveCenter">
                <Icon type={require('../assets/home/active.svg')} className="tabSelect-icon" />
                <div >活动中心</div>
              </Link>} key="3"
          />
          <TabPane
            tab={
              <Link className="tabSelect" to={url1}>
                <Icon type={require('../assets/home/myxz.svg')} className="tabSelect-icon"  />
                <div >我的小智</div>
              </Link>} key="4"
          />
          <TabPane
            tab={
              <Link className="tabSelect" onClick={() =>this.payUrl()}>
                <Icon type={require('../assets/home/scan.svg')} className="tabSelect-icon" />
                <div >扫码支付</div>
              </Link>} key="5"
          />
        </Tabs>
      </div>
    );
  }
}
export default Text;
