import React from 'react';
import {Card, Icon, Grid} from 'antd-mobile';
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
      </div>
    );
  }
}
export default BoundBar;
