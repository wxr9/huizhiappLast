import React from 'react';
import ITRepairBar from '../../components/server/ITRepair/ITRepairBar';

import '../../components/server/ITRepair/ITRepair.less';
import autoLoginUtil from '../../utils/autoLoginUtil';
// IT维修
class ServiceRepair extends React.Component {
  componentWillMount () {
    //判断登录是否超时
    autoLoginUtil();
  }
  render() {
    return (
      <div>
        <img
          className="ITRepair_img"
          src={require('../../assets/service/service-it.jpg')}/>
        <ITRepairBar />
      </div>
    );
  }
}
export default ServiceRepair;
