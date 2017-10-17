import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import * as actions from '../../..//actions/index';

import validate from 'validate.js';

import { MainContentSection } from '../../layout/main-content';
import FormGroup from '../../../components/form-group/formGroup';
import AddInvoiceButton from '~/components/add-invoice/add-invoice';
import ActionButton from '../../../components/action-button/action-button';
import DateTimeDisplay from '../../../components/date/dateTimeDisplay';
import StatusField from './indexStatus';
import SerialNumberInput from './serialNumberInput';

const fields = [
    'delivery_order.number',
    'delivery_order.reference_number',
    'delivery_order.expected_ship_date',
    'delivery_order.ship_date',
    'delivery_order.order_ids[]', // required
    'delivery_order.order_ids_included', // required
    'delivery_order.stock_transfer_ids[]', // required
    'delivery_order.stock_transfer_ids_included', // required
    'delivery_order.billing.customer_id',
    'delivery_order.billing.customer_name',
    'delivery_order.delivery_note.customer_id',
    'delivery_order.delivery_note.customer_name',
    'delivery_order.delivery_note.address',
    'delivery_order.delivery_note.phone',
    'delivery_order.delivery_note.email',
    'delivery_order.remarks',
    'delivery_order.signature_data',
    'delivery_order.tracking_number',
    'delivery_order.courier',
    'delivery_order.state',
    'delivery_order.created_at',
    'delivery_order.created_by',

    'delivery_order_items[].id',
    'delivery_order_items[].purchasable_id',
    'delivery_order_items[].invoice_id',
    'delivery_order_items[].invoice_number',
    'delivery_order_items[].pallet_number',
    'delivery_order_items[].carton_number',
    'delivery_order_items[].product_id',
    'delivery_order_items[].line_item_id', // required
    'delivery_order_items[].stock_transfer_item_id', // required
    'delivery_order_items[].product_code',
    'delivery_order_items[].description',
    'delivery_order_items[].uom',
    'delivery_order_items[].total_quantity',
    'delivery_order_items[].quantity', // required
    'delivery_order_items[].qty_sent',
    'delivery_order_items[].qty_remaining', // required
    'delivery_order_items[].qty_fulfilled', // For UI
    'delivery_order_items[].gross_weight',
    'delivery_order_items[].net_weight',
    'delivery_order_items[].weight_unit',
    'delivery_order_items[].serial_numbers[]',
    'delivery_order_items[].fulfilment_note',
    'delivery_order_items[].upc',
    'delivery_order_items[].ean13',
    'delivery_order_items[].listing_barcode',
    'delivery_order_items[].serial_number_enabled',
    'delivery_order_items[].expiration_date_enabled',
    'delivery_order_items[].unit_group_id',
    'delivery_order_items[].display_unit_id',
    'delivery_order_items[].display_unit_name',
];

const SummaryRow = (props) => {
    const { children = [], className = ''} = props;
    return (
        <div className={ `row ${className}` }>
            <div className="col-sm-6">{ children[0] }</div>
            <div className="col-sm-6">{ children[1] }</div>
        </div>
    );
};
SummaryRow.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};

class DeliveryOverviewForm extends Component {
    addInvoice(invoices) {
        const { pathState: { storeId }, actions} = this.props;
        const invoiceIds = invoices.map(invoice => invoice.number);
        actions.addInvoiceToDeliveryOrder(storeId, invoiceIds);
    }

    setDeliveryQuantity(field, value){
        field.quantity.onChange(value);
        field.qty_remaining.onChange(field.total_quantity.value - field.qty_fulfilled.value - value);
    }

