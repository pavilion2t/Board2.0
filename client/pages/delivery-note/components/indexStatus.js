import React, { PropTypes } from 'react';
import Status from '../../../components/status/status';

function IndexStatus(props) {
    const { data } = props;
    const state = data || 'created';
    return (
        <Status state={ data || 'created' } label={ IndexStatus.STATUS_FOR_DISPLAY[state] } />
    );
}

IndexStatus.propTypes = {
    data: PropTypes.string
};

IndexStatus.STATUS_FOR_DISPLAY = {
    created: 'Created',
    pending: 'Pending',
    sent: 'Delivered',
    partially_sent: 'Partially Delivered',
    canceled: 'Cancelled',
};

export default IndexStatus;
