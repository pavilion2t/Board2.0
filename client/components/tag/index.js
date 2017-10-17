import React, { Component, PropTypes } from 'react';

import './tag.scss';

export default class Tag extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func
  };

  render() {
    const { label, onClick } = this.props;

    return (
      <span className="tag">
        <span className="tag__label">{ label }</span>
        { this.props.onClick && <a className="tag__times" onClick={ onClick }><i className="fa fa-times"/></a> }
      </span>
    );
  }
}
