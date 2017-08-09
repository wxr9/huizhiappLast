import React from 'react';
import BoatOrderTop from '../../components/server/boatOrder/BoatOrderTop';
import BoatOrderBar from '../../components/server/boatOrder/BoatOrder';
import autoLoginUtil from '../../utils/autoLoginUtil';
// 游船预约
class BoatOrder extends React.Component {
  componentWillMount () {
    //判断登录是否超时
    autoLoginUtil();
  }
  render() {
    return (
      <div>
        <BoatOrderTop/>
        <BoatOrderBar />
      </div>
    );
  }
}
export default BoatOrder;
