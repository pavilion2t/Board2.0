import './index.scss';

import React from 'react';
import cz from 'classnames';
import Select from 'react-select';
import { Link } from 'react-router';
import { dateTime, date, decimal, lowercase } from '~/helpers/formatHelper';
import * as statusHelper from '~/helpers/statusHelper';
import { bindPublicMethod } from '~/helpers/bindHelper';
import Status from '../status/status';
import InputCurrency from '../input-currency';
import InputNumber from '../input-number';
import { CountSerialNumber } from '../serial-number';

export const listingComponent = WrappedComponent =>
  bindPublicMethod(WrappedComponent, 'listingComponent', (additionalFields = []) => function ListingComponent(props) {
    const { data, rowData } = props; //eslint-disable-line react/prop-types
    let imgEl = null;
    let codes = [];
    if (Array.isArray(additionalFields)){
      additionalFields.forEach(field => {
        if (field === 'imageUrl'){
          imgEl = (
            <div className="media-left">
              <img className="_thumbnail" src={ rowData.imageUrl || require('./images/inventory_placeholder.png') }/>
            </div>
          );
        } else if (field === 'listingReferenceCodes'){
          const refCodes = rowData.listingReferenceCodes || [];
          const refStr = refCodes.join(', ');
          codes.push(
            !refStr ? null :
              <div className="_code pull-left w-100" key={ field }>Ref Codes: { refStr }</div>
          );
        } else {
          const label = {
            bpid:           'BPID',
            blid:           'BLID',
            ean13:          'UPC/EAN',
            listingBarcode: 'PLU/SKU',
          }[field];
          const value = rowData[field];
          codes.push(
            !value ? null : <div className="_code pull-left w-50" key={ field }>{ label }: { value }</div>
          );
        }
      });
    }
    codes = codes.filter(d => d);
    return (
      <div className={ cz('media', { 'listing-name-thumbnail': imgEl }) }>
        { !imgEl ? null : imgEl }
        <div className="media-body">
          <div className="_name">{ data }</div>
          { codes }
        </div>
      </div>
    );
  });

export const linkComponent = WrappedComponent => {
  function linkComponent(props) {
    const { data, rowData } = props; //eslint-disable-line react/prop-types
    let path = `${location.pathname}/${rowData.id}`;
    return (<Link to={ path }>{ data }</Link>);
  }

  return bindPublicMethod(WrappedComponent, 'linkComponent', linkComponent);
};

export const orderStatusComponent = WrappedComponent => {
  const orderStatusComponent = (props) => {
    let { data, metadata } = props; //eslint-disable-line react/prop-types
    const { customComponentProps = {} } = metadata;
    const { colorTransformer, labelTransformer } = customComponentProps;

    return <Status state={ data } label={ data } colorTransformer={ colorTransformer } labelTransformer={ labelTransformer }/>;
  };

  return bindPublicMethod(WrappedComponent, 'orderStatusComponent', orderStatusComponent);
};

export const timeComponent = WrappedComponent => {
  function timeComponent(props) {
    let { data } = props; //eslint-disable-line react/prop-types
    let timezine = this.context.currentStore && this.context.currentStore.timezone;
    return <span>{ data && dateTime(data, timezine) }</span>;
  }

  return bindPublicMethod(WrappedComponent, 'timeComponent', timeComponent);
};

export const countSerialNumberComponent = WrappedComponent =>
  bindPublicMethod(WrappedComponent, 'countSerialNumberComponent', function CountSerialNumberComponent(props){
    const { data = [], metadata, rowData } = props;
    const { customComponentProps = {} } = metadata;
    let { onConfirm, readOnly, productName, hide, ...meta } = customComponentProps;
    readOnly = (typeof readOnly === 'function') ? readOnly(props) : readOnly;
    hide = (typeof hide === 'function') ? hide(props) : hide;
    productName = (typeof productName === 'function') ? productName(props) : productName;
    const handleOnConfirm = onConfirm ? (value) => onConfirm(value, rowData) : undefined;
    return (
      hide ? null :
        <CountSerialNumber
          value={ data }
          productName={ productName }
          readOnly={ readOnly }
          onConfirm={ handleOnConfirm }
          { ...meta }
          />
    );
  });
export const dateComponent = WrappedComponent => {

  function dateComponent(props) {
    let { data } = props; //eslint-disable-line react/prop-types
    return <span>{ date(data) }</span>;
  }

  return bindPublicMethod(WrappedComponent, 'dateComponent', dateComponent);
};

export const currencyInputComponent = WrappedComponent =>
  bindPublicMethod(WrappedComponent, 'currencyInputComponent', function CurrencyInputComponent(props){
    const { data, rowData, metadata } = props; //eslint-disable-line react/prop-types
    const { customComponentProps = {} } = metadata;
    let { onChange, readOnly, dp, ...meta } = customComponentProps;
    readOnly = (typeof readOnly === 'function') ? readOnly(props) : readOnly;
    dp = (typeof dp === 'function') ? dp(props) : dp;
    const handleOnChange = onChange ? (value) => onChange(value, rowData) : undefined;
    return <InputCurrency value={ data } onChange={ handleOnChange } readOnly={ readOnly } dp={ dp } { ...meta }/>;
  });

