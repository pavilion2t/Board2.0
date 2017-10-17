import React, { PropTypes } from 'react';


function IndexType(props) {
    const { order_ids = [], stock_transfer_ids = []} = props.rowData;
    const type = order_ids.length > 0 ? 'Invoice' : stock_transfer_ids.length > 0 ? 'Stock Transfer' : 'Unknow';
    return (
        <div>{ type }</div>
    );
}

IndexType.propTypes = {
    rowData: PropTypes.object.isRequired
};

export default IndexType;
