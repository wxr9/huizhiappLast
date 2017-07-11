import React from 'react';
import { List, Badge, Flex, WhiteSpace, Tabs, Card } from 'antd-mobile';
import { Link } from 'react-router';
import requestGET from '../../../utils/requestGET';
import request from '../../../utils/request';
import config from '../../../config';
import './PersonNotify.less';

const TabPane = Tabs.TabPane;
// 个人消息中心第一部分--标签页选卡项
class PersonNotify1 extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      infoList: []
    };
  }

  componentWillMount () {
    requestGET(config.notificationUrl).then((data) => {//从配置文件中读取url
      var infoList = data;
      this.setState({
        infoList : infoList
      })
      console.log(infoList);
    });
  }
  render() {
    const {infoList} = this.state;
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
                      <Flex style={{ width: '100%', fontSize: '20px ' }}>
                        <Flex.Item style={{ color: '#3DA6DD' }}>业务处理提醒</Flex.Item>
                        <Flex.Item style={{ width: '300px' }}>2017-7-10 13:41:24</Flex.Item>
                      </Flex>
                    </div>}
                />
                <Card.Body>
                  <div>hehe</div>
                </Card.Body>
              </Card>
            </div>
          </TabPane>
          {/*<TabPane tab="回应" key="2">*/}
            {/*<div className="personNotify_par1_div_huiying">*/}
              {/*选项卡二内容*/}
            {/*</div>*/}
          {/*</TabPane>*/}
        </Tabs>
        <WhiteSpace />
      </div>
    );
  }
}
export default PersonNotify1;
