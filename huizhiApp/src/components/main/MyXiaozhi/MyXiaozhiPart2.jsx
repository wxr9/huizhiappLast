import React from 'react';
import { List, WingBlank, Card, Tag, Icon, Tabs, Button,Modal } from 'antd-mobile';
import { createForm } from 'rc-form';
import { Link } from 'react-router';
import axios from 'axios';
import config from '../../../config';
import './MayXiaozhi.less'
import requestGET from '../../../utils/requestGET';

const alert = Modal.alert;
const TabPane = Tabs.TabPane;
const Item = List.Item;
var count = 0;
const NUM_ROWS = 10;

// 我的小智面板
class MyXiaozhiPart2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      myService:'',
      myApply:'none',
      myServiceColor:'#FF6C52',
      myApplyColor:'#333',
      myServiceBorder:'2PX solid #FF6C52',
      myApplyBorder:'none',
      infoList:[],
      infoOrderList:[],
      currentPageService:0,
      currentPageOrder:0,
      totalPageService:0,
      totalPageOrder:0,
      isLastPageService:false,
      isLastPageOrder:false,
      isBound:this.props.content.isBound,
      isClassName:'',
      isClassName1:'',
      infoTotal:'',
      infoOrderTotal:'',
      isPageBlock:'',
    };
  }

  componentWillMount () {
    if(this.state.isBound == "0"){
      this.setState({
        isClassName:'MyXiaozhi_MyPosition_un',
        isClassName1:'MyXiaozhi_MyPosition1_un'
      });
    }
    if (this.state.isBound == "1"){
      this.setState({
        isClassName:'MyXiaozhi_MyPosition',
        isClassName1:'MyXiaozhi_MyPosition1'
      });
    }

    var myServiceUrl = config.myServiceUrl.replace("page",this.state.currentPageService+1).replace("pageSize",NUM_ROWS);
    requestGET(myServiceUrl).then((data) => {//从配置文件中读取url
      var infoList = data.result;
      var infoTotal = data.total;
      var currentPageService = '';
      if(infoList.length<1||infoList===null||infoList===undefined||infoList===""){
        currentPageService = 0;
        console.log(22)
      }else {
        currentPageService = data.page
      }
      this.setState({
        infoList: infoList,
        infoTotal:infoTotal,
        currentPageService:currentPageService,
        totalPageService:Math.ceil(data.total/NUM_ROWS),
      })
    });
    var myOrderUrl = config.myOrderUrl.replace("page",this.state.currentPageOrder+1).replace("pageSize",NUM_ROWS);
    requestGET(myOrderUrl).then((data) => {//从配置文件中读取url
      var infoOrderList = data.result;
      var infoOrderTotal = data.total;
      var currentPageOrder = '';
      if(infoOrderList.length<1||infoOrderList===null||infoOrderList===undefined||infoOrderList===""){
        currentPageOrder = 0;
      }else {
        currentPageOrder = data.page
      }
      this.setState({
        infoOrderList: infoOrderList,
        infoOrderTotal:infoOrderTotal,
        currentPageOrder:currentPageOrder,
        totalPageOrder:Math.ceil(data.total/NUM_ROWS),
      })
    });
  }

  Cancel= (val) =>{
    var myOrderUrl = config.myOrderUrl.replace("page",this.state.currentPageOrder).replace("pageSize",NUM_ROWS);
    var DelMyOrder = config.DelMyOrderUrl.replace("{objectid}",val);//取消预约的object
    requestGET(DelMyOrder).then((data) => {//从配置文件中读取url
      alert("预约"+data.msg);
      if(data.success){//取消成功，重新渲染
        requestGET(myOrderUrl).then((data) => {//从配置文件中读取ur
          var infoOrderList = data.result;
          this.setState({
            infoOrderList: infoOrderList,
          })
        });
      }
    });
  };


  //我的服务和我的申请的点击事件
  changeTab(tabNo){
    if(tabNo==1){
      this.setState({
        myService:'',
        myApply:'none',
        myServiceColor:'#FF6C52',
        myApplyColor:'#333',
        myServiceBorder:'2PX solid #FF6C52',
        myApplyBorder:'none',
      });
    }else {
      this.setState({
        myService:'none',
        myApply:'',
        myServiceColor:'#333',
        myApplyColor:'#FF6C52',
        myServiceBorder:'none',
        myApplyBorder:'2PX solid #FF6C52'
      });
    }
  }

  lastPageRefresh1= () =>{
    var myServiceUrl = config.myServiceUrl.replace("page",this.state.currentPageService-1).replace("pageSize",NUM_ROWS);
    requestGET(myServiceUrl).then((data) => {//从配置文件中读取url
      var infoList = data.result;
      if(infoList.length < NUM_ROWS){
        this.setState({
          isLastPageService:true,
        })
      }
      this.setState({
        infoList: infoList,
        currentPageService:data.page,
      })
    });
  };

  nextPageRefresh1= () =>{
    var myServiceUrl = config.myServiceUrl.replace("page",this.state.currentPageService+1).replace("pageSize",NUM_ROWS);
    requestGET(myServiceUrl).then((data) => {//从配置文件中读取url
      var infoList = data.result;
      if(infoList.length < NUM_ROWS){
        this.setState({
          isLastPageService:true,
        })
      }
      this.setState({
        infoList: infoList,
        currentPageService:data.page,
      })
    });
  };

  lastpageRefresh2= () =>{
    var myOrderUrl = config.myOrderUrl.replace("page",this.state.currentPageOrder-1).replace("pageSize",NUM_ROWS);
    requestGET(myOrderUrl).then((data) => {//从配置文件中读取url
      var infoOrderList = data.result;
      if(infoOrderList.length < NUM_ROWS){
        this.setState({
          isLastPageOrder:true,
        })
      }
      this.setState({
        infoOrderList: infoOrderList,
        currentPageOrder:data.page,
      })
    });
  };
  nextpageRefresh2= () =>{
    var myOrderUrl = config.myOrderUrl.replace("page",this.state.currentPageOrder+1).replace("pageSize",NUM_ROWS);
    requestGET(myOrderUrl).then((data) => {//从配置文件中读取url
      var infoOrderList = data.result;
      if(infoOrderList.length < NUM_ROWS){
        this.setState({
          isLastPageOrder:true,
        })
      }
      this.setState({
        infoOrderList: infoOrderList,
        currentPageOrder:data.page,
      })
    });
  };

  render() {
    const { getFieldProps } = this.props.form;
    let button1;
    if(this.state.currentPageService == '1'){
      button1=(
        <div style={{textAlign:'center',width:'100%'}}>
          <Button
            className="card_none"
            style={{
              display:'inline-block',
              float:'left',
              marginLeft: '20%',
              backgroundColor: '#fff'}}
            disabled
            onClick={() =>this.lastPageRefresh1()}>上一页</Button>
          <span
            style={{
              display: 'inline-block',
              marginTop: '0.3rem'}}>
            { this.state.currentPageService }页/ { this.state.totalPageService }页</span>
          <Button
            className="card_none"
            style={{
              float:'right',
              display:'inline-block',
              marginRight: '20%',
              backgroundColor: '#fff'}}
            onClick={() =>this.nextPageRefresh1()}>下一页</Button>
        </div>
      );
    }else if( this.state.currentPageService < this.state.totalPageService ){
      button1=(
        <div style={{textAlign:'center',width:'100%'}}>
          <Button
            className="card_none"
            style={{display:'inline-block',float:'left',marginLeft: '20%',backgroundColor: '#fff'}}
            onClick={() =>this.lastPageRefresh1()}>上一页</Button>
          <span  style={{
            display: 'inline-block',
            marginTop: '0.3rem'}}
          >{ this.state.currentPageService }页/ { this.state.totalPageService }页</span>
          <Button
            className="card_none"
            style={{
              float:'right',
              display:'inline-block',
              marginRight: '20%',
              backgroundColor: '#fff'}}
            onClick={() =>this.nextPageRefresh1()}>下一页</Button>
        </div>
      );
    }else{
      button1=(
        <div style={{textAlign:'center',width:'100%'}}>
          <Button
            className="card_none"
            style={{
              display:'inline-block',
              float:'left',
              marginLeft: '20%',
              backgroundColor: '#fff'}}
            onClick={() =>this.lastPageRefresh1()}>上一页</Button>
          <span
            style={{
              display: 'inline-block',
              marginTop: '0.3rem'}}>
            { this.state.currentPageService }页/ { this.state.totalPageService }页</span>
          <Button
            className="card_none"
            style={{
              float:'right',
              display:'inline-block',
              marginRight: '20%',
              backgroundColor: '#fff'}} disabled
            onClick={() =>this.nextPageRefresh1()}>下一页</Button>
        </div>
      );
    }
    let button2;
    if(this.state.currentPageOrder == '1'){
      button2=(
        <div style={{textAlign:'center',width:'100%'}}>
          <Button
            className="card_none"
            style={{
              display:'inline-block',
              float:'left',
              marginLeft: '20%',
              backgroundColor: '#fff'}} disabled
            onClick={() =>this.lastpageRefresh2()}>上一页</Button>
          <span
            style={{
              display: 'inline-block',
              marginTop: '0.3rem'}}>
            { this.state.currentPageOrder }页/ { this.state.totalPageOrder }页</span>
          <Button
            className="card_none"
            style={{
              float:'right',
              display:'inline-block',
              marginRight: '20%',
              backgroundColor: '#fff'}}
            onClick={() =>this.nextpageRefresh2()}>下一页</Button>
        </div>
      );
    }else if( this.state.currentPageOrder < this.state.totalPageOrder ){
      button2=(
        <div style={{textAlign:'center',width:'100%',backgroundColor: '#fff'}}>
          <Button
            className="card_none"
            style={{display:'inline-block',float:'left',marginLeft: '20%'}}
            onClick={() =>this.lastpageRefresh2()}>上一页</Button>
          <span
            style={{
            display: 'inline-block',
            marginTop: '0.3rem'}}>
            { this.state.currentPageOrder }页/{ this.state.totalPageOrder }页</span>
          <Button
            className="card_none"
            style={{
              float:'right',
              display:'inline-block',
              marginRight: '20%',
              backgroundColor: '#fff'}}
            onClick={() =>this.nextpageRefresh2()}>下一页</Button>
        </div>
      );
    }else{
      button2=(
        <div style={{textAlign:'center',width:'100%'}}>
          <Button
            className="card_none"
            style={{
              display:'inline-block',
              float:'left',
              marginLeft: '20%',
              backgroundColor: '#fff'}}
            onClick={() =>this.lastpageRefresh2()}>上一页</Button>
          <span
            style={{
              display: 'inline-block',
              marginTop: '0.3rem'}}>
            { this.state.currentPageOrder }页/ { this.state.totalPageOrder }页</span>
          <Button
            className="card_none"
            style={{
              float:'right',
              display:'inline-block',
              marginRight: '20%',
              backgroundColor: '#fff'}}
            disabled
            onClick={() =>this.nextpageRefresh2()}>下一页</Button>
        </div>
      );
    }


    if(this.state.infoTotal===0){
      button1=(
        <div style={{textAlign:'center'}}>
          <p style={{paddingTop:'1rem',display:'block'}}>暂无数据</p>
        </div>
      )
    }else if(this.state.totalPageService===1){
      button1=(
        <div>
        </div>
      )
    }
    if(this.state.infoOrderTotal===0){
      button2=(
        <div style={{textAlign:'center'}}>
          <p style={{paddingTop:'1rem',display:'block'}}>暂无数据</p>
        </div>
      )
    }
    if(this.state.totalPageOrder===1){
      button2=(
        <div>
        </div>
      )
    }

    return (
      <div>
        <div className={this.state.isClassName}>
          <div style={{
            display:'inline',
            marginLeft:'10%',
            marginRight:'10%',
            fontSize:'1em',
            color:this.state.myServiceColor,
            borderRadius:'0.1rem',
            border: this.state.myServiceBorder,
            padding: '0.08rem 0.4rem'
          }} onClick={() =>this.changeTab(1)}>我的服务</div>
          <div style={{
            display:'inline',
            marginLeft:'10%',
            marginRight:'10%',
            fontSize:'1em',
            color:this.state.myApplyColor,
            borderRadius:'0.1rem',
            border: this.state.myApplyBorder,
            padding: '0.08rem 0.4rem'
            //  FF6C52
          }} onClick={() =>this.changeTab(2)}>我的申请</div>
        </div>
          <div className={this.state.isClassName1}>
            {/*<List className="MyXiaozhi_list">*/}
            <List>
              <Card className="card_none">

                  <div>
                    <div >
                      <div style={{display:this.state.myService}}>
                        <List className="MyXiaozhi_fontSize">
                          {
                            this.state.infoList.map((data) => {
                              count = count + 1;
                              var sn = data.sn;
                              var isITorPro = sn.substring(0,2);
                              var Detail1 =
                                <Link
                                  to={{
                                    pathname:'Detail',
                                    query:{identity_field_value:data.identity_field_value,isITorPro:isITorPro}}}
                                  key={count}>
                                  <Item wrap  multipleLine className="MyXiaozhi_server_Item">
                                    <div>流水号：{data.sn}</div>
                                    <div>时&nbsp;&nbsp;&nbsp;间：{data.addtime}</div>
                                    <div>类&nbsp;&nbsp;&nbsp;别：{data.process_name}</div>
                                    <div>状&nbsp;&nbsp;&nbsp;态：{data.current_state}</div>
                                  </Item>
                                </Link>
                              ;
                              var Detail2 =
                                <Item wrap  multipleLine className="MyXiaozhi_server_Item">
                                  <div>流水号：{data.sn}</div>
                                  <div>时&nbsp;&nbsp;&nbsp;间：{data.addtime}</div>
                                  <div>类&nbsp;&nbsp;&nbsp;别：{data.process_name}</div>
                                  <div>状&nbsp;&nbsp;&nbsp;态：{data.current_state}</div>
                                </Item>

                                if(isITorPro==="WY"||isITorPro==="IT"){
                                  return (
                                    Detail1
                                  );
                                }else{
                                  return (
                                    Detail2
                                  );
                                }
                              }
                            )
                          }
                        </List>
                          {button1}
                      </div>
                      <div style={{display:this.state.myApply}}>
                        <List className="MyXiaozhi_fontSize">
                          {
                            this.state.infoOrderList.map((data) => {
                                count = count + 1;
                                let object = data.objectid;
                                let now = new Date();
                                let month = now.getMonth()+1;
                                if(month<10){
                                  month = "0"+month;
                                }
                                let day =now.getDate();
                                if(day<10){
                                  day = "0"+day;
                                }
                                let newDate = now.getFullYear()+""+month+""+day;
                                let dingStartTime =
                                  data.dingStartTime.replace("-","").replace("-","").substring(0,8);
                                let orderInfo;
                                if (data.bCancel) {
                                  orderInfo = (
                                    <div className="MyXiaozhi_cancelBtn">预约已取消</div>
                                  )
                                }else if(dingStartTime>newDate){
                                  orderInfo = (
                                    <Button  size="small"
                                             className="MyXiaozhi_smallBtn"
                                             inline onClick={() =>this.Cancel(object)}>取消预约</Button>
                                  )
                                }else{
                                  orderInfo = (
                                    <Button  size="small"
                                             className="MyXiaozhi_smallBtn_ok"
                                             inline>预约成功</Button>
                                  )
                                }
                                return (
                                  <div key={count}>
                                    <List.Item multipleLine>
                                      <div className="MyXiaozhi_Item">
                                        <div>开始时间：{data.dingStartTime}</div>
                                        <div>结束时间：{data.dingEndTime}</div>
                                        <div>预约数量：{data.dingNumber}</div>
                                      </div>
                                      {orderInfo}
                                    </List.Item>
                                  </div>
                                );
                              }
                            )
                          }
                        </List>
                        {button2}
                      </div>
                    </div>
                  </div>

              </Card>
            </List>
        </div>

        </div>
    );
  }
}
const MyXiaozhiPart2Wrapper = createForm()(MyXiaozhiPart2);
export default MyXiaozhiPart2Wrapper;
