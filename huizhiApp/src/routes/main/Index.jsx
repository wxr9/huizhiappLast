import React from 'react';
import {Link} from 'react-router';
import {Drawer,Icon,List,Badge} from 'antd-mobile';

import Index_1 from "../../components/main/Index/part1";
import Index_2 from "../../components/main/Index/part2";
import Index_3 from "../../components/main/Index/part3";
import '../../components/main/Index/index.less'
import PersonCenter1 from '../../components/user/PersonCenter/PersonCenter1';
import PersonCenterUnLogin from '../../components/user/PersonCenter/PersonCenter_UnLogin';
import PersonCenter2 from '../../components/user/PersonCenter/PersonCenter2';
import autoLoginUtil from '../../utils/autoLoginUtil';
import getUserInfo from '../../utils/getUserInfo';
import config from '../../config'
import requestGET from '../../utils/requestGET';

let startX = 0;
let startY = 0;
let endX = 0;
let endY = 0;

class Index extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      userInfo: [],
      open: false,//侧边栏的默认关闭状态
      display:'none',//个人中心已登录页
      display2:'',//个人中心未登录页
      drawerdisplay:'none',//侧边栏收起时不显示
      zhiYin:'none',//指引页是否显示
      WinningMoney:'',//中奖红包金额
      Winning:'none',
      unReadCount:0,//通知是否未读消息条数
    };
  }
  componentWillMount () {
    //判断登录是否超时
    autoLoginUtil();
    //获取用户信息，并存入缓存
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
    var isShowZhiYin='';
    //清除缓存显示指引页
    let isFristLogin=JSON.parse(localStorage.isFristLogin).toString();
    if (isFristLogin === 'true'||isFristLogin === undefined) {//显示  -- 第一次
      // localStorage.isShowZhiYin = 'true';
      this.setState({
        zhiYin:'block'
      })
    }else {//隐藏 -- 不是第一次
      // localStorage.isShowZhiYin = 'false';
      this.setState({
        zhiYin:'none'
      })
    }
    //获取未读信息条数
    requestGET(config.getUnReadCountUrl).then((data) => {//从配置文件中读取url
      if(data.success){
        this.setState({
          unReadCount: data.msg,
        })
      }
    });
    //新用户登录第一次进入首页显示中奖红包
    if(localStorage.loginInfo !== undefined) {
      let WinningUrl = config.WinningUrl;
      requestGET(WinningUrl).then((data) => {//从配置文件中读取url
        let WinningTotal = data.total;
        let WinningData = data.result;
        if (WinningData!==undefined&&WinningData!==null&&WinningData!==""){
          if (WinningData.length>0) {
            WinningData = data.result[0];
            this.setState({
              WinningMoney: WinningData.sum,//中奖金额
            })
          }
          if(WinningTotal>0){
            this.setState({
              Winning: 'block',//显示中奖红包
            })
          }
        }
      });
    }
  }

  handleTouchStart=(e)=> {
    startX = e.changedTouches[0].pageX;
    startY = e.changedTouches[0].pageY;
  };

  handleTouchMove=(e)=> {
  };

  handleTouchEnd=(e)=> {
    endX = e.changedTouches[0].pageX;
    endY = e.changedTouches[0].pageY;
    let direction = endX - startX;
    if( startX < 30 && direction > 150 ){   //右滑 -->显示左侧边栏
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
      let mainContents=document.getElementById("mainContents");
      mainContents.style.overflow="hidden";
    }
    if( this.state.open && direction < -150 ){   ////左滑 -->收起左侧边栏
      this.setState({
        open:false,
      });
      let mainContents=document.getElementById("mainContents");
      mainContents.style.overflow="auto";
      setTimeout(() => {
        this.setState({
          drawerdisplay:'none',
        });
      }, 50);
    }
  };
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
    let mainContents=document.getElementById("mainContents");
    mainContents.style.overflow="auto";
    setTimeout(() => {
      this.setState({
        drawerdisplay:'none',
      });
    }, 50);
  };

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
  zhiYin=()=>{
    this.setState({
      zhiYin:'none'
    });
    localStorage.isFristLogin = 'false';
  };
  Winning=()=>{
    this.setState({
      Winning:'none'
    });
    window.location.reload("#index/Index");
  };

  render() {
    //首页通知提示图标
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
      <div className="index" onTouchStart={this.handleTouchStart} onTouchMove={this.handleTouchMove} onTouchEnd={this.handleTouchEnd}>

        <div className="index_avatar" onClick={() =>this.Avatar()}>
          <Icon type={require('../../assets/home/home_avatar.svg')} className="index_avatar_icon"/>
          {unReadCount}
        </div>
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
        <Index_1/>
        <Index_2/>
        <Index_3/>

        <div  style={{display:this.state.zhiYin}} >
          <img src={require('../../assets/home/direct.png')} className="zhiYin_img"/>
          <div className="zhiYin_know"  onClick={()=>this.zhiYin()}> </div>
        </div>

        <div style={{display:this.state.Winning}}>
          <img src={require('../../assets/home/Winning.png')} className="index_Winning_img"/>
          <p className="index_Winning_money">￥{this.state.WinningMoney}</p>
          <p className="index_Winning_font">恭喜获得汇智卡充值红包</p>
          <Icon type="cross-circle" className="index_Winning_icon"  onClick={()=>this.Winning()}/>
        </div>
      </div>
    );
  }
}

export default Index;
