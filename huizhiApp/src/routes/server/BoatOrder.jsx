import React from 'react';
import BoatOrderTop from '../../components/server/boatOrder/BoatOrderTop';
import BoatOrderBar from '../../components/server/boatOrder/BoatOrder';

// 游船预约
class BoatOrder extends React.Component {
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
