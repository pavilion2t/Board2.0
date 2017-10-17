import React, { PropTypes } from 'react';
import DateDisplay from '../../../components/date/dateDisplay';

function IndexShipDate(props, context) {
    const { rowData = {} } = props;
    const { ship_date, expected_ship_date } = rowData;
    const timezone = context.currentStore && context.currentStore.timezone;
    let date = ship_date || expected_ship_date || null;
    return (
        <DateDisplay value={ date } timezone={ timezone } />
    );
}

IndexShipDate.propTypes = {
    rowData: PropTypes.object.isRequired
};

export default IndexShipDate;
