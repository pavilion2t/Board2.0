import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { INVENTORY_VARIANCE } from '~/constants';
const { TYPE, MODE, TAB } = INVENTORY_VARIANCE;

import Template from './item-template';


function InventoryVarianceCreate(props) {
  return <Template {...props} />;
}

InventoryVarianceCreate.propTypes = {
  type:    PropTypes.number,
  mode:    PropTypes.string.isRequired,
  tab:     PropTypes.string.isRequired,
  storeId: PropTypes.string.isRequired,
  id:      PropTypes.string,
};

const mapStateToProps = (state, props) => {
  const type = TYPE.OPENING;
  const mode = MODE.NEW;
  const tab = TAB.OVERVIEW;
  const { params = {} } = props;
  const { store_id: storeId, inventory_variance_id: id } = params;
  return { type, mode, tab, storeId, id };
};

export default connect(mapStateToProps)(InventoryVarianceCreate);
