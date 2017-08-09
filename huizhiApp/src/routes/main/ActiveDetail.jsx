import React from 'react';
import { List,ImagePicker,Button} from 'antd-mobile';
import { Link } from 'react-router';

import ActiveDetail_1 from "../../components/main/ActiveDetail/part1";
import autoLoginUtil from '../../utils/autoLoginUtil';

// 头像设置
class ActiveDetail extends React.Component {
  componentWillMount () {
    //判断登录是否超时
    autoLoginUtil();
  }
  render() {
    return (
      <div className="ActiveDetail">
        <ActiveDetail_1/>
      </div>
    );
  }
}

export default ActiveDetail;
