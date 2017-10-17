import './stylesheets/styles.scss';
import './base.scss';

import React, { PropTypes } from 'react';
import find from 'lodash/find';

import MainMenu from '../main-menu/mainMenu';
import ProfileMenu from '../profile-menu/profileMenu';
import StoreMenu from '../store-menu/storeMenu';

import Loading from '../loading/loading';
import AppAlert from '../alert/alert';
import PageLoading from '../../../components/loading/loading';

class BaseLayout extends React.Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    appState: PropTypes.object.isRequired,
    children: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
  }

  static childContextTypes = {
    currentStore: React.PropTypes.object,
    currentStores: React.PropTypes.array,
    multiStore: React.PropTypes.bool,
  }

  constructor(props){
    super(props);
  }

  getChildContext() {
    let { store_id } = this.props.params;
    let { stores } = this.props.appState;

    let currentStore = find(stores, {id: parseInt(store_id)});
    let storeIds = (store_id||'').split(',').map(id => parseInt(id)).filter(id => !isNaN(id));
    let multiStore = storeIds.length > 1;
    let currentStores = storeIds.map(id => find(stores, { id }));

    return { currentStore, multiStore, currentStores };
  }

  componentDidMount() {
    let { store_id } = this.props.params;

    this.props.actions.getStores();
    this.props.actions.getStoreModule(parseInt(store_id));
    this.props.actions.getStorePermissions(parseInt(store_id));
    this.props.actions.getStoreChainInfo(parseInt(store_id));
  }

  componentWillUpdate(nextProps) {
    let { store_id } = nextProps.params;

    if (store_id !== this.props.params.store_id) {
      this.props.actions.getStores();
      this.props.actions.getStoreModule(parseInt(store_id));
      this.props.actions.getStorePermissions(parseInt(store_id));
      this.props.actions.getStoreChainInfo(parseInt(store_id));
    }
  }

  render() {
    let { actions } = this.props;
    let { store_id } = this.props.params;
    let { stores } = this.props.appState;

    let currentStore = find(stores, {id: parseInt(store_id)});

    if (stores.length < 1) {
      return (
        <div>
          <PageLoading>Loading Stores</PageLoading>
        </div>
      );
    }

    return (
      <div id="app-layout">
        <div id="menu">
          <div id="menu-header">
            <a href="/" id="header__logo">
              <img src={ require("./images/bindo-dashboard-logo.png") } />
            </a>
          </div>
          <nav id="menu-body">
            <MainMenu storeId={ store_id } store={ currentStore } actions={ actions }/>
          </nav>
          <div id="menu-footer">
            <a id="intercom" href="mailto:support@bindo.com">Report a problem</a>
            <a href="http://support.bindo.com" target="_blank">Help</a>
          </div>
        </div>

        <div id="main">
          <div id="main-header">
            <StoreMenu {...this.props} />

            <ProfileMenu {...this.props} />
          </div>
          <main id="main-body">
            { this.props.children }
          </main>
        </div>
        <Loading />
        <AppAlert />
      </div>
    );
  }
}

export default BaseLayout;
