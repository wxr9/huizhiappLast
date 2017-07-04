import React from 'react';
import { Link } from 'react-router';
import { Card,WhiteSpace,WingBlank,Button,Grid,Icon} from 'antd-mobile';

import './unbound.less'

class part1 extends React.Component {

  render() {
    return (
      <div>
        <Link to="index/Index">
          <div>
            <img
              className="Unbound_img"
              src={require('../../../assets/card/card-p1.jpg')}/>
          </div>
        </Link>
      </div>
    );
  }
}

export default part1;
