import { Modal,List, Picker, WingBlank, Button, InputItem, DatePicker, TextareaItem, Select, Cascader, Toast } from 'antd-mobile';
import React from 'react';
import { createForm } from 'rc-form';
import moment from 'moment';
import 'moment/locale/zh-cn';

import config from '../../../config';
import './UserInfo.less'
import requestGET from '../../../utils/requestGET';
import requestPOST from '../../../utils/requestPOST';

const alert = Modal.alert;
const maxDate = moment().locale('zh-cn').utcOffset(8);
const minDate = moment('1900/01/01 +0800', 'YYYY/MM/DD Z').utcOffset(8);
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
      initEdu:[],
      initNation:[],
      initApartCity:[],
      initHomeCity:[],
      initSignature:"",
      initBirthday:"",
    };
  }


  componentWillMount () {
    //从缓存中读取用户个人信息
    var userInfo = JSON.parse(localStorage.userInfo);
    console.log("userInfo.workYears",userInfo.workYears);

    this.setState({
      userInfo : userInfo
    })

    //城市获取
    var proUrl = config.cityDicUrl.replace("{ParentId}","1000001");
    requestGET(proUrl).then((data) => {//一级菜单获取
      var proList = data.result;//异步获取数据，必须定义为const
      var proData = "";
      for (var i=0; i<proList.length; i++){
        proData = proList[i];
        const proObj={};//异步获取数据，必须定义为const
        proObj.label = proData.name;
        proObj.value = proData.objectid;
        requestGET(config.cityDicUrl.replace("{ParentId}",proData.objectid)).then((data) => {//二级菜单获取
          cityArrTemp = [];
          var cityList = data.result;
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
          this.setState({
            city: cityArr
          })
        });
      }
    });

    //学历获取
    requestGET(config.eduDicUrl).then((data) => {//从配置文件中读取url
      var  dataList = data.result;
      var data = "";
      for (var i=0; i<dataList.length; i++){
        data = dataList[i];
        var obj={};
        obj.label = data.name;
        obj.value = data.objectid;
        educationArr.push(obj);
      }
      this.setState({
        education: educationArr
      })
    });

    //国籍获取
    requestGET(config.nationDicUrl).then((data) => {//从配置文件中读取url
      var  dataList = data.result;
      var data = "";
      for (var i=0; i<dataList.length; i++){
        data = dataList[i];
        var obj={};
        obj.label = data.name;
        obj.value = data.objectid;
        nationArr.push(obj);
      }
      this.setState({
        nation: nationArr
      })
    });
    //户籍地初始化
    if (userInfo.settingHometowntCity != null) {
      var settingCity = userInfo.settingHometowntCity.settingCity;
      if(settingCity == null || settingCity == undefined || settingCity == ""){
        return;
      }
      var objectid = settingCity.objectid;
      var hometownCity = userInfo.hometownCity;
      this.setState({
        initHomeCity:[objectid,hometownCity]
      })
    }
    //居住地初始化
    if (userInfo.settingApartmentCity != null) {
      var settingCity = userInfo.settingApartmentCity.settingCity;
      if(settingCity == null || settingCity == undefined || settingCity == ""){
        return;
      }
      var objectid = settingCity.objectid;
      var apartmentCity = userInfo.apartmentCity;
      this.setState({
        initApartCity:[objectid,apartmentCity]
      })
    }
  //  个性签名初始化
    if (userInfo.signature != null) {
      var signature = userInfo.signature;
      this.setState({
        initSignature:signature
      })
    }
//出生日期初始化
    if (userInfo.birthday != null) {
      var birthday = moment(userInfo.birthday).utcOffset(8);
      this.setState({
        initBirthday:birthday
      })
    }
  }


  //提交
  onSubmit = () => {
    //轻提示，1秒后消失
      this.props.form.validateFields({force: true}, (error) => {
        if (!error) {
          var userInfo = this.props.form.getFieldsValue();
          console.log("userInfo", userInfo);
          if (userInfo.birthDay == undefined || userInfo.birthDay == null || userInfo.birthDay == "") {
            alert("请选择生日！");
            return;
          }
          if (userInfo.nation[0] == undefined || userInfo.nation[0] == null || userInfo.nation[0] == "" || userInfo.nation[0] == 0) {
            alert("请选择国籍！");
            return;
          }
          if (userInfo.area.length <= 0) {
            alert("请选择户籍地！");
            return;
          }
          if (userInfo.residence.length <= 0) {
            alert("请选择居住地！");
            return;
          }
          var birthDay = userInfo.birthDay._d.toISOString().slice(0, 10).toString().replace("-", "/").replace("-", "/");
          console.log("workYear", userInfo.workYear);
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
            workYears: parseInt(userInfo.workYear),
          };
          console.log("data", data);
          // 表单提交post请求
          Toast.loading('提交中...', 0);
          requestPOST(config.editUserInfoUrl, data).then((data) => {//从配置文件中读取url，GET请求
            if (data.success) {//保存成功
              Toast.hide();
              //重新获取个人信息，写入缓存
              requestGET(config.userInfoUrl).then((data) => {//从配置文件中读取url，GET请求
                userInfo = JSON.stringify(data);
                localStorage.userInfo = userInfo;//个人信息存入缓存
                //跳转首页
                alert("保存成功", '', [
                  {text: '确认', onPress: () => window.location.href = "#index/Index", style: {fontWeight: 'bold'}},
                ]);
              });
            } else {
              Toast.hide();
              alert(reData.msg);
            }
          }).catch(function (error) {
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
    // const {userInfo} = this.state;
    const {userInfo} = this.state;

    return (
      <form>
        <div>
          <List
            className="date-picker-list UserInfo_div_list"
          >
          <InputItem
            className="UserInfo-list-item"
            {...getFieldProps('userName',{
              initialValue: userInfo.username,
            })}
            clear
            placeholder="请输入用户名"
            autoFocus
            editable={false}
          ><span className="ApplyCard_label_color"> </span>用户名</InputItem>

          <InputItem
            className="UserInfo-list-item"
            {...getFieldProps('nickName',{
              initialValue: userInfo.name,
            })}
            clear
            placeholder="请输入昵称"
            maxLength="20"
            autoFocus
          ><span className="ApplyCard_label_color"> </span>昵称</InputItem>

          <Picker data={sex} className="forss" cols={1}
                  {...getFieldProps('sex',{
                    initialValue: [ userInfo.sex],
                  })}>
            <List.Item arrow="horizontal" className="UserInfo_picker">
              <span className="ApplyCard_label_color"> </span>性别</List.Item>
          </Picker>
          <InputItem
            className="UserInfo-list-item"
            {...getFieldProps('realName', {
              initialValue: userInfo.realName,
            })}
            clear
            placeholder="请输入真实姓名"
            autoFocus
            maxLength="20"
          ><span className="ApplyCard_label_color"> </span>真实姓名</InputItem>
          <DatePicker
            mode="date"
            title="选择日期"
            extra="请选择"
            {...getFieldProps('birthDay', {
              initialValue: this.state.initBirthday,
            })}
            minDate={minDate}
            maxDate={maxDate}
          >
            <List.Item arrow="horizontal" className="UserInfo_picker">
              <span className="ApplyCard_label_color">*</span>出生日期</List.Item>
          </DatePicker>
          <InputItem
            className="UserInfo-list-item"
            {...getFieldProps('workYear',{
              initialValue:userInfo.workYears,
            })}
            clear
            placeholder="请输入工作年限"
            autoFocus
            maxLength="2"
            type="number"
          ><span className="ApplyCard_label_color">*</span>工作年限</InputItem>
          <Picker data={this.state.nation}
                  extra="请选择"
                  cols={1}  className="forss"
                  {...getFieldProps('nation',{
            initialValue: [ userInfo.nation],
          })}>
            <List.Item arrow="horizontal" className="UserInfo_picker">
              <span className="ApplyCard_label_color">*</span>国籍</List.Item>
          </Picker>
          <Picker extra="请选择" cols={2}
                    data={cityArr}
                    title="选择地区"
                    {...getFieldProps('area',{
                      // initialValue: [ userInfo.settingHometowntCity.settingCity.objectid, userInfo.hometownCity ],
                      initialValue: this.state.initHomeCity,
                    })}
                    onOk={e => console.log('ok', e)}
                    onDismiss={e => console.log('dismiss', e)}
          >
            <List.Item arrow="horizontal" className="UserInfo_picker">
              <span className="ApplyCard_label_color">*</span>户籍地</List.Item>
          </Picker>
          <Picker extra="请选择" cols={2}
                    data={cityArr}
                    title="选择地区"
                    {...getFieldProps('residence',{
                      // initialValue: [ userInfo.settingApartmentCity.settingCity.objectid, userInfo.apartmentCity ],
                      initialValue: this.state.initApartCity,
                    })}
                    onOk={e => console.log('ok', e)}
                    onDismiss={e => console.log('dismiss', e)}
          >
            <List.Item arrow="horizontal" className="UserInfo_picker">
              <span className="ApplyCard_label_color">*</span>居住地</List.Item>
          </Picker>
          <InputItem
            className="UserInfo-list-item"
            {...getFieldProps('companyName',{
              initialValue: userInfo.enterpriseInput,
            })}
            clear
            placeholder="请输入企业名称"
            autoFocus
          ><span className="ApplyCard_label_color"> </span>企业名称</InputItem>

          <Picker data={marry} cols={1} className="forss"
                  {...getFieldProps('isMarry',{
            initialValue: [ userInfo.marital],
          })}>
            <List.Item arrow="horizontal" className="UserInfo_picker">
              <span className="ApplyCard_label_color"> </span>婚否</List.Item>
          </Picker>
          <Picker className="forss" data={this.state.education} cols={1}
                  {...getFieldProps('education',{
                    initialValue: [userInfo.education],
                  })}>
            <List.Item arrow="horizontal" className="UserInfo_picker">
              <span className="ApplyCard_label_color"> </span>学历</List.Item>
          </Picker>
          <TextareaItem
            className="UserInfo_TextareaItem"
            title="&nbsp;&nbsp;&nbsp;个性签名"
            {...getFieldProps('perSignature',{
              // initialValue: userInfo.signature,
              initialValue: this.state.initSignature
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
          <WingBlank>
              <Button
                className="boatOrder_submit" type="primary" onClick={this.onSubmit}
              >提交</Button>
          </WingBlank>
      </div>
    </form>
    );
  }
}
const UserInfoWrapper =  createForm()(UserInfo1);
export default UserInfoWrapper;
