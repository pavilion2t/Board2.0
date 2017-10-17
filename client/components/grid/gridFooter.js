import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

const defaultRowCounts = [25, 50, 100, 200];

export class GridRowsPerPage extends Component {
  static propTypes = {
    disableAll: PropTypes.bool,
    returnAll: PropTypes.bool,
    totalEntries: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    updateRowsPerPage: PropTypes.func.isRequired,
  };

  static defaultProps = {
    disableAll: true,
    returnAll: false
  };

  renderSwitch() {
    const {
      totalEntries,
      disableAll,
      rowsPerPage,
      updateRowsPerPage,
      returnAll
    } = this.props;

    let switches = defaultRowCounts.map((number, i) => {
      let showLink = returnAll || (rowsPerPage !== number);

      return (
        <span className="row-count__switch"
              key={ `${number}` }>
          { showLink && <a onClick={ ()=>updateRowsPerPage(number) }>{ number }</a> }
          { !showLink && <span>{ number }</span> }
          { i!== defaultRowCounts.length-1 && ' / ' }
        </span>
      );
    });
    if (!disableAll) {
      let allSwitch = (
        <span className="row-count__switch"
              key="all">
          { ' / ' }
          { !returnAll && <a onClick={ () => updateRowsPerPage(totalEntries) }>All</a> }
          { returnAll && <span>All</span> }
        </span>
      );
      switches.push(allSwitch);
    }

    return switches;
  }

  render() {
    const {
      totalEntries,
      currentPage,
      rowsPerPage,
      returnAll
    } = this.props;

    let gridIsEmpty = totalEntries < 1;
    return (
      <div className="grid__row-count">
        { returnAll && <span>{ `Showing ${gridIsEmpty ? 0 : 1}-${totalEntries} of ${totalEntries} results.` }</span> }
        { !returnAll && <span>{ `Showing ${gridIsEmpty ? 0 : (currentPage - 1) * rowsPerPage + 1}-${Math.min(currentPage * rowsPerPage, totalEntries)} of ${totalEntries} results.` }</span> }
        <span>Show { this.renderSwitch() }</span>
      </div>

    );
  }
}


export class GridPagination extends Component {
  static propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    goToPage: PropTypes.func.isRequired,
    paginationLinks: PropTypes.array.isRequired,
  };

  renderLinks() {
    const { paginationLinks, goToPage, currentPage } = this.props;

    return paginationLinks.map((number, i) => {
      return (
        <span className="pagination__link"
              key={ number }>
          <a onClick={ () => goToPage(number) }
             className={ classnames({ _current: number === currentPage}) } >{ number }</a>
        </span>
      );
    });

  }

  render() {
    const {
      currentPage,
      totalPages,
      goToPage
    } = this.props;

    return (
      <div className="grid__pagination">
        { currentPage!==1 && <span className="pagination__link">
          <a onClick={ () => goToPage(1) }>«</a>
          </span> }
        { currentPage !== 1 && <span className="pagination__link">
            <a onClick={ () => goToPage(currentPage-1) }>‹</a>
          </span> }
        { this.renderLinks() }
        { currentPage !== totalPages && <span className="pagination__link">
          <a onClick={ () => goToPage(currentPage+1) }>›</a>
          </span> }
        { currentPage !== totalPages && <span className="pagination__link">
          <a onClick={ () => goToPage(totalPages) }>»</a>
          </span> }
      </div>
    );
  }
}

function paginationLinks(currentPage, totalPages) {
  let min;
  let max;
  let links = [];

  if (currentPage > 4) {
    max = Math.min(totalPages, currentPage + 5);
    min = Math.max(1, max - 9);
  } else {
    min = 1;
    max = Math.min(totalPages, 10);
  }

  for (let i = min; i < max + 1; i++) {
    links.push(i);
  }

  return links;
}

export default class GirdFooter extends Component {
  static propTypes = {
    totalEntries:      PropTypes.number,
    rowsPerPage:       PropTypes.number,
    currentPage:       PropTypes.number,
    totalPages:        PropTypes.number,
    goToPage:          PropTypes.func,
    updateRowsPerPage: PropTypes.func,
    hidePaginate:      PropTypes.bool,
    hideRowPerPage:    PropTypes.bool,
  };

  static defaultProps = {
    rowsPerPage: 25
  };

  render() {
    const {
      totalEntries,
      rowsPerPage,
      currentPage,
      totalPages,
      goToPage,
      updateRowsPerPage,
      hidePaginate,
      hideRowPerPage,
    } = this.props;

    return (
      <div className="grid__footer">
        {
          hidePaginate ? null :
            <GridPagination currentPage={ currentPage }
                            totalPages={ totalPages }
                            goToPage={ goToPage }
                            paginationLinks={ paginationLinks(currentPage, totalPages) }/>
        }
        {
          hideRowPerPage ? null :
            <GridRowsPerPage currentPage={ currentPage }
                             totalEntries={ totalEntries }
                             rowsPerPage={ rowsPerPage }
                             updateRowsPerPage={ updateRowsPerPage }/>
        }
      </div>
    );
  }
}
