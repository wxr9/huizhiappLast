import { Link } from 'react-router';
import { Card,Icon} from 'antd-mobile';

import './unbound.less';

const Text = () => (
<Card
  className="Unbound_part2 card_none">
  <Card.Header className="Unbound_part2_header"
    title="汇智卡使用帮助"
    thumb={require('../../../assets/card/card-qmark.png')}
    // thumb={require('../../assets/card-qmark.svg')}
  />
  <Card.Body className="Unbound_part4_cardBody">
    <div style={{float:'left',textAlign:'center'}}>
      <ul >
        <li>
          <img  src={require('../../../assets/card/card-unbound-help1.png')}/>
          {/*<div className="Unbound_part4-xz">办卡流程须知</div>*/}
        </li>
        <li>
          <img  src={require('../../../assets/card/card-unbound-help.png')} className="Unbound_part4_middle"/>
        </li>
        <li>
          <img  src={require('../../../assets/card/card-unbound-help2.png')}/>
          {/*<div className="Unbound_part4-xz">换卡解卡须知</div>*/}
        </li>
        <li>
          <img  src={require('../../../assets/card/card-unbound-help.png')} className="Unbound_part4_middle"/>
        </li>
        <li>
          <img  src={require('../../../assets/card/card-unbound-help3.png')}/>
          {/*<div className="Unbound_part4-xz">挂失解挂须知</div>*/}
       </li>
        <li>
          <img  src={require('../../../assets/card/card-unbound-help.png')} className="Unbound_part4_middle"/>
        </li>
        <li>
          <img  src={require('../../../assets/card/card-unbound-help4.png')}/>
          {/*<div className="Unbound_part4-xz">密码重置须知</div>*/}
        </li>
      </ul>
    </div>
  </Card.Body>
</Card>
);

export default Text;
