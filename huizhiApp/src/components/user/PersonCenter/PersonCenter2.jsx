import React from 'react';
import { List, Badge, Flex, WhiteSpace, Icon, Modal, Toast } from 'antd-mobile';
import { Link } from 'react-router';

import './PersonCenter.less';
import requestPost from '../../../utils/requestPOST';
import requestGET from '../../../utils/requestGET';
import config from '../../../config';

const alert = Modal.alert;

// 个人中心第二部分--菜单
class PersonCenter2 extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      url1: "index/personinfo",
      url2: "index/Bound",
      url3: "index/UserPay",
      url4: "index/personnotify",
      unReadCount:0,
    };
  }
  componentWillMount () {
    //获取未读信息条数
    requestGET(config.getUnReadCountUrl).then((data) => {//从配置文件中读取url
      if(data.success){
        this.setState({
          unReadCount: data.msg,
        })
      }
    });
    //缓存中无用户登录信息则需先登录
    if(localStorage.loginInfo == undefined) {
      //跳转登录界面
      var login = "login";
      this.setState({
        url1: login+"?url=index/personinfo",
        url2: login+"?url=index/Bound",
        url3: login+"?url=index/UserPay",
        url4: login+"?url=index/personnotify",
      })
    }else {
      var url2 =  "index/Bound";
      //从缓存中读取用户个人信息
      if(localStorage.userInfo != undefined){
        var userInfo = JSON.parse(localStorage.userInfo);
        var cardId = userInfo.cardid;

        if( cardId == null|| cardId == "" || cardId == undefined){
          url2 = "index/Bound";
        }
      }
      this.setState({
        url2 : url2
      })
    }
  }
  writeOff =()=>{
    const array1 = [
      {text: '退出', onPress: () => this.confirmWriteOff(), style: {fontWeight: 'bold'}},
      {text: '取消', onPress: () => console.log('cancel'), style: 'default'},
    ];
    const array2 = [
      {text: '登录', onPress: () => this.jumpLogin(), style: {fontWeight: 'bold'}},
      {text: '取消', onPress: () => console.log('cancel'), style: 'default'},
    ];
    if(localStorage.userInfo != undefined){
      alert('您即将退出您的账户', '确定退出?', array1);
    }else{
      alert('请先登录您的账户', '确定登录?', array2);
    }
  }
  confirmWriteOff =()=>{
    Toast.loading('退出中...', 0);
    //注销
    requestPost(config.loginOutUrl,{}).then(function(data){//从配置文件中读取url，POST请求
      if(data.success) {//注销成功
        if(localStorage.lastUrl != undefined){
          localStorage.removeItem("lastUrl");
        }
        if(localStorage.userInfo != undefined){
          localStorage.removeItem("userInfo");
        }
        if(localStorage.loginInfo != undefined){
          localStorage.removeItem("loginInfo");
        }
        Toast.hide();
        alert(data.msg, '', [
          { text: '确认', onPress: () => {window.location.href="#login"}, style: {fontWeight: 'bold'} },
        ]);
      }else {
        Toast.hide();
        alert("注销失败！");
      }
    }).catch(function(error){
      Toast.hide();
      console.log(error);
    });
  }
  jumpLogin=()=>{
    window.location.href="#login?url=index/Index";
  }
  render() {
    const tiShi = this.state.unReadCount ;
    let tiShi_toInt = tiShi-0;//转换为数字
    const { url1,url2,url3,url4} = this.state;
    let unReadCount;
    if(this.state.unReadCount > 0){
      unReadCount =  <List.Item
        className="tiShi_personCenter"
        extra={<Badge text={tiShi_toInt} overflowCount={99} />}
      >
      </List.Item>
    }else {
      unReadCount = <div> </div>
    }
    return (
      <div>
        <WhiteSpace size="sm" />
        <div className="personCenter_par2_div">
          <Link to={url1}>
            <List.Item extra="" arrow="horizontal" className="personCenter_par2_List">
              {/* TODO-ICON */}
              <Badge text={0} className="personCenter_par2_Badge">
                <Icon
                  type={require('../../../assets/user/user-info.svg')}
                  className="personCenter_par2_icon" />
                个人信息 </Badge>
            </List.Item>
          </Link>
          <Link to={url2}>
            <List.Item extra="" arrow="horizontal"  className="personCenter_par2_List">
              {/* TODO-ICON */}
              <Badge text={0} className="personCenter_par2_Badge">
                <Icon
                  type={require('../../../assets/user/user-card.svg')}
                  className="personCenter_par2_icon"/>
                汇智卡</Badge>
            </List.Item>
          </Link>
          {/*<Link to={url3}>*/}
            {/*<List.Item extra="" arrow="horizontal"  className="personCenter_par2_List">*/}
              {/*/!* TODO-ICON *!/*/}
              {/*<Badge text={0} className="personCenter_par2_Badge">*/}
                {/*<Icon*/}
                  {/*type={require('../../../assets/user/user-pay.svg')}*/}
                  {/*className="personCenter_par2_icon"/>*/}
                {/*支付记录</Badge>*/}
            {/*</List.Item>*/}
          {/*</Link>*/}
          <Link to={url4}>
            <List.Item extra="" arrow="horizontal"  className="personCenter_par2_List">
              {/* TODO-ICON */}
              <Badge text={0} className="personCenter_par2_Badge">
                <Icon
                  type={require('../../../assets/user/user-notice.svg')}
                  className="personCenter_par2_icon"/>
                通知管理</Badge>
            </List.Item>
            {unReadCount}
          </Link>
          <Link  onClick={this.writeOff}>
            <List.Item extra="" arrow="horizontal"  className="personCenter_par2_List">
              {/* TODO-ICON */}
              <Badge text={0} className="personCenter_par2_Badge">
                <Icon
                  type={require('../../../assets/user/user-set.svg')}
                  className="personCenter_par2_icon"/>
                注销</Badge>
            </List.Item>
          </Link>
        </div>
      </div>
    );
  }
}
export default PersonCenter2;
