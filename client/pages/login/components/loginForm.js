import './loginForm.scss';

import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import uniqueId from 'lodash/uniqueId';

class LoginForm extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired
  };

  render(){
    const {fields: {emailOrId, password, rememberMe}, handleSubmit} = this.props;
    const checkboxId = uniqueId();

    return (
      <form className="signin-form" onSubmit={ handleSubmit }>
        <div className="_logo">
          <img src={ require('./loginForm.logo.png') } alt="Logo" />
        </div>
        <div className="_form">
          <div className="form-group">
            <input className="form-control" type="text" placeholder="Bindo ID / Email" {...emailOrId} />
          </div>
          <div className="form-group">
            <input className="form-control" type="password" placeholder="Password" {...password} />
          </div>
          <div className="_remember">
            <input id={ checkboxId } type="checkbox" {...rememberMe}/>
            <label htmlFor={ checkboxId } className="_description">Remember me for 7 days</label>
          </div>
        </div>
        <div className="_actions">
          <a className="_forgot">Forgot Password?</a>

          <div>
            <button className="btn btn-secondary btn-sm">Sign Up</button>
            <button className="btn btn-primary btn-sm" type="submit">Login</button>
          </div>
        </div>
      </form>
    );
  }
}

let loginForm = reduxForm({
  form: 'login',
  fields: ['emailOrId', 'password', 'rememberMe']
})(LoginForm);

export default loginForm;
