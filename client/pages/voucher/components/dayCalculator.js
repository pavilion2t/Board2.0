import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';

export function sumDays(day, week, month, year) {
  return day * 1 + week * 7 + month * 30 + year * 365;
}

const fields = ['day', 'week', 'month', 'year'];

const initialValues = {
  day:   0,
  week:  0,
  month: 0,
  year:  0,
};

class DayCalForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired,
  };



  render(){
    const {
      fields: { day, week, month, year },
      handleSubmit
    } = this.props;

    let days = sumDays(day.value, week.value, month.value, year.value);

    return (
      <form onSubmit={ handleSubmit }>
      <div className="modal-body">
        <div className="row">
          <div className="col-md-3">
            <label>Days</label>
            <input type="number" className="form-control" { ...day } />
          </div>
          <div className="col-md-3">
            <label>Weeks</label>
            <input type="number" className="form-control" { ...week }/>
          </div>
          <div className="col-md-3">
            <label>Month</label>
            <input type="number" className="form-control" { ...month }/>
          </div>
          <div className="col-md-3">
            <label>Years</label>
            <input type="number" className="form-control" { ...year }/>
          </div>
        </div>
        <hr />
        <p className="_align-right">= <b>{ days }</b> Days</p>
      </div>
      </form>
    );
  }
}

export default reduxForm({
  form: 'dayCalculator',
  fields,
  initialValues,
})(DayCalForm);

