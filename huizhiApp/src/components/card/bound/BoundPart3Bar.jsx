import React from 'react';
import {Card, Icon, Grid} from 'antd-mobile';
import { Link } from 'react-router';

import '../Unbound/unbound.less';

const data = Array.from(new Array(9)).map((_val, i) => ({
  icon: 'https://os.alipayobjects.com/rmsportal/IptWdCkrtkAUfjE.png',
  text: `name${i}`,
}));
{ /* ------------------------------汇智卡已绑定第三部分-----------------使用帮助-------------------*/
}
class BoundBar extends React.Component {
  render() {
    return (
      <div>
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
      </div>
    );
  }
}
export default BoundBar;
