import cz from 'classnames';
import React, { Component, PropTypes } from 'react';
import Griddle from 'griddle-react';

import Dropdown from '~/components/drop-down/dropDown';

class ActionDropDown extends Component {
  static propTypes = {
    rowData: PropTypes.object,
    metadata: PropTypes.object,
  };
  render() {
    const { rowData, metadata } = this.props;
    const { actions = [] } = metadata;
    const actionButtons = actions.map((act, i) => {
      let { name, hide, onClick }  = act;
      if (hide || typeof  hide === 'function' ? hide(rowData): false) return null;
      return (
        <a key={ i } className="dropdown-item a" onClick={ () => onClick(rowData) }>{ name }</a>
      );
    });
    const hasActionButtons = actionButtons.some(el => el);
    return (
      hasActionButtons ? <Dropdown>{ actionButtons }</Dropdown> : null
    );
  }
}

class RemoveButton extends Component {
  static propTypes = {
    rowData: PropTypes.object,
    metadata: PropTypes.object,
  };

  render() {
    const { rowData, metadata } = this.props;
    const { onClick } = metadata;

    return (
        <button type="button" className="_remove" onClick={ () => onClick(rowData) }/>
    );
  }
}

export default class GridBody extends Component {
  static propTypes = {
    actions: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
      hide: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.bool
      ])
    })),
    columns: PropTypes.array,
    data: PropTypes.array,
    onRemove: PropTypes.any, // eslint-disable-line react/forbid-prop-types
    border: PropTypes.oneOf([true, false, 'v', 'h']),
    noOutline: PropTypes.bool,
  };

  static defaultProps = {
    loadingGrid: false,
    actions: undefined,
    columns: [],
    data: [],
    showRemoveButton: false,
    onRemove: undefined,
    border: 'v',
    noOutline: false,
  };

  render() {
    const { data, columns: metadatas, actions, onRemove, border, noOutline } = this.props;

    let rows = data.slice();
    let columnMetadatas = metadatas.slice();
    if (Array.isArray(actions)) {
      columnMetadatas.push({
        columnName: "gridActions",
        displayName: "",
        customComponent: ActionDropDown,
        actions
      });
    }
    if (typeof onRemove === 'function') {
      columnMetadatas.push({
        columnName: "  ",
        displayName: "",
        customComponent: RemoveButton,
        onClick: onRemove
      });
    }
    let columnNames = columnMetadatas.filter(i => !i.hide).map(i => i.columnName);
    rows.forEach(datum => {
      columnNames.forEach(col => {
        if (!datum.hasOwnProperty(col)) datum[col] = " ";
      });
    });
    const tableClassName = cz('table data-table', {
      'table-bordered': !noOutline,
      'data-table--h-border': border === 'h',
      'data-table--v-border': border === 'v',
      'data-table--all-border': border === true,
      'data-table--no-border': border === false,
    });

    return (
      <Griddle
        useGriddleStyles={ false }
        tableClassName={ tableClassName }
        resultsPerPage={ 200 }
        results={ rows }
        columns={ columnNames }
        columnMetadata={ columnMetadatas }
      />
    );
  }
}
