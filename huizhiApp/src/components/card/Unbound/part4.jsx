import { Link } from 'react-router';
import { Card,Icon} from 'antd-mobile';

import './unbound.less';

const Text = () => (
<Card
  className="Unbound_part2 card_none">
  <Card.Header className="Unbound_part2_header"
    title="汇智卡使用帮助"
    thumb={require('../../../assets/card/card-qmark.png')}
  />
  <Card.Body className="Unbound_part4_cardBody">
    <div style={{float:'left',textAlign:'center'}}>
      <ul >
        <li>
          <Icon
            type={require('../../../assets/card/card-unbound-help1.svg')}
            className="Unbound_img_svg_help"
          />
        </li>
        <li>
          <Icon
            type={require('../../../assets/card/card-unbound-help.svg')}
            className="Unbound_part4_middle"/>
        </li>
        <li>
          <Icon
            type={require('../../../assets/card/card-unbound-help2.svg')}
            className="Unbound_img_svg_help"
          />
        </li>
        <li>
          <Icon
            type={require('../../../assets/card/card-unbound-help.svg')}
            className="Unbound_part4_middle"/>
        </li>  <li>
        <Icon
          type={require('../../../assets/card/card-unbound-help3.svg')}
          className="Unbound_img_svg_help"
        />
      </li>
        <li>
          <Icon
            type={require('../../../assets/card/card-unbound-help.svg')}
            className="Unbound_part4_middle"/>
        </li>
        <li>
          <Icon
            type={require('../../../assets/card/card-unbound-help4.svg')}
            className="Unbound_img_svg_help"
          />
        </li>
      </ul>
    </div>
  </Card.Body>
</Card>
);

export default Text;
