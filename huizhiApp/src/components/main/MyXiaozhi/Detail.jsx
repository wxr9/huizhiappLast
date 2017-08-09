import React from 'react';
import { createForm } from 'rc-form';
import {List, WhiteSpace, WingBlank, Checkbox, Card} from 'antd-mobile';
import axios from 'axios';
import requestGET from '../../../utils/requestGET';
import config from '../../../config';

class Detail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Detail:[],
      httpUrl:config.httpUrl,
      isIT:'block',
      repairCreateTime:[],
      repairMemo:[],
      displayImg:''
    };
  }
  componentWillMount () {
    var obj  = this.props.location.query.identity_field_value;
    var isIT  = this.props.location.query.isITorPro;
    if(isIT==="IT"){
      this.setState({
        isIT:'none'
      })
    }
    var myServerDetail = config.myServerDetailUrl.replace("{objectid}",obj);//取消预约的object
    requestGET(myServerDetail).then((data) => {//从配置文件中读取url
      var building  = "";
      var park  = "";
      var repairTypeDetail  = "";
      var settingDict  = "";
      var dataBuilding = data.building;
      var dataTypeDetail = data.repairTypeDetail;
	    var repairTypeConfmName1;
      var repairTypeConfmName2;
      var buildingConfmName;
      if(dataBuilding!=null&&dataBuilding!=""&&dataBuilding!=undefined){
        building = dataBuilding.name;
        if(dataBuilding.park!=""&&dataBuilding.park!=""&&dataBuilding.park!=undefined){
          park = dataBuilding.park.name;
        }
      }
      if(dataTypeDetail!=null&&dataTypeDetail!=""&&dataTypeDetail!=undefined){
        repairTypeDetail = dataTypeDetail.name;
        if(dataTypeDetail.settingDict!=""&&dataTypeDetail.settingDict!=""&&dataTypeDetail.settingDict!=undefined){
          settingDict = data.repairTypeDetail.settingDict.name;
        }
      }
	  if(data.repairTypeConfmDetail != null && data.repairTypeConfmDetail != "" && data.repairTypeConfmDetail != undefined){
        repairTypeConfmName2 = data.repairTypeConfmDetail.name;
        if(data.repairTypeConfmDetail.settingDict != null && data.repairTypeConfmDetail.settingDict != ""
          && data.repairTypeConfmDetail.settingDict != undefined){
          repairTypeConfmName1 = data.repairTypeConfmDetail.settingDict.name;
        }
      }
      if(data.buildingConfmDetail != null && data.buildingConfmDetail != "" && data.buildingConfmDetail != undefined){
        buildingConfmName = data.buildingConfmDetail.name;
      }
      this.setState({
        Detail: data,
        building:building,
        park:park,
        repairTypeDetail:repairTypeDetail,
        settingDict:settingDict,
        httpUrl:config.httpUrl+ data.photoUrl,
		    repairTypeConfmName1:repairTypeConfmName1,
        repairTypeConfmName2:repairTypeConfmName2,
        buildingConfmName:buildingConfmName,
      });

      if(data.photoUrl===""||data.photoUrl===null){
          this.setState({
            displayImg:'none'
          })
      }
    });
	var myServerDetail2 = config.myServerDetailUrl2+obj;//取消预约的object
    requestGET(myServerDetail2).then((data) => {//从配置文件中读取url
      console.log(data.result[0]);
      var result = data.result[0];
      this.setState({
        assignTime:result.assignTime,
        arriveTime:result.arriveTime,
      })
    });
    var myServerDetail3 = config.myServerDetailUrl3+obj;//取消预约的object
    requestGET(myServerDetail3).then((data) => {//从配置文件中读取url
      var repairHistorys = [];
      // var repairCreateTimes = [];
      // var repairMemos = [];
      for(var i = 0; i < data.result.length; i++){
        var result = data.result[i];
        var repairHistoryContent = {};
        repairHistoryContent.repairCreateTime = result.createTime;
        repairHistoryContent.repairMemo = result.memo;
        repairHistorys.push(repairHistoryContent);
      }
      this.setState({
        repairCreateTime:repairHistorys,
        // repairMemo:repairMemos,
      });
    });
  };
  render() {
    const {repairCreateTime,repairMemo} = this.state;
    var repairHistory = "";
    if(repairCreateTime.length > 0){
      repairHistory = repairCreateTime.map((data)=>
        <p >
        <p>{data.repairCreateTime}---{data.repairMemo}</p>
        </p>);

    }
    return (
      <div>
        <div>
          <img
            className="MyXiaozhi_img"
            src={require('../../../assets/mine/mine-title.jpg')}/>
        </div>

          <Card className="card_none">
            <div className="MyServer_div">
              <h2>{this.state.Detail.serialNumber}</h2>
              <h3>基本信息</h3>
              <ul>
                <WingBlank>
              <li>报&nbsp;&nbsp;修&nbsp;&nbsp;人：{this.state.Detail.applicant}</li>
              <li>联系方式：{this.state.Detail.contact}</li>
              <li>申请日期：{this.state.Detail.createDate}</li>
              <li>固定电话：{this.state.Detail.mobile}</li>
              <li>公司名称：{this.state.Detail.company}</li>
                </WingBlank>
              </ul>
              <h3>区域信息</h3>
              <ul>
                <WingBlank>
              <li>园&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;区：{this.state.park}</li>
              <li>楼&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;宇：{this.state.building}</li>
                  <li>报修地址：<p className="detail_p">{this.state.Detail.address}</p></li>
                </WingBlank>
              </ul>
              <h3>报修信息</h3>
              <ul>
                <WingBlank>
              <li>报修类别：{this.state.settingDict}-{this.state.repairTypeDetail}</li>
              <li style={{display:this.state.isIT}}>报修时间：{this.state.Detail.appointDate}</li>
              <li>报修图片：</li>
              <img className="MyServer_div_img" style={{display:this.state.displayImg}} src={this.state.httpUrl}/>
              <li>报修描述：<p className="detail_p">{this.state.Detail.description}</p></li>
              <li>备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注：<p className="detail_p">{this.state.Detail.memo}</p></li>
                </WingBlank>
              </ul>
              <h2>派工信息</h2>
              <h3>报修信息（修改后）</h3>
              <ul>
                <WingBlank>
                <li>报修类别：{this.state.repairTypeConfmName1}-{this.state.repairTypeConfmName2}</li>
                <li>楼&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;宇：{this.state.buildingConfmName}</li>
                <li>报修描述：{this.state.Detail.descriptionConfm}</li>
                <li>派工时间：{this.state.assignTime}</li>
                </WingBlank>
              </ul>
              <h2>维修信息</h2>
              <h3>节点信息</h3>
              <ul className="Detail_bottom">
                <WingBlank>
                <li  style={{display:this.state.isIT}}>抵达时间：{this.state.arriveTime}</li>
                <li>维修记录：<p className="detail_p">{repairHistory}</p></li>
                {/*<li>维修内容：{this.state.repairMemo}</li>*/}
                </WingBlank>
              </ul>

            </div>
          </Card>
      </div>
    );
  }
}

export default Detail;
