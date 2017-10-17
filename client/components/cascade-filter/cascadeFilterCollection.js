import './cascadeFilterCollection.scss';

import React, { PropTypes, Component } from 'react';
import uniqueId from 'lodash/uniqueId';

import CascadeFilter from './cascadeFilter';
import SavedFilter from './savedFilter';

import ActionButton from '~/components/action-button/action-button';


class CascadeFilterCollection extends Component {
  static propTypes = {
    group: PropTypes.string.isRequired,
    settings: PropTypes.arrayOf(PropTypes.object).isRequired,
    filters: PropTypes.arrayOf(PropTypes.object).isRequired,
    onSearch: PropTypes.func.isRequired
  };

  state = {
    filters: this.props.filters || [],
  }

  componentWillReceiveProps(nextProps) {
    let filters = nextProps.filters || [];

    // ensure filters passed in have id
    filters.forEach(filter => {
      filter.id = filter.id || uniqueId();
    });

    this.setState({
      filters: filters,
    });
  }

  onFilterSelected = (filters) => {
    this.setState({filters: []});
    this.setState({filters: filters});
  }

  addNewFilter = () => {
    let filters = this.state.filters;
    filters.push({
      id: uniqueId(), // for react render correct
      column: null,
      condition: null,
      conditionValue: null,
      conditionFrom: null,
      conditionTo: null
    });
    this.setState({filters: filters});
  }

  handleFilterChange = (index, data) => {
    let { filters } = this.state;
    filters[index] = data;
    this.setState({filters: filters});
  }

  handleFilterDelete = (index) => {
    this.state.filters.splice(index, 1);
    this.setState({filters: this.state.filters});
  }

  handleSearch = (e) => {
    this.props.onSearch(this.state.filters);
  }

  render(){
    let { filters } = this.state;
    // Set a default filter if no filters exist
    if (filters.length === 0){
      filters.push({
        id: uniqueId(),
        column: '',
        condition: '',
        conditionValue: '',
        conditionFrom: '',
        conditionTo: ''
      });
    }

    // Expends filters
    let cascadeFilter = filters.map((filter, index)=>{
      let showDelete = !!(filters.length - 1);
      return (
        <CascadeFilter
          key={ filter.id }
          settings={ this.props.settings }
          filter={ filter }
          onChange={ this.handleFilterChange.bind(null, index) }
          onDelete={ this.handleFilterDelete.bind(null, index) }
          showDelete={ showDelete }
        />
      );
    });

    return (
      <div className="card cascade-filter-collection">
        <div className="card-block">
          { cascadeFilter }
          <ActionButton type="add" onClick={ this.addNewFilter }>Add Filter</ActionButton>
        </div>
        <div className="card-footer clearfix">
          <div className="right">
             &nbsp; <button className="btn btn-primary btn-sm" onClick={ this.handleSearch }>Search</button>
          </div>
          <div className="right">
            <SavedFilter
              group={ this.props.group }
              currentFilter={ this.state.filters }
              onFilterSelected={ this.onFilterSelected }/>
          </div>
        </div>
      </div>
    );
  }
}

export default CascadeFilterCollection;
