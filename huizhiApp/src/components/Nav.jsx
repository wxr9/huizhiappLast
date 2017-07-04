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
          leftContent={'返回'} mode="light" onLeftClick={() => history.goBack()}
          rightContent={
            <Popover
              mask
              overlayClassName="fortest"
              overlayStyle={{ color: 'currentColor' }}
              visible={this.state.visible}
              overlay={[
                       (<Item
                         key="4" value="scan" icon={<Icon type="ellipsis" size="xs" />}
                         data-seed="logId"
                       >刷新</Item>),
                       (<Item
                         key="5" value="special" icon={<Icon type="ellipsis" size="xs" />}
                         style={{ whiteSpace: 'nowrap' }}
                       >确定</Item>),
                       (<Item key="6" value="button ct" icon={<Icon type="ellipsis" size="xs" />}>
                         <span style={{ marginRight: 5 }}>取消</span>
                       </Item>),
              ]}
              align={{
                overflow: { adjustY: 0, adjustX: 0 },
                offset: [offsetX, 15],
              }}
              onVisibleChange={this.handleVisibleChange}
              onSelect={this.onSelect}
            >
              <div
                style={{
                  height: '100%',
                  padding: '0 0.3rem',
                  marginRight: '-0.3rem',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Icon type="ellipsis" />
              </div>
            </Popover>
          }
        >
          <div style={{ color: 'white' }}>{this.props.title}</div>
        </NavBar>
      </div>
    );
  }
}

Nav.propTypes = {};

export default Nav;
