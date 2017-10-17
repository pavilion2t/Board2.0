import React, { PropTypes } from 'react';

import ActionButton from '~/components/action-button/action-button';

function AssociatedProductDelete(props) {
  let { id } = props.rowData;

  function deleteItem(){
    props.metadata.deleteProduct(id);
  }

  return (
    <ActionButton className="btn btn-primary" type="delete" onClick={ deleteItem }/>
  );
}

AssociatedProductDelete.propTypes = {
  rowData: PropTypes.object.isRequired
};

export default AssociatedProductDelete;
