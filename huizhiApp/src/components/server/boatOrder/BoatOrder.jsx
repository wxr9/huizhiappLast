import React from 'react';
import {List, InputItem, DatePicker, WingBlank, Button, Modal, Picker, Toast } from 'antd-mobile';
import {createForm} from 'rc-form';
import {Link} from 'react-router';
import moment from 'moment';
import 'moment/locale/zh-cn';
import './boatOrder.less';
import config from '../../../config';
import requestGET from '../../../utils/requestGET';
import request from '../../../utils/requestPOST';
import axios from 'axios';
import Qs from 'qs';

var zhNow;
const alert=Modal.alert;
const dingTime = [];

// 游船预约
class BoatOrderBar extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      imgUrl: config.codeImgUrl,
      userInfo: [],
    };
  }

  /*验证公司*/
  validateCompany = (rule, value, callback) => {
    // value = value.replace(" ","").replace(" ","");
    var re = /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、\s+]/im;
    if(!re.test(value)){
      callback();
    }else{
      callback(new Error('公司名包含特殊字符！'));
    }
  }
  /*验证手机号*/
  validateMobile = (rule, value, callback) => {
    this.focus;
    // value = value.replace(" ","").replace(" ","");
    var re = /^1[34578]\d{9}$/;
    if(re.test(value)){
      callback();
    }else{
      callback(new Error('手机号格式错误！'));
    }
  }
  validatedingNumber = (rule, value, callback)=>{
  this.focus;
  // value = value.replace(" ","").replace(" ","");
    if(value>=1){
      callback();
    }else{
      callback(new Error('预约数量不能小于1'));
    }
  }
  componentWillMount () {
    zhNow = moment().locale('zh-cn').utcOffset(0);
    //从缓存中读取用户个人信息
    var userInfo = JSON.parse(localStorage.userInfo);
    this.setState({
      userInfo : userInfo
    })
    /*获取游船预约的预约时间*/
    requestGET(config.BoatTimeUrl).then((data) => {//一级菜单获取
      console.log(data);
      for(var i = 0; i < data.length; i++){
        var eachTime = data[i];
        var supTimeObj = {};
        supTimeObj.label = eachTime[0];
        supTimeObj.value = eachTime[0] + ":00";
        var eachTimeChild = [];
        var childTimeObj = {};
        childTimeObj.label = eachTime[1];
        childTimeObj.value = eachTime[1] + ":00";
        eachTimeChild.push(childTimeObj);
        supTimeObj.children = eachTimeChild;
        dingTime.push(supTimeObj);
      }
      console.log(dingTime);
    })
  }
  onSubmit = () => {
    //轻提示，1秒后消失
      this.props.form.validateFields({force: true}, (error) => {
        if (!error) {
          var orderInfo = this.props.form.getFieldsValue();

          var realname = orderInfo.realname;
          var company = orderInfo.company;
          var mobile = orderInfo.mobile;
          var dingNumber = orderInfo.dingNumber;
          var yueTime = orderInfo.yuDingTime;

          var dingDate = orderInfo.dingDate._d;
          dingDate = dingDate.toISOString().slice(0, 10);

          //此处为北京时间加8小时，为下方toISOString（转为标准时间的字符串）转换时减8小时做准备
          var nowDataTime = moment().locale('zh-cn').utcOffset(8);
          var nowData = nowDataTime._d.toISOString().slice(0,10);
          var nowTime = nowDataTime._d.toISOString().slice(11,19);
          console.log(dingDate.replace("-","").replace("-",""));
          console.log(nowData.replace("-","").replace("-",""));
          var date1 = dingDate.replace("-","").replace("-","");
          var date2 = nowData.replace("-","").replace("-","");
          console.log(yueTime[0]);
          console.log(nowTime);
          if(date1 <= date2 && yueTime[0] < nowTime){
            alert("预约时间已过，请重新选择时间");
          } else{
            var orderData = {
              email: this.state.userInfo.email,
              // username: username,
              company: company,
              mobile: mobile,
              dingStartTime: dingDate + " " + yueTime[0],
              dingEndTime: dingDate + " " + yueTime[1],
              dingNumber: dingNumber,
              name: realname,
            };
            console.log(orderData);
            Toast.loading('提交中...', 0)
            axios.post(config.boatOrder, Qs.stringify(orderData)).then(function (response) {//从配置文件中读取url，POST请求
              var reData = response.data;
              console.log(reData);
              if (reData.success) {//成功
                Toast.hide();
                alert("预约成功！", '', [
                  {text: '确认', onPress: () => window.location.href = "#index/MyXiaozhi", style: {fontWeight: 'bold'}},
                ]);
              } else {
                Toast.hide();
                alert(reData.msg);
              }
            });
          }


        } else {//游船验证失败
          alert("校验失败");
        }
      });
  }

  render() {
    const { getFieldProps, getFieldError } = this.props.form;
    const {userInfo} = this.state;
    return (
      <form>
        <List className="date-picker-list">
          <InputItem className="boatOrder-list-item"
                     {...getFieldProps('realname',{
                       initialValue: userInfo.realName,
                       rules: [
                         { required: true, message: '请输入预约人' },
                       ],
                     })}
                     clear
                     placeholder="请输入预约人"
                     autoFocus
                     error={!!getFieldError('realname')}
                     onErrorClick={() => {
                       alert(getFieldError('realname').join('、'));
                     }}
          ><span className="ApplyCard_label_color">*</span>姓名</InputItem>

          <InputItem className="boatOrder-list-item"
            {...getFieldProps('company',{
              initialValue: userInfo.enterpriseInput,
              rules: [
                { required: true, message: '请输入所属公司' },
                { validator: this.validateCompany },
              ],
            })}
            clear
            maxLength = "30"
            placeholder="请输入所属公司"
            autoFocus
                     error={!!getFieldError('company')}
                     onErrorClick={() => {
                       alert(getFieldError('company').join('、'));
                     }}
          ><span className="ApplyCard_label_color">*</span>所属公司</InputItem>

          <InputItem className="boatOrder-list-item"
                     {...getFieldProps('mobile',{
                       initialValue: userInfo.phone,
                       rules: [
                         { required: true, message: '请输入手机号' },
                         { validator: this.validateMobile },
                       ],
                     })}
                     clear
                     maxLength = "11"
                     type="number"
                     placeholder="18612341234"
                     error={!!getFieldError('mobile')}
                     onErrorClick={() => {
                       alert(getFieldError('mobile').join('、'));
                     }}
          ><span className="ApplyCard_label_color">*</span>手机号码</InputItem>

          <DatePicker
            className="boatOrder_DatePicker"
            mode="date"
            title="选择日期"
            extra="请选择"
            {...getFieldProps('dingDate', {
              initialValue: zhNow,
            })}
            minDate={zhNow}
            // maxDate={maxDate}
          >
            <List.Item arrow="horizontal"   className="boatOrder_DatePicker">
              <span className="ApplyCard_label_color">*</span>预约日期</List.Item>
          </DatePicker>

          <Picker extra="请选择" cols={2}
                  data={ dingTime }
                  title="选择时间"
                  {...getFieldProps('yuDingTime', {
                    initialValue: ['10:00:00','10:30:00'],
                  })}
          >
            <List.Item arrow="horizontal"  className="boatOrder_DatePicker">
              <span className="ApplyCard_label_color">*</span>预约时间</List.Item>
          </Picker>
          <InputItem className="boatOrder-list-item"
            {...getFieldProps('dingNumber', {
              initialValue: '1',
              rules: [
                { validator: this.validatedingNumber },
                { required: true, message: '请输入数量' },
              ],
            })}
            clear
            placeholder="请输入数量"
                     type="number"
                      autoFocus
                     error={!!getFieldError('dingNumber')}
                     onErrorClick={() => {
                       alert(getFieldError('dingNumber').join('、'));
                     }}
          ><span className="ApplyCard_label_color">*</span>预约数量</InputItem>
        </List>
        <WingBlank>
          <Button
            className="boatOrder_submit" type="primary" onClick={() => {this.onSubmit()}}
          >提交</Button>
        </WingBlank>
      </form>
    );
  }
}
const BoatOrderBarWrap = createForm()(BoatOrderBar);
export default BoatOrderBarWrap;
