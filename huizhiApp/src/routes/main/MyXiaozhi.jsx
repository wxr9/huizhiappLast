import React from 'react';
import { List } from 'antd-mobile';
import { createForm } from 'rc-form';
import { Link } from 'react-router';

import MyXiaozhiPart1 from '../../components/main/MyXiaozhi/MyXiaozhiPart1';
import MyXiaozhiPart2 from '../../components/main/MyXiaozhi/MyXiaozhiPart2';
import '../../components/main/MyXiaozhi/MayXiaozhi.less'

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
          <img
            className="MyXiaozhi_img"
            src={require('../../assets/mine/mine-title.jpg')}/>
        <MyXiaozhiPart1/>
        <MyXiaozhiPart2/>
      </form>
    );
  }
}
const MyXiaozhiWrapper = createForm()(MyXiaozhi);
export default MyXiaozhiWrapper;
