import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../actions/index';

import OverviewForm from './components/overviewForm';
import Remarks from './components/remarks';
import MainContent from '../layout/main-content/main-content';
import MainContentHeader from '../layout/main-content/main-content-header';
import MainContentTabs from '../layout/main-content/main-content-tabs';
import Breadcrumb from '../layout/breadcrumb/breadcrumb';

import { ROOT_ROUTE, OVERVIEW, REMARKS } from './constant';

class DeliveryOrderOverviewNew extends Component {

    componentDidMount() {
        const { store_id, type, ref_id } = this.props.params;
        const { initDeliveryOrderForInvoice } = this.props.actions;

        if (type === 'invoice') {
            initDeliveryOrderForInvoice(store_id, ref_id);
        }
    }

    onSubmit(data) {
        const props = this.props;
        const { params: { store_id }, actions } = props;
        actions.createDeliveryOrder(store_id, data);
    }

    handleSubmit() {
        this.refs.OverviewForm.submit();
    }

    handleCancel() {
      browserHistory.goBack();
    }

    render() {
        let props = this.props;
        let { actions } = props;
        let { pathState = {} } = props;
        let { storeId, currentTab, initialValues } = pathState;

        return (
            <MainContent>
                <MainContentHeader title="New Delivery Note">
                    <button className="btn btn-secondary" onClick={ this.handleCancel.bind(this) }>Cancel</button>
                    <button className="btn btn-primary btn-sm" onClick={ this.handleSubmit.bind(this) }>Save</button>
                </MainContentHeader>
                <Breadcrumb links={ [
                    { label: 'Delivery Note', link: `/${storeId}/${ROOT_ROUTE}` },
                    { label: `New Delivery Note` },
                ] }/>
                <MainContentTabs>
                    <a href="#"
                        className={ `nav-link ${currentTab === OVERVIEW ? 'active' : ''}` }
                        onClick={ (event) => actions.changeDeliveryOrderTab(OVERVIEW) && event.preventDefault() }
                    >Overview</a>
                    <a href="#"
                        className={ `nav-link ${currentTab === REMARKS ? 'active' : ''}` }
                        onClick={ (event) => actions.changeDeliveryOrderTab(REMARKS) && event.preventDefault() }
                    >Remarks</a>
                </MainContentTabs>
                <OverviewForm ref="OverviewForm"
                    style={ { display: currentTab === OVERVIEW ? 'block' : 'none' } }
                    initialValues={ initialValues }
                    onSubmit={ this.onSubmit.bind(this) } />
                <Remarks style={ { display: currentTab === REMARKS ? 'block' : 'none' } } />
            </MainContent>
        );
    }

}

DeliveryOrderOverviewNew.contextTypes = {
    router: React.PropTypes.object.isRequired,
};

DeliveryOrderOverviewNew.propTypes = {
    params: PropTypes.shape({
        store_id: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        ref_id: PropTypes.string.isRequired,
    }).isRequired,
    actions: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => {
    let {deliveryOrder: pathState = {}} = state;
    let appState = state;
    let { base: { loading }, entities } = state;
    return { appState, pathState, entities, loading };
};

const mapDispatchToProps = (dispatch) => {
    return { actions: bindActionCreators(actions, dispatch) };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeliveryOrderOverviewNew);
