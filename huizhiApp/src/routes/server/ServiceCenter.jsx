import React from 'react';
import {List} from 'antd-mobile';
import {Link} from 'react-router';

const Item = List.Item;

class ServiceCenter extends React.Component {
  render() {
    return (
      <List>
        {/*左边部分*/}
        <div style={{
          float: 'left',
          width: '49%',
          align: 'center',
          borderLeft: '1px solid white',
          borderBottom: '1px solid white',
        }}>
          <Link to="index/propertyRepair">
            <img className="service-image" src={require('../../assets/service/service-p1.jpg')} alt="icon"
                 onClick={() => {
                 }}/>
          </Link>
          <Link to="index/instruction">
            <img className="service-image" src={require('../../assets/service/service-p3.jpg')} alt="icon"
                 onClick={() => {
                 }}/>
          </Link>
          <Link to="index/Bound">
            <img className="service-image" src={require('../../assets/service/service-p5.jpg')} alt="icon"
                 onClick={() => {
                 }}/>
          </Link>
        </div>

        {/*右边部分*/}
        <div style={{
          float: 'right',
          width: '49%',
          align: 'center',
          borderLeft: '1px solid white',
          borderBottom: '1px solid white',
        }}>
          <Link to="index/itRepair">
            <img className="service-image" src={require('../../assets/service/service-p2.jpg')} alt="icon"
                 onClick={() => {
                 }}/>
          </Link>
          <Link to="Recharge">
            <img className="service-image" src={require('../../assets/service/service-p4.jpg')} alt="icon"
                 onClick={() => {
                 }}/>
          </Link>
          <Link to="index/unbound">
            <img className="service-image" src={require('../../assets/service/service-p6.jpg')} alt="icon"
                 onClick={() => {
                 }}/>
          </Link>
        </div>
      </List>

    );
  }
}
export default ServiceCenter;






