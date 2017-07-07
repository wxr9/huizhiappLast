import React from 'react';
import { Link } from 'react-router';
import './server.less';

class ServiceCenter_part1 extends React.Component {
  render() {
    return (
      <div className="server-center-bg">
        {/* 左边部分*/}
        <div className="server-center-left">
          <Link to="index/propertyRepair">
            <img
              className="server-left-image" src={require('../../../assets/service/service-p1.jpg')} alt="image"
              onClick={() => {
              }}
            />
          </Link>
          <Link to="index/instruction">
            <img
              className="server-left-image" src={require('../../../assets/service/service-p3.jpg')} alt="image"
              onClick={() => {
              }}
            />
          </Link>
          <Link to="index/Bound">
            <img
              className="server-left-image" src={require('../../../assets/service/service-p5.jpg')} alt="image"
              onClick={() => {
              }}
            />
          </Link>
        </div>

        {/* 右边部分*/}
        <div className="server-center-right">
          <Link to="index/itRepair">
            <img
              className="server-right-image" src={require('../../../assets/service/service-p2.jpg')} alt="image"
              onClick={() => {
              }}
            />
          </Link>
          <Link to="Recharge">
            <img
              className="server-right-image" src={require('../../../assets/service/service-p4.jpg')} alt="image"
              onClick={() => {
              }}
            />
          </Link>
          <Link to="index/unbound">
            <img
              className="server-right-image" src={require('../../../assets/service/service-p6.jpg')} alt="image"
              onClick={() => {
              }}
            />
          </Link>
        </div>
      </div>
    );
  }
}
export default ServiceCenter_part1;

