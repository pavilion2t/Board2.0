import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getValues } from 'redux-form';
import * as actions from '../../actions/index';

import OverviewForm from './components/overviewForm';
import Remarks from './components/remarks';
import Logs from './components/logs';
import MainContent from '../layout/main-content/main-content';
import MainContentHeader from '../layout/main-content/main-content-header';
import MainContentTabs from '../layout/main-content/main-content-tabs';
import Breadcrumb from '../layout/breadcrumb/breadcrumb';

import { ROOT_ROUTE, VIEW, EDIT, OVERVIEW, REMARKS, LOG } from './constant';

class DeliveryOrderOverview extends Component {

    componentDidMount() {
        const { store_id, delivery_id } = this.props.params;
        const { initDeliveryOrderOverview } = this.props.actions;

        initDeliveryOrderOverview(store_id, delivery_id);
    }

    onSubmit(data) {
        const props = this.props;
        const { params: { store_id, delivery_id }, actions } = props;
        actions.updateDeliveryOrder(store_id, delivery_id, data);
    }

    saveEdit() {
        this.refs.OverviewForm.submit();
    }

    cancelEdit() {
        let { params: { store_id, delivery_id }, actions } = this.props;
        actions.initDeliveryOrderOverview(store_id, delivery_id);
    }

    sendEmail() {
        const { params: { store_id, delivery_id }, pathState = {}, actions } = this.props;
        const { initialValues = {} } = pathState;
        const { delivery_order : { order_ids = [], delivery_note: { email } } } = initialValues;
        actions.sendEmailTemplate(store_id, email, delivery_id, order_ids[0]);
    }

    exportPdf() {

    }

    markAsDelivered() {
        let props = this.props;
        let { params: { store_id, delivery_id }, appState, actions } = props;
        let data = getValues(appState.form.deliveryOverviewForm);
        data.delivery_order.ship_date = data.delivery_order.expected_ship_date;
        actions.fulfillDeliveryOrder(store_id, delivery_id, data);
    }

    cancelDeliveryOrder() {
        let { params: { store_id, delivery_id }, actions } = this.props;
        actions.cancelDeliveryOrder(store_id, delivery_id);
    }

    editDeliveryOrder() {
        let { pathState: { currentTab }, actions } = this.props;
        actions.startEditDeliveryOrder(currentTab);
    }

    render() {
        let props = this.props;
        let { actions, loading } = props;
        let { pathState = {} } = props;
        let { storeId, deliveryId, page, currentTab, initialValues = {}, logs = []} = pathState;
        let { delivery_order = {}, delivery_order_items = []} = initialValues;
        let qtySent = delivery_order_items.reduce((total, item) => total + item.qty_sent, 0);
        let { state, orders = []} = delivery_order;
        let invoices = orders.map(order => order.number);
        let editButtons = [
            <button key="cancelEdit" className="btn btn-secondary btn-sm" disabled={ loading }
                onClick={ this.cancelEdit.bind(this) }>Cancel</button>,
            <button key="editSave" className="btn btn-primary btn-sm" disabled={ loading }
                onClick={ this.saveEdit.bind(this) }>Save</button>
        ];
        let viewButtons = [
            <button key="send" className="btn btn-secondary btn-sm" disabled={ loading }
               onClick={ this.sendEmail.bind(this) }>Send Email Template</button>,
            // TODO: Implement export feature
            // <button key="export" className="btn btn-secondary btn-sm" disabled={ loading }
            //    onClick={ this.exportPdf.bind(this) }>Export to PDF</button>,
        ];
        // Only can edit the Delivery Note when status is created
        if (state == null) {
            viewButtons.push([
                <button key="deliver" className="btn btn-secondary btn-sm" disabled={ loading }
                    onClick={ this.markAsDelivered.bind(this) }>Mark As Delivered</button>,
                <button key="cancel" className="btn btn-secondary btn-sm" disabled={ loading }
                    onClick={ this.cancelDeliveryOrder.bind(this) }>Cancel</button>,
                <button key="edit" className="btn btn-secondary btn-sm" disabled={ loading }
                    onClick={ this.editDeliveryOrder.bind(this) }>Edit</button>,
            ]);
        }
        let pageButtons = page === EDIT ? editButtons : viewButtons;
        let pageTitle = `${page === EDIT ? 'Edit' : 'View'} Delivery Note`;

        return (
            <MainContent>
                <MainContentHeader title={ pageTitle }>
                    { pageButtons }
                </MainContentHeader>
                <Breadcrumb links={
                    [
                        { label: 'Delivery Note', link: `/v2/${storeId}/${ROOT_ROUTE}` },
                        { label: pageTitle },
                    ]
                }/>
                {
                    // TODO: Add Status color bar to show document status
                }
                <MainContentTabs>
                    <a href="#"
                        className={ `nav-link ${currentTab === OVERVIEW ? 'active' : ''}` }
                        onClick={ (event) => actions.changeDeliveryOrderTab(OVERVIEW) || event.preventDefault() }
                        >Overview</a>
                    <a href="#"
                        className={ `nav-link ${currentTab === REMARKS ? 'active' : ''}` }
                        onClick={ (event) => actions.changeDeliveryOrderTab(REMARKS) || event.preventDefault() }
                        >Remarks</a>
                    {
                        page === VIEW ?
                            <a href="#"
                                className={ `nav-link ${currentTab === LOG ? 'active' : ''}` }
                                onClick={ (event) => actions.viewDeliveryOrderLogs(storeId, deliveryId) || event.preventDefault() }
                                >Log</a>
                            : null
                    }
                </MainContentTabs>
                <OverviewForm ref="OverviewForm"
                    style={ { display: currentTab === OVERVIEW ? 'block' : 'none' } }
                    initialValues={ initialValues } viewMode={ page === VIEW }
                    onSubmit={ this.onSubmit.bind(this) } />
                <Remarks
                    style={ { display: currentTab === REMARKS ? 'block' : 'none' } }
                    viewMode={ page === VIEW } />
                <Logs style={ { display: currentTab === LOG ? 'block' : 'none' } }
                    qtySent={ qtySent }
                    invoices={ invoices }
                    logs={ logs } />
            </MainContent>
        );
    }

}

DeliveryOrderOverview.contextTypes = {
    router: React.PropTypes.object.isRequired,
    currentStore: React.PropTypes.object.isRequired,
};

DeliveryOrderOverview.propTypes = {
    params: PropTypes.shape({
        store_id: PropTypes.string.isRequired,
        delivery_id: PropTypes.string.isRequired,
    }).isRequired,
    pathState: PropTypes.object.isRequired,
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

export default connect(mapStateToProps, mapDispatchToProps)(DeliveryOrderOverview);
