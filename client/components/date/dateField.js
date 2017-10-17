import React, { PropTypes } from 'react';
import moment from 'moment';
import 'moment-timezone/builds/moment-timezone-with-data-2010-2020';

import DateDisplayField from './dateDisplay';

function DateField(props, context) {
    const { name, value, className = '', style = {}, readOnly, disabled, onChange, offsetTips } = props;
    let timezone = props.timezone ? props.timezone : context.currentStore && context.currentStore.timezone;
    let offsetStr = '';
    if (value && offsetTips){
        const [match, year, month, date] = value.match(/^(\d{4})-(\d{2})-(\d{2})$/)||[];
        const d1 = match ? moment().tz(timezone).set({year, month: month - 1, date}).startOf('day') : moment(value).tz(timezone).startOf('day');
        const d2 = moment().tz(timezone).startOf('day');
        if (d1.isValid()){
            const diff = Math.floor(moment.duration(d1.diff(d2)).asDays());
            if (diff === 0){
                offsetStr = 'Today';
            } else if (diff > 0) {
                offsetStr = `${diff} Day${diff > 1 ? 's' : ''} Later`;
            } else {
                offsetStr = `${-diff} Day${diff < -1 ? 's' : ''} Before`;
            }
        }
    }

    return (
        <div>
            {
              readOnly ?
                <DateDisplayField
                  value={ value }
                  timezone={ timezone }
                  className={ className }
                  style={ style }
                  formField
                  />
                :
                <input type="date"
                  className={ `form-control ${className}` }
                  style={ style }
                  name={ name }
                  value={ value }
                  readOnly={ readOnly }
                  disabled={ disabled }
                  onChange={ onChange } />
            }
            <span>{ offsetStr }</span>
        </div>
    );
}

DateField.contextTypes = {
    currentStore: PropTypes.object.isRequired,
};

DateField.propTypes = {
    name: PropTypes.string,
    value: PropTypes.string,
    timezone: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    readOnly: PropTypes.bool,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    offsetTips: PropTypes.bool,
};

export default DateField;
