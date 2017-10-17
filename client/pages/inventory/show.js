import './inventory.scss';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import Loading from '~/components/loading/loading';
import Can from '~/components/can/can';


class InventoryShow extends Component {
  static propTypes = {
    appState: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    children: PropTypes.object.isRequired,
  };

  componentDidMount() {
    let { params, actions} = this.props;

    actions.getListing(params.store_id, params.listing_id);
  }

  render(){
    let { appState, params } = this.props;
    let listings = appState.entities.listings || {};
    let listing = listings[parseInt(params.listing_id)];

    let basePath = `/v2/${params.store_id}/inventory/${params.listing_id}`;

    if (!listing) {
      return <Loading>Loading Inventory</Loading>;

    } else {
      return (
        <div className="main-content">

          <div className="main-content-tab">
            <ul className="nav nav-tabs">
              <li className="nav-item">
                <Link to={ basePath+'/overview' } className="nav-link" activeClassName="active">Overview</Link>
              </li>

              <Can action="inventory:supplier_tab">
                <li className="nav-item">
                  <Link to={ basePath+'/supplier' } className="nav-link" activeClassName="active">Supplier</Link>
                </li>
              </Can>

              <li className="nav-item">
                <Link to={ basePath+'/tax' } className="nav-link" activeClassName="active">Tax Options</Link>
              </li>
              <li className="nav-item">
                <Link to={ basePath+'/log' } className="nav-link" activeClassName="active">Log</Link>
              </li>
            </ul>
          </div>
          { this.props.children }
        </div>
      );
    }
  }
}


export default InventoryShow;
