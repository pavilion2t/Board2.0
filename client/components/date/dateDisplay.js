import React, { PropTypes } from 'react';

import { date } from '../../helpers/formatHelper';

function DateDisplay(props, context) {
    const { value, formField, className = '', style } = props;
    let compClassName = `${ formField ? 'form-control' : ''} ${className}`;
    let timezone = props.timezone ? props.timezone : context.currentStore && context.currentStore.timezone;
    let dateString = value ? date(value, timezone) : '\u00A0';

    return (
        <span className={ compClassName } style={ style } readOnly={ formField }>{ dateString }</span>
    );
}

DateDisplay.contextTypes = {
    currentStore: PropTypes.object.isRequired,
};

DateDisplay.propTypes = {
    value: PropTypes.string,
    timezone: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    formField: PropTypes.bool,
};

export default DateDisplay;
