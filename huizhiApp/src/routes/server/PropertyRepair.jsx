import React from 'react';
import PropertyRepairBar from '../../components/server/propertyRepair/PropertyRepairBar';

import '../../components/server/propertyRepair/PropertyRepair.less'
// 物业维修
class ServiceRepair extends React.Component {
  render() {
    return (
      <div>
        <img
          className="PropertyRepair_img"
          src={require('../../assets/service/service-title.jpg')}/>
        <PropertyRepairBar />
      </div>
    );
  }
}
export default ServiceRepair;
