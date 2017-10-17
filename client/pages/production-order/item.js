import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import routeHelper from '~/helpers/routeHelper';
import * as actions from '~/actions/formActions/productionOrderItem';

function mapStateToProp(state) {
  let { isLoading } = state.forms.productionOrderItem;
  return { isLoading };
}

function mapDispatchToProp(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

@connect(mapStateToProp, mapDispatchToProp)
export default class ProductionOrderItem extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
    currentStore: React.PropTypes.object.isRequired
  };

  static propTypes = {
    params: PropTypes.object.isRequired,
    children: PropTypes.element.isRequired,
    actions: PropTypes.object.isRequired
  };

  componentDidMount() {
    const { store_id, production_order_id } = this.props.params;
    this.props.actions.open(production_order_id, store_id);
  }

  componentWillUnmount() {
    this.props.actions.close();
  }

  render() {
    const { store_id, production_order_id } = this.props.params;
    const path = routeHelper.productionOrders(store_id, production_order_id);

    let style = {};
    if (location.pathname.indexOf('material-list') > -1) {     // only use transparent bg color in material list, for the table
      style.backgroundColor = 'transparent';
    }
    return (
      <div className="main-content" style={ style }>
        <div className="main-content-tab">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <Link to={  `${ path }/overview`  } className="nav-link" activeClassName="active">Overview</Link>
            </li>
            <li className="nav-item">
              <Link to={  `${ path }/material-list`  } className="nav-link" activeClassName="active">Material
                List</Link>
            </li>
          </ul>
        </div>
        {  this.props.children  }
      </div>
    );
  }
}


