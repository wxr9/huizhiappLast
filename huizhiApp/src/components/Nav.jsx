import React from 'react';
import { NavBar, Icon, Popover } from 'antd-mobile';
const Item = Popover.Item;
class Nav extends React.Component {
  state = {
    visible: false,
    selected: '',
  };
  onSelect = (opt) => {
    // console.log(opt.props.value);
    this.setState({
      visible: false,
      selected: opt.props.value,
    });
  };
  handleVisibleChange = (visible) => {
    this.setState({
      visible,
    });
  };

  render() {
    console.log(this.props);
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
            // height: '90px',
            // lineHeight: '90px',
            color: 'white',
            position: 'fixed',
            top: '0',
            width: '100%',
          }}
          leftContent={''} mode="light" onLeftClick={() => history.goBack()}

        >
          <div style={{ color: 'white' }}>{this.props.title}</div>
        </NavBar>
      </div>
    );
  }
}

Nav.propTypes = {};

export default Nav;
