import React from 'react';
import { List, Button } from 'antd-mobile';
import { createForm } from 'rc-form';
import { Link } from 'react-router';

const Item = List.Item;
// 解绑
class Unbunding extends React.Component {
  render() {
    return (
      <div className="Unbunding_part">
        <List className="my-list">
          <Item data-seed="logId">
            <div style={{ marginLeft: '2em', height: '3em', textAlign: 'center', paddingTop: '1em' }}>
              <span>汇智卡卡号：</span>
              <span>123456789222</span>
              <sapn>[已绑定]</sapn>
            </div>
          </Item>
          <Item>
            <div style={{ paddingTop: '1em' }}>
              <Link to="index/unbound">
                <Button
                  className="button_blue" type="primary" inline size="large" onClick={() => {
                  }}
                  style={{ marginLeft: '1.5rem' }}
                >解绑</Button>
              </Link>
              <Link to="index/bound">
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
const UnbundingWrapper = createForm()(Unbunding);
export default UnbundingWrapper;
