import React, { PropTypes } from 'react';
import { dateTime } from '~/helpers/formatHelper';

function IndexDatetime(props, context) {
  let timezine = context.currentStore && context.currentStore.timezone;
  let { created_at } = props.rowData;

  return (
    <span>{ dateTime(created_at, timezine) }</span>
  );
}

IndexDatetime.propTypes = {
  rowData: PropTypes.object.isRequired
};

export default IndexDatetime;
