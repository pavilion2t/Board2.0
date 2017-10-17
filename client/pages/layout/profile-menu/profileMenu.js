import './profileMenu.scss';

import React, { PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import cx from 'classnames';

import authDataHelper from '../../../helpers/authDataHelper';

class ProfileMenu extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }
  static propTypes = {
    appState: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  }
  constructor(props){
    super(props);
    this.state = {
      showMenu: false,
    };

    this.handleHideMenu = this.hideMenu.bind(this);
  }

  componentDidMount() {
    document.body.addEventListener('click', this.handleHideMenu);
  }
  componentWillUnmount() {
    document.body.removeEventListener('click', this.handleHideMenu);
  }

  hideMenu(event) {
    if (this.state.showMenu == false) {
      return;
    }
    const dropdown_element = findDOMNode(this);

    if (!dropdown_element.contains(event.target)){
      this.setState({
        showMenu: false
      });
    }
  }

  toggleMenu() {
    this.setState({
      showMenu: !this.state.showMenu
    });
  }
  setLang() {
    this.toggleMenu();
    // TODO
  }
  logout() {
    this.toggleMenu();

    authDataHelper.clear();

    this.context.router.push({
      pathname: '/login/index',
    });
  }

  render() {
    let className = cx('profile-menu', 'dropdown', {open: this.state.showMenu});
    let user = this.props.appState.user;

    if (!user) {
      return null;
    }

    return (
      <div className={ className } onClick={ this.toggleMenu.bind(this) }>
        <div className="_profile">
          <div className="_name">{ user.name }</div>
          <div className="_role">owner</div>
        </div>
        <div className="_avatar a" >
          <img src={ require('./images/avatar_placeholder.png') } />
        </div>
        <div className="_menu dropdown-menu dropdown-menu-right">
          <span className="a dropdown-item" onClick={ this.setLang.bind(this, 'en') }>English</span>
          <span className="a dropdown-item" onClick={ this.setLang.bind(this, 'it') }>Italiano</span>
          <span className="a dropdown-item" onClick={ this.setLang.bind(this, 'es') }>Español</span>
          <span className="a dropdown-item" onClick={ this.setLang.bind(this, 'zh_HK') }>中文（繁）</span>
          <span className="a dropdown-item" onClick={ this.setLang.bind(this, 'zh_CN') }>中文（簡）</span>
          <span className="a dropdown-item" onClick={ this.setLang.bind(this, 'ja_JP') }>日本語</span>
          <div className="dropdown-divider"></div>
          <span className="a dropdown-item" onClick={ this.logout.bind(this) } >Logout</span>
        </div>
      </div>
    );
  }
}

export default ProfileMenu;
