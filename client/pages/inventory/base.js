import React, { Component, PropTypes } from 'react';


class InventoryBase extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    params: PropTypes.object
  }

  render(){
    let storeIds = this.props.params.store_id.split(',');
    if (storeIds.length > 1) {
      return (
        <div className="main-content">
        <div className="main-content-section">
          <p>multi store not supported in this section</p>
        </div>
        </div>
      );
    } else {
      return (
        <div>{ this.props.children }</div>
      );
    }

  }
}
export default InventoryBase;
