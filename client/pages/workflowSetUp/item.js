import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import values from 'lodash/values';

import * as workflowOverview from '~/actions/formActions/workflowOverview';
import { getWorkflow } from '~/actions/workflowActions';
import { getLineItemStatuses } from '~/actions/lineItemStatusAction';
import routeHelper from '~/helpers/routeHelper';
import InputBox from '~/components/input-box';
import Step from './components/step';

function mapStateToProps(state, ownProps) {
  const { workflowOverview } = state.forms;
  const { entities } = state;
  let lineItemStatuses = [];
  if (entities && entities.lineItemStatuses) {
    lineItemStatuses = values(entities.lineItemStatuses);
  }
  return Object.assign({}, workflowOverview, { lineItemStatuses });
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(workflowOverview, dispatch),
    getWorkflow: bindActionCreators(getWorkflow, dispatch),
    getLineItemStatuses: bindActionCreators(getLineItemStatuses, dispatch)
  };
}

class WorkflowSetupItem extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  static propTypes = {
    params: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    steps: PropTypes.array.isRequired,
    isCreating: PropTypes.bool.isRequired,
    lineItemStatuses: PropTypes.array.isRequired,

    actions: PropTypes.object.isRequired,
    getWorkflow: PropTypes.func.isRequired,
    getLineItemStatuses: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { getLineItemStatuses, params, actions } = this.props;
    const { workflow_id, store_id } = params;

    getLineItemStatuses(store_id);
    if (workflow_id !== undefined) {
      this.props.getWorkflow(workflow_id, store_id).then(resp => {
        const { workflow, error } = resp;
        if (!error) {
          actions.showWorkflowOverview({ initialValues: workflow, isCreating: false });
        }
      });
    } else {
      actions.showWorkflowOverview({ initial: null, isCreating: true });
    }
  }

  discard = () => {
    let { store_id } = this.props.params;
    routeHelper.goWorkflowSetUp(store_id);
  };

  renderSteps() {
    let { steps, lineItemStatuses, actions } = this.props;

    let options = lineItemStatuses.slice();
    options.forEach(s => {
      s.value = s.status;
      s.label = s.status;
    });
    if (!steps.length) {
      steps = [undefined];
    }
    return steps.map((step, i) => (<Step value={ step }
                                         valueKey={ 'status' }
                                         placeholder="Select Status"
                                         key={ i }
                                         resetValue={ undefined }
                                         onChange={ (lineItemStatus) => actions.selectWorkflowTitle({ stepNumber: i, lineItemStatus }) }
                                         options={ options }
                                         stepNumber={ i } />));

  }

  render() {
    const { actions, title, params } = this.props;
    const { store_id } = params;

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
            <button className="btn btn-secondary btn-sm"
                    onClick={ this.discard }
                    type="submit">Cancel</button>
            &nbsp;
            <button className="btn btn-primary btn-sm"
                    onClick={ () => actions.saveWorkflowSetting(store_id) }
                    type="submit">Save</button>
          </div>
        </header>
        <div className="main-content-section ">
          <div className="row">
            <div className="col-md-12 col-sm-12">
              <InputBox title="WORKFLOW TITLE"
                        value={ title }
                        type="text"
                        onChange={ (e) => actions.changeWorkflowTitle(e.target.value) }/>
            </div>
          </div>
          { this.renderSteps() }
          <a className="btn" onClick={ actions.addWorkflowNextStep }><i className="fa fa-plus-circle" /> Add Next Step</a>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WorkflowSetupItem);

