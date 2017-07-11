import { List, Picker, WingBlank, Button, InputItem, DatePicker, TextareaItem, Select, Cascader } from 'antd-mobile';
import React from 'react';
import { createForm } from 'rc-form';
import moment from 'moment';
import 'moment/locale/zh-cn';

import request from '../../../utils/request';
import config from '../../../config';
import dropDown from '../../../utils/dropDownUtil';

const zhNow = moment().locale('zh-cn').utcOffset(8);
const maxDate = moment('2017-06-29 +0800', 'YYYY-MM-DD Z').utcOffset(8);
const minDate = moment('1900-01-01 +0800', 'YYYY-MM-DD Z').utcOffset(8);
const gmtNow = moment().utcOffset(0);
const sex = [{ label: '男', value: '1' }, { label: '女', value: '2' }];
const marry = [{ label: '已婚', value: '2' }, { label: '未婚', value: '1' }];
const dis = [[{ label: '上海', value: '1' }, { label: '浙江', value: '2' }],
  [{ label: '上海市', value: '3' }, { label: '杭州', value: '4' }]];
var education = dropDown(config.eduDicUrl);
var nation = dropDown(config.nationDicUrl);
// var city = dropDown(config.cityDicUrl);

var count = 0;

class UserInfo1 extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      userInfo: [],
    };
  }


  componentWillMount () {
    //从缓存中读取用户个人信息
    var userInfo = JSON.parse(sessionStorage.userInfo);
    this.setState({
      userInfo : userInfo
    })
  }
  //提交
  onSubmit = () => {
    this.props.form.validateFields({ force: true }, (error) => {
      if (!error) {
        var userInfo = this.props.form.getFieldsValue();
        console.log(userInfo);
        // console.log(userInfo.userName);
        // console.log(userInfo.nickName);
        // console.log(userInfo. sex[0]);
        // console.log(userInfo.realName);
        // alert(userInfo.birthDay._d);
        // console.log(userInfo.workYear);
        // console.log(userInfo.nation[0]);
        // console.log(userInfo.area);
        // console.log(userInfo.isMarry[0]);
        // console.log(userInfo.education[0]);
        // post请求
        var params = "username=ptyh&apartmentCity=510000&education=353&nation=6&hometownCity=510000&workyears=2&sex=1&userFlag=2&marital=1&birthday=1991-10-15&enterpriseInput=kufu";
        console.log(params);
        request(config.editUserUrl,params).then((data) => {//从配置文件中读取url
          var reData = data;
          console.log(reData);
          // if(reData.success){//提交成功
          //
          // }else{//提交失败
          //   alert(reData.msg);
          //   // this.props.form.resetFields();//重置表单的值
          // }
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
            className="date-picker-list"
            style={{ backgroundColor: 'white' }}
          >
          <InputItem
            {...getFieldProps('userName',{
              initialValue: userInfo.username,
            })}
            clear
            placeholder="请输入用户名"
            autoFocus
            editable={false}
            // value={userInfo.username}
          >用户名</InputItem>

          <InputItem
            {...getFieldProps('nickName',{
              initialValue: userInfo.username,
            })}
            clear
            placeholder="请输入昵称"
            maxLength="20"
            autoFocus
          >昵称</InputItem>

          <Picker data={sex} cols={1} {...getFieldProps('sex')} className="forss">
            <List.Item arrow="horizontal">性别</List.Item>
          </Picker>
          <InputItem
            {...getFieldProps('realName', {
              initialValue: '普通用户',
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
          <Picker data={nation} cols={1} {...getFieldProps('nation')} className="forss">
            <List.Item arrow="horizontal">国籍</List.Item>
          </Picker>
          <Picker
            data={dis}
            title="选择地区"
            {...getFieldProps('area')}
            cascade={false}
            extra="请选择"
            value={this.state.sValue}
            onChange={v => this.setState({ sValue: v })}
          >
            <List.Item arrow="horizontal">户籍地</List.Item>
          </Picker>
          <Picker
            data={dis}
            title="选择地区"
            {...getFieldProps('residence')}
            cascade={false}
            extra="请选择"
            value={this.state.sValue}
            onChange={v => this.setState({ sValue: v })}
          >
            <List.Item arrow="horizontal">居住地</List.Item>
          </Picker>
          <InputItem
            {...getFieldProps('companyName')}
            clear
            placeholder="请输入企业名称"
            autoFocus
          >企业名称</InputItem>

          <Picker data={marry} cols={1} {...getFieldProps('isMarry')} className="forss">
            <List.Item arrow="horizontal">婚否</List.Item>
          </Picker>
          <Picker className="forss" data={education} cols={1} {...getFieldProps('education')}>
            <List.Item arrow="horizontal">学历</List.Item>
          </Picker>
          <TextareaItem
            title="个性签名"
            {...getFieldProps('perSignature')}
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
