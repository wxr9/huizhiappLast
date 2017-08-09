import React from 'react';
import PropertyRepairBar from '../../components/server/propertyRepair/PropertyRepairBar';

import '../../components/server/propertyRepair/PropertyRepair.less'
import autoLoginUtil from '../../utils/autoLoginUtil';
// 物业维修
class ServiceRepair extends React.Component {
  componentWillMount () {
    //判断登录是否超时
    autoLoginUtil();
  }
  render() {
    return (
      <div>
        <img
          className="PropertyRepair_img"
          src={require('../../assets/service/service-pro.jpg')}/>
        <PropertyRepairBar />
      </div>
    );
  }
}
export default ServiceRepair;
