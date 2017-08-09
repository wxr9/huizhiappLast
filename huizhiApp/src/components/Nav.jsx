import React from 'react';
import { NavBar, Icon, Popover } from 'antd-mobile';

class Nav extends React.Component {
  state = {
    visible: false,
    selected: '',
  };

  backClick(){
    //从缓存中读取
    let userInfo = localStorage.userInfo;
    if(userInfo !== undefined){
      if (this.props.location.pathname === "/index/Bound") {
        window.location.href = "#index/Index"
      }else if (this.props.location.pathname === "/RechargeThree") {
        window.location.href = "#index/Bound"
      }else{
        this.props.history.goBack();
      }
    }else{
      window.location.href = '#/index/Index';
    }
  }

  render() {
    const { history } = this.props;
    let offsetX = -10; // just for pc demo
    if (/(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent)) {
      offsetX = -26;
    }
    return (
      <div>
        <NavBar
          style={{
            fontSize: '20px',
            backgroundColor: '#259dda',
            height:'0.9rem',
            color: 'white',
            position: 'fixed',
            top: '0',
            width: '100%',
            paddingTop: '0.5rem'
          }}
          leftContent={''} mode="light" onLeftClick={() => this.backClick()}

        >
          <div style={{ color: 'white' }}>{this.props.title}</div>
        </NavBar>
      </div>
    );
  }
}

Nav.propTypes = {};

export default Nav;
