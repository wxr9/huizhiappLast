import React from 'react';
import Nav from './Nav';
class Wrap extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const titleName = this.props.routes.pop().breadName;
    return (
      <div>
        <div
          style={{
            position: 'absolute',
            top: '1.4rem',
            bottom: '1.2rem',
            width: '100%',
            overflow: 'auto',
            paddingBottom: '20px',
          }}
        >
          {this.props.children}
        </div>
        <Nav {...this.props} title={titleName} />
      </div>
    );
  }
}


Wrap.propTypes = {};

export default Wrap;
