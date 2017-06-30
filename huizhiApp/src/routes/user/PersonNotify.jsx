import React from 'react';
import { List, Badge, Flex, WhiteSpace, Tabs, Card } from 'antd-mobile';
import { Link } from 'react-router';
const TabPane = Tabs.TabPane;
// 个人信息页面
class PersonNotify extends React.Component {
  render() {
    return (
      <div>
        <Tabs>
          <TabPane tab={<div><div>通知</div><div className="index_tishi2">88</div></div>} key="1">
            <div>
              <Card style={{ margin: '5px 8px', padding: '5px 5px' }}>
                <Card.Header
                  style={{ height: '18px', color: 'blue' }}
                  title={
                    <div>
                      <Flex style={{ width: '100%', fontSize: '10px ' }}>
                        <Flex.Item style={{ color: '#3DA6DD' }}>业务通知提醒</Flex.Item>
                        <Flex.Item style={{ width: '200px' }}>2017-6-27 18:25:40</Flex.Item>
                      </Flex>
                    </div>}
                />
                <Card.Body>
                  <div>This is content of `Card`但啊什么的那是动漫社，但是刷单什么的，那手机的哈就肯定会洒家坎大哈客户端框架</div>
                </Card.Body>
              </Card>

              <Card style={{ margin: '5px 8px', padding: '5px 5px' }}>
                <Card.Header
                  style={{ height: '18px', color: 'blue' }}
                  title={
                    <div>
                      <Flex style={{ width: '100%', fontSize: '10px ' }}>
                        <Flex.Item style={{ color: '#3DA6DD' }}>业务通知提醒</Flex.Item>
                        <Flex.Item style={{ width: '200px' }}>2017-6-27 18:25:40</Flex.Item>
                      </Flex>
                    </div>}
                />
                <Card.Body>
                  <div>This is content of `Card`但啊什么的那是动漫社，但是刷单什么的，那手机的哈就肯定会洒家坎大哈客户端框架</div>
                </Card.Body>
              </Card>

              <Card style={{ margin: '5px 8px', padding: '5px 5px' }}>
                <Card.Header
                  style={{ height: '18px', color: 'blue' }}
                  title={
                    <div>
                      <Flex style={{ width: '100%', fontSize: '10px ' }}>
                        <Flex.Item style={{ color: '#3DA6DD' }}>业务通知提醒</Flex.Item>
                        <Flex.Item style={{ width: '200px' }}>2017-6-27 18:25:40</Flex.Item>
                      </Flex>
                    </div>}
                />
                <Card.Body>
                  <div>This is content of `Card`但啊什么的那是动漫社，但是刷单什么的，那手机的哈就肯定会洒家坎大哈客户端框架</div>
                </Card.Body>
              </Card>
            </div>
          </TabPane>
          <TabPane tab="回应" key="2">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '5rem', backgroundColor: '#fff' }}>
              选项卡二内容
            </div>
          </TabPane>
        </Tabs>
        <WhiteSpace />
      </div>
    );
  }
}
export default PersonNotify;
