import React from 'react';
import {Card, WingBlank, List, Drawer, Icon, Button,ListView} from 'antd-mobile';
import {Link} from 'react-router';

import '../../components/main/ActiveCenter/ActiveCenter.less'
import ActiveCenter_1 from "../../components/main/ActiveCenter/ActiveCenter1";
import requestGET from "../../utils/requestGET";
import config from  "../../config";
import '../../components/main/Index/index.less'
import PersonCenter1 from '../../components/user/PersonCenter/PersonCenter1';
import PersonCenterUnLogin from '../../components/user/PersonCenter/PersonCenter_UnLogin';
import PersonCenter2 from '../../components/user/PersonCenter/PersonCenter2';
import autoLoginUtil from '../../utils/autoLoginUtil';

var startX = 0;
var startY = 0;
var endX = 0;
var endY = 0;
const NUM_ROWS = 10;
var index = 0;
var totalData = [];

// 工作详情
class ActiveCenter extends React.Component {
  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
    this.state = {
      userInfo: [],
      dataSource: dataSource.cloneWithRows({}),
      isLoading: true,
      data:[],
      current:1,
      open: false,//侧边栏的默认关闭状态
      display:'none',//个人中心已登录页
      display2:'',//个人中心未登录页
      drawerdisplay:'none',//侧边栏收起时不显示
      totalCount:0,//活动中心是否有数据
      unReadCount:0,//通知是否未读消息条数

    };
  }

  handleTouchStart = (e) => {
    startX = e.changedTouches[0].pageX;
    startY = e.changedTouches[0].pageY;
  }

  handleTouchMove = (e) => {
  }

  handleTouchEnd = (e) => {
    endX = e.changedTouches[0].pageX;
    endY = e.changedTouches[0].pageY;

    var direction = endX - startX;   //横向
    var portrait = endY - startY;   //纵向

    if( startX < 30 && direction > 150 ){   //右滑 -->显示左侧边栏
    // if( direction > 150 ){   //右滑 -->显示左侧边栏
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

  componentWillMount () {
    //判断登录是否超时
    autoLoginUtil();
    //从缓存中读取用户个人信息
    if(localStorage.userInfo){
      var userInfo = JSON.parse(localStorage.userInfo);
      this.setState({
        userInfo: userInfo
      });
    }
    //获取未读信息条数
    requestGET(config.getUnReadCountUrl).then((data) => {//从配置文件中读取url
      if(data.success){
        this.setState({
          unReadCount: data.msg,
        })
      }
    });

    var url = config.actCenterUrl.replace("page", this.state.current).replace("pageSize", NUM_ROWS);
    requestGET(url).then((data) => {//从配置文件中读取url
      var listData = data.result;
      totalData = [];
      if(listData.length>0){
        this.setState({
          totalCount:1,
        })
      }
      for(var i = 0;i<listData.length;i++){
        totalData.push(listData[i]);
      }
      var current = data.page;
      this.rData = this.state.data;
      this.setState({
        data: listData,
        current:current,
        dataSource: this.state.dataSource.cloneWithRows(...totalData),
      })
    });
  }
  componentDidMount() {
    setTimeout(() => {
      this.rData =  {...totalData};
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.rData),
        isLoading: false,
      });
    }, 1000);
  }

  //加载新数据
  onEndReached = (event) => {
    if (this.state.isLoading && !this.state.hasMore) {
      return;
    }
    if(event==undefined){
      return;
    }
    this.setState({ isLoading: true });
    var url = config.actCenterUrl.replace("page", this.state.current+1).replace("pageSize",NUM_ROWS);
    requestGET(url).then((data) => {//从配置文件中读取url
      var nextData = data.result;
      for(var i = 0;i<nextData.length;i++){
        totalData.push(nextData[i]);
      }
      if(nextData == null || nextData == "" || nextData.length ==0){
        this.setState({
          isLoading: false,
        });
        return;
      }

      this.setState({
        current: data.page
      })
    })
    setTimeout(() => {
      this.rData = { ...totalData};
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.rData),
        isLoading: false,
      });
    }, 1000);
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

    const separator = (sectionID, rowID) => (
      <div key={`${sectionID}-${rowID}`}
           style={{
             backgroundColor: '#F5F5F9',
             height: 8,
             borderTop: '1px solid #ECECED',
             borderBottom: '1px solid #ECECED',
           }}
      />
    );
    const row = (rowData, sectionID, rowID) => {
      return (
        <ActiveCenter_1 {...rowData} key={rowID}/>
      );
    };

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
    let alertInfo = '';
    if(this.state.totalCount != 0){
      alertInfo = '加载完毕';
    }else{//没有数据
      alertInfo = '暂无数据';
    }
    return (
      <div  onTouchStart={this.handleTouchStart} onTouchMove={this.handleTouchMove} onTouchEnd={this.handleTouchEnd}>
        <img className="activeCenter_img"
             src={require('../../assets/active/active-title.jpg')}/>
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
        <div  className="activeCenter_div_scroll">
          <ListView ref="lv"
                    dataSource={this.state.dataSource}
                    renderFooter={() => (<div style={{ margin: 10, textAlign: 'center' }}>
                      {this.state.isLoading ? '正在加载...' : alertInfo}
                    </div>)}
                    renderRow={row}
                    renderSeparator={separator}
                    className="am-list"
                    pageSize={NUM_ROWS}
                    useBodyScroll
                    onScroll={() => { console.log('scroll'); }}
                    scrollEventThrottle={200}
                    onEndReached={this.onEndReached}
                    onEndReachedThreshold={10}
          />
        </div>
        <div className="index_avatar" onClick={() =>this.Avatar()}>
          <Icon type={require('../../assets/home/home_avatar.svg')} className="index_avatar_icon"/>
          {unReadCount}
        </div>
      </div>
    );
  }
}
export default ActiveCenter;
