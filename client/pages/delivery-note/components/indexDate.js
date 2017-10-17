import React, { PropTypes } from 'react';
import DateTimeDisplay from '../../../components/date/dateTimeDisplay';

function IndexDate(props, context) {
  const timezone = context.currentStore && context.currentStore.timezone;
  const { data } = props;
  return (
    <DateTimeDisplay value={ data } timezone={ timezone } />
  );
}

IndexDate.propTypes = {
  data: PropTypes.object.isRequired
};

export default IndexDate;
