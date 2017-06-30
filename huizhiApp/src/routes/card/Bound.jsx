import React from 'react';
import { Link } from 'react-router';
import { List, WingBlank, Card, Grid, Flex, Icon } from 'antd-mobile';

const data = Array.from(new Array(9)).map((_val, i) => ({
  icon: 'https://os.alipayobjects.com/rmsportal/IptWdCkrtkAUfjE.png',
  text: `name${i}`,
}));
// 汇智卡已绑定
class Bound extends React.Component {

  render() {
    return (
      <div style={{ marginTop: '20px' }}>

        <Link to="index/Index">
          <div className="index_part1">
            <img style={{ width: '100%', height: 'auto' }} src={require('../../assets/card/card-p1.jpg')} alt="图片" />
          </div>
        </Link>
        <div style={{ margin: '5px,16px,16px,10px' }}>
          <WingBlank
            style={{
              marginTop: '5px',
            }} size="sm"
          >
            <List>
              <Card>
                <div style={{ textAlign: 'center', margin: '10px,10px,10px,0' }}>汇智卡号：1234***9123</div>
                <div style={{ margin: '10px' }}>
                  <Flex>
                    <Flex.Item>
                      <div style={{ textAlign: 'center' }}>电子钱包余额</div>
                      <div
                        style={{
                          textAlign: 'center',
                          borderWidth: '1px',
                          borderStyle: 'dashed',
                          borderColor: '#ffaa00',
                          marginLeft: '15%',
                          marginRight: '15%',
                          marginTop: '5px',
                        }}
                      >
                        <div style={{ margin: '5px', padding: '10px', backgroundColor: '#e1e1e5' }}>***</div>
                      </div>
                    </Flex.Item>
                    <Flex.Item>
                      <div style={{ textAlign: 'center' }}>主账户余额</div>
                      <div
                        style={{
                          textAlign: 'center',
                          borderWidth: '1px',
                          borderStyle: 'dashed',
                          borderColor: '#ffaa00',
                          marginLeft: '15%',
                          marginRight: '15%',
                          marginTop: '5px',
                        }}
                      >
                        <div style={{ margin: '5px', padding: '10px', backgroundColor: '#e1e1e5' }}>***</div>
                      </div>
                    </Flex.Item>
                  </Flex>
                </div>
                <Card.Footer style={{ textAlign: 'center' }} content={'（以卡内实际金额为准，单位：元）'} />
              </Card>
            </List>
          </WingBlank>
        </div>

        <Card className=" Unbound_part2" style={{ border: 'none' }}>
          <div >
            <div className="Unbound_content ">
              <ul className="Unbound_content_ul clearfix">

                <Link className="Unbound_link" to="Recharge">
                  <li>
                    <Icon type={require('../../assets/card/card-recharge.svg')} className="tabSelect-icon" />
                    <p>充值</p>
                  </li>
                </Link>
                <Link className="Unbound_link" to="TransactionQuery">
                  <li className="two" onClick={{}}>
                    <Icon type={require('../../assets/card/card-detail.svg')} className="tabSelect-icon" />
                    <p>交易明细查询</p>
                  </li>
                </Link>
                <Link className="Unbound_link" to="index/unbunding">
                  <li>
                    <Icon type={require('../../assets/card/card-unbund.svg')} className="tabSelect-icon" />
                    <p>解绑</p>
                  </li>
                </Link>
                <Link className="Unbound_link">
                  <li>
                    <Icon type={require('../../assets/card/card-unhang.svg')} className="tabSelect-icon" />
                    <p>挂失</p>
                  </li>
                </Link>
                <Link className="Unbound_link">
                  <li className="two">
                    <Icon type={require('../../assets/card/card-lose.svg')} className="tabSelect-icon" />
                    <p>解挂</p>
                  </li>
                </Link>
                <Link className="Unbound_link">
                  <li>
                    <Icon type={require('../../assets/card/card-red.svg')} className="tabSelect-icon" />
                    <p>红包管理</p>
                  </li>
                </Link>
              </ul>
            </div>
          </div>
        </Card>

        {/* ------------------------------第三部分-----------------汇智卡使用帮助-------------------*/}
        <Card className="Unbound_part2" style={{ border: 'none' }}>
          <Card.Header
            title="汇智卡使用帮助"
            thumb={require('../../assets/card/card-qmark.png')}
            // thumb={require('../../assets/card-qmark.svg')}
          />
          <Card.Body>
            <div>
              <Grid data={data} columnNum={7} hasLine={false} />
            </div>
          </Card.Body>

        </Card>


      </div>
    );
  }
}
export default Bound;
