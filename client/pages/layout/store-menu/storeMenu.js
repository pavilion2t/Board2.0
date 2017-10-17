import './storeMenu.scss';

import React, { PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import cx from 'classnames';
import find from 'lodash/find';
import map from 'lodash/map';
import compact from 'lodash/compact';

import StoreMenuItem from './storeMenuItem';
import { buildStoreTree } from '../../../helpers/storeHelper';

class StoreMenu extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  static propTypes = {
    appState: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  }
  constructor(props){
    super(props);
    this.state = {
      showMenu: false,
    };

    this.handleHideMenu = this.hideMenu.bind(this);
  }

  componentWillMount() {
    this.updateStore(this.props);

  }

  componentDidMount() {
    document.body.addEventListener('click', this.handleHideMenu);
  }

  componentWillUpdate(nextProps) {
    if (nextProps.params.store_id !== this.props.params.store_id) {
      this.updateStore(nextProps);
    }
  }
  componentWillUnmount() {
    document.body.removeEventListener('click', this.handleHideMenu);
  }

  updateStore(nextProps) {
    let { params, appState } = nextProps;

    let storeIds = params.store_id.split(',');

    appState.stores.forEach(store => {
      if (storeIds.includes(store.id.toString())) {
        store.selected = true;
      }
    });
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

  switchStore = () => {
    let { stores } = this.props.appState;
    let storeIds = compact(map(stores, store => store.selected ? store.id : null)).join(',');


    //for role: item master, need to redirect here.
    if (find(stores, {'id': parseInt(storeIds) }).associate_type === "CHAIN_MASTER"){
      window.location = `/v2/${storeIds}/item-master`;
      return;
    }

    if (storeIds !== this.props.params.store_id) {
      this.context.router.push(`/v2/${storeIds}/inventory`);
      this.setState({ showMenu: false });
      // window.location = `/v2/${storeIds}/summary`;
    }
  }
  selectStore(store, e) {
    store.selected = !store.selected;
    this.forceUpdate();
    e.preventDefault();
  }
  deselectAllStores = () => {
    let allStores = this.props.appState.stores;

    allStores.forEach(store => store.selected = false);
    this.forceUpdate();
  }
  selectAllStores = () => {
    let allStores = this.props.appState.stores;

    allStores.forEach(store => store.selected = true);
    this.forceUpdate();
  }

  render() {
    let className = cx('store-selector', {'-open': this.state.showMenu});

    let allStores = this.props.appState.stores;
    let currentStore = find(allStores, {id: parseInt(this.props.params.store_id) });
    let storeTree = buildStoreTree(allStores);

    if (!(allStores && currentStore)) {
      return null;
    }

    return (
      <div className={ className }>
        <div className="current-store" onClick={ this.toggleMenu.bind(this) }>
          <StoreMenuItem store={ currentStore } />
          <div className="selector">
            <div className="selector__toggle"><i className="fa fa-angle-down actions-arrow"></i></div>
          </div>
        </div>
        <div className="store-selector__dropdown">
          <div className="dropdown__stores">
          {
            storeTree.map(store => (
              <div key={ store.id }>
                <div onClick={ this.selectStore.bind(this, store) } className="dropdown__store a">
                  <StoreMenuItem {...this.props} store={ store } />
                </div>
                {
                  store._children && store._children.map(store => (
                    <div onClick={ this.selectStore.bind(this, store) } className="dropdown__store -child a" key={ store.id }>
                      <StoreMenuItem {...this.props} store={ store } />
                    </div>
                  ))
                }
              </div>
            ))
          }
          </div>
          <div className="dropdown__options">
            <span className="btn btn-sm btn-select" onClick={ this.deselectAllStores }>Deselect All</span>
            <span className="btn btn-sm btn-select" onClick={ this.selectAllStores }>Select All</span>
            <span className="btn btn-sm btn-apply" onClick={ this.switchStore }>Apply</span>
          </div>
        </div>
      </div>
    );
  }
}

// var selectedMultiStore =
//  <div className="store-selector__current" ng-click="startUpdatingCurrentStore()" ng-if="currentStores.length > 1">
//    <img className="current__image" src="images/store_placeholder.png" placeholder-src="store" />
//    <div className="current__details">
//      <p className="details__title">{ 'currentStores.length' } Stores/Chains Selected</p>
//    </div>
//    <div className="current__selector">
//      <div className="selector__toggle"><i className="fa fa-angle-down actions-arrow"></i></div>
//    </div>
//  </div>

export default StoreMenu;
