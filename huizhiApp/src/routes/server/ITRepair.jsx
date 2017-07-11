import React from 'react';
import ITRepairBar from '../../components/server/ITRepair/ITRepairBar';

import '../../components/server/ITRepair/ITRepair.less'
// IT维修
class ServiceRepair extends React.Component {
  render() {
    return (
      <div>
        <img
          className="ITRepair_img"
          src={require('../../assets/service/service-title.jpg')}/>
        <ITRepairBar />
      </div>
    );
  }
}
export default ServiceRepair;
