import React from 'react';
import {Icon} from 'antd-mobile';


class Wrap extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { history } = this.props;
    let offsetX = -10; // just for pc demo
    if (/(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent)) {
      offsetX = -26;
    }
    return (
      <div>
        <div
          style={{
            position: 'absolute',
            top: '0rem',
            width: '100%',
            overflow: 'auto',
            backgroundColor:'#ffffff',
            height:'100%'
          }}
        >
          {this.props.children}
        </div>
        <div
          style={{
            width:'23%',
            position: 'fixed',
            top: '6%',
            left: '4%',
            zIndex:'3'}}
             onClick={() => history.goBack()}>
          <Icon
            type={require('../assets/home/goBack.svg')}
            style={{
              height: '0.36rem',
              width: '0.36rem'}}/>
        </div>

      </div>
    );
  }
}


Wrap.propTypes = {};

export default Wrap;
