import React, { PropTypes, Component } from 'react';
import map from 'lodash/map';
import uniqueId from 'lodash/uniqueId';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { saveFilter, removeFilter } from '~/actions/savedFiltersActions';
import InputDialog from '../dialogs/inputDialog';

function mapStateToProps(state, ownProps) {
  return {
    savedFilters: state.savedFilters[ownProps.group]
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const actions = {
    saveFilter   : saveFilter.bind(null, ownProps.group),
    removeFilter : removeFilter.bind(null, ownProps.group)
  };
  return bindActionCreators(actions, dispatch);
}

class SavedFilter extends Component {
  static propTypes = {
    savedFilters: PropTypes.object,
    currentFilter: PropTypes.arrayOf(PropTypes.object).isRequired,
    saveFilter: PropTypes.func.isRequired,
    removeFilter: PropTypes.func.isRequired,
    onFilterSelected: PropTypes.func.isRequired
  };

  state = {
    openInputDialog: false,
    openSaved: false
  };

  toggleSaved = (e) => {
    this.setState({ openSaved: !this.state.openSaved });
  }

  handleInputDialogOpen = (e) => {
    this.setState({
      openInputDialog: true
    });
  }

  handleInputDialogCancel = (e) => {
    this.setState({
      openInputDialog: false
    });
  }

  handleSave = (name) => {
    let filter = [...this.props.currentFilter];
    this.props.saveFilter(name, filter);

    this.setState({
      openInputDialog: false
    });
  }

  handleRemove(name, event) {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete the filter?')) {
      this.props.removeFilter(name);
    }
  }

  selectFilter(filter) {
    this.props.onFilterSelected(filter);

    this.setState({ openSaved: false });
  }

  render() {
    let counter = 0;
    for (let savedFilter in this.props.savedFilters) {
      if (this.props.savedFilters.hasOwnProperty(savedFilter)) {
        counter++;
      }
    }

    return (
      <div className="form-inline">
        <div className={ this.state.openSaved ? 'btn-group open' : 'btn-group' }>
          <button className="btn btn-secondary btn-sm dropdown-toggle" onClick={ this.toggleSaved }>Saved Filters</button>
          <ul className="dropdown-menu dropdown-menu-right">
            {
               counter > 0 ? map(this.props.savedFilters, (filter, name) => (
                <li key={ uniqueId() } className="dropdown-item a" onClick={ this.selectFilter.bind(this, filter) }>
                  <span className="right a text-danger" onClick={ this.handleRemove.bind(this, name) }>&times;</span> { name }
                </li>
              )) : (

                <li className="dropdown-item text-muted small">No Saved Filter</li>
              )
            }
            <li className="dropdown-divider"></li>
            <li className="dropdown-item a" onClick={ this.handleInputDialogOpen }>
              <b className="text-success">+</b> Save current filter
            </li>
          </ul>
        </div>

        <InputDialog isOpen={ this.state.openInputDialog }
          onSave={ this.handleSave }
          onCancel={ this.handleInputDialogCancel }/>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SavedFilter);

// TODO : close dropdown menu when click body
