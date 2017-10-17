import React, { Component, PropTypes } from 'react';
import './remove-button.scss';

export default class RemoveButton extends Component {
  static propTypes = {
    onClick: PropTypes.func
  };

  static defaultProps = {
    onClick: () => {}
  };

  render() {
    return (
      <div className="remove-btn __has-title">
        <div className="outer">
          <div className="inner">
            <button type="button" className="_remove" onClick={ this.props.onClick }/>
          </div>
        </div>
      </div>
    );
  }
}
