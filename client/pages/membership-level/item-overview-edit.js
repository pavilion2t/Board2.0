import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { getMembershipLevel, updateMembershipLevel } from '../../actions/membershipLevelActions';
import MembershipForm from './components/item-form';

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
  const actions = { getMembershipLevel, updateMembershipLevel };
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
    actions: PropTypes.object
  };

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  componentDidMount() {
    const { store_id, membership_id } = this.props.params;
    const { getMembershipLevel } = this.props.actions;

    getMembershipLevel(store_id, membership_id);
  }

  onSubmit = (data) => {
    const { store_id, membership_id } = this.props.params;
    const { updateMembershipLevel } = this.props.actions;

    let pathname = `/v2/${store_id}/membership-levels`;

    updateMembershipLevel(store_id, membership_id, {membership_level: data}, pathname)
    .then(data => {
      const showPath = `/v2/${store_id}/membership-levels`;
      this.context.router.push(showPath);
    });

  };
  handleSubmit = () => {
    this.refs.MembershipForm.submit();
  };

  render() {
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
              <button className="btn btn-primary btn-sm" onClick={ this.handleSubmit }>Save</button>
            </div>
          </header>
          <div className="main-content-section">
            <MembershipForm ref="MembershipForm" initialValues={ membership } onSubmit={ this.onSubmit }/>



          </div>
        </div>
      );
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VoucherOverviewShow);
