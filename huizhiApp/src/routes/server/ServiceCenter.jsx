import React from 'react';
import { Link } from 'react-router';

import ServiceCenter_part1 from "../../components/server/ServiceCenter/ServiceCenter_part1";
import '../../components/server/ServiceCenter/server.less'

class ServiceCenter extends React.Component {
  render() {
    return (
      <div>
        <img
          className="server-img"
          src={require('../../assets/service/service-title.jpg')}/>
        <ServiceCenter_part1/>
      </div>
    );
  }
}
export default ServiceCenter;

