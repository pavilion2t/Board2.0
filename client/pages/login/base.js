import './login.scss';

import React, { PropTypes } from 'react';

export default class Login extends React.Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    appState: PropTypes.object.isRequired,
    children: PropTypes.element.isRequired
  };

  componentWillMount() {
    // clear cached store from maybe other account
    this.props.actions.clearStore();

  }

  render() {
    return (
      <div className="login-layout">
        <div className="login-layout-main">
          { this.props.children }
        </div>
        <div className="login-layout-footer">
          <div className="copyright">
            <p>2016 Bindo Labs, Inc. All rights reserved.</p>
            <p>Bindo is a registered trademark of Bindo Labs, Inc</p>
          </div>
        </div>
      </div>
    );
  }
}
