import React from 'react';
import { Card, WingBlank, List, Icon, Button } from 'antd-mobile';
import { Link } from 'react-router';

import '../../components/main/ActiveCenter/ActiveCenter.less'
import ActiveCenter_1 from "../../components/main/ActiveCenter/ActiveCenter1";
import requestGET from "../../utils/requestGET";
import config from  "../../config";

var count = 0;

// 工作详情
class ActiveCenter extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      listData:[],//当前渲染的页面数据
      // totalData:listData,
      current: 1, //当前页码
      pageSize:4, //每页显示的条数
      totalPage:0,//总页数
    };

  }

  componentWillMount(){
      var url = config.actCenterUrl.replace("page",this.state.current).replace("pageSize",this.state.pageSize);
      requestGET(url).then((data) => {//从配置文件中读取url
        var listData = data.msg.result;
        var totalPage = Math.ceil(data.msg.total/this.state.pageSize);
        var current = data.msg.page;
        this.setState({
          listData : listData,
          totalPage: totalPage,
        })
      });
  }

//下一页
  nextPage = () => {
    if(this.state.current < this.state.totalPage){
      var nextPage = this.state.current+1;
      var url = config.actCenterUrl.replace("page",nextPage).replace("pageSize",this.state.pageSize);
      requestGET(url).then((data) => {//从配置文件中读取url
        var listData = data.msg.result;
        var current = data.msg.page;
        this.setState({
          listData : listData,
          current:nextPage
        })
      })
    }
  }

  上一页
  prePage = () => {
    if(this.state.current > 1){
      var prePage = this.state.current-1;
      var url = config.actCenterUrl.replace("page",prePage).replace("pageSize",this.state.pageSize);
      requestGET(url).then((data) => {//从配置文件中读取url
        var listData = data.msg.result;
        var current = data.msg.page;
        this.setState({
          listData : listData,
          current:prePage
        })
      })
    }
  }

  render() {
    const {listData} = this.state;

    return (
      <div>
        <img className="activeCenter_img"
          src={require('../../assets/active/active-title.jpg')}/>
          {
            listData.map((data) => {
            count = count + 1;
            return (
              <ActiveCenter_1 {...data} key={count}/>
            );
          }
        )}
        {/*<ActiveCenter_1/>*/}
        <WingBlank>
        <div>
          <Button onClick={this.prePage} >上一页</Button>
          <span>{ this.state.current }页/ { this.state.totalPage }页</span>
          <Button onClick={this.nextPage}>下一页</Button>
        </div>
        </WingBlank>
      </div>
    );
  }
}
export default ActiveCenter;
