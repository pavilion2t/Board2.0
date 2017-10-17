import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as baseSelectors from '~/selectors/baseSelectors';
import * as promoCodeSelectors from '~/selectors/promoCodeSelectors';

import * as promoCodeActions from '~/actions/promoCodeActions';

import {
  MainContentSection,
} from '~/pages/layout/main-content';
import FormGroup from '~/components/form-group/formGroup';
import InputNumber from '~/components/input-number';
import SelectDiscount from '~/components/select-discount';

const mapStateToProp = (state, props, context) => {
  return {
    loading: baseSelectors.getLoading(state),
    pathInfo: promoCodeSelectors.getPathInfo(state),
    data: promoCodeSelectors.getItem(state),
    discountDetail: promoCodeSelectors.getDiscountDetail(state),
    readOnly: promoCodeSelectors.getReadOnlyConfig(state),
  };
};

const mapDispatchToProp = (dispatch) => {
  const actions = {
    ...promoCodeActions,
  };
  return bindActionCreators(actions, dispatch);
};

@connect(mapStateToProp, mapDispatchToProp)
export default class PromoCodeOverview extends Component {
  static propTypes = {
    updatePromoCodeField: PropTypes.func.isRequired
  };

  static contextTypes = {
    currentStore: PropTypes.object.isRequired,
  };

  handleFieldChange = (field, value) => {
    this.props.updatePromoCodeField(field, value);
  }

  render() {
    const { props } = this;
    const { data = {}, readOnly = {} } = props;
    return (
      <div>
          <MainContentSection>
          <div className="row">

            <FormGroup
              label="Promotion Code"
              className="col-xs-6"
              autoHideHelpText
              >
                <input
                  className="form-control"
                  value={ data.code }
                  onChange={ (event) => this.handleFieldChange('code', event.target.value) }
                  readOnly={ readOnly.code }
                  />
            </FormGroup>
          </div>

          <div className="row">
            <FormGroup
              label="Individual User Quota"
              className="col-xs-3"
              autoHideHelpText
              >
                <InputNumber
                  className="form-control"
                  value={ data.userQuota?data.userQuota:'' }
                  dp={ 0 }
                  onChange={ (value) => this.handleFieldChange('userQuota', value) }
                  readOnly={ readOnly.userQuota }
                  placeholder={ '1' }
                  />
            </FormGroup>

            <FormGroup
              label="Total Quota"
              className="col-xs-3"
              autoHideHelpText
              >
                <InputNumber
                  className="form-control"
                  value={ data.totalQuota?data.totalQuota:'' }
                  dp={ 0 }
                  onChange={ (value) => this.handleFieldChange('totalQuota', value) }
                  readOnly={ readOnly.totalQuota }
                  placeholder={ 'Unlimited' }
                  />
            </FormGroup>

            <FormGroup
              label="Used Quota"
              className="col-xs-3"
              autoHideHelpText
              >
                <InputNumber
                  className="form-control"
                  value={ data.usedQuota?data.usedQuota:0 }
                  dp={ 0 }
                  onChange={ (value) => this.handleFieldChange('usedQuota', value) }
                  readOnly={ readOnly.usedQuota }
                  />
            </FormGroup>

          </div>
        </MainContentSection>

        <MainContentSection>
          <div className="row">
            <FormGroup
              label="Discount"
              className="col-xs-6"
              autoHideHelpText
              >
                {/*<input
                  className="form-control"
                  value={ data.discount }
                  onChange={ (event) => this.handleFieldChange('discount', event.target.value) }
                  readOnly={ readOnly.discount }
                  />*/}
                <SelectDiscount
                  inputClassName="form-control"
                  value={ data.discount }
                  onConfirm={ discount=>this.handleFieldChange('discount', discount) }
                  readOnly={ readOnly.discount }
                />
            </FormGroup>
          </div>
          {/*
            Discount Type
            Discount Percentage(%)
            Discount Amount
            Discount Code
            Start Date
            End Date
          */}
        </MainContentSection>
      </div>
    );
  }
}
