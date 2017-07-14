/**
 * 首页第三部分--活动展示‘啤酒节’
 */
import React from 'react';
import {Link} from 'react-router';
import { Carousel,WhiteSpace, WingBlank,Icon } from 'antd-mobile';

import requestGET from "../../../utils/requestGET";
import config from  "../../../config";
import './index.less'

class part3 extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      listData:[],//当前渲染的页面数据
      current: 1, //当前页码
      pageSize:4, //每页显示的条数
      data1:[],
      data2:[],
      data3:[],
      data4:[]
    };

  }

  componentWillMount(){
    var url = config.actCenterUrl.replace("page",this.state.current).replace("pageSize",this.state.pageSize);
    requestGET(url).then((data) => {//从配置文件中读取url
      var listData = data.msg.result;
      this.setState({
        data1 : listData[0],
        data2 : listData[1],
        data3 : listData[2],
        data4 : listData[3],
      });
    });
  }

  render() {
    const {data1,data2,data3,data4} = this.state;
    return (
      <div className="index_par3">
        <div className="index_par3_div">
          <li>
            <Link className="index_link" to="TransactionQuery">
              <img src={config.httpUrl+data1.image} />
              <div className="index_bg_div"></div>
              <div className="index_font">{data1.title}</div>
            </Link>
          </li>
          <li>
            <img src={config.httpUrl+data2.image} className="index_part3_position_top"/>
            <div className="index_bg_div index_part3_position" ></div>
            <div className="index_font index_part3_position">{data2.title}</div>
          </li>
          <li>
            <img src={config.httpUrl+data3.image} className="index_part3_position_left"/>
            <div className="index_bg_div"></div>
            <div className="index_font">{data3.title}</div>
          </li>
          <li>
            <img src={config.httpUrl+data4.image}  className="index_part3_position_top index_part3_position_left"/>
            <div className="index_bg_div index_part3_position" ></div>
            <div  className="index_font index_part3_position" >{data4.title}</div>
          </li>
        </div>
      </div>
  );
}
}

export default part3;
