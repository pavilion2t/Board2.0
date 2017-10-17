import React, { PropTypes } from 'react';

import { dateTime } from '../../helpers/formatHelper';

function DateTimeDisplay(props, context) {
    const { value, formField, className = '', style } = props;
    let compClassName = `${ formField ? 'form-control' : ''} ${className}`;
    let timezone = props.timezone ? props.timezone : context.currentStore && context.currentStore.timezone;
    let dateString = value ? dateTime(value, timezone) : '\u00A0';

    return (
        <span className={ compClassName } style={ style } readOnly={ formField }>{ dateString }</span>
    );
}

DateTimeDisplay.contextTypes = {
    currentStore: PropTypes.object.isRequired,
};

DateTimeDisplay.propTypes = {
    value: PropTypes.string,
    timezone: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    formField: PropTypes.bool,
};

export default DateTimeDisplay;