export const numberInputComponent = WrappedComponent =>
  bindPublicMethod(WrappedComponent, 'numberInputComponent', function NumberInputComponent(props){
    const { data, rowData, metadata } = props; //eslint-disable-line react/prop-types
    const { customComponentProps = {} } = metadata;
    let { onChange, readOnly, dp, ...meta } = customComponentProps;
    readOnly = (typeof readOnly === 'function') ? readOnly(props) : readOnly;
    dp = (typeof dp === 'function') ? dp(props) : dp;
    const handleOnChange = onChange ? (value) => onChange(value, rowData) : undefined;
    return <InputNumber value={ data } onChange={ handleOnChange } readOnly={ readOnly } dp={ dp } { ...meta }/>;
  });

export const spanComponent = WrappedComponent => {
  const spanComponent = (props) => {
    const { data } = props; //eslint-disable-line react/prop-types
    return (<span>{ data }</span>);
  };

  return bindPublicMethod(WrappedComponent, 'spanComponent', spanComponent);
};

export const selectComponent = WrappedComponent => {
  const selectComponent = (props) => {
    const { data, rowData, metadata } = props; //eslint-disable-line react/prop-types
    const { customComponentProps } = metadata;
    const selectProps = {
      ...customComponentProps,
      value: data,
      onChange: (e) => customComponentProps.onChange(e, rowData),
      options: customComponentProps.optionsAccessor(rowData)
    };
    return (<Select { ...selectProps }/>);
  };

  return bindPublicMethod(WrappedComponent, 'selectComponent', selectComponent);
};

export const capitalizeFirstLetterComponent = WrappedComponent => {
  const capitalizeFirstLetterComponent = (props) => {
    const { data } = props; //eslint-disable-line react/prop-types
    if (typeof data === 'string' && data.length) {
      let s = data.charAt(0).toUpperCase() + data.slice(1);
      return (<span>{ s }</span>);
    } else {
      return null;
    }
  };

  return bindPublicMethod(WrappedComponent, 'capitalizeFirstLetterComponent', capitalizeFirstLetterComponent);
};

export const decimalComponent = WrappedComponent => {
  return bindPublicMethod(WrappedComponent, 'decimalComponent', (props) => {
    const { data } = props; //eslint-disable-line react/prop-types
    return (<span style={ { width: '50%' } }>{ decimal(data) }</span>);
  });
};

export const transactionTypeComponent = WrappedComponent => {
  return bindPublicMethod(WrappedComponent, 'transactionTypeComponent', (props) => {
    const { data, rowData } = props; //eslint-disable-line react/prop-types
    const { extra } = rowData;
    const value = extra ? 'Credit Card' : data;
    return (<span className="capitalize">{ value }</span>);
  });
};

export const transactionDetailsComponent = WrappedComponent => {
  return bindPublicMethod(WrappedComponent, 'transactionDetailsComponent', (props) => {
    const { rowData } = props; //eslint-disable-line react/prop-types
    let {
      approvalCode = '',
      entryMode = '',
      statusMessage = '',
      transactionType = '',
      extra,
    } = rowData;
    if (extra){
      let { holderName, last4Digits, creditCardType } = extra;
      return (
        <div className="credit-card-details">
          <div className="credit-card-details__row">
            <div className="credit-card-details__label">Cardholder</div>
            <div className="credit-card-details__value">{ holderName }</div>
          </div>
          <div className="credit-card-details__row">
            <div className="credit-card-details__label">Paid via { creditCardType } Card</div>
            <div className="credit-card-details__value">**** **** **** { last4Digits }</div>
          </div>
          <div className="credit-card-details__row">
            <div className="credit-card-details__label">Transaction Type</div>
            <div className="credit-card-details__value">{ lowercase(transactionType) }</div>
          </div>
          <div className="credit-card-details__row">
            <div className="credit-card-details__label">Approval Code</div>
            <div className="credit-card-details__value">{ approvalCode }</div>
          </div>
          <div className="credit-card-details__row">
            <div className="credit-card-details__label">Entry Mode</div>
            <div className="credit-card-details__value">{ lowercase(entryMode) }</div>
          </div>
          <div className="credit-card-details__row">
            <div className="credit-card-details__label">Authorised</div>
            <div className="credit-card-details__value">{ lowercase(statusMessage) }</div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  });
};

export const statusComponent = WrappedComponent =>
  bindPublicMethod(WrappedComponent, 'statusComponent', (statusType) => function StatusComponent(props) {
    const { data } = props; //eslint-disable-line react/prop-types
    const defaultState = statusHelper.DEFAULT_STATE[statusType];
    const labelTransformer = statusHelper[`${statusType}Label`];
    const colorTransformer = statusHelper[`${statusType}Color`];
    return <Status state={ data || defaultState } labelTransformer={ labelTransformer } colorTransformer={ colorTransformer } />;
  });

// The WrappedComponent must have either appState or stores in props
export const storeComponent = WrappedComponent =>
  bindPublicMethod(WrappedComponent, 'storeComponent', function (props) {
    let storeName = null;
    const { appState = {}, stores } = this.props;
    const s = stores || appState.stores;
    if (Array.isArray(s)){
      const { data } = props; //eslint-disable-line react/prop-types
      const target =  s.find(s => s.id === data) || {};
      storeName = target.title;
    }
    return storeName ? <span>{ storeName }</span> : null;
  });
