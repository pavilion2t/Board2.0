import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { createMembershipLevel } from '~/actions/membershipLevelActions';
import MembershipForm from './components/item-form';

const mapStateToProps = (state) => {
  return {
  };
};

const mapDispatchToProps = (dispatch) => {
  const actions = { createMembershipLevel };
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};


class MembershipLevelNew extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  static propTypes = {
    params: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  onSubmit = (data) => {
    const { store_id } = this.props.params;
    const { createMembershipLevel } = this.props.actions;

    let pathname = `/v2/${store_id}/membership-levels`;

    createMembershipLevel(store_id, {membership_level: data}, pathname)
    .then(data => {
      const showPath = `/v2/${store_id}/membership-levels`;
      this.context.router.push(showPath);
    });

  };

  handleSubmit = () => {
    this.refs.MembershipForm.submit();
  };

  render() {
    const { store_id } = this.props.params;
    let backPath = `/v2/${store_id}/membership-levels`;

    return (
      <div className="main-content">
        <header className="main-content-header columns">
          <h1 className="main-content-title columns-main">Create New Membership Level</h1>
          <div>
            <Link to={ backPath } className="btn btn-secondary btn-sm">Cancel</Link> &nbsp;
            <button className="btn btn-primary btn-sm" onClick={ this.handleSubmit }>Save</button>
          </div>
        </header>
        <div className="main-content-section">
          <MembershipForm ref="MembershipForm" onSubmit={ this.onSubmit }/>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MembershipLevelNew);
