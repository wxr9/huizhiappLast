import React from 'react';
import { List, Badge, Flex, WhiteSpace, Tabs, Card } from 'antd-mobile';
import { Link } from 'react-router';

import './PersonNotify.less';

const TabPane = Tabs.TabPane;
// 个人消息中心第一部分--标签页选卡项
class PersonNotify1 extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      perNoList: []
    };
  }

  componentWillMount () {
    fetch('http://localhost:3003/user')
      .then(res => res.json())
      .then(res => {
        this.setState({
          perNoList: res
        });
      });
  }
  render() {
    const {perNoList} = this.state;
    return (
      <div>
        <Tabs>
          <TabPane tab={<div><div>通知</div><div className="index_tishi2">88</div></div>} key="1">
            <div>
              {
                perNoList.map((perNo) => {
                  return (
              <Card style={{ margin: '5px 8px', padding: '5px 5px' }}>
                <Card.Header
                  style={{ height: '18px', color: 'blue' }}
                  title={
                    <div>
                      <Flex style={{ width: '100%', fontSize: '20px ' }}>
                        <Flex.Item style={{ color: '#3DA6DD' }}>{perNo.age}</Flex.Item>
                        <Flex.Item style={{ width: '300px' }}>2{perNo.gender}</Flex.Item>
                      </Flex>
                    </div>}
                />
                <Card.Body>
                  <div>{perNo.name}</div>
                </Card.Body>
              </Card>
                  );
                })
              }
            </div>
          </TabPane>
          <TabPane tab="回应" key="2">
            <div className="personNotify_par1_div_huiying">
              选项卡二内容
            </div>
          </TabPane>
        </Tabs>
        <WhiteSpace />
      </div>
    );
  }
}
export default PersonNotify1;
