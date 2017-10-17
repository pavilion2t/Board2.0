import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

class MembershipItem extends Component {
  static propTypes = {
    params: PropTypes.shape({
      store_id: PropTypes.string.isRequired,
      membership_id: PropTypes.string.isRequired
    }).isRequired,
    children: PropTypes.element.isRequired,
    actions: PropTypes.object,
  };

  render() {
    const { store_id, membership_id } = this.props.params;
    const path = `/v2/${store_id}/membership-levels/${membership_id}`;

    return (
      <div className="main-content">
        <div className="main-content-tab">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <Link to={ `${path}/overview` } className="nav-link" activeClassName="active">Overview</Link>
            </li>
            <li className="nav-item">
              <Link to={ `${path}/customers` } className="nav-link" activeClassName="active">Customers</Link>
            </li>
          </ul>
        </div>
        { this.props.children }
      </div>
    );
  }
}

export default MembershipItem;
