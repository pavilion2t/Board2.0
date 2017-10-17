import React, { Component, PropTypes } from 'react';

import InputSelect from '~/components/input-select';
import Tag from '~/components/tag';

export default class MatchingCriteria extends Component {
  static propTypes = {
    number: PropTypes.number.isRequired,
    departments: PropTypes.array.isRequired,
    status: PropTypes.array.isRequired,
    showPrematureItems: PropTypes.bool.isRequired,
    changeMatchingCriteria: PropTypes.func.isRequired,
    openDepartmentSelection: PropTypes.func.isRequired,
    openStatusSelection: PropTypes.func.isRequired,
  };

  handleDepartmentRemove = (tag) => {
    const { number, departments, changeMatchingCriteria } = this.props;
    let list = departments.filter(d => d.department_id !== tag.department_id);
    changeMatchingCriteria({ number, departments: list });
  };

  handleStatusRemove = (tag) => {
    const { number, status, changeMatchingCriteria } = this.props;
    let list = status.filter(d => d.line_item_status_id !== tag.line_item_status_id);
    changeMatchingCriteria({ number, status: list });
  };

  handleShowPrematureItemsChange = (val) => {
    const { number, changeMatchingCriteria } = this.props;
    changeMatchingCriteria({ number, showPrematureItems: val });
  };

  render() {
    const {
      departments,
      status,
      number,
      showPrematureItems,
      openDepartmentSelection,
      openStatusSelection
    } = this.props;

    return (
      <div>
        <h2>Match #{ number }</h2>
        <div className="input-box">
          <p className="input-box__title">Department</p>
          <div className="row">
            <div className="col-md-4">
              <InputSelect placeholder="Select Departments" onClick={ () => openDepartmentSelection({ selected: [], params: { number, opener: 'settings-kds' } }) }/>
            </div>
            <div className="col-md-8">
              { (departments && departments.length > 0) && departments.map((d, i) => {
                return (<Tag label={ d.department_name }
                             onClick={ () => this.handleDepartmentRemove(d) }
                             key={ i }/>);
              }) }
            </div>
          </div>
        </div>
        <div className="input-box">
          <p className="input-box__title">Status</p>
          <div className="row">
            <div className="col-md-4">
              <InputSelect placeholder="Select Status" onClick={ () => openStatusSelection({ selected: status, params: { number } }) }/>
            </div>
            <div className="col-md-8">
              { (status && status.length > 0)&& status.map((d, i) => {
                return (<Tag label={ d.line_item_status_name }
                             onClick={ () => this.handleStatusRemove(d) }
                             key={ i }/>);
              }) }
            </div>
          </div>
        </div>
        <p><input type="checkbox"
                  checked={ showPrematureItems }
                  onChange={ (e) => this.handleShowPrematureItemsChange(e.target.checked) }/> Show Premature Items</p>
      </div>
    );
  }
}
