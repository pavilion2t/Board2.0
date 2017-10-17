import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import values from 'lodash/values';
import { dateTime } from '~/helpers/formatHelper';

import { GridBody } from '~/components/grid';
import Loading from '~/components/loading/loading';
import { removeWorkflow, getWorkflows } from '~/actions/workflowActions';
import routeHelper from '~/helpers/routeHelper';

function mapStateToProps(state) {
  const { entities } = state;
  let workflows = [];

  if (entities.workflows) {
    workflows = values(entities.workflows);
  }

  return {
    workflows
  };
}

function mapDispatchToProps(dispatch) {
  return {
    removeWorkflow: bindActionCreators(removeWorkflow, dispatch),
    getWorkflows: bindActionCreators(getWorkflows, dispatch)
  };
}

class WorkflowSetUpIndex extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
    currentStore: React.PropTypes.object.isRequired
  };

  static propTypes = {
    params: PropTypes.object.isRequired,
    workflows: PropTypes.array.isRequired,

    removeWorkflow: PropTypes.func.isRequired,
    getWorkflows: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      loading: true
    };

    this.gridActions = [
      { name: 'Edit', onClick: (item) => {
        const { id } = item;
        let { store_id } = this.props.params;
        routeHelper.goWorkflowSetUp(store_id, id);
      } },
      { name: 'Remove', onClick: (item) => {
        if (!confirm('Do you really want to remove this item?')) return false;
        const { id, store_id } = item;
        this.props.removeWorkflow(id, store_id).then(resp => {
          const { error } = resp;
          if (!error) {
            alert('Remove item successfully.');
          } else {
            alert('Remove item failed.');
          }
        });
      } },
    ];

    this.columns = [
      { columnName: 'name', displayName: 'TITLE'},
      { columnName: 'workflow_statuses', displayName: 'WORKFLOW', customComponent: this.workflowFormatter },
      { columnName: 'created_at', displayName: 'CREATED AT', customComponent: this.timeFormatter },
    ];
  }

  componentDidMount() {
    let { store_id } = this.props.params;
    this.props.getWorkflows(store_id).then(() => {
      this.setState({ loading: false }); //eslint-disable-line react/no-did-mount-set-state
    });
  }

  handleCreate = () => {
    let { store_id } = this.props.params;
    routeHelper.goWorkflowSetUp(store_id, 'new');
  };

  workflowFormatter = (props) => {
    let { data } = props;//eslint-disable-line react/prop-types
    if (data && data.length) {
      let steps = linksToList(data);
      return <span>{ steps.map(w => w.status).join(' > ') }</span>;
    } else {
      return null;
    }
  };

  timeFormatter = (props) => {
    let { data } = props;//eslint-disable-line react/prop-types
    let timezine = this.context.currentStore && this.context.currentStore.timezone;
    return <span>{ dateTime(data, timezine) }</span>;
  };

  render() {
    const { workflows } = this.props;
    const { loading } = this.state;

    return (
      <div className="main-content">
        <div className="main-content-tab">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <a className="nav-link active">Overview</a>
            </li>

          </ul>
        </div>
        <header className="main-content-header columns">
          <h1 className="main-content-title columns-main"/>
          <div>
            <button className="btn btn-primary btn-sm"
                    onClick={ this.handleCreate }
                    type="submit">New Workflow</button>
          </div>
        </header>
        <div className="main-content-section ">
          { loading ?
            (
              <Loading>Loading...</Loading>
            ): (
            <div className="grid">
              <GridBody data={ workflows }
                        selectable={ false }
                        actions={ this.gridActions }
                        columns={ this.columns }/>
            </div>
          ) }
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WorkflowSetUpIndex);

function linksToList(actions) {
  let links = {};
  let all = {};
  let froms = {};
  let tos = {};
  actions.forEach(({ from_status, to_status }) => {
    from_status = from_status || {};
    to_status = to_status || {};
    links[from_status.id] = to_status.id;
    all[from_status.id] = from_status;
    all[to_status.id] = to_status;
    froms[from_status.id] = from_status;
    tos[to_status.id] = to_status;
  });
  let start = Object.keys(all).filter(i => tos[i] === undefined);
  if (start.length) {
    let from = start[0];
    let list = [];
    list.push(all[start[0]]);
    let to = links[from];
    while (to!==undefined){
      list.push(all[to]);
      to = links[to];
    }
    return list;
  } else {
    return [];
  }
}
