import React from 'react';



class Wrap extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props);
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

        <img src={require('../assets/home/goBack.png')}
             style={{
               position: 'fixed',
               top: '4%',
               left: '4%',
               width:'2.4%',
               height:'auto',
               zIndex:'3'
             }} onClick={() => history.goBack()}/>
      </div>
    );
  }
}


Wrap.propTypes = {};

export default Wrap;
