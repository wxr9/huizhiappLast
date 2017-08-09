import React from 'react';
import { List, Badge, Flex, WhiteSpace, Tabs, Card } from 'antd-mobile';
import { Link } from 'react-router';

import './PersonNotify.less';

const TabPane = Tabs.TabPane;
// 个人消息中心第一部分--标签页选卡项
class PersonNotify1 extends React.Component {
  constructor (props) {
    super(props);
  }
  render() {
    const {msg} = this.props;
    return (
      <div>
        <Tabs className="personNotify_notice">
          <TabPane tab={<div><div>通知</div><div className="index_tishi2">{msg}</div></div>}>
          </TabPane>
        </Tabs>
        <WhiteSpace />
      </div>
    );
  }
}
export default PersonNotify1;
