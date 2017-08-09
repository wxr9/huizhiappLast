import React from 'react';
import {List,Icon, Badge, Flex, WhiteSpace, Tabs, Card, ListView ,Modal} from 'antd-mobile';
import { Link } from 'react-router';

import requestGET from '../../utils/requestGET';
import config from '../../config';
import PersonNotify_1 from "../../components/user/PersonNotify/PersonNotify1";
import autoLoginUtil from '../../utils/autoLoginUtil';

const TabPane = Tabs.TabPane;
const alert = Modal.alert;
const NUM_ROWS = 10;
var index = 0;
var totalData = [];
// 个人信息页面
class PersonNotify extends React.Component {
  constructor (props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
    this.state = {
      dataSource: dataSource.cloneWithRows({}),
      isLoading: true,
      current:1,
      unReadCount:[],
      totalCount:0,
    };
  }
  componentWillMount () {
    //判断登录是否超时
    autoLoginUtil();
    //获取未读信息条数
    requestGET(config.getUnReadCountUrl).then((data) => {//从配置文件中读取url
      if(data.success){
        this.setState({
          unReadCount: data,
        })
      }
    });

    //获取通知内容
    var url = config.notificationUrl.replace("page", this.state.current).replace("pageSize", NUM_ROWS);
    var totalCount = 0;
    requestGET(url).then((data) => {//从配置文件中读取url
      var listData = data.result;
      totalData = [];
      for(var i = 0;i<listData.length;i++){
        totalData.push(listData[i]);
      }
      var current = data.page;
      this.rData =  {...totalData};
      this.setState({
        current:current,
      })

      setTimeout(() => {
        this.rData = { ...totalData};
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(this.rData),
          isLoading: false,
        });
      }, 600);
    });
  }

  //加载新数据
  onEndReached = (event) => {
    if (this.state.isLoading && !this.state.hasMore) {
      return;
    }
    if(event==undefined){
      return;
    }
    this.setState({
      isLoading: true,
    });
    var url = config.notificationUrl.replace("page", this.state.current+1).replace("pageSize",NUM_ROWS);
    requestGET(url).then((data) => {//从配置文件中读取url
      var nextData = data.result;
      for(var i = 0;i<nextData.length;i++){
        totalData.push(nextData[i]);
      }
      // console.log("totalData",totalData);
      if(nextData == null || nextData == "" || nextData.length ==0){
        this.setState({
          isLoading: false,
        });
      }else {
        var totalDateObject = {...totalData};
        this.setState({
          current: data.page,
        })
        setTimeout(() => {
          this.rData = {...this.rData, ...totalDateObject};
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.rData),
            current: data.page,
            isLoading: false,
          });
        }, 600);

      }
    })
  }
  checkDetail= (readStatus,objectid) =>{
    if(readStatus != 1) {//已读
      // console.log("personNotify__Click1");
      return ;
    }
    // console.log("personNotify__Click2");
    //调用第三方接口设置为已读(GET)
    requestGET(config.setReadStatusUrl.replace("{objectid}",objectid)).then((data) => {//从配置文件中读取url
      if(data.success){
        //重新获取当前通知信息，进行渲染
        var url = config.notificationUrl.replace("page", 1).replace("pageSize",this.state.current*NUM_ROWS);
        requestGET(url).then((data) => {//从配置文件中读取url
          totalData = [];
          var list = data.result;
          for(var i = 0;i<list.length;i++){
            totalData.push(list[i]);
          }
          this.rData = { ...totalData};
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.rData),
          })
        })
        //重新获取未读信息条数，进行渲染
        requestGET(config.getUnReadCountUrl).then((data) => {//从配置文件中读取url
          if(data.success){
            this.setState({
              unReadCount: data,
            })
          }
        });
      }else {
        alert("点击已读失败！");
      }
    });
  }

  deleteNews= (objectid) =>{//根据objectid删除消息(GET)
    // console.log("删除开始！");
    requestGET(config.deleteNewsUrl.replace("{objectid}",objectid)).then((data) => {//从配置文件中读取url
      console.log(data.success)
      if(data.success){
        //重新获取当前通知信息，进行渲染
        var url = config.notificationUrl.replace("page", 1).replace("pageSize",this.state.current*NUM_ROWS);
        requestGET(url).then((data) => {//从配置文件中读取url
          totalData = [];
          var list = data.result;
          for(var i = 0;i<list.length;i++){
            totalData.push(list[i]);
          }
          this.rData = { ...totalData};
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.rData),
          })

          //重新获取未读信息条数，进行渲染
          requestGET(config.getUnReadCountUrl).then((data) => {//从配置文件中读取url
            if(data.success){
              this.setState({
                unReadCount: data,
              })
            }
          });
        })
      }else {
        alert(data.msg);
      }
    })
  }
  render() {
    const tiShi = this.state.unReadCount;
    let tiShi_toInt = tiShi .msg ;
    if(tiShi_toInt>99){
      tiShi_toInt = '99+';
    }
    const separator = (sectionID, rowID) => (
      <div key={`${sectionID}-${rowID}`}/>
    );
    const row = (rowData, sectionID, rowID) => {
      let isReadFlag;
      let detail;
      let bold;
      if(rowData.readStatus != 1){//已读
        isReadFlag = (<div> </div>);
        detail = (<Card.Body>
          <div>{rowData.content}</div>
        </Card.Body>);
        bold = (
          <Flex className="personNotify_par1_Flex">
            <Flex.Item className="personNotify_par1_Flex_color" >{rowData.title}</Flex.Item>
            <Flex.Item className="personNotify_par1_Flex_width" >{rowData.createTime}</Flex.Item>
          </Flex>
        );
      }else {//未读
        isReadFlag = (<div className="personNotify_circle"> </div>);
        detail = (<Card.Body style={{display:'none'}}>
          <div>{rowData.content}</div>
        </Card.Body>);
        bold = (
          <b>
            <Flex className="personNotify_par1_Flex">
              <Flex.Item className="personNotify_par1_Flex_color" >{rowData.title}</Flex.Item>
              <Flex.Item className="personNotify_par1_Flex_width" >{rowData.createTime}</Flex.Item>
            </Flex>
          </b>
        )
      }
      return (
        <div key={'${sectionID}-${rowID}'}>
          <Card className="personNotify_par1_card">
            <Card.Header
              onClick={() =>this.checkDetail(rowData.readStatus,rowData.objectid)}
              className="personNotify_par1_cardHeader"
              title={
                <div>
                  {isReadFlag}
                  {bold}
                </div>}/>
            <div onClick={() =>this.deleteNews(rowData.objectid)}>
              <Icon className="personNotify_del_icon" type="cross-circle" size="xs"/>
            </div>
            {detail}
          </Card>
        </div>
      );
    };

    return (
      <div>
        {/*<PersonNotify_1 {...this.state.unReadCount}/>*/}
        <div>
          <ListView
            ref="lv"
            dataSource={this.state.dataSource}
            // renderHeader={() => (<div>
            //   <Tabs className="personNotify_notice">
            //     <TabPane tab={<div><div>通知</div><div className="index_tishi2">{this.state.unReadCount.msg}</div></div>}>
            //     </TabPane>
            //     </Tabs>
            //   <WhiteSpace />
            // </div>)}
            renderFooter={() => (<div style={{ margin: 10, textAlign: 'center' }}>
              {this.state.isLoading ? '正在加载...' : '加载完毕'}
            </div>)}
            renderRow={row}
            renderSeparator={separator}
            className="am-list personNotify_notice_top"
            pageSize={NUM_ROWS*this.state.current}
            useBodyScroll
            onScroll={() => { console.log('scroll'); }}
            scrollEventThrottle={200}
            onEndReached={this.onEndReached}
            onEndReachedThreshold={10}
          />
        </div>
        {/*<List.Item*/}
          {/*className="tiShi"*/}
          {/*extra={<Badge text={tiShi_toInt} overflowCount={99} />}*/}
        {/*>*/}
        {/*</List.Item>*/}
        <div className="index_tishi2">{tiShi_toInt}</div>
      </div>
    );
  }
}
export default PersonNotify;
