import { Link } from 'react-router';
import { Card,Icon} from 'antd-mobile';

import './unbound.less';

class Text extends React.Component {
  render() {

    return (
      <Card
        className="Unbound_part2 card_none Unbound_part4_bottom">
        <Card.Header className="Unbound_part2_header"
                     title="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;汇智卡使用帮助"
        />
        <Icon
          type={require('../../../assets/card/card-qmark.svg')}
          className="help_icon"
        />
        <Card.Body className="Unbound_part4_cardBody">
          <div>
            <ul >
              <Link to="notice?key=1">
                <li>
                  <Icon
                    type={require('../../../assets/card/card-unbound-help1.svg')}
                    className="Unbound_img_svg_help"
                  />
                </li>
              </Link>

              <li>
                <Icon
                  type={require('../../../assets/card/card-unbound-help.svg')}
                  className="Unbound_part4_middle"/>
              </li>
              <Link to="notice?key=2">
                <li>
                  <Icon
                    type={require('../../../assets/card/card-unbound-help2.svg')}
                    className="Unbound_img_svg_help"
                  />
                </li>
              </Link>
              <li>
                <Icon
                  type={require('../../../assets/card/card-unbound-help.svg')}
                  className="Unbound_part4_middle"/>
              </li>
              <Link to="notice?key=3">
                <li>
                  <Icon
                    type={require('../../../assets/card/card-unbound-help3.svg')}
                    className="Unbound_img_svg_help"
                  />
                </li>
              </Link>
              <li>
                <Icon
                  type={require('../../../assets/card/card-unbound-help.svg')}
                  className="Unbound_part4_middle"/>
              </li>
              <Link to="notice?key=4">
                <li>
                  <Icon
                    type={require('../../../assets/card/card-unbound-help4.svg')}
                    className="Unbound_img_svg_help"
                  />
                </li>
              </Link>
            </ul>
          </div>
        </Card.Body>
      </Card>
    );
  }
}

export default Text;
