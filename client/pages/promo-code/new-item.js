import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { get, pick } from 'lodash';
import {bindActionCreators} from 'redux'

import { PROMO_CODE } from '~/constants';
import * as baseSelectors from '~/selectors/baseSelectors';
import PromoCodeLayout from './layout';

import {transformPromoCode} from '~/helpers/promoCodeHelper'

import {modeChange} from '~/actions/promoCodeActions'

class PromoCodeNewItem extends React.Component{
  static propTypes = {
    modeChange: PropTypes.func
  }
  componentWillMount(){
    this.props.modeChange(PROMO_CODE.MODE.NEW, {coupon:transformPromoCode()})
  }
  render(){
    const p = pick(this.props, ['mode', 'storeId', 'promoCodeId']);
    return <PromoCodeLayout {...p} />
  }
}

const mapStateToProp = (state, props, context) => {
  const params = baseSelectors.getParams(state, props);
  return {
    mode: PROMO_CODE.MODE.NEW,
    storeId: get(params, 'store_id'),
  };
};

const mapDispatchToProp = (dispatch) => {
  return bindActionCreators({modeChange}, dispatch)
};

export default connect(mapStateToProp, mapDispatchToProp)(PromoCodeNewItem);
