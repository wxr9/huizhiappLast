import React from 'react';
import {Link} from 'react-router';
import { Carousel, WhiteSpace, WingBlank,Icon } from 'antd-mobile';

import Index_1 from "../../components/main/Index/part1";
import Index_2 from "../../components/main/Index/part2";
import Index_3 from "../../components/main/Index/part3";

class Index extends React.Component {
  render() {
    return (
      <div className="index">
        <Index_1/>
        <Index_2/>
        <Index_3/>
      </div>
    );
  }
}

export default Index;
