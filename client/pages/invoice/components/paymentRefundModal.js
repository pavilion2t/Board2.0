import './paymentRefundModal.scss';

import Big from 'big.js';
import cx from 'classnames';
import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actions from '../../../actions/formActions/paymentRefund';

import { formatCurrency } from '~/helpers/formatHelper';
import { Module } from '~/components/can';
import { Modal, ModalContainer, ModalHeader, ModalContent, ModalBottom } from '~/components/modal';
import InputCurrency from '~/components/input-currency';
import { MonthField, YearField } from '~/components/date';


const TYPE = {
  PAYMENT: 'PAYMENT',
  REFUND: 'REFUND',
};
const DEFAULT_PAYMENT_TYPE = {
  CREDIT_CARD: 1,
  CASH: 2,
  CHECK: 3,
  STORE_CREDIT: 4,
  OCTOPUS: 5,
};
const defaultTitle = {
  PAYMENT: 'Make Payment',
  REFUND: 'Issue Refund',
};
const defaultSuccessString = {
  PAYMENT: 'Payment is successfully processed.',
  REFUND: 'Refund is successfully processed.',
};

const mapStateToProps = (state, props) => {
  const { base: { loading }, entities } = state;
  const { forms = {} } = state;
  const { paymentRefund: modal = {} } = forms;
  return Object.assign({}, props, { entities, loading, modal });
};

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(actions, dispatch) };
};

@connect(mapStateToProps, mapDispatchToProps)
export default class PaymentRefundModal extends Modal {
  static TYPE = TYPE;
  static DEFAULT_PAYMENT_TYPE = DEFAULT_PAYMENT_TYPE;
  static defaultTitle = defaultTitle;
  static contextTypes = {
    currentStore: PropTypes.object,
  };
  static propTypes = {
    type:               PropTypes.string.isRequired,
    amountDue:          PropTypes.instanceOf(Big),
    amountSettled:      PropTypes.instanceOf(Big),
    amountBalance:      PropTypes.instanceOf(Big),
    refundTo:           PropTypes.number,
    saleTransactions:   PropTypes.arrayOf(PropTypes.object),
    refundTransactions: PropTypes.arrayOf(PropTypes.object),
    onSuccessClose:     PropTypes.func,
    ...Modal.propTypes
  };

  handleRefundToChange = (event) => {
    const value = event.target.value;
    const { actions } = this.props;
    actions.changeRefundTo(value);
  };

  handlePaymentTypeChange = (event) => {
    const target = event.target;
    const { selectedIndex = 0 } = target;
    const value = Number(target.value);
    const { children = []} = target;
    const selected = children[selectedIndex] || {};
    const { dataset = {} } = selected;
    const { instrumentName } = dataset;
    const { actions } = this.props;
    actions.changePaymentType(value);
    if (instrumentName) {
      this.changeField('instrumentName', instrumentName);
    }
  };

  handleAmountChange = (amount) => {
    const { actions } = this.props;
    actions.changeAmount(amount);
  };

  handleTenderAmountChange = (amount) => {
    const { actions } = this.props;
    actions.changeTenderAmount(amount);
  }

  changeField = (field, value) => {
    const { actions } = this.props;
    actions.changeField(field, value);
  };

  handleSubmit = () => {
    const { actions, modal = {} } = this.props;
    if (modal.type === TYPE.PAYMENT) {
      actions.payInvoice(modal);
    } else {
      actions.refundInvoice(modal);
    }
  };

