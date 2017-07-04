import React from 'react';
import { List, Button } from 'antd-mobile';
import { Link } from 'react-router';

const Item = List.Item;

class UserInstruction extends React.Component {
  render() {
    return (
      <List>
        <div className="instruction-binding-warp">
          <Item wrap>
            <div className="instruction-binding-item">
              <span className="instruction-head">用户须知</span></div>
            <span className="instruction-content">
            一,上海浦东软件园,作为公益服务项目,上海浦东软件园,作为公益服务项目,上海浦东软件园,作为公益服务项目<br />
            二,上海浦东软件园,作为公益服务项目,上海浦东软件园,作为公益服务项目,上海浦东软件园,作为公益服务项目<br />
            三,上海浦东软件园,作为公益服务项目,上海浦东软件园,作为公益服务项目,上海浦东软件园,作为公益服务项目<br />
            四,上海浦东软件园,作为公益服务项目,上海浦东软件园,作为公益服务项目,上海浦东软件园,作为公益服务项目<br />
            五,上海浦东软件园,作为公益服务项目,上海浦东软件园,作为公益服务项目,上海浦东软件园,作为公益服务项目<br />
            六,上海浦东软件园,作为公益服务项目,上海浦东软件园,作为公益服务项目,上海浦东软件园,作为公益服务项目<br />
            </span>
            <div className="user-instruction-button">
              <Link to="index/service">
                <Button
                  className="btn1" type="primary" inline size="small" onClick={() => {
                  }}
                >不同意</Button>
              </Link>
              <Link to="index/boatOrder">
                <Button
                  className="btn2" type="primary" inline size="small" onClick={() => {
                  }}
                >同意协议</Button>
              </Link>
            </div>
          </Item>
        </div>
      </List>
    );
  }
}
export default UserInstruction;
