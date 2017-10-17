import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classnames from 'classnames';
import * as actions from '~/actions/formActions/tableSizeSegmentation';
import Loading from '~/components/loading/loading';
import TableType from './tableType';
import LinkDisplay from './linkDisplay';
import { dateTime } from '~/helpers/formatHelper';

class SettingsBusinessTableSizingSegmentation extends Component {
  static propTypes = {
    editMode: PropTypes.bool.isRequired,
    items: PropTypes.array.isRequired,
    enableDailyRestart: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isCreating: PropTypes.bool.isRequired,
    loadingError: PropTypes.string.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    isRefreshing: PropTypes.bool.isRequired,
    updatedAt: PropTypes.string.isRequired,
    isModalOpen: PropTypes.bool.isRequired,
    isLinking: PropTypes.bool.isRequired,
    linkSuccess: PropTypes.bool.isRequired,
    linkError: PropTypes.bool.isRequired,
    params: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  componentDidMount() {
    let { store_id } = this.props.params;
    this.props.actions.open(store_id);
  }

  componentWillUnmount() {
    this.props.actions.close();
  }

  timeFormatter = (value) => {
    let timezine = this.context.currentStore && this.context.currentStore.timezone;
    return dateTime(value, timezine);
  };

  renderItems() {
    let { editMode, items, actions } = this.props;
    let prev = 0;
    return items.map((item, i) => {
      let min = prev;
      let { label, minimumPartySize } = item;
      prev = minimumPartySize + 1;
      return (<TableType label={ label }
                        key={ i }
                        size={ minimumPartySize }
                        onNameChange={ (name) => actions.changeTypeName(name, i) }
                        onRemove={ () => actions.removeTableType(i) }
                        onSizeChange={ (size) => actions.changeTableSize(size, i) }
                        disabled={ !editMode }
                        min={ min }/>);

    });
  }

  renderContent() {
    const { editMode, enableDailyRestart, actions, updatedAt, isModalOpen, linkSuccess, isLinking, linkError, items } = this.props;

    let typeLen = items ? items.length: 0;

    return (
      <div className="main-content">
        <LinkDisplay isOpen={ isModalOpen }
                     isSubmitting={ isLinking }
                     success={ linkSuccess }
                     failure={ linkError }
                     onSubmit={ actions.submitLinkUp }
                     onRequestClose={ actions.closeLinkUpQueueDisplayModal }/>
        <header className="main-content-header columns">
          <h1 className="main-content-title columns-main"> </h1>
          <div>
            { !isModalOpen && <button className="btn btn-secondary btn-sm" onClick={ actions.openLinkUpQueueDisplayModal } >Link Up Bindo Display</button> }
            { editMode && <button className="btn btn-primary btn-sm" onClick={ actions.submit }>Save</button> }
            { !editMode && <button className="btn btn-primary btn-sm" onClick={ () => actions.changeTableSizeSegmentationEditMode(true) }>Edit</button> }
          </div>
        </header>
        <div className="main-content-section">
          <h1>Table Size Segmentation</h1>
          { this.renderItems() }
          { typeLen < 4 && <a className={ classnames('_add', { '__disabled': !editMode }) } onClick={ editMode ? actions.addTableType : () => {} }><i className="fa fa-plus-circle" /> Add Table Type</a> }
        </div>
        <div className="main-content-section">
          <h1>Setting</h1>
          <div>
            <p><input type="checkbox"
                      value="1"
                      checked={ enableDailyRestart }
                      disabled={ !editMode }
                      onChange={ (e) => actions.changeRestartEnable(e.target.checked) }/> Daily Queue Count Restart</p>
          </div>
          <br/>
          {/*<br/>
          <div>
            <button className="btn btn-secondary btn-sm" disabled={ isCreating || isLoading } onClick={ actions.refreshNow }>Refresh Now</button>
          </div>*/}
          <br/>
          <div>
            <p>Last update: { this.timeFormatter(updatedAt) }</p>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { isLoading } = this.props;
    // let isLoading = true;
    return isLoading ?<Loading>Loading Settings</Loading> : this.renderContent();
  }


}

function mapStateToProps(state) {
  return state.forms.tableSizeSegmentation;
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsBusinessTableSizingSegmentation);
