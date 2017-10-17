import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import moment from 'moment';
import * as actions from '../../../actions/index';

// import { dateToIso } from '~/helpers/formatHelper';

import MainContentSection from '../../layout/main-content/main-content-section';
import SelectCustomer from '../../../components/select-customer/select-customer';
import FormGroup from '../../../components/form-group/formGroup';
import Status from '../../../components/status/status';
import { DateTimeDisplay, DateField, DateTimeField } from '../../../components/date';
import AddListingButton from '../../../components/add-listing/addListing';
import ActionButton from '../../../components/action-button/action-button';
import InputNumber from '../../../components/input-number';
import InputCurrency from '../../../components/input-currency';
import { Module } from '~/components/can';

import TotalSlip from './totalSlip';
import PaymentSlip from './paymentSlip';
import { VIEW, NEW, QUOTE_TYPE, INVOICE_TYPE } from '../constant';

class InvoiceOverview extends Component {

    render() {
        const props = this.props;
        const { pathState = {}, actions = {} } = props;
        const { currentStore = {},
            mode, type, order = {},
            unitGroups = {}, units = {},
            quantityDp, listingDp, totalDp } = pathState;
        const isViewMode = mode === VIEW;
        const isNewMode = mode === NEW;
        const isQuote = type === QUOTE_TYPE;
        const isInvoice = type === INVOICE_TYPE;
        const { id: storeId, title: storeTitle, currency/*, timezone*/ } = currentStore;
        // const isEffective = !isNewMode && moment().isAfter(dateToIso(order.effectiveCreatedAt, timezone));

        return (
            <div>
                <MainContentSection>

                    <div className="row">
                        <div className="col-sm-3">
                            <FormGroup label="STORE NAME"  autoHideHelpText>
                                {
                                    /*
                                    TODO: handle multi store cases
                                    */
                                }
                                <input className="form-control" value={ storeTitle } readOnly />
                            </FormGroup>
                        </div>
                        {
                            isNewMode ? null : (
                                <div className="col-sm-3">
                                    <FormGroup label="ORDER STATUS" autoHideHelpText>
                                        <div className="form-control" readOnly>
                                            <Status state={ order.state } />
                                        </div>
                                    </FormGroup>
                                </div>
                            )
                        }
                        {
                            isQuote || isNewMode ? null : (
                                <div className="col-sm-3">
                                    <FormGroup label="FULFILLMENT STATUS" autoHideHelpText>
                                        <div className="form-control" readOnly>
                                            <Status state={ order.inventoryState } />
                                        </div>
                                    </FormGroup>
                                </div>
                            )
                        }
                        {
                            isQuote || isNewMode ? null : (
                                <div className="col-sm-3">
                                    <FormGroup label="PAYMENT STATUS" autoHideHelpText>
                                        <div className="form-control" readOnly>
                                            <Status state={ order.quoteInvoiceState } />
                                        </div>
                                    </FormGroup>
                                </div>
                            )
                        }
                    </div>

                    <div className="row">
                        <div className="col-sm-6">
                            <FormGroup label="REFERENCE NUMBER"  autoHideHelpText>
                                <input className="form-control"
                                    value={ order.referenceNumber || '' }
                                    onChange={ event => actions.changeInvoiceField('referenceNumber', event.target.value) }
                                    readOnly={ !isNewMode } />
                            </FormGroup>
                        </div>
                        {
                            isNewMode ? null : (
                                <div className="col-sm-3">
                                    <FormGroup label="CREATED AT"  autoHideHelpText>
                                        <DateTimeDisplay value={ order.createdAt } formField />
                                    </FormGroup>
                                </div>
                            )
                        }
                        {
                            isNewMode ? null : (
                                <div className="col-sm-3">
                                    <FormGroup label="CREATED BY" autoHideHelpText>
                                        <input className="form-control" value={ order.createdBy } readOnly />
                                    </FormGroup>
                                </div>
                            )
                        }
                    </div>

                    <div className="row">
                        <div className="col-sm-3">
                            <FormGroup label="EFFECTIVE DATE"  autoHideHelpText>
                                <DateField
                                    value={ order.effectiveCreatedAt || '' }
                                    onChange={ event => actions.changeInvoiceField('effectiveCreatedAt', event.target.value) }
                                    readOnly
                                    offsetTips />
                            </FormGroup>
                        </div>
                        <div className="col-sm-3">
                            <FormGroup label="DUE DATE"  autoHideHelpText>
                                <DateField
                                    value={ order.dueDate || '' }
                                    onChange={ event => actions.changeInvoiceField('dueDate', event.target.value) }
                                    readOnly={ isViewMode }
                                    offsetTips />
                            </FormGroup>
                        </div>
                        <Module module="restaurant_features_enabled" store={ currentStore }>
                          <div className="col-sm-6">
                              <FormGroup label="DELIVERY DATE"  autoHideHelpText>
                                  <DateTimeField
                                      value={ order.deliveryDate || '' }
                                      onChange={ value => actions.changeInvoiceField('deliveryDate', value) }
                                      readOnly={ isViewMode }
                                      offsetTips />
                              </FormGroup>
                          </div>
                        </Module>
                    </div>

                </MainContentSection>

                <MainContentSection>

                    <div className="row">
                        <div className="col-sm-3">
                            <FormGroup label="BILL TO"  autoHideHelpText>
                                <SelectCustomer
                                    customer={ order.billingAddressInfo }
                                    readOnly={ isViewMode }
                                    onChange={ customer => actions.changeInvoiceField('billingAddressInfo', customer) }
                                    />
                            </FormGroup>
                        </div>
                        <div className="col-sm-3">
                            <FormGroup label="SHIP TO"  autoHideHelpText>
                                <SelectCustomer
                                    customer={ order.shippingAddressInfo }
                                    readOnly={ isViewMode }
                                    onChange={ customer => actions.changeInvoiceField('shippingAddressInfo', customer) }
                                    />
                            </FormGroup>
                        </div>
                        <div className="col-sm-3">
                            <FormGroup label="CUSTOMER PHONE"  autoHideHelpText>
                                <input className="form-control"
                                    value={ order.customerPhone || '' }
                                    readOnly />
                            </FormGroup>
                        </div>
                        <div className="col-sm-3">
                            <FormGroup label="CUSTOMER EMAIL"  autoHideHelpText>
                                <input className="form-control"
                                    value={ order.customerEmail || '' }
                                    readOnly />
                            </FormGroup>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-6">
                            <FormGroup label="BILLING ADDRESS"  autoHideHelpText>
                                <input className="form-control"
                                    value={ order.billingAddress || (order.billingAddressInfo && order.billingAddressInfo.billingAddress)  || '' }
                                    readOnly />
                            </FormGroup>
                        </div>
                        <div className="col-sm-6">
                            <FormGroup label="SHIPPING ADDRESS"  autoHideHelpText>
                                <input className="form-control"
                                    value={ order.shippingAddress || (order.shippingAddressInfo && order.shippingAddressInfo.shippingAddress)  || '' }
                                    readOnly />
                            </FormGroup>
                        </div>
                    </div>

                    {
                        !order.lineItems || order.lineItems.length === 0 ?
                            <div style={ { textAlign: 'center', padding: 30 } }>There is no item</div>
                            :
                            <table className="table data-table data-table--no-border data-table--primary-link">
                                <thead>
                                    <tr>
                                        <th style={ { width: '25%' } }>ITEM</th>
                                        <th style={ { width: '10%', textAlign: 'right' } }>ORDER QTY</th>
                                        <th style={ { width: '10%', textAlign: 'right' } }>FULFILLED QTY</th>
                                        <th style={ { width: '10%', textAlign: 'right' } }>REFUND QTY</th>
                                        <th style={ { width: '10%' } }>UNIT</th>
                                        <th style={ { width: '10%', textAlign: 'right' } }>UNIT PRICE</th>
                                        <th style={ { width: '10%', textAlign: 'right' } }>AMOUNT</th>
                                        {
                                          isQuote ? null :
                                            <th style={ { width: '10%' } }>FULFILLMENT STATUS</th>
                                        }
                                        {
                                            isViewMode ? null :
                                                <th style={ { width: '5%' } }></th>
                                        }
                                    </tr>
                                </thead>

                                <tbody>
                                    {
                                        order.lineItems.map((item, i) => (
                                            <tr key={ i }>
                                                <td>{ item.label }</td>
                                                <td>
                                                    <InputNumber
                                                        value={ item.unitQuantity }
                                                        dp={ item.quantityAllowDecimal ? quantityDp : 0 }
                                                        onChange={ value => actions.changeInvoiceListingQuantity(i, value) }
                                                        readOnly={ isViewMode }
                                                        />
                                                </td>
                                                <td>
                                                    <InputNumber
                                                        value={ item.qtyFulfilledInDisplayUnit }
                                                        dp={ item.quantityAllowDecimal ? quantityDp : 0 }
                                                        readOnly
                                                        />
                                                </td>
                                                <td>
                                                    <InputNumber
                                                        value={ item.qtyRefundedInDisplayUnit }
                                                        dp={ item.quantityAllowDecimal ? quantityDp : 0 }
                                                        readOnly
                                                        />
                                                </td>
                                                <td>
                                                    {
                                                        (()=>{
                                                            const allowEditUnit = false;
                                                            if (!isViewMode && allowEditUnit && item.unitGroupId){
                                                                const unitGroup = unitGroups[item.unitGroupId] || {};
                                                                const unitOptions = (unitGroup.units||[]).map(unitId => units[unitId]);
                                                                if (unitOptions.length > 0){
                                                                    return (
                                                                        <select
                                                                            value={ item.unitId || item.defaultOrderUnitId || item.baseUnitId }
                                                                            onChange={ (event) => { actions.changeInvoiceListingUnit(i, event.target.value); } }
                                                                        >
                                                                            {
                                                                                unitOptions.map(unit =>
                                                                                    <option key={ unit.id } value={ unit.id }>{ unit.name }</option>
                                                                                )
                                                                            }
                                                                        </select>
                                                                    );
                                                                }
                                                            }
                                                            return item.unit || null;
                                                        })()
                                                    }
                                                </td>
                                                <td>
                                                    <InputCurrency
                                                        value={ item.unitPrice }
                                                        currency={ currency }
                                                        onChange={ (value) => { actions.changeInvoiceListingUnitPrice(i, value); } }
                                                        readOnly={ isViewMode }
                                                        />
                                                </td>
                                                <td>
                                                    <InputCurrency
                                                        value={ item.total }
                                                        dp={ listingDp }
                                                        currency={ currency }
                                                        readOnly
                                                        />
                                                </td>
                                                {
                                                  isQuote ? null :
                                                    <td>
                                                        <Status state={ item.inventoryState } />
                                                    </td>
                                                }
                                                {
                                                    isViewMode || (isInvoice && item.id) ? null :
                                                        <td>
                                                            <ActionButton type="delete" onClick={ () => actions.removeListingsFromInvoice(i) }/>
                                                        </td>
                                                }
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                    }
                    {
                        isViewMode ? null :
                            <AddListingButton
                              withBarcode
                              onSave={ listings => actions.addListingsToInvoice(listings, storeId, unitGroups, units) }
                            >Add New Item</AddListingButton>
                    }

                    <div className="w-100">
                        <div className="row">
                            <div className="col-xs-6 w-50">
                                <label className="form-label">NOTE</label>
                                <textarea className="form-control"
                                    style={ { height: 250 } }
                                    value={ order.note || '' }
                                    readOnly={ isViewMode }
                                    onChange={ event => actions.changeInvoiceField('note', event.target.value) }
                                    />
                            </div>
                            <div className="col-xs-6 w-50">
                                <TotalSlip
                                    currency={ currency }
                                    totalDp={ totalDp }
                                    listingDp={ listingDp }
                                    totalItems={ order.totalItems }
                                    subtotal={ order.subtotal }
                                    tax={ order.tax }
                                    discountTotal={ order.discountTotal }
                                    serviceFee={ order.serviceFee }
                                    tips={ order.tips }
                                    rounding={ order.rounding }
                                    total={ order.total }
                                />
                                {
                                  isQuote ? null :
                                    <PaymentSlip
                                      currency={ currency }
                                      paidTotal={ order.paidTotal }
                                      refundTotal={ order.refundTotal }
                                      remaining={ order.amountLefted }
                                      saleTransactions={ order.saleTransactions }
                                      refundTransactions={ order.refundTransactions } />
                                }
                            </div>
                        </div>
                    </div>

                </MainContentSection>

            </div>
        );
    }

}

InvoiceOverview.contextTypes = {
    currentStore: PropTypes.object.isRequired,
};

InvoiceOverview.propTypes = {
};


const mapStateToProps = (state, props) => {
    let appState = state;
    let { invoice: pathState = {}} = state;
    let { base: { loading }, entities } = state;
    return Object.assign({}, props, { appState, pathState, entities, loading });
};

const mapDispatchToProps = (dispatch) => {
    return { actions: bindActionCreators(actions, dispatch) };
};

export default connect(mapStateToProps, mapDispatchToProps)(InvoiceOverview);
