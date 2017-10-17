import React, { Component, PropTypes } from 'react';

export default class Status extends Component {
  static propTypes = {
    status: PropTypes.string.isRequired,
    showProgress: PropTypes.bool.isRequired,
    rate: PropTypes.number
  };

  render() {
    const { status, rate, showProgress } = this.props;

    return (
      <div>
        <h4>Status</h4>
        <p><span>{ status }</span></p>
        { showProgress && <div className="progress">
          <div className="progress-bar" style={ { width: `${rate * 100}%` } }/>
        </div>
        }
      </div>
    );
  }
}
