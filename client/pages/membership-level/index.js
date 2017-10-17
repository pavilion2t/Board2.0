import React, {Component, PropTypes} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Griddle from 'griddle-react';
import map from 'lodash/map';

import { getMembershipLevels, removeMembershipLevel } from '../../actions/membershipLevelActions';

import Loading from '../../components/loading/loading';
import { Link } from 'react-router';
import Dropdown from '~/components/drop-down/dropDown';
import Can from '~/components/can/can';
import IndexName from './components/indexName';
import IndexDatetime from './components/indexDatetime';


const mapStateToProps = (state, ownProps) => {
  let pathname = ownProps.location.pathname;
  let pathState = state.path[pathname];

  let pageState = {};

  for (let prop in pathState) {
    pageState[prop] = map(pathState[prop], key => state.entities[prop][key]);
  }

  return pageState;
};

const mapDispatchToProps = (dispatch, ownProps) => {
  let actions = { getMembershipLevels, removeMembershipLevel };
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};



class MemberShipIndex extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  static propTypes = {
    params: PropTypes.object,
    location: PropTypes.object,
    actions: PropTypes.object,
    membership_level: PropTypes.arrayOf(PropTypes.object),
  };

  componentWillMount() {
    const { store_id } = this.props.params;
    const { pathname } = this.props.location;
    const { getMembershipLevels } = this.props.actions;

    getMembershipLevels(store_id, pathname);
  }

  deleteMembership = (id) => {
    const { store_id } = this.props.params;
    const { pathname } = this.props.location;
    const { removeMembershipLevel } = this.props.actions;

    removeMembershipLevel(store_id, id, pathname);
  }

  render() {
    const { store_id } = this.props.params;

    let { membership_level } = this.props;
    let path = `/v2/${store_id}/membership-levels/new`;
    let deleteMembership = this.deleteMembership;
    const noDataMessage = 'There is no membership level data';

    let LinkComponent = function (props) {
      /* eslint-disable react/prop-types */
      let { id } = props.rowData;
      /* eslint-enable react/prop-types */

      return (
        <div>
          <Dropdown>
            <a onClick={ deleteMembership.bind(null, id) } className="dropdown-item text-danger a">Delete</a>
          </Dropdown>
        </div>
      );
    };
    LinkComponent.propTypes = {
      rowData: PropTypes.shape({
        id: PropTypes.any.isRequired,
      }),
    };

    // Voucher list settings
    const columnMetadatas = [{
      columnName: "title",
      displayName: "Title",
      customComponent: IndexName,
    },{
      columnName: "created_at",
      displayName: "CREATED AT",
      customComponent: IndexDatetime,
    },{
      columnName: "",
      displayName: "",
      customComponent: LinkComponent,
    }];

    // Columns for grid display
    const columns = columnMetadatas.map(i => i.columnName);

    return (
      <div>
        <header className="main-content-header columns">
          <h1 className="main-content-title columns-main">Membership Level</h1>
          <Can action="voucher:create"><Link to={ path } className="btn btn-primary btn-sm">New Membership Level</Link></Can>
        </header>
        <div className="main-content">
          {
            !membership_level ? (
              <Loading />
            ) : (

            <Griddle
              useGriddleStyles={ false }
              tableClassName="table table-bordered data-table"
              results={ membership_level }
              noDataMessage={ noDataMessage }
              columns={ columns }
              resultsPerPage="100"
              columnMetadata={ columnMetadatas }/>
            )
          }
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MemberShipIndex);
