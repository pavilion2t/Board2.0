import './alert.scss';

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import uniqueId from 'lodash/uniqueId';

import Alert from '~/components/alert/alert';

function AppAlertComponent(props) {
  let { alerts } = props;
   
  return (
    <div id="app-alert">
      {
        alerts.map(alert => <Alert key={ uniqueId() } style={ alert.style }> { alert.message } </Alert>)
      }
    </div>
  );
}

AppAlertComponent.propTypes = {
  alerts: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => {
  return {
    alerts: state.alerts
  };
};

const AppAlert = connect(mapStateToProps)(AppAlertComponent);

export default AppAlert;
