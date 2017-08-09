import React from 'react';
import { Drawer,Icon } from 'antd-mobile';
import { Link } from 'react-router';

import ServiceCenter_part1 from "../../components/server/ServiceCenter/ServiceCenter_part1";
import '../../components/server/ServiceCenter/server.less'
import '../../components/main/Index/index.less'
import PersonCenter1 from '../../components/user/PersonCenter/PersonCenter1';
import PersonCenterUnLogin from '../../components/user/PersonCenter/PersonCenter_UnLogin';
import PersonCenter2 from '../../components/user/PersonCenter/PersonCenter2';
import autoLoginUtil from '../../utils/autoLoginUtil';
import getUserInfo from '../../utils/getUserInfo';
import requestGET from "../../utils/requestGET";
import config from  "../../config";

var startX = 0;
var startY = 0;
var endX = 0;
var endY = 0;

class ServiceCenter extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      userInfo: [],
      open: false,//侧边栏的默认关闭状态
      display:'none',//个人中心已登录页
      display2:'',//个人中心未登录页
      drawerdisplay:'none',//侧边栏收起时不显示
      unReadCount:0,//通知是否未读消息条数
    };
  }
  componentWillMount () {
    //判断登录是否超时
    autoLoginUtil();
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
    //获取未读信息条数
    requestGET(config.getUnReadCountUrl).then((data) => {//从配置文件中读取url
      if(data.success){
        this.setState({
          unReadCount: data.msg,
        })
      }
    });
  }
  handleTouchStart=(e)=> {
    startX = e.changedTouches[0].pageX;
    startY = e.changedTouches[0].pageY;
  }

  handleTouchMove=(e)=> {
  }

  handleTouchEnd=(e)=> {
    endX = e.changedTouches[0].pageX;
    endY = e.changedTouches[0].pageY;
    var direction = endX - startX;
    // if( startX < 20 && direction > 150 ){   //右滑 -->显示左侧边栏
    if( direction > 150 ){   //右滑 -->显示左侧边栏
      this.checkLogon();
      this.setState({
        drawerdisplay:'',
      });
      //设置打开的后延
      setTimeout(() => {
        this.setState({
          open: true,
        });
      }, 50);
      var mainContents=document.getElementById("mainContents");
      mainContents.style.overflow="hidden";
    }
    if( this.state.open && direction < -150 ){   ////左滑 -->收起左侧边栏
      this.setState({
        open:false,
      });
      var mainContents=document.getElementById("mainContents");
      mainContents.style.overflow="auto";
      setTimeout(() => {
        this.setState({
          drawerdisplay:'none',
        });
      }, 50);
    }
  }
  //判断是否登录，并设置个人中心的页面显示与不显示
  checkLogon=()=> {
    let user = localStorage.userInfo;
    if (user !== undefined && user !== null && user !== "") {
      user = JSON.parse(user);
      console.log(user)
      let realName = user.realName;
      let phone = user.phone;
      console.log(realName);
      console.log(phone);
      if ((realName!== "" && realName!== undefined && realName !== null)
        ||(phone!== "" && phone!== undefined && phone !== null)) {
        console.log("已登录！");
        this.setState({
          display: '',
          display2: 'none',
        });
      } else {
        console.log("未登录，请登录！");
        this.setState({
          display: 'none',
          display2: '',
        });
      }
    } else {
      console.log("未登录，请登录！");
      this.setState({
        display: 'none',
        display2: '',
      });
    }
  };
  //侧边栏的开关事件
  onOpenChange = (...args) => {
    this.checkLogon();
    this.setState({
      open: !this.state.open
    });
    var mainContents=document.getElementById("mainContents");
    mainContents.style.overflow="auto";
    setTimeout(() => {
      this.setState({
        drawerdisplay:'none',
      });
    }, 50);
  }

  //点击左上角头像出现个人中心
  Avatar= () =>{
    this.checkLogon();
    this.setState({
      drawerdisplay:'',
    });
    //设置打开的后延
    setTimeout(() => {
      this.setState({
        open:true,
      });
    }, 50);
  };
  render() {
    //通知提示图标
    let unReadCount;
    if(this.state.unReadCount > 0){
      unReadCount =  <div className="tiShi_index"> </div>
    }else {
      unReadCount = <div> </div>
    }
    //侧边栏包含的内容
    const sidebar = (<div className="div-siderbar">
      <div style={{display:this.state.display}}>
        <PersonCenter1 {...this.state.userInfo}/>
      </div>
      <div style={{display:this.state.display2}}>
        <PersonCenterUnLogin/>
      </div>
      <PersonCenter2/>
    </div>);
    return (
      <div onTouchStart={this.handleTouchStart} onTouchMove={this.handleTouchMove} onTouchEnd={this.handleTouchEnd}>
        <img
          className="server-img"
          src={require('../../assets/service/service-title.jpg')}/>
        <Drawer
          className="my-drawer"
          style={{ minHeight: document.documentElement.clientHeight - 200,display:this.state.drawerdisplay,
            position:'fixed',zIndex:'201'}}
          enableDragHandle
          contentStyle={{ color: '#A6A6A6', textAlign: 'center', paddingTop: 42 }}
          sidebar={sidebar}
          position={'left'}
          open={this.state.open}
          onOpenChange={this.onOpenChange}
        />
        <ServiceCenter_part1/>
        <div className="index_avatar" onClick={() =>this.Avatar()}>
          <Icon type={require('../../assets/home/home_avatar.svg')} className="index_avatar_icon"/>
          {unReadCount}
        </div>
      </div>
    );
  }
}
export default ServiceCenter;

