/* eslint react/prop-types: 0 */

import React, { Component } from 'react';
import LoginForm from './components/loginForm';

class LoginIndex extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  handleLogin(loginData) {
    this.props.actions.login(loginData.emailOrId, loginData.password);
  }

  render() {
    return (
      <div>
        <LoginForm onSubmit={ this.handleLogin.bind(this) } />
      </div>
    );
  }
}

export default LoginIndex;
