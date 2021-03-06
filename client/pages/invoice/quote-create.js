import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { QUOTE_TYPE, NEW, OVERVIEW } from './constant';

import Can from '../../components/can/can';
import InvoiceLayout from './layout';

const QuoteCreate = (props) => {
  const { type, mode, tab, storeId, orderNumber } = props;
  return (
    <Can action="invoice:edit">
      <InvoiceLayout type={ type } mode={ mode } tab={ tab } storeId={ storeId } orderNumber={ orderNumber } />
    </Can>
  );
};

QuoteCreate.propTypes = {
  type: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired,
  tab: PropTypes.string.isRequired,
  storeId: PropTypes.string.isRequired,
  orderNumber: PropTypes.string,
};

const mapStateToProps = (state, props) => {
  const type = QUOTE_TYPE;
  const mode = NEW;
  const { params = {} } = props;
  const { store_id: storeId, order_number: orderNumber } = params;
  const tab = OVERVIEW;
  return { type, mode, tab, storeId, orderNumber };
};

export default connect(mapStateToProps)(QuoteCreate);
