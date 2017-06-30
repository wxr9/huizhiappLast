import React from 'react';
import { List, Switch, WingBlank, Card, Flex, Tag, Icon, Tabs } from 'antd-mobile';
import { createForm } from 'rc-form';
import { Link } from 'react-router';

const TabPane = Tabs.TabPane;
const Item = List.Item;

// 我的小智面板
class MyXiaozhi extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal1: false,
    };
  }

  render() {
    const { getFieldProps } = this.props.form;

    return (
      <form>
        <List>
          <img style={{width:'100%',height:'auto'}} src={require('../../assets//mine/mine-p1.jpg')} alt="图片" />
        </List>
        <WingBlank
          style={{
            marginTop: '5px',
          }} size="sm"
        >
          <List>
            <Card>
              <div style={{textAlign:'center',margin:'10px,10px,10px,0'}}>汇智卡号：1234***9123</div>
              <div style={{margin:'10px'}}>
                <Flex>
                  <Flex.Item>
                  <div style={{textAlign:'center'}}>电子钱包余额</div>
                  <div style={{textAlign:'center',borderWidth:'1px',borderStyle:'dashed',borderColor:'#ffaa00',marginLeft:'15%',marginRight:'15%',marginTop:'5px'}}>
                    <div style={{margin:'5px',padding:'10px',backgroundColor:'#e1e1e5'}}>***</div>
                  </div>
                  </Flex.Item>
                  <Flex.Item>
                    <div style={{textAlign:'center'}}>主账户余额</div>
                    <div style={{textAlign:'center',borderWidth:'1px',borderStyle:'dashed',borderColor:'#ffaa00',marginLeft:'15%',marginRight:'15%',marginTop:'5px'}}>
                      <div style={{margin:'5px',padding:'10px',backgroundColor:'#e1e1e5'}}>***</div>
                    </div>
                  </Flex.Item>
                </Flex>
              </div>
              <Card.Footer style={{textAlign:'center'}} content={'（以卡内实际金额为准，单位：元）'} />
            </Card>
          </List>
        </WingBlank>
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
      </form>
    );
  }
}
const MyXiaozhiWrapper = createForm()(MyXiaozhi);
export default MyXiaozhiWrapper;
