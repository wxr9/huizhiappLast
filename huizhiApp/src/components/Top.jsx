import React from 'react';

class Wrap extends React.Component {

  constructor(props) {
    super(props);
  }
  render() {
    const titleName = this.props.routes.pop().breadName;
    return (
      <div>
        <div id="mainContents"
          style={{
            position: 'absolute',
            top: '0',
            // bottom: '1.2rem',
            width: '100%',
            overflow: 'auto',
            paddingBottom: '1.4rem',
          }}
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}


Wrap.propTypes = {};

export default Wrap;
