import React from 'react';
import { Tabs,Icon} from 'antd-mobile';
import { Link } from 'react-router';

const TabPane = Tabs.TabPane;

function callback(key) {
  console.log(key);
}

class Text extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      url1: "index/MyXiaozhi",
      url2:"index/pay",
    };
  }

  componentWillMount () {
    //缓存中无用户登录信息则需先登录
    if(sessionStorage.loginInfo == undefined) {
      //跳转登录界面
      var login = "login";
      this.setState({
        url1: login,
        url2:login,
      })
    }else {
      var url1 =  "index/MyXiaozhi";
      //从缓存中读取用户个人信息
      if(sessionStorage.userInfo != undefined){
        var userInfo = JSON.parse(sessionStorage.userInfo);
        var cardId = userInfo.cardid;

        if( cardId == null|| cardId == "" || cardId == undefined){
          url1 = "index/unbound";
        }
      }
      this.setState({
        url1 : url1
      })
    }
  }

  render() {
    const { url1,url2 } = this.state;
    return (
      <div className="nav-tab">
        <Tabs
          defaultActiveKey="1" animated={false} onChange={callback}
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
                {/*// TODO-ICON*/}
                <Icon type={require('../assets/home/first.svg')} className="tabSelect-icon" />
                {/*<img src={require('../assets/13.png')} className="tabSelect_img" />*/}
                <div >首页</div>
              </Link>
            } key="1"
          />

          <TabPane
            tab={
              <Link className="tabSelect" to="index/service">
                {/*// TODO-ICON*/}
                <Icon type={require('../assets/home/server.svg')} className="tabSelect-icon" />
                {/*<img src={require('../assets/14.png')} className="tabSelect_img" />*/}
                <div >服务中心</div>
              </Link>
            } key="2"
          />


          <TabPane
            tab={
              <Link className="tabSelect" to="index/ActiveCenter">
                {/*// TODO-ICON*/}
                <Icon type={require('../assets/home/active.svg')} className="tabSelect-icon" />
                {/*<img src={require('../assets/15.png')} className="tabSelect_img"/>*/}
                <div >活动中心</div>
              </Link>} key="3"
          />
          <TabPane
            tab={
              <Link className="tabSelect" to={url1}>
                {/*// TODO-ICON*/}
                <Icon type={require('../assets/home/myxz.svg')} className="tabSelect-icon"  />
                {/*<img src={require('../assets/16.png')} className="tabSelect_img"/>*/}
                <div >我的小智</div>
              </Link>} key="4"
          />
          <TabPane
            tab={
              <Link className="tabSelect" to={url2}>
                {/*// TODO-ICON*/}
                <Icon type={require('../assets/home/scan.svg')} className="tabSelect-icon" />
                {/*<img src={require('../assets/17.png')} className="tabSelect_img"/>*/}
                <div >扫码支付</div>
              </Link>} key="5"
          />
        </Tabs>
      </div>
    );
  }
}
export default Text;
