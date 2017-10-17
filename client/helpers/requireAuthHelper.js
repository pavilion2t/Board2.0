import React, { PropTypes } from 'react';
import authDataHelper from '../helpers/authDataHelper';

export function requireAuth(Component) {
  class AuthenticatedComponent extends React.Component {
    static contextTypes = {
      router: React.PropTypes.object.isRequired
    }

    static propTypes = {
      appState: PropTypes.object.isRequired,
      location: PropTypes.object.isRequired,
      params: PropTypes.object.isRequired,
      actions: PropTypes.object.isRequired,
    };

    componentWillMount() {
      this.checkAuth();
    }

    componentWillReceiveProps(nextProps) {
      if (this.props.location.pathname !== nextProps.location.pathname ||
          this.props.location.search !== nextProps.location.search) {
        this.checkAuth();
      }
    }

    checkAuth() {
      let auth = authDataHelper.get();
      let { actions, location } = this.props;

      if (auth) {
        actions.requestLoginSuccess(auth);

      } else {
        let redirectAfterLogin = location.pathname;

        this.context.router.push({
          pathname: '/v2/login/index',
          query: { next: redirectAfterLogin }
        });
      }
    }

    render() {
      let auth = authDataHelper.get();
      if (!auth) {
        return null;
      }

      return (
        <Component {...this.props} />
      );
    }
  }

  return AuthenticatedComponent;
}
