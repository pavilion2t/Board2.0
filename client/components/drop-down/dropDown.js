import './dropDown.scss';
import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import classnames from 'classnames';

class DropDown extends Component {
  static propTypes = {
    children: PropTypes.node,
  }

  state = {
    open: false
  }

  componentDidMount() {
    document.body.addEventListener('click', this.close);
  }
  componentWillUnmount() {
    document.body.removeEventListener('click', this.close);
  }

  close = (event) => {
    if (this.state.open == false) {
      return;
    }
    const dropdown_element = findDOMNode(this);

    if (!dropdown_element.contains(event.target)){
      this.setState({
        open: false
      });
    }
  }

  toggle = () => {
    this.setState({open: !this.state.open});
  }

  render() {
    let { children } = this.props;
    let className = this.state.open ? "btn-group open" : "btn-group";

    return (
      <div className={ className }>
        <a className="dropdown-caret"><i className={ classnames('fa', { 'fa-chevron-circle-down': !this.state.open, 'fa-chevron-circle-up': this.state.open }, 'fa-lg') }  onClick={ this.toggle }></i></a>
        <div className="dropdown-menu dropdown-menu-right">
          { children }
        </div>
      </div>
    );
  }
}

export default DropDown;
