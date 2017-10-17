import React, { Component, PropTypes } from 'react';

import { moduleEnabled } from '~/helpers/storeHelper';

class Module extends Component {
  static propTypes = {
    module: PropTypes.string.isRequired,
    store: PropTypes.object,
    children: PropTypes.node,
  };

  static contextTypes = {
    currentStore: React.PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { module, store, children } = this.props;
    const { currentStore } = this.context;
    const assertStore = store || currentStore;

    if (!assertStore) {
      return null;
    }

    return moduleEnabled(module, assertStore) ? children : null;
  }
}

export default Module;
