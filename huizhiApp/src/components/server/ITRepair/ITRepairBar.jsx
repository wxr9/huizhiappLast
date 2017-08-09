import React from 'react';
import { createForm } from 'rc-form';
import {List, Picker, InputItem, DatePicker, TextareaItem, ImagePicker, WingBlank, Button,Modal, Toast } from 'antd-mobile';
import { Link } from 'react-router';
import moment from 'moment';
import 'moment/locale/zh-cn';
import Qs from 'qs';
import axios from 'axios';
import config from '../../../config';
import './ITRepair.less'
import requestGET from '../../../utils/requestGET';
import request from '../../../utils/requestPOST';
import requestPOSTHeader from '../../../utils/requestPOSTHeader';

const image = [];
const alert = Modal.alert;

var parkId = [];
var buildingTemp = [];
var repairType = [];
var repairTypeTemp = [];

class ITRepairForm extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      userInfo: [],
      files: image,
      btnDisable:"",
      imageUrl:[],
    };
  }

  /*验证手机号*/
  validatePhone = (rule, value, callback) => {
    value = value.replace(" ","").replace(" ","");
    var re = /^1[34578]\d{9}$/;
    if(re.test(value)){
      callback();
    }else{
      callback(new Error('手机号格式错误！'));
    }
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
  /*验证固定电话*/
  validatefixPhone = (rule, value, callback) => {
    var re = /^(\d{8})?$/;
    if(value === null || value === undefined){
      callback();
    }
    if(re.test(value)){
      callback();
    }else{
      callback(new Error('固定电话格式错误！'));
    }
  }
  componentWillMount () {
    //从缓存中读取用户个人信息
    var userInfo = JSON.parse(localStorage.userInfo);
    this.setState({
      userInfo : userInfo
    })

    /*获取园区和楼宇信息*/
    var proUrl = config.parkUrl;
    requestGET(proUrl).then((data) => {//一级菜单获取
      const proList = data.result;
      var proData = "";
      for (var i=0; i<proList.length; i++){
        proData = proList[i];
        const proObj={};
        proObj.label = proData.name;
        proObj.value = proData.objectid;
        requestGET(config.buildingUrl.replace("{ParentId}",proData.objectid)).then((data) => {//一级菜单获取
          buildingTemp = [];
          var buildingList = data.result;
          var buildingData = "";
          for (var j=0; j<buildingList.length; j++) {
            buildingData = buildingList[j];
            var buildingObj = {};
            buildingObj.label = buildingData.name;
            buildingObj.value = buildingData.objectid;
            buildingTemp.push(buildingObj);
          }
          proObj.children = buildingTemp;
          parkId.push(proObj);
          this.setState({
            parkId: parkId
          })
        });
      }
    });
    /*获取报修信息*/
    var proUrl = config.ITrepairsUrl;
    requestGET(proUrl).then((data) => {//一级菜单获取
      const proList = data.result;
      var proData = "";
      for (var i=0; i<proList.length; i++){
        proData = proList[i];
        const proObj={};
        proObj.label = proData.name;
        proObj.value = proData.objectid;
        requestGET(config.settingDictUrl.replace("{ParentId}",proData.objectid)).then((data) => {//一级菜单获取
          repairTypeTemp = [];
          var repairTypeList = data.result;
          var repairTypeData = "";
          for (var j=0; j<repairTypeList.length; j++) {
            repairTypeData = repairTypeList[j];
            var repairTypeobj = {};
            repairTypeobj.label = repairTypeData.name;
            repairTypeobj.value = repairTypeData.objectid;
            repairTypeTemp.push(repairTypeobj);
          }
          proObj.children = repairTypeTemp;
          repairType.push(proObj);
          this.setState({
            repairType: repairType
          })
        });
      }
    });
  }
  _onChange(evt){
    this.setState({
      value: evt.target.value
    })
  }
  onChange = (files, type, index) => {
    Toast.loading('图片上传中...', 0);
    this.setState({
      files,
    });
    //文件上传的post请求参数
    var formData = this.base64ToBlob(this.state.files[0]);
    //设置请求头
    var header={
      'content-type': 'multipart/form-data',
    }
    //post请求
    requestPOSTHeader(config.SimpleUploadFileUrl,formData,header).then((reData)=>{//SimpleUploadFileUrl
      if(reData.success) {//成功
        Toast.hide();
        this.setState({
          imageUrl:reData.path,
        });
      }else {
        Toast.hide();
        alert(reData.msg);
      }
    });
  }

  //图片格式转换
  base64ToBlob = (file) => {
    var base64 = file.url;
    const byteString = atob(base64.split(',')[1]);
    const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0, len = byteString.length; i < len; i += 1) {
      ia[i] = byteString.charCodeAt(i);
    }

    let blobUrl;
    blobUrl = new Blob([ab], { type: mimeString });

    const fd = new FormData();

    fd.append('file', blobUrl, file.file.name);

    return fd
  }

  onSubmit = () => {
      this.props.form.validateFields({ force: true }, (error) => {
        if (!error) {
          var repairInfo = this.props.form.getFieldsValue();
          console.log(repairInfo);
         var createDate = moment().utcOffset(0)._d;
          createDate = createDate.toString().slice(0,33);
          console.log("createDate:"+createDate);
          var fixPhone="";
          if(repairInfo.fixPhone!=undefined || repairInfo.fixPhone!=null){
            fixPhone = repairInfo.fixPhone.replace(" ","").replace(" ","");
          }
          console.log(fixPhone);
          var company = repairInfo.company;
          var phone = repairInfo.phone.replace(" ","").replace(" ","");
          console.log(phone);
          console.log(repairInfo.area);
          if(repairInfo.area!=undefined || repairInfo.fixPhone!=null){
            var parkId = repairInfo.area[0];
            var buildingId = repairInfo.area[1];
          }else{
            alert("请选择区域/园区！");
            return;
          }
          var address = repairInfo.address;
          if(repairInfo.repairType!=undefined  || repairInfo.fixPhone!=null){
            var repairTypeParent = repairInfo.repairType[0];
            var repairType = repairInfo.repairType[1];
          }else{
            alert("请选择报修类型！");
            return;
          }
          //图片上传
          // this.imgUpload();

          var description = repairInfo.description;
          var memo = repairInfo.memo;
          var typeId = 2;
          //从缓存中读取
          var userInfo = localStorage.userInfo;
          //json转换为Object对象
          var  reData = JSON.parse(userInfo);
          //读取用户ID
          // console.log(reData.username);
          var applicant = reData.username;
          var imgUrl = "";
          if(this.state.imageUrl[0] != undefined && this.state.imageUrl[0] != null){
            imgUrl = this.state.imageUrl[0];
          }
          var data = {
            repairType: repairType,
            company: company,
            description:description,
            address:address,
            parkId:parkId,
            buildingId:buildingId,
            repairTypeParent:repairTypeParent,
            contact:phone,//手机号
            mobile:fixPhone,//固话
            applicant:applicant,
            memo:memo,
            typeId:typeId,
            photoUrl:imgUrl,
            createDate:createDate
          };
          console.log(data);
          Toast.loading('提交中...', 0);
          //获取IT报修的某些字段
          var workflowData = {};
          requestGET(config.WorkflowCreate+typeId).then((firstData)=>{
            console.log(firstData);
            if(firstData.success === false){
              Toast.hide();
              alert(firstData.msg);
              return;
            }else{
              workflowData = firstData;

              //IT报修表单提交
              request(config.userRepairUrl,data).then((secondData) => {//从配置文件中读取url
                console.log("userRepairUrl data",secondData);
                if(secondData.success){
                  var data2 = {
                    identity_field_value:secondData.objectid,
                    process_id:workflowData.process,
                    related_table:workflowData.related_table,
                    sn:secondData.sn,
                    task_id:workflowData.task_id,
                    task_user:workflowData.task_user,
                    title:secondData.sn
                  };
                  console.log("newTransferUrl data",data2);
                  //执行流转
                  request(config.newTransferUrl,data2).then((data) => {//从配置文件中读取url
                    console.log("newTransferUrl data",data);
                    if(data.success){
                      Toast.hide();
                      alert("提交成功！", '', [
                        { text: '确认', onPress: () => window.location.href="#index/Index", style: {fontWeight: 'bold'} },
                      ]);
                    }else{
                      Toast.hide();
                      alert(data.msg);
                    }
                  });

                }else{
                  Toast.hide();
                  alert(secondData.msg);
                }
              });
            }
          });

        } else {
          alert('校验失败');
        }
      });

  }
  render() {
    const { getFieldProps, getFieldError } = this.props.form;
    const {files,userInfo} = this.state;
    return (
      <form className="ITRepair_div">
        <List renderHeader={() => '基本信息'} >
          <InputItem className="ITRepair-list-item"
                     {...getFieldProps('phone',{
                       initialValue: userInfo.phone,
                       rules: [
                         { required: true, message: '请输入手机号' },
                         { validator: this.validatePhone },
                       ],
                     })}
                     clear
                     type="number"
                     placeholder="18612341234"
                     maxLength = "11"
                     error={!!getFieldError('phone')}
                     onErrorClick={() => {
                       alert(getFieldError('phone').join('、'));
                     }}
          ><span className="ApplyCard_label_color">*</span>手机号码</InputItem>
          <InputItem className="ITRepair-list-item"
                     {...getFieldProps('company',{
                       initialValue: userInfo.enterpriseInput,
                       rules: [
                         { required: true, message: '请输入公司名称' },
                         { validator: this.validateCompany },
                       ],
                     })}
                     clear
                     maxLength = "30"
                     placeholder="请输入公司名称"
                     autoFocus
                     error={!!getFieldError('company')}
                     onErrorClick={() => {
                       alert(getFieldError('company').join('、'));
                     }}
          ><span className="ApplyCard_label_color">*</span>公司名称</InputItem>
          <InputItem className="ITRepair-list-item"
                     {...getFieldProps('fixPhone',{
                       rules: [
                         { validator: this.validatefixPhone },
                       ],
                     })}
                     error={!!getFieldError('fixPhone')}
                     onErrorClick={() => {
                       alert(getFieldError('fixPhone').join('、'));
                     }}
                     type="number"
                     maxLength="8"
          ><span className="ApplyCard_label_color"> </span>固定电话</InputItem>
        </List>

        <List renderHeader={() => '区域信息'} className="ITRepair_picker">
          <Picker extra="请选择" cols={2}
                  data={parkId}
                  title="选择园区和楼宇"
                  {...getFieldProps('area')}
                  onOk={e => console.log('ok', e)}
                  onDismiss={e => console.log('dismiss', e)}
          >
            <List.Item arrow="horizontal"><span className="ApplyCard_label_color">*</span>园区/楼宇</List.Item>
          </Picker>
          <InputItem
            className="ITRepair-list-item"
            {...getFieldProps('address',{
              rules: [
                { required: true, message: '请输入地址' },
              ],
            })}
            clear
            placeholder="如：金京路1139路A座"
            autoFocus
            error={!!getFieldError('address')}
            onErrorClick={() => {
              alert(getFieldError('address').join('、'));
            }}
          ><span className="ApplyCard_label_color">*</span>地址详情</InputItem>
        </List>

        <List renderHeader={() => '报修信息'}  className="ITRepair_picker">
          <Picker extra="请选择" cols={2}
                  data={repairType}
                  title="选择报修类别和子类"
                  {...getFieldProps('repairType')}
                  onOk={e => console.log('ok', e)}
                  onDismiss={e => console.log('dismiss', e)}
          >
            <List.Item arrow="horizontal"><span className="ApplyCard_label_color">*</span>
              报修类别/子类</List.Item>
          </Picker>
          <span className="ApplyCard_label_color it_mShu">*</span>
          <TextareaItem
            className="ITRepair_TextareaItem "
            title="&nbsp;&nbsp;&nbsp;报修描述"
            {...getFieldProps('description',{
              rules: [
                { required: true, message: '请输入描述' },
              ],
            })}
            placeholder="100字以内（必填）"
            data-seed="logId"
            clear
            maxLength="100"
            autoHeight
            focused={this.state.focused}
            onFocus={() => {
              this.setState({
                focused: false,
              });
            }}
            error={!!getFieldError('description')}
            onErrorClick={() => {
              alert(getFieldError('description').join('、'));
            }}
          />
          <TextareaItem
            className="ITRepair_TextareaItem"
            title="&nbsp;&nbsp;&nbsp;备注"
            {...getFieldProps('memo')}
            placeholder="100字以内"
            data-seed="logId"
            autoHeight
            maxLength="100"
            focused={this.state.focused}
            onFocus={() => {
              this.setState({
                focused: false,
              });
            }}
          />
        </List>
        <List renderHeader={() => '报修照片'} className="ITRepair_photo">
          <ImagePicker
            files={files}
            onChange={this.onChange}
            onImageClick={(index, fs) => console.log(index, fs)}
            selectable={files.length < 1}
          />
        </List>
        <WingBlank>
          <Button
            disabled={this.state.btnDisable}
            className="boatOrder_submit" type="primary"  onClick={this.onSubmit}
          >提交</Button>
        </WingBlank>
      </form>
    );
  }
}
const ITRepairBar = createForm()(ITRepairForm);
export default ITRepairBar;
