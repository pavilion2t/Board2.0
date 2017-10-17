import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { get, pick } from 'lodash';
import {bindActionCreators} from 'redux'

import { PROMO_CODE } from '~/constants';
import * as baseSelectors from '~/selectors/baseSelectors';
import PromoCodeLayout from './layout';

import {loadPromoCodeItem} from '~/actions/promoCodeActions'

class PromoCodeItem extends React.Component {
  static propTypes = {
    storeId: PropTypes.number,
    promoCodeId: PropTypes.number,
    loadPromoCodeItem: PropTypes.func 
  }
  componentWillMount(){
    let {storeId, promoCodeId, loadPromoCodeItem} = this.props
    loadPromoCodeItem(storeId, promoCodeId)
  }
  render(){
    const p = pick(this.props, ['mode', 'storeId', 'promoCodeId']);
    return <PromoCodeLayout {...p} />
  }
}

const mapStateToProp = (state, props, context) => {
  const params = baseSelectors.getParams(state, props);
  return {
    mode: PROMO_CODE.MODE.VIEW,
    storeId: get(params, 'store_id'),
    promoCodeId: get(params, 'promo_code_id'),
  };
};

const mapDispatchToProp = (dispatch) => {
  return bindActionCreators({
    loadPromoCodeItem
  }, dispatch)
};

export default connect(mapStateToProp, mapDispatchToProp)(PromoCodeItem);
