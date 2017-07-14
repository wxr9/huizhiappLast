import { Modal,List, Picker, WingBlank, Button, InputItem, DatePicker, TextareaItem, Select, Cascader } from 'antd-mobile';
import React from 'react';
import { createForm } from 'rc-form';
import moment from 'moment';
import 'moment/locale/zh-cn';
import Qs from 'qs';

import config from '../../../config';
import axios from 'axios';
import './UserInfo.less'

const alert = Modal.alert;
const zhNow = moment().locale('zh-cn').utcOffset(8);
const maxDate = moment('2017/06/29 +0800', 'YYYY/MM/DD Z').utcOffset(8);
const minDate = moment('1900/01/01 +0800', 'YYYY/MM/DD Z').utcOffset(8);
const gmtNow = moment().utcOffset(0);
const sex = [{ label: '男', value: 1 }, { label: '女', value: 2 }];
const marry = [{ label: '已婚', value: 2 }, { label: '未婚', value: 1 }];

var count = 0;
var educationArr = [];
var cityArr = [];
var nationArr = [];
var cityArrTemp = [];

class UserInfo1 extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      userInfo: [],
      education : [],
      nation : [],
      city : []
    };
  }


  componentWillMount () {
    //从缓存中读取用户个人信息
    var userInfo = JSON.parse(sessionStorage.userInfo);
    this.setState({
      userInfo : userInfo
    })

    //城市获取
    var proUrl = config.cityDicUrl.replace("{ParentId}","1000001");
    axios.get(proUrl).then(function(response){//一级菜单获取
      const proList = response.data.result;//异步获取数据，必须定义为const
      var proData = "";
      for (var i=0; i<proList.length; i++){
        proData = proList[i];
        const proObj={};//异步获取数据，必须定义为const
        proObj.label = proData.name;
        proObj.value = proData.objectid;
        axios.get(config.cityDicUrl.replace("{ParentId}",proData.objectid)).then(function(response){//二级菜单获取
          cityArrTemp = [];
          var cityList = response.data.result;
          var cityData = "";
          for (var j=0; j<cityList.length; j++) {
            cityData = cityList[j];
            var cityObj = {};
            cityObj.label = cityData.name;
            cityObj.value = cityData.objectid;
            cityArrTemp.push(cityObj);
          }
          proObj.children = cityArrTemp;
          cityArr.push(proObj);
        });
      }
    });

    //学历获取
    axios.get(config.eduDicUrl).then(function(response){//从配置文件中读取url，GET请求
      var  dataList = response.data.result;
      var data = "";
      for (var i=0; i<dataList.length; i++){
        data = dataList[i];
        var obj={};
        obj.label = data.name;
        obj.value = data.objectid;
        educationArr.push(obj);
      }
    });

    //国籍获取
    axios.get(config.nationDicUrl).then(function(response){//从配置文件中读取url，GET请求
      var  dataList = response.data.result;
      var data = "";
      for (var i=0; i<dataList.length; i++){
        data = dataList[i];
        var obj={};
        obj.label = data.name;
        obj.value = data.objectid;
        nationArr.push(obj);
      }
    });
  }
  componentDidMount(){
    this.setState({
      education : educationArr,
      nation : nationArr,
      city : cityArr,
    })
  }

  //提交
  onSubmit = () => {
    this.props.form.validateFields({ force: true }, (error) => {
      if (!error) {
        var userInfo = this.props.form.getFieldsValue();
        console.log("userInfo",userInfo);
        var birthDay = userInfo.birthDay._d.toISOString().slice(0,10).toString().replace("-","/").replace("-","/");
        // console.log(birthDay);

        var data = {
          username: userInfo.userName,
          name: userInfo.nickName,
          sex: userInfo.sex[0],
          hometownCity: userInfo.area[1],
          birthday: birthDay,
          enterpriseInput: userInfo.companyName,
          education: userInfo.education[0],
          marital: userInfo.isMarry[0],
          nation: userInfo.nation[0],
          signature: userInfo.perSignature,
          realName: userInfo.realName,
          apartmentCity: userInfo.residence[1],
          workyears: userInfo.workYear
        };
        console.log("data",data);
        // post请求
        axios.post(config.editUserInfoUrl,Qs.stringify(data)).then(function(response){//从配置文件中读取url，POST请求
          var reData = response.data;
          if(reData.success){//保存成功
            //跳转首页
            window.location.href="#index/Index";
          }else{
            alert(reData.msg);
          }
        }).catch(function(error){
          console.log(error);
        });
      } else {
        alert('校验失败');
      }
    });
  }
  _onChange(evt){
    this.setState({
      value: evt.target.value
    })
  }

  render() {
    const { getFieldProps } = this.props.form;
    const {userInfo} = this.state;

    return (
      <form>
        <div>
          <List
            className="date-picker-list UserInfo_div_list"
          >
          <InputItem
            {...getFieldProps('userName',{
              initialValue: userInfo.username,
            })}
            clear
            placeholder="请输入用户名"
            autoFocus
            editable={false}
          >用户名</InputItem>

          <InputItem
            {...getFieldProps('nickName',{
              initialValue: userInfo.name,
            })}
            clear
            placeholder="请输入昵称"
            maxLength="20"
            autoFocus
          >昵称</InputItem>

          <Picker data={sex} className="forss" cols={1}
                  {...getFieldProps('sex',{
                    initialValue: [ userInfo.sex],
                  })}>
            <List.Item arrow="horizontal">性别</List.Item>
          </Picker>
          <InputItem
            {...getFieldProps('realName', {
              initialValue: userInfo.realName,
            })}
            clear
            placeholder="请输入真实姓名"
            autoFocus
            maxLength="20"
          >真实姓名</InputItem>
          <DatePicker
            mode="date"
            title="选择日期"
            extra="请选择"
            {...getFieldProps('birthDay', {
              initialValue: zhNow,
            })}
            minDate={minDate}
            maxDate={maxDate}
          >
            <List.Item arrow="horizontal">出生日期</List.Item>
          </DatePicker>
          <InputItem
            {...getFieldProps('workYear',{
              initialValue:'0'
            })}
            clear
            placeholder="请输入工作年限"
            autoFocus
            maxLength="2"
            type="number"
          >工作年限</InputItem>
          <Picker data={this.state.nation} cols={1}  className="forss"
                  {...getFieldProps('nation',{
            initialValue: [ userInfo.settingNation.objectid ],
          })}>
            <List.Item arrow="horizontal">国籍</List.Item>
          </Picker>
          <Picker extra="请选择" cols={2}
                    data={cityArr}
                    title="选择地区"
                    {...getFieldProps('area',{
                      initialValue: [ userInfo.settingHometowntCity.settingCity.objectid, userInfo.settingHometowntCity.objectid ],
                    })}
                    onOk={e => console.log('ok', e)}
                    onDismiss={e => console.log('dismiss', e)}
          >
            <List.Item arrow="horizontal">户籍地</List.Item>
          </Picker>
          <Picker extra="请选择" cols={2}
                    data={cityArr}
                    title="选择地区"
                    {...getFieldProps('residence',{
                      initialValue: [ userInfo.settingApartmentCity.settingCity.objectid, userInfo.settingApartmentCity.objectid ],
                    })}
                    onOk={e => console.log('ok', e)}
                    onDismiss={e => console.log('dismiss', e)}
          >
            <List.Item arrow="horizontal">居住地</List.Item>
          </Picker>
          <InputItem
            {...getFieldProps('companyName',{
              initialValue: userInfo.enterpriseInput,
            })}
            clear
            placeholder="请输入企业名称"
            autoFocus
          >企业名称</InputItem>

          <Picker data={marry} cols={1} className="forss"
                  {...getFieldProps('isMarry',{
            initialValue: [ userInfo.marital],
          })}>
            <List.Item arrow="horizontal">婚否</List.Item>
          </Picker>
          <Picker className="forss" data={this.state.education} cols={1}
                  {...getFieldProps('education',{
                    initialValue: [userInfo.settingDict.objectid],
                  })}>
            <List.Item arrow="horizontal">学历</List.Item>
          </Picker>
          <TextareaItem
            title="个性签名"
            {...getFieldProps('perSignature',{
              initialValue: userInfo.signature,
            })}
            placeholder="请输入个性签名"
            data-seed="logId"
            autoHeight
            maxLength="140"
            focused={this.state.focused}
            onFocus={() => {
              this.setState({
                focused: false,
              });
            }}
          />
        </List>
          <WingBlank className="login-wingBlank">
            <div className="btn-container">
              <Button
                className="btn-login" type="primary" onClick={this.onSubmit} inline
              >提交</Button>
            </div>
          </WingBlank>
      </div>
    </form>
    );
  }
}
const UserInfoWrapper =  createForm()(UserInfo1);
export default UserInfoWrapper;
