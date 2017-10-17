import './mainMenu.scss';
import React, { Component, PropTypes } from 'react';
import remove from 'lodash/remove';
import classnames from 'classnames';
import { Link } from 'react-router';
import { filterMenu } from '~/helpers/menuHelper';
import { isAllowStoreTransfer } from '~/helpers/storeHelper';
import { default as menuConfig }  from '@/config/menu';

const CHAIN_MASTER = 'CHAIN_MASTER';

class Menuitem extends Component {
  static propTypes = {
    m: PropTypes.object,
    storeId: PropTypes.string,
  };

  state = {
    condition: false
  };

  handleClick = () => {
    this.setState({ condition: !this.state.condition });
  };

  render() {
    let { m, storeId } = this.props;

    return (
      <span>
        <a onClick={ this.handleClick }>
          <i className={ 'main-menu-icon' + ' -' + m.route }/> { m.name }
        </a>
        <ul className={ this.state.condition ? 'menu__submenu' : 'menu__submenu nodisplay' }>
          { m.children.map((submenu, i) => (
            <li key={ i }>
              <span className="menu__submenu-title">{ submenu.name }</span>
              <ul className="list-unstyled">
                { submenu.children.map((subitem, idx) => {
                  const { prefix, route, name } = subitem;
                  let path = `/${storeId}/${route}`;
                  if (prefix) path = `/${prefix}${path}`;
                  return (<li key={ idx } className={ 'menu__submenuitem' }>
                    <Link to={ path }>{ name }</Link>
                  </li>);
                })
                }
              </ul>
            </li>))
          }
        </ul>
      </span>
    );
  }
}

export default class MainMenu extends Component {
  static propTypes = {
    store: PropTypes.object,
    storeId: PropTypes.string,
  };

  handleClick(item) {
    const { storeId } = this.props;
    const { type, route, prefix } = item;
    if (type === 'link') {
      let path = `/${storeId}/${route}`;
      if (prefix)  path = `/${prefix}${path}`;
      if (!path.startsWith('/v2')) {
        window.history.pushState({ url: path }, 'Bindo Dashboard', path);
        location.reload();
      }
    }
  }

  renderMenu() {
    const { store, storeId } = this.props;
    let menu = store.associate_type === CHAIN_MASTER ? menuConfig.CHAIN_MASTER_MENUS : menuConfig.DEFAULT;

    let filteredMenu = filterMenu(menu, store.associate_type, store.module, store.store_permissions);
    if (!isAllowStoreTransfer(store.chain_info)) {
      remove(filteredMenu, m => m.route == 'stock-transfers');
    }

    return filteredMenu.map((m, i) => (
      <li className={ classnames('main-menu-item', { 'main-menu-group': m.type === 'group' }) }
          onClick={ this.handleClick.bind(this, m) }
          key={ i }>
        { (() => {
          const { type, route, prefix, name, label } = m;
          if (type === 'link') {
            let path = `/${storeId}/${m.route}`;
            if (prefix)  path = `/${prefix}${path}`;
            return (<Link to={ path } activeClassName="-active">
              <i className={ `main-menu-icon -${route}` }/> { name }
              <span className="label">{ label }</span>
            </Link>);
          }
          else if (type === 'group') {
            return (<span className="menu__group">{ name }</span>);
          }
          else if (type === 'menu') {
            return (<Menuitem m={ m } storeId={ storeId }/>);
          }
        })() }
      </li>
    ));
  }

  render() {
    let { store } = this.props;
    if (!store) return null;

    return (
      <ul className="main-menu">
        { this.renderMenu() }
      </ul>
    );
  }
}