  renderChildren() {
    const { currentStore = {} } = this.context;
    const { currency } = currentStore;
    const { onRequestClose, onSuccessClose, modal = {} } = this.props;
    const {
      loading,
      type,
      amountDue = Big(0),
      amountSettled = Big(0),
      amountBalance = Big(0),
      refundTo,
      amount,
      tenderAmount,
      changeAmount,
      tipsAmount,
      note,
      showTips,
      showChange,
      instrumentId,
      saleTransactions = [],
      successResponse,
      paymentInstruments = [],
      cardNumber,
      expMonth,
      expYear,
      cvv,
      errors = [],
    } = modal;
    const isSuccess = !!successResponse;
    const title = defaultTitle[type];
    const successString = defaultSuccessString[type];
    const currencyFormat = { currency, dp: 2 };
    let formElements = null;
    if (type === TYPE.REFUND) {
      const refundableTransactions = saleTransactions.filter(t => t.amountLefted.gt(0));
      formElements = (
        <div>
          <div className="form-group">
            <label>Refund to</label>
            <select
              className="form-control"
              value={ refundTo }
              disabled={ loading }
              onChange={ this.handleRefundToChange }
              >
              {
                refundableTransactions.map(t => (
                  <option key={ t.id } value={ t.id }>
                    {
                      t.extra ? `${t.extra.creditCardType} - **** **** **** ${t.extra.last4Digits}` : t.payment
                    }
                  </option>
                ))
              }
            </select>
          </div>
          <div className="form-group">
            <label>Refund Amount</label>
            <InputCurrency
              className="form-control"
              value={ amount || Big(0) }
              disabled={ loading }
              onChange={ this.handleAmountChange }
              {...currencyFormat}
              />
          </div>
          <div className="form-group">
            <label>Refund Reason</label>
            <textarea
              className="form-control"
              value={ note }
              disabled={ loading }
              onChange={ e => this.changeField('note', e.target.value) } />
          </div>
        </div>
      );
    } else {
      formElements = (
        <div>
          <div className="form-group">
            <label>Payment Type</label>
            <select
              className="form-control"
              value={ instrumentId }
              disabled={ loading }
              onChange={ this.handlePaymentTypeChange }
            >
              <option value={ DEFAULT_PAYMENT_TYPE.CASH }>Cash</option>
              <Module module="payment_check_enabled">
                <option value={ DEFAULT_PAYMENT_TYPE.CHECK }>Check</option>
              </Module>
              <option value={ DEFAULT_PAYMENT_TYPE.CREDIT_CARD }>Credit Card</option>
              {
                paymentInstruments.map(p =>
                  <option value={ p.id } key={ p.id } data-instrument-name={ p.name }>Other - { p.name }</option>
                )
              }
            </select>
          </div>
          <div className="form-group">
            <label>Payment Amount</label>
            <InputCurrency
              className="form-control"
              value={ amount || Big(0) }
              disabled={ loading }
              onChange={ this.handleAmountChange }
              {...currencyFormat}
            />
          </div>
          {
            !showChange ? null :
              <div className="form-group">
                <label>Tender Amount</label>
                <InputCurrency
                  className="form-control"
                  value={ tenderAmount || Big(0) }
                  disabled={ loading }
                  onChange={ this.handleTenderAmountChange }
                  {...currencyFormat}
                />
              </div>
          }
          {
            !showChange ? null :
              <div className="form-group">
                <label>Change Amount</label>
                <InputCurrency
                  className="form-control"
                  value={ changeAmount || Big(0) }
                  readOnly
                  {...currencyFormat}
                />
              </div>
          }
          {
            !showTips ? null :
              <div className="form-group">
                <label>Tips Amount</label>
                <InputCurrency
                  className="form-control"
                  value={ tipsAmount || Big(0) }
                  disabled={ loading }
                  onChange={ amount => this.changeField('tipsAmount', amount) }
                  {...currencyFormat}
                />
              </div>
          }
          {
            instrumentId !== DEFAULT_PAYMENT_TYPE.CREDIT_CARD ?
              null :
              <div className="credit-card-form">
                <div className="form-group">
                  <label>Card Number</label>
                  <input
                    className="form-control"
                    value={ cardNumber }
                    disabled={ loading }
                    onChange={ e => this.changeField('cardNumber', e.target.value) }
                    />
                </div>
                <div className="form-group">
                  <label>Expiry Date</label>
                  <div className="credit-card-form__expire-date">
                    <MonthField
                      className="form-control credit-card-form__expire-month"
                      value={ expMonth }
                      disabled={ loading }
                      onChange={ e => this.changeField('expMonth', e.target.value) }
                      />
                    <YearField
                      className="form-control credit-card-form__expire-year"
                      value={ expYear }
                      disabled={ loading }
                      count={ 20 }
                      valueFormat="YY"
                      displayFormat="YYYY"
                      onChange={ e => this.changeField('expYear', e.target.value) }
                      />
                  </div>
                </div>
                <div className="form-group">
                  <label>CVV/CVC</label>
                  <input
                    className="form-control"
                    value={ cvv }
                    disabled={ loading }
                    onChange={ e => this.changeField('cvv', e.target.value) }
                    />
                </div>
              </div>
          }
          {
            errors.length === 0 ? null :
              <div className="alert alert-danger">
                <ul>
                  {
                    errors.map((err, i) =>
                      <li key={ i }>{ err }</li>
                    )
                  }
                </ul>
              </div>
          }
          <div className="form-group">
            <label>Note</label>
            <textarea
              className="form-control"
              value={ note }
              disabled={ loading }
              onChange={ e => this.changeField('note', e.target.value) }
              />
          </div>
        </div>
      );
    }

    return (
      <ModalContainer>
        <ModalHeader title={ title } onRequestClose={ onRequestClose } />
        <ModalContent>
          <div className={ cx('payment-refund', { 'payment-refund--success': isSuccess }) }>
            <div className="payment-refund__result">{ successString }</div>
            <div className="balance-form">
              <div>
                <div className="balance-form__item">
                  <div className="balance-form__item__label">Amount Due</div>
                  <div className="balance-form__item__value">{ formatCurrency(amountDue, currencyFormat) }</div>
                </div>
                <div className="balance-form__item">
                  <div className="balance-form__item__label">Amount Settled</div>
                  <div className="balance-form__item__value">{ formatCurrency(amountSettled, currencyFormat) }</div>
                </div>
              </div>
              <div className="balance-form__result">
                <div className="balance-form__item">
                  <div className="balance-form__item__label">Net Balance</div>
                  <div className="balance-form__item__value">{ formatCurrency(amountBalance, currencyFormat) }</div>
                </div>
              </div>
            </div>
            <div className="payment-refund-form">
              { formElements }
            </div>
          </div>
        </ModalContent>
        <ModalBottom>
          {
            isSuccess ? null :
              <button className="btn btn-secondary btn-sm"
                disabled={ loading }
                onClick={ onRequestClose }>Cancel</button>
          }
          {
            isSuccess ? null :
              <button className="btn btn-primary btn-sm"
                disabled={ loading }
                onClick={ this.handleSubmit }>{ title }</button>
          }
          {
            !isSuccess ? null :
              <button className="btn btn-primary btn-sm"
                onClick={ () => onSuccessClose(successResponse) }>Close</button>
          }
        </ModalBottom>
      </ModalContainer>
    );
  }
}
