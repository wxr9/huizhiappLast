import React from 'react';
import { SearchBar, Card, List, Flex, Checkbox } from 'antd-mobile';
const Item = List.Item;
const AgreeItem = Checkbox.AgreeItem;
const Brief = Item.Brief;
class Circulated extends React.Component {
  render() {
    return (
      <div>
        <SearchBar placeholder="搜索" />
        <div className="circulated_list">
          <Flex>
            <Flex.Item>
              <Card
                className="index_list"
                style={{ border: 'none', marginTop: '10px', minHeight: '1rem', paddingBottom: '0px' }}
              >
                <AgreeItem onChange={e => console.log('checkbox', e)}>
                  <Item
                    thumb="https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png"
                    onClick={() => {
                    }}
                  >
                    郭翔宇<Brief className="contact_brief">汇智软件研发中心</Brief>
                  </Item>
                </AgreeItem>
              </Card>
            </Flex.Item>
          </Flex>
        </div>
        <div className="circulated_list">
          <Flex>
            <Flex.Item>
              <Card
                className="index_list"
                style={{ border: 'none', marginTop: '10px', minHeight: '1rem', paddingBottom: '0px' }}
              >
                <AgreeItem onChange={e => console.log('checkbox', e)}>
                  <Item
                    thumb="https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png"
                    onClick={() => {
                    }}
                  >
                    郭翔宇<Brief className="contact_brief">汇智软件研发中心</Brief>
                  </Item>
                </AgreeItem>
              </Card>
            </Flex.Item>
          </Flex>
        </div>
        <div className="circulated_list">
          <Flex>
            <Flex.Item>
              <Card
                className="index_list"
                style={{ border: 'none', marginTop: '10px', minHeight: '1rem', paddingBottom: '0px' }}
              >
                <AgreeItem onChange={e => console.log('checkbox', e)}>
                  <Item
                    thumb="https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png"
                    onClick={() => {
                    }}
                  >
                    郭翔宇<Brief className="contact_brief">汇智软件研发中心</Brief>
                  </Item>
                </AgreeItem>
              </Card>
            </Flex.Item>
          </Flex>
        </div>
        <div className="circulated_list">
          <Flex>
            <Flex.Item>
              <Card
                className="index_list"
                style={{ border: 'none', marginTop: '10px', minHeight: '1rem', paddingBottom: '0px' }}
              >
                <AgreeItem onChange={e => console.log('checkbox', e)}>
                  <Item
                    thumb="https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png"
                    onClick={() => {
                    }}
                  >
                    郭翔宇<Brief className="contact_brief">汇智软件研发中心</Brief>
                  </Item>
                </AgreeItem>
              </Card>
            </Flex.Item>
          </Flex>
        </div>
      </div>
    );
  }
}
export default Circulated;
