import { List, Picker, InputItem, DatePicker, TextareaItem, Select, Cascader } from 'antd-mobile';
import React from 'react';
import { createForm } from 'rc-form';
import moment from 'moment';
import 'moment/locale/zh-cn';

const zhNow = moment().locale('zh-cn').utcOffset(8);
const maxDate = moment('2017-06-29 +0800', 'YYYY-MM-DD Z').utcOffset(8);
const minDate = moment('1900-01-01 +0800', 'YYYY-MM-DD Z').utcOffset(8);
const seasons = [{ label: '男', value: '男' }, { label: '女', value: '女' }];
const contry = [{ label: '中国', value: '中国' }, { label: '外国', value: '外国' }];
const marry = [{ label: '已婚', value: '已婚' }, { label: '未婚', value: '未婚' }];
const study = [{ label: '小学', value: '小学' }, { label: '幼儿园', value: '幼儿园' }];
const dis = [[{ label: '上海', value: '上海' }, { label: '浙江', value: '浙江' }],[{ label: '上海市', value: '上海市' }, { label: '杭州', value: '杭州' }]];
//
class UserInfo1 extends React.Component {
  state = {
    value: null,
  };
  onChange = (value) => {
    console.log(value);
    this.setState({
      value,
    });
  };
  onClick = () => {
    setTimeout(() => {
      this.setState({
        data: province,
      });
    }, 120);
  };
  render() {
    const { getFieldProps } = this.props.form;
    return (<div>
      <List
        className="date-picker-list"
        style={{ backgroundColor: 'white' }}
      >
        <InputItem
          {...getFieldProps('autofocus1')}
          clear
          placeholder="请输入用户名"
          autoFocus
        >用户名</InputItem>

        <InputItem
          {...getFieldProps('autofocus2')}
          clear
          placeholder="请输入昵称"
          autoFocus
        >昵称</InputItem>

        <Picker data={seasons} cols={1} {...getFieldProps('district3')} className="forss">
          <List.Item arrow="horizontal">性别</List.Item>
        </Picker>
        <InputItem
          {...getFieldProps('autofocus3')}
          clear
          placeholder="请输入真实姓名"
          autoFocus
        >真实姓名</InputItem>
        <DatePicker
          mode="date"
          title="选择日期"
          extra="请选择"
          {...getFieldProps('date1', {
            initialValue: zhNow,
          })}
          minDate={minDate}
          maxDate={maxDate}
        >
          <List.Item arrow="horizontal">出生日期</List.Item>
        </DatePicker>
        <InputItem
          {...getFieldProps('autofocus4')}
          clear
          placeholder="请输入工作年限"
          autoFocus
        >工作年限</InputItem>
        <Picker data={contry} cols={1} {...getFieldProps('district4')} className="forss">
          <List.Item arrow="horizontal">国籍</List.Item>
        </Picker>
        <Picker
          data={dis}
          title="选择地区"
          {...getFieldProps('district5')}
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
          {...getFieldProps('district6')}
          cascade={false}
          extra="请选择"
          value={this.state.sValue}
          onChange={v => this.setState({ sValue: v })}
        >
          <List.Item arrow="horizontal">居住地</List.Item>
        </Picker>
        <InputItem
          {...getFieldProps('autofocus')}
          clear
          placeholder="请输入企业名称"
          autoFocus
        >企业名称</InputItem>

        <Picker data={marry} cols={1} {...getFieldProps('district7')} className="forss">
          <List.Item arrow="horizontal">婚否</List.Item>
        </Picker>
        <Picker data={study} cols={1} {...getFieldProps('district8')} className="forss">
          <List.Item arrow="horizontal">学历</List.Item>
        </Picker>
        <TextareaItem
          title="个性签名"
          {...getFieldProps('district9')}
          placeholder="请输入个性签名"
          data-seed="logId"
          autoHeight
          focused={this.state.focused}
          onFocus={() => {
            this.setState({
              focused: false,
            });
          }}
        />
      </List>
    </div>);
  }
}
const UserInfoWrapper =  createForm()(UserInfo1);
export default UserInfoWrapper;
