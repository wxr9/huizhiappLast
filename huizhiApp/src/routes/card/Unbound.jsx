import React from 'react';
import { Link } from 'react-router';
import { Card,WhiteSpace,WingBlank,Button,Grid,Icon} from 'antd-mobile';

import Part1 from '../../components/card/Unbound/part1.jsx';
import Part2 from '../../components/card/Unbound/part2.jsx';
import Part3 from '../../components/card/Unbound/part3.jsx';
import Part4 from '../../components/card/Unbound/part4.jsx';
import autoLoginUtil from '../../utils/autoLoginUtil';
class Unbound extends React.Component {
  componentWillMount () {
    //判断登录是否超时
    autoLoginUtil();
  }
  render() {
    return (
      <div>
        <Part1/>
        <Part2/>
        <Part3/>
        <Part4/>
      </div>
    );
  }
}

export default Unbound;
