import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { INVOICE_TYPE, VIEW, OVERVIEW } from './constant';

import Can from '../../components/can/can';
import InvoiceLayout from './layout';

const Invoice = (props) => {
  const { type, mode, tab, storeId, orderNumber } = props;
  return (
    <Can action={ /invoice:/ }>
      <InvoiceLayout type={ type } mode={ mode } tab={ tab } storeId={ storeId } orderNumber={ orderNumber } />
    </Can>
  );
};

Invoice.propTypes = {
  type: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired,
  tab: PropTypes.string.isRequired,
  storeId: PropTypes.string.isRequired,
  orderNumber: PropTypes.string.isRequired,
};

const mapStateToProps = (state, props) => {
  const type = INVOICE_TYPE;
  const mode = VIEW;
  const { params = {} } = props;
  const { store_id: storeId, order_number: orderNumber } = params;
  const tab = OVERVIEW;
  return { type, mode, tab, storeId, orderNumber };
};

export default connect(mapStateToProps)(Invoice);
