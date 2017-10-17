import React, { Component, PropTypes } from 'react';

import { permissionAccessor } from '~/helpers/permissionHelper';

class Can extends Component {
  static propTypes = {
    action: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(RegExp),
    ]),
    children: PropTypes.node,
  }

  static contextTypes = {
    currentStore: React.PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
  }

  render() {
    let { action, children } = this.props;
    let { currentStore } = this.context;

    if (!currentStore) {
      return null;
    }

    return permissionAccessor(action, currentStore) ? children : null;
  }
}

export default Can;
