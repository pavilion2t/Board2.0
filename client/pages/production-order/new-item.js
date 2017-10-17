import React, { Component, PropTypes } from 'react';
import ProductionOrderItemOverview from './item-overview';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  getCurrentPermission
} from '~/helpers/permissionHelper';
import * as actions from '~/actions/formActions/productionOrderItem';
import routeHelper from '~/helpers/routeHelper';

function mapDispatchToProp(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

@connect(() => ({}), mapDispatchToProp)
@getCurrentPermission
export default class ProductionOrderNewItem extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
    currentStore: React.PropTypes.object.isRequired
  };

  componentDidMount() {
    const createPermission = this.getCurrentPermission('production_order:create');
    const { store_id } = this.props.params;
    if (!createPermission) {
      routeHelper.goProductionOrders(store_id);
    } else {
      this.props.actions.open(undefined, store_id);
    }
  }

  getChildContextType() {
    return {
      router: this.context.router,
      currentStore: this.context.currentStore
    };
  }

  render() {
    return (
      <div className="main-content">
        <ProductionOrderItemOverview params={ this.props.params }/>
      </div>
    );
  }
}


