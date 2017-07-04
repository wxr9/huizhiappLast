import React from 'react';
import { List, WingBlank, Card, Tag, Icon, Tabs } from 'antd-mobile';
import { createForm } from 'rc-form';
import { Link } from 'react-router';

const TabPane = Tabs.TabPane;
const Item = List.Item;

// 我的小智面板
class MyXiaozhiPart2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal1: false,
    };
  }

  render() {
    const { getFieldProps } = this.props.form;

    return (
      <WingBlank
        style={{
          marginTop: '5px',
        }} size="sm"
      >
        <List>
          <Card>
            <Card.Body>
              <Tabs>
                <TabPane tab="我的服务" key="1">
                  <div style={{ display: 'flex' }}>
                    <Tabs>
                      <TabPane tab="全部" key="1">
                        <div style={{ display: 'flex'}}>
                          <List style={{fontsize:'5' }}>
                            <Item wrap arrow="horizontal" multipleLine>
                              <div>流水号：123456798</div>
                              <div>时间：2017-06-27 14:02</div>
                              <div>类别：物业维修</div>
                              <div>状态：待处理</div>
                            </Item>
                            <Item wrap arrow="horizontal" multipleLine>
                              <div>流水号：123456798</div>
                              <div>时间：2017-06-27 14:02</div>
                              <div>类别：物业维修</div>
                              <div>状态：待处理</div>
                            </Item>
                          </List>
                        </div>
                        <Icon type="left" />
                        <Icon type="right" />
                      </TabPane>
                      <TabPane tab="未完成" key="2">
                        <div style={{ display: 'flex', backgroundColor: '#f00' }}>
                          选项卡二内容
                        </div>
                      </TabPane>
                      <TabPane tab="已完成" key="3">
                        <div style={{ display: 'flex', backgroundColor: '#0f0' }}>
                          选项卡二内容
                        </div>
                      </TabPane>
                    </Tabs>
                  </div>
                </TabPane>
                <TabPane tab="我的申请" key="2">
                  <div style={{ display: 'flex' }}>
                    <Tabs>
                      <TabPane tab="职位申请" key="1">
                        <div style={{ display: 'flex', backgroundColor: '#00f' }}>
                          选项卡一内容
                        </div>
                      </TabPane>
                      <TabPane tab="个人培训报名" key="2">
                        <div style={{ display: 'flex', backgroundColor: '#f00' }}>
                          选项卡二内容
                        </div>
                      </TabPane>
                      <TabPane tab="企业集中登记" key="3">
                        <div style={{ display: 'flex', backgroundColor: '#0f0' }}>
                          选项卡二内容
                        </div>
                      </TabPane>
                      <TabPane tab="企业汇智卡申请" key="4">
                        <div style={{ display: 'flex', backgroundColor: '#0f0' }}>
                          选项卡二内容
                        </div>
                      </TabPane>
                    </Tabs>
                  </div>
                </TabPane>
              </Tabs>
            </Card.Body>
          </Card>
        </List>
      </WingBlank>
    );
  }
}
const MyXiaozhiPart2Wrapper = createForm()(MyXiaozhiPart2);
export default MyXiaozhiPart2Wrapper;
