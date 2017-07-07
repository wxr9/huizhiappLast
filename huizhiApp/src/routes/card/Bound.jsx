import React from 'react';
import BoundPart1 from '../../components/card/bound/BoundPart1Bar';
import BoundPart2 from '../../components/card/bound/BoundPart2Bar';
import BoundPart3 from '../../components/card/bound/BoundPart3Bar';


// 汇智卡已绑定
class Bound extends React.Component {

  render() {
    return (
        <div>
          <BoundPart1 />
          <BoundPart2 />
          <BoundPart3 />
        </div>
    );
  }
}
export default Bound;