    render() {
        const props = this.props;
        const { pathState: { storeId, page }, actions, viewMode } = props;
        const { className, style } = props;
        const {
            fields: {
                delivery_order: {
                    number, reference_number, expected_ship_date, ship_date,
                    order_ids = [],
                    billing: { customer_id: billing_customer_id, customer_name: billing_customer_name },
                    delivery_note: { customer_id, customer_name, address, phone },
                    tracking_number, courier,
                    state, created_at, created_by,
                },
                delivery_order_items = [],
            },
        } = props;

        const { handleSubmit } = props;

        let deliveryOrderItemsCount = 0;
        let deliveryOrderInvoiceNumberToInvoiceId = {};
        let deliveryOrderTable = delivery_order_items.reduce((map, item) => {
            if (item.invoice_number.value) {
                map[item.invoice_number.value] = map[item.invoice_number.value] || [];
                map[item.invoice_number.value].push(item);
                deliveryOrderItemsCount += item.quantity.value;
                deliveryOrderInvoiceNumberToInvoiceId[item.invoice_number.value] = item.invoice_id.value;
            }
            return map;
        }, {});

        return (
            <form className={ className } style={ style } onSubmit={ handleSubmit }>
                <MainContentSection>
                    <SummaryRow>
                        <FormGroup label="BILL TO"  autoHideHelpText>
                            <input className="form-control" name={ billing_customer_name.name } value={ billing_customer_name.value } readOnly />
                        </FormGroup>
                        <FormGroup label="SHIP TO" autoHideHelpText>
                            <input className="form-control" name={ customer_name.name } value={ customer_name.value } readOnly />
                        </FormGroup>
                    </SummaryRow>
                    <SummaryRow className="form-inline">
                        <FormGroup label="PHONE" autoHideHelpText>
                            <input className="form-control" name={ phone.name } value={ phone.value } readOnly />
                        </FormGroup>
                        <FormGroup label="D.N. NUMBER" autoHideHelpText>
                            <input className="form-control" name={ number.name } value={ number.value } readOnly />
                        </FormGroup>
                    </SummaryRow>
                    <SummaryRow className="form-inline">
                        <FormGroup label="ADDRESS" autoHideHelpText>
                            <input className="form-control" name={ address.name } value={ address.value } readOnly />
                        </FormGroup>
                        <FormGroup label="CREATED AT" autoHideHelpText>
                            <DateTimeDisplay value={ created_at.value } formField />
                        </FormGroup>
                    </SummaryRow>
                    <SummaryRow className="form-inline">
                        <FormGroup label="STATUS" autoHideHelpText>
                            <div className="form-control" readOnly>
                                <StatusField data={ page === 'new' ? 'new' : state.value } />
                            </div>
                        </FormGroup>
                        <FormGroup label="CREATED BY" autoHideHelpText>
                            <input className="form-control" name={ created_by.name } value={ created_by.value } readOnly />
                        </FormGroup>
                    </SummaryRow>
                    <SummaryRow>
                        <FormGroup label="REFERENCE NUMBER" autoHideHelpText>
                            <input className="form-control" name={ reference_number.name } value={ reference_number.value } onChange={ reference_number.onChange } readOnly={ viewMode } />
                        </FormGroup>
                        <FormGroup label="DELIVERY DATE" autoHideHelpText>
                            <input className="form-control" type="date" name={ expected_ship_date.name }
                                value={ state.value === 'sent' ? ship_date.value : expected_ship_date.value }
                                onChange={ expected_ship_date.onChange }
                                readOnly={ viewMode } />
                        </FormGroup>
                    </SummaryRow>
                    <SummaryRow>
                        <FormGroup label="COURIER" autoHideHelpText>
                            <input className="form-control" name={ courier.name } value={ courier.value } onChange={ courier.onChange } readOnly={ viewMode } />
                        </FormGroup>
                        <FormGroup label="TRACKING NO." autoHideHelpText>
                            <input className="form-control" name={ tracking_number.name } value={ tracking_number.value } onChange={ tracking_number.onChange } readOnly={ viewMode } />
                        </FormGroup>
                    </SummaryRow>
                </MainContentSection>

                <MainContentSection>
                    <label>Invoices</label>
                    <div>
                        {
                            Object.keys(deliveryOrderTable).map(invoice_number => (
                                <span key={ invoice_number }>
                                    {
                                        order_ids.length > 1 && !viewMode ?
                                            <ActionButton
                                                type="delete"
                                                defaultTextColor
                                                onClick={ () => actions.removeInvoiceFromDeliveryOrder(deliveryOrderInvoiceNumberToInvoiceId[invoice_number]) }
                                                >{ invoice_number }</ActionButton>
                                            :
                                            <span style={ { padding: 5, display: 'inline-block' } }>{ invoice_number }</span>
                                    }
                                </span>
                            ))
                        }
                    </div>
                </MainContentSection>

                {
                    Object.keys(deliveryOrderTable).map((key, keyIdx, keys) => (
                        <table key={ key } className="table data-table data-table--h-border data-table--primary-link">
                            <thead>
                                <tr>
                                    <th style={ { width: '40%' } }>Invoice: { key }</th>
                                    <th style={ { width: '15%' } }>ORDERED</th>
                                    <th style={ { width: '15%' } }>DELIVER QTY</th>
                                    <th style={ { width: '15%' } }>DEFAULT UNIT</th>
                                    <th style={ { width: '15%' } }>REMAINING</th>
                                </tr>
                            </thead>

                            <tbody>
                                {
                                    deliveryOrderTable[key].map((item, i) => (
                                        <tr key={ item.id.value || i }>
                                            <td>
                                                <div className="container">
                                                    <div className="row">
                                                        <div className="col-xs-12">
                                                            <Link className="block-a" to={ `/v2/${storeId}/inventory/${item.purchasable_id.value}` }>{ item.description.value }</Link>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-xs-6">UPC/EAN: { item.upc.value || item.ean13.value }</div>
                                                        <div className="col-xs-6">PLU/SKU: { item.listing_barcode.value }</div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-xs-12">
                                                            <div style={ { display: viewMode ? 'none' : 'block' } }>
                                                                {
                                                                    item.serial_number_enabled.value ?
                                                                        <SerialNumberInput
                                                                            productName={ item.description.value }
                                                                            serialNumbers={ item.serial_numbers }
                                                                            max={ item.total_quantity.value || -1 }
                                                                            onConfirm={ sn => this.setDeliveryQuantity(item, sn.length) }
                                                                        />
                                                                        : null
                                                                }
                                                                {
                                                                /*
                                                                <button
                                                                    className="btn btn-primary btn-sm"
                                                                    style={ { width: 250, display: item.expiration_date_enabled.value ? 'block' : 'none' } }
                                                                    >Enter Expiration Date</button>
                                                                */
                                                                }
                                                            </div>
                                                            <div style={ { display: viewMode ? 'block' : 'none' } }>
                                                                <div className="row">
                                                                    {
                                                                        item.serial_number_enabled.value ?
                                                                            item.serial_numbers.map((sn, i) => (
                                                                                <div key={ i } className="col-xs-6">
                                                                                    S/N: { sn.value }
                                                                                </div>
                                                                            ))
                                                                            : null
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    name={ item.total_quantity.name }
                                                    value={ item.total_quantity.value }
                                                    readOnly
                                                    />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    name={ item.quantity.name }
                                                    value={ item.quantity.value }
                                                    onChange={ event => {
                                                        let value = event.target.value || '0';
                                                        let qty = parseFloat(value);
                                                        this.setDeliveryQuantity(item, qty);
                                                    } }
                                                    min={ 0 }
                                                    max={ item.total_quantity.value - item.qty_fulfilled.value }
                                                    readOnly={ viewMode || item.serial_number_enabled.value || item.expiration_date_enabled.value }
                                                    />
                                            </td>
                                            <td>{ item.display_unit_name.value }</td>
                                            <td>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    name={ item.qty_remaining.name }
                                                    value={ item.qty_remaining.value }
                                                    readOnly
                                                    />
                                            </td>
                                        </tr>
                                    ))
                                }
                                {
                                    keyIdx < keys.length - 1 ? null :
                                    <tr>
                                        <td>
                                            { viewMode  ?
                                                null :
                                                <AddInvoiceButton
                                                    filters={ {
                                                        inventory_status: ['unfulfilled', 'in_transit'],
                                                        customer_id: customer_id.value || billing_customer_id.value,
                                                    } }
                                                    excludeInvoices={ order_ids.map(d => d.value) }
                                                    onConfirm={ this.addInvoice.bind(this) }
                                                >Add Another Invoice</AddInvoiceButton>
                                            }
                                        </td>
                                        <td>
                                            <div>Total Items: </div>
                                        </td>
                                        <td>
                                            <div><input className="form-control" type="number" value={ deliveryOrderItemsCount } readOnly /></div>
                                        </td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    ))
                }
            </form>
        );
    }
}

DeliveryOverviewForm.propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    actions: PropTypes.object.isRequired,
    appState: PropTypes.object.isRequired,
    pathState: PropTypes.object.isRequired,
    entities: PropTypes.object.isRequired,
    className: PropTypes.string,
    style: PropTypes.object,
};

const mapStateToProps = (state, props) => {
    let appState = state;
    let { base: { loading }, entities, deliveryOrder: pathState } = state;
    return { appState, pathState, entities, loading };
};

const mapDispatchToProps = (dispatch) => {
    return { actions: bindActionCreators(actions, dispatch) };
};

const constraints = {
    'delivery_order.reference_number': {
        format: {
            pattern: /^[\w\d]*$/,
        },
    }
};

const validator = (values) => {
    let result = validate(values, constraints) || {};
    let { delivery_order_items = []} = values;
    delivery_order_items.forEach((item, i) => {
        let error = validate(item, {
            'quantity': {
                presence: true,
                numericality: {
                    greaterThanOrEqualTo: 0,
                },
            },
            'qty_remaining': {
                presence: true,
                numericality: {
                    greaterThanOrEqualTo: 0,
                },
            }
        });
        if (error) {
            Object.keys(error).forEach(key => {
                result[`delivery_order_items[${i}].${key}`] = error[key];
            });
        }
    });
    let total_quantity = delivery_order_items.reduce((sum, item) => sum + item.quantity, 0);
    if (total_quantity <= 0) {
        result.total_quantity = ['Total quantity cannot be zero'];
    }

    return result;
};

export default reduxForm({
    form: 'deliveryOverviewForm',
    fields: fields,
    destroyOnUnmount: false,
    validate: validator,
}, mapStateToProps, mapDispatchToProps)(DeliveryOverviewForm);
