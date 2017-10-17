import React, { Component, PropTypes } from 'react';
import map from 'lodash/map';

class InputGroupBtn extends Component {
  static propTypes = {
    state: PropTypes.object,
    options: PropTypes.object.isRequired,
    onChange: PropTypes.func,
    defaultOption: PropTypes.string,
  };

  state = {
    open: false,
    key: this.props.defaultOption || '',
  }

  toggle = () => {
    this.setState({
      open: !this.state.open,
    });
  }

  select(key) {
    let { onChange, options } = this.props;
    onChange(options[key]);

    this.setState({
      key: key,
      open: false,
    });
  }

  render() {
    let className = this.state.open ? 'input-group-btn open' : 'input-group-btn';
    let { options } = this.props;

    return (
      <div className={ className }>
        <button type="button" className="btn btn-secondary dropdown-toggle" onClick={ this.toggle }>
          { this.state.key }
        </button>
        <div className="dropdown-menu dropdown-menu-right">
        {
          map(options, (value, key) => (
            <span className="dropdown-item a" key={ key } onClick={ this.select.bind(this, key) }>{ key }</span>
          ))
        }
        </div>
      </div>
    );
  }
}

export default InputGroupBtn;
