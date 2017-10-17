import './tree-select.scss';

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import TreeMenu from '~/components/tree-menu';
import { Modal, ModalContainer, ModalHeader, ModalContent, ModalBottom } from '~/components/modal';
import {getDepartments} from '~/actions/departmentActions';
import {toggleAllDepartmentSelection} from '~/actions/formActions/departmentSelection';

function mapDispatchToProp(dispatch) {
  return {
    getDepartments: bindActionCreators(getDepartments, dispatch),
    toggleAllDepartmentSelection: bindActionCreators(
        toggleAllDepartmentSelection, dispatch)
  };
 }

@connect(null, mapDispatchToProp)
export default class SelectDepartment extends Modal {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    all: PropTypes.array.isRequired,
    closeDepartmentSelection: PropTypes.func.isRequired,
    submitDepartmentSelection: PropTypes.func.isRequired,
    toggleDepartmentCollapse: PropTypes.func.isRequired,
    toggleDepartmentSelection: PropTypes.func.isRequired,
    getDepartments: PropTypes.func.isRequired,
    toggleAllDepartmentSelection: PropTypes.func.isRequired
  };
  static contextTypes = {
      currentStore: React.PropTypes.object.isRequired
  };

  constructor(props) {
      super(props);
      this.toggleAll = this.toggleAll.bind(this);
  }

  componentDidMount() {
      this.props.getDepartments(this.context.currentStore.id);
  }

  toggleAll(event) {
      this.props.all.map((data)=>{
          data.checked=event.target.checked;
      });
      this.props.toggleAllDepartmentSelection(!event.target.checked);
  }

  renderChildren(){
    const {
      all,
      closeDepartmentSelection,
      toggleDepartmentCollapse,
      toggleDepartmentSelection,
      submitDepartmentSelection
    } = this.props;
    let customerHeader = this.props.customerHeader? this.props.customerHeader(): null;
    return (
      <ModalContainer >
        <ModalHeader title="Select Departments">
            { customerHeader }
            <div>
                <input type="checkbox" onChange={ this.toggleAll }/>
                <span className="all-nodes-label">All Departments</span>
            </div>
        </ModalHeader>
        <ModalContent>
          <div>
            <TreeMenu
              onChange={ toggleDepartmentSelection }
              toggleCollapse={ toggleDepartmentCollapse }
              data={ all } />
          </div>
        </ModalContent>
        <ModalBottom>
          <button className="btn btn-secondary"
                  onClick={ closeDepartmentSelection }>Cancel</button>
          <button className="btn btn-primary"
                  onClick={ submitDepartmentSelection }>Save</button>
        </ModalBottom>
      </ModalContainer>
    );
  }
}
