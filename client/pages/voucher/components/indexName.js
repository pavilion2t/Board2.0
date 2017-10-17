import React, { PropTypes } from 'react';
import { Link } from 'react-router';

function IndexName(props) {
  let { id, store_id, name } = props.rowData;
  let path = `/v2/${store_id}/vouchers/${id}`;
  return (
    <Link className="block-a" to={ path }>{ name }</Link>
  );
}

IndexName.propTypes = {
  rowData: PropTypes.object.isRequired
};

export default IndexName;
