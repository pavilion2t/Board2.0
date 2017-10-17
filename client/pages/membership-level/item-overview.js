import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { getMembershipLevel } from '../../actions/membershipLevelActions';
import Loading from '../../components/loading/loading';

const mapStateToProps = (state, ownProps) => {
  const { entities: { membership_level } } = state;
  const { membership_id } = ownProps.params;

  let membership = membership_level && membership_level[membership_id];

  return {
    membership: membership,
    params: ownProps.params
  };
};

const mapDispatchToProps = (dispatch) => {
  const actions = { getMembershipLevel };
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};


class VoucherOverviewShow extends Component {
  static propTypes = {
    params: PropTypes.shape({
      store_id: PropTypes.string.isRequired,
      membership_id: PropTypes.string.isRequired
    }).isRequired,
    membership: PropTypes.object,
    actions: PropTypes.shape({
      getMembershipLevel: PropTypes.func.isRequired
    }).isRequired
  };

  componentDidMount() {
    const { store_id, membership_id } = this.props.params;
    const { getMembershipLevel } = this.props.actions;

    getMembershipLevel(store_id, membership_id);
  }

  render() {

    const { store_id, membership_id } = this.props.params;
    const editPath = `/v2/${store_id}/membership-levels/${membership_id}/overview/edit`;

    const membership = this.props.membership || {};


    if (!membership) {
      return <Loading>Loading Membership</Loading>;
    }
    else {

      return (
        <div>
          <header className="main-content-header columns">
            <h1 className="main-content-title columns-main">Membership Level</h1>
            <div>
              <Link to={ editPath } className="btn btn-primary btn-sm">Edit</Link>
            </div>
          </header>
          <div className="main-content-section">
            <div className="row">
              <div className="col-sm-12">
                <div className="mapdata">
                  <div className="mapdata-label">TITLE</div>
                  <div className="mapdata-value">{ membership.title }</div>
                </div>
              </div>
              <div className="col-sm-12">
                <div className="mapdata">
                  <div className="mapdata-label">NOTE</div>
                  <div className="mapdata-value">{ membership.note }</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VoucherOverviewShow);
