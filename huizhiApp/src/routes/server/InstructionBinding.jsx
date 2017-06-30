import React from 'react';
import { List, Button } from 'antd-mobile';
import { Link } from 'react-router';

const Item = List.Item;

class InstructionBinding extends React.Component {
  render() {
    return (
      <List>
        <div style={{ height: '11rem' }}>
          <Item wrap>
            <div style={{ textAlign: 'center' }}><span style={{ fontSize: '2em' }}>用户须知</span></div>
            一,上海浦东软件园,作为公益服务项目,上海浦东软件园,作为公益服务项目,上海浦东软件园,作为公益服务项目<br />
            二,上海浦东软件园,作为公益服务项目,上海浦东软件园,作为公益服务项目,上海浦东软件园,作为公益服务项目<br />
            三,上海浦东软件园,作为公益服务项目,上海浦东软件园,作为公益服务项目,上海浦东软件园,作为公益服务项目<br />
            四,上海浦东软件园,作为公益服务项目,上海浦东软件园,作为公益服务项目,上海浦东软件园,作为公益服务项目<br />
            五,上海浦东软件园,作为公益服务项目,上海浦东软件园,作为公益服务项目,上海浦东软件园,作为公益服务项目<br />
            六,上海浦东软件园,作为公益服务项目,上海浦东软件园,作为公益服务项目,上海浦东软件园,作为公益服务项目<br />
            <div>
              <Link to="index/bunding">
              <Button
                className="btn" type="primary" inline size="small" onClick={() => {
                }}
                style={{ marginLeft: '2.1rem'}}
              >请先绑定卡</Button>
              </Link>
            </div>
          </Item>
        </div>
      </List>
    );
  }
}
export default InstructionBinding;
