import './listingNameDisplay.scss';

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

class ListingDepartmentDisplay extends Component {
  static propTypes = {
    departments: PropTypes.object.isRequired,
    departmentId: PropTypes.number.isRequired
  }

  render() {
    let { departments, departmentId } = this.props;
    let departmentName;
    try {
      departmentName = departments[departmentId].name;

    } catch (e) {
      departmentName = departmentId;
    }

    return (
        <div className="media listing-name-thumbnail">
          { departmentName }
        </div>
    );
  }
}

function mapStateToProps(state, ownProps) {

  let departmentId = ownProps.departmentId
                    || ownProps.department_id
                    || ownProps.rowData.department_id;

  return {
    departments: state.entities.departments,
    departmentId: departmentId,
  };
}

export default connect(mapStateToProps)(ListingDepartmentDisplay);
