import React from 'react';
import { List, Button, InputItem } from 'antd-mobile';
import { createForm } from 'rc-form';
import { Link } from 'react-router';

const Item = List.Item;
// 绑定
class Bunding extends React.Component {
  render() {
    return (
      <div className="Unbunding_part">
        <List className="my-list">
          <Item data-seed="logId">
            <InputItem placeholder="22">汇智卡卡号</InputItem>
            <div style={{ paddingTop: '1em' ,textAlign:'center'}}>
              <Link to="index/bound">
                <Button
                  className="button_blue" type="primary" inline size="large" onClick={() => {
                  }}
                >绑定</Button>
              </Link>
              <Link to="index/unbound">
                <Button
                  className="button_gray" inline size="large" onClick={() => {
                  }}
                  style={{ marginLeft: '1em' }}
                >取消</Button>
              </Link>
            </div>
          </Item>
        </List>
      </div>
    );
  }
}
const BundingWrapper = createForm()(Bunding);
export default BundingWrapper;
