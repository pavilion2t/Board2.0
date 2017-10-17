import React, { PropTypes } from 'react';

function IndexQuantity(props) {
    const {data = []} = props;
    const qty = data.reduce((total, item) => total + parseFloat(item.delivery_order_item.quantity) , 0);
    return (
        <div>{ qty }</div>
    );
}

IndexQuantity.propTypes = {
    data: PropTypes.array.isRequired
};

export default IndexQuantity;
