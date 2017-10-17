import React, { Component, PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import Modal from 'react-modal';
import validate from 'validate.js';

import FormGroup from '../../../components/form-group/formGroup';
import DayCalForm, { sumDays } from './dayCalculator';
import RemoveButton from '~/components/remove-button';

export const perDaySecons = 86400;

export const EXPIRATION_TYPE = {
  DATE: 'date',
  NEVER: 'never',
  DURATION: 'duration'
};

export const REVENUE = {
  SALES: 0,
  REDEMPTION: 1
};

export const fields = ['name',
                       'notes',
                       'amount',
                       'price',
                       'revenue_recognition',
                       'expiration_type',
                       'expiration_date',
                       'expiration_duration',
                       'date_ranges[].start_from',
                       'date_ranges[].end_at'
                       ];

function validator(values) {
  const constraints = {
    name   : { presence: true },
    amount : { presence: true },
    price  : { presence: true },
    date_ranges: { //validate.js not work well with array
      length: {
        minimum: 0,
        maximum: 999
      }
    }
  };
  return validate(values, constraints) || {};
}

class VoucherOverviewForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired,
    voucherId: PropTypes.number,
  };

  state = {
    showDayCalculator: false
  };

  toogleDayCalculator = () => {
    this.setState({
      showDayCalculator: !this.state.showDayCalculator,
    });
  };

  setExpirationDay = (data) => {
    let days = sumDays(data.day, data.week, data.month, data.year);
    this.props.fields.expiration_duration.onChange(days);

    this.setState({
      showDayCalculator: false,
    });
  };

  submitSetExpirationDay = () => {
    this.refs.DayCalForm.submit();
  };

  render(){
    const {
      voucherId,
      fields: { name, notes, price, amount, revenue_recognition, expiration_type, expiration_date, expiration_duration, date_ranges },
      handleSubmit
    } = this.props;

    return (
      <form onSubmit={ handleSubmit } className="voucher-overview-form">
        <div className="main-content-section">
          <div className="row">
            <div className="col-sm-6">
              <FormGroup state={ name }>
                <label>TITLE</label>
                <input type="text" className="form-control" { ...name }/>
              </FormGroup>
            </div>
            {
              voucherId ? (
                <div className="col-sm-6">
                  <FormGroup label="VOUCHER TYPE ID">
                    <input type="text" className="form-control" value={ voucherId } disabled />
                  </FormGroup>
                </div>
              ) : null
            }

            <div className="col-sm-12">
              <FormGroup label="Description" state={ notes }>
                <textarea className="form-control" rows={ 4 } { ...notes }/>
              </FormGroup>
            </div>
          </div>
        </div>
        <div className="main-content-section">
          <div className="row">
            <div className="col-sm-6">
              <FormGroup state={ amount }>
                <label>FACE VALUE</label>
                <input type="text" className="form-control" { ...amount }/>
              </FormGroup>
            </div>
            <div className="col-sm-6">
              <FormGroup state={ price }>
                <label>PRICE</label>
                <input type="text" className="form-control" { ...price }/>
              </FormGroup>
            </div>
            <div className="col-sm-6">
              <FormGroup state={ revenue_recognition }>
                <label>REVENUE RECOGNITION</label>
                <div className="mapdata-value">
                <select className="form-control" { ...revenue_recognition }>
                  <option key="0" value={ REVENUE.SALES }>Sales</option>
                  <option key="1" value={ REVENUE.REDEMPTION }>Redemption</option>
                </select>
                </div>
              </FormGroup>
            </div>


            <div className="col-sm-6">
              <FormGroup state={ expiration_type }>
                <label>EXPIRATION DATE</label>
                <select defaultValue={ EXPIRATION_TYPE.NEVER } className="form-control _expiration_select" { ...expiration_type }>
                  <option key="0" value={ EXPIRATION_TYPE.NEVER }>Never</option>
                  <option key="1" value={ EXPIRATION_TYPE.DATE }>Specific Date</option>
                  <option key="2" value={ EXPIRATION_TYPE.DURATION }>Days From Activation</option>
                </select>
                {
                  expiration_type.value === EXPIRATION_TYPE.DATE ? (
                    <input type="date" className="form-control" { ...expiration_date } />
                  ) : null
                }
                {
                  expiration_type.value === EXPIRATION_TYPE.DURATION ? (
                    <div className="input-group">
                      <input ref="expiration_date" type="text" className="form-control col-md-3" placeholder="ENTER DAYS" { ...expiration_duration }/>
                      <span className="input-group-addon">
                        Days &nbsp;&nbsp;
                        <a className="small a" onClick={ this.toogleDayCalculator }>calculator...</a>
                      </span>
                    </div>
                  ) : null
                }
              </FormGroup>

              <Modal className="ReactModal__Content" isOpen={ this.state.showDayCalculator } onRequestClose={ this.toogleDayCalculator }>

                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h4 className="modal-title">Expiration Days Calculator</h4>
                    </div>
                    <div className="modal-body">
                      <DayCalForm ref="DayCalForm" onSubmit={ this.setExpirationDay } />
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" onClick={ this.toogleDayCalculator }>Cancel</button>
                      <button type="button" className="btn btn-primary" onClick={ this.submitSetExpirationDay }>Set Expiration Days</button>
                    </div>
                  </div>
                </div>
              </Modal>

            </div>

          </div>
        </div>
        <div className="main-content-section">
          <h3>Blackout Date</h3>
            { date_ranges.map((range, i) => (
              <div key={ i }>
                <div className="row" >
                  <div className="col-md-1">
                    <div className="mapdata-label">{ " " }</div>
                    <div className="mapdata-value">#{ i+1 }</div>
                  </div>
                  <div className="col-md-5">
                    <div className="mapdata-label">Start Date</div>
                    <div className="mapdata-value">
                      <input ref="blackout_start_date" type="date" className="form-control" {...range.start_from} />
                    </div>
                  </div>
                  <div className="col-md-5">
                    <div className="mapdata-label">End Date</div>
                    <div className="mapdata-value">
                      <input ref="blackout_start_date" type="date" className="form-control" {...range.end_at}/>
                    </div>
                  </div>
                  <div className="col-md-1">
                    <RemoveButton onClick={ () => date_ranges.removeField(i) }/>
                  </div>
                </div>
                <br/>
              </div>
            ))
            }
            <a className="_add" onClick={ () => date_ranges.addField({ start_from: '', end_at: '' }) }><i className="fa fa-plus-circle" /> { date_ranges.length ? 'Add Another Date Range' : 'Add Date Range' }</a>
        </div>
      </form>
    );
  }
}

export default reduxForm({
  form: 'voucherOverview',
  fields: fields,
  validate: validator,
})(VoucherOverviewForm);


