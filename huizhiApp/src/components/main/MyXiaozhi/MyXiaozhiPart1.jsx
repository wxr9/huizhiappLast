import React from 'react';
import { List, WingBlank, Card, Flex } from 'antd-mobile';
import { createForm } from 'rc-form';
import { Link } from 'react-router';

// 我的小智面板
class MyXiaozhiPart1 extends React.Component {
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
    );
  }
}
const MyXiaozhiPart1Wrapper = createForm()(MyXiaozhiPart1);
export default MyXiaozhiPart1Wrapper;
