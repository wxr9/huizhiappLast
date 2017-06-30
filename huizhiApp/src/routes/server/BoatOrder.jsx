import { List, InputItem, DatePicker } from 'antd-mobile';
import React from 'react';
import { createForm } from 'rc-form';
import moment from 'moment';
import 'moment/locale/zh-cn';

const zhNow = moment().locale('zh-cn').utcOffset(8);
const maxDate = moment('2017-06-29 +0800', 'YYYY-MM-DD Z').utcOffset(8);
const minDate = moment('1900-01-01 +0800', 'YYYY-MM-DD Z').utcOffset(8);
const Item = List.Item;
// 游船预约
class BoatOrder extends React.Component {
  state = {
    phonenum: false,
  }

  render() {
    const { getFieldProps } = this.props.form;
    return (
      <div>
        <List
          className="date-picker-list"
          style={{ backgroundColor: 'white' }}
        >
          <InputItem
            {...getFieldProps('username')}
            clear
            placeholder="请输入预约人"
            autoFocus
          >用户名</InputItem>

          <InputItem
            {...getFieldProps('autofocus2')}
            clear
            placeholder="请输入所属公司"
            autoFocus
          >所属公司</InputItem>

          <InputItem
            {...getFieldProps('phone')}
            type="phone"
            placeholder="186 1234 1234"
          >手机号码</InputItem>

          <DatePicker
            mode="date"
            title="选择日期"
            extra="请选择"
            {...getFieldProps('date', {
              initialValue: zhNow,
            })}
            minDate={minDate}
            maxDate={maxDate}
          >
            <List.Item arrow="horizontal">预约日期</List.Item>
          </DatePicker>

          <DatePicker mode="time" {...getFieldProps('time')} minuteStep={5}>
            <List.Item arrow="horizontal">预约时间(local time)</List.Item>
          </DatePicker>

          <InputItem
            {...getFieldProps('money', {
              initialValue: '1',
            })}
            clear
            placeholder="请输入数量"
            autoFocus
          >预约数量</InputItem>

          <List style={{ float: 'right', width: '60%' }}>
            <InputItem
              {...getFieldProps('inputtitle2')}
              placeholder="请输入验证码"
            />
          </List>
          <div style={{ width: '3rem', height: '1.1rem' }}>
            <img src="http://222.73.203.71:8080/WiseAuth/AuthImageServlet" style={{ width: '1.8rem', height: '0.7rem', marginTop: '10px', marginLeft: '1em' }} alt="image" />
          </div>
          <List>
            <Item>
              <div style={{ height: 500 }} />
            </Item>
          </List>

        </List>
      </div>
    );
  }
}
const BoatOrderWraper = createForm()(BoatOrder);
export default BoatOrderWraper;
