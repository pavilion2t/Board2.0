import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Loading from '~/components/loading/loading';
import OverviewForm from './components/overviewForm';

import * as actions from '~/actions/formActions/uomGroupOverview';

class UomGroupItem extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  static propTypes = {
    params: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    overviewState: PropTypes.object.isRequired,
  };

  componentDidMount(){
    const { params } = this.props;
    const { store_id, uom_group_id } = params;
    this.props.actions.open(store_id, uom_group_id);
  }

  componentWillUnmount() {
    this.props.actions.close();
  }

  render() {
    const { params, overviewState, actions } = this.props;
    const { store_id } = params;
    return (
      <div className="main-content">
        <div className="main-content-tab">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <a className="nav-link active">Overview</a>
            </li>

          </ul>
        </div>
        { overviewState.isLoading ?
          (
            <Loading>Loading Settings...</Loading>
          ) : (
          <OverviewForm store_id={ store_id }
                        discard={ () => {} }
                        actions={ actions }
                        { ...overviewState }/>
        ) }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    overviewState: state.forms.uomOverview
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UomGroupItem);
