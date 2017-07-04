import React from 'react';
import { Link } from 'react-router';
import { List, WingBlank, Card, Flex } from 'antd-mobile';
import './card.less';

class BoundBar extends React.Component {
  render() {
    return (
      <div>
        <Link to="index/Index">
          <div className="index_part1">
            <img className="index_part1-img" src={require('../../../assets/card/card-p1.jpg')} alt="图片" />
          </div>
        </Link>
        <div className="index-part1-warp">
          <WingBlank
            className="index-part1-wingblank" size="sm"
          >
            <List>
              <Card>
                <div className="index-part1-card">汇智卡号：1234***9123</div>
                <div className="index-part1-card-div">
                  <Flex>
                    <Flex.Item>
                      <div className="index-part1-flex">电子钱包余额</div>
                      <div className="index-part1-flex-item">
                        <div className="index-part1-flex-item-div">***</div>
                      </div>
                    </Flex.Item>
                    <Flex.Item>
                      <div className="index-part1-flex">主账户余额</div>
                      <div className="index-part1-flex-item-wrap">
                        <div className="index-part1-flex-item-div">***</div>
                      </div>
                    </Flex.Item>
                  </Flex>
                </div>
                <Card.Footer className="index-part1-flex" content={'（以卡内实际金额为准，单位：元）'} />
              </Card>
            </List>
          </WingBlank>
        </div>
      </div>
    );
  }
}
export default BoundBar;
