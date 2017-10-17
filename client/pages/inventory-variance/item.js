import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { INVENTORY_VARIANCE } from '~/constants';
const { MODE, TAB } = INVENTORY_VARIANCE;

import Template from './item-template';


function InventoryVarianceItem(props) {
  return <Template {...props} />;
}

InventoryVarianceItem.propTypes = {
  type:    PropTypes.number,
  mode:    PropTypes.string.isRequired,
  tab:     PropTypes.string.isRequired,
  storeId: PropTypes.string.isRequired,
  id:      PropTypes.string.isRequired,
};

const mapStateToProps = (state, props) => {
  const type = undefined;
  const mode = MODE.VIEW;
  const tab = TAB.OVERVIEW;
  const { params = {} } = props;
  const { store_id: storeId, inventory_variance_id: id } = params;
  return { type, mode, tab, storeId, id };
};

export default connect(mapStateToProps)(InventoryVarianceItem);
