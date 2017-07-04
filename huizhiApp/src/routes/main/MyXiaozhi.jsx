import React from 'react';
import { List } from 'antd-mobile';
import { createForm } from 'rc-form';
import { Link } from 'react-router';
import MyXiaozhiPart1 from '../../components/main/MyXiaozhi/MyXiaozhiPart1';
import MyXiaozhiPart2 from '../../components/main/MyXiaozhi/MyXiaozhiPart2';

// 我的小智面板
class MyXiaozhi extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal1: false,
    };
  }

  render() {
    const { getFieldProps } = this.props.form;

    return (
      <form>
        <List>
          <img style={{width:'100%',height:'auto'}} src={require('../../assets//mine/mine-p1.jpg')} alt="图片" />
        </List>
        <MyXiaozhiPart1/>
        <MyXiaozhiPart2/>
      </form>
    );
  }
}
const MyXiaozhiWrapper = createForm()(MyXiaozhi);
export default MyXiaozhiWrapper;
