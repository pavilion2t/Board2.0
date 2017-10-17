import React, { PropTypes } from 'react';
import { Link } from 'react-router';

import { ROOT_ROUTE } from '../constant';

function IndexName(props) {
  const { id, store_id, number } = props.rowData;
  const path = `/v2/${store_id}/${ROOT_ROUTE}/${id}`;
  return (
    <Link className="block-a" to={ path }>{ number }</Link>
  );
}

IndexName.propTypes = {
  rowData: PropTypes.object.isRequired
};

export default IndexName;
