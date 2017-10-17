import React, { PropTypes } from 'react';
import { Link } from 'react-router';

function IndexName(props) {
  let { id, store_id, title } = props.rowData;
  let path = `/v2/${store_id}/membership-levels/${id}`;
  return (
    <Link className="block-a" to={ path }>{ title }</Link>
  );
}

IndexName.propTypes = {
  rowData: PropTypes.object.isRequired
};

export default IndexName;
