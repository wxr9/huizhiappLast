import React from 'react';
import TabBar from './TabBar';
// import TabBarTemp from '../routes/TabBarTemp';
class WrapTab extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        {this.props.children}
        <TabBar {...this.props} />
      </div>
    );
  }
}
;

WrapTab.propTypes = {};

export default WrapTab;
