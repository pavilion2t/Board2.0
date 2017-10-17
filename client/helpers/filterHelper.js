import { browserHistory } from 'react-router';
import { each, pick } from 'lodash';
import { decamelizeKeys } from 'humps';

class FilterHelper {
  filtersToString(filters) {
    let queryList = this.filtersToQueryString(filters);

    return queryList.join('____');
  }

  filtersToQueryString(filters) {
    let queryList = [];

    for (let filterKey in filters) {
      if (filters.hasOwnProperty(filterKey)) {
        let filter = filters[filterKey];

        switch (filter.condition) {
          case 'between':
          case 'date_between': {
            if (!filter.conditionFrom && !filter.conditionTo) {
              continue;
            }

            let query = `${filter.column}__${filter.condition}__${filter.conditionFrom}__${filter.conditionTo}`;

            queryList.push(query);
            break;
          }
          default: {
            if (filter.conditionValue == null || filter.conditionValue === ''){
              continue;
            }
            const value = typeof filter.conditionValue === 'boolean' ?
              (filter.conditionValue ? 1 : 0) :
              filter.conditionValue;
            let query = `${filter.column}__${filter.condition}__${value}`;

            queryList.push(query);
            break;
          }
        }
      }
    }

    return queryList;
  }

  stringToFilters(query) {
    let filters = [];
    if (!query) {
      return filters;
    }

    let queryList = query.split('____');
    for (let i = 0; i < queryList.length; i++) {
      let rowData = queryList[i].split('__');
      let condition = rowData[1];

      switch (condition) {
        case 'between':
        case 'date_between': {
          let filter = {
            column: rowData[0],
            condition: rowData[1],
            conditionFrom: rowData[2],
            conditionTo: rowData[3]
          };

          filters.push(filter);
          break;
        }
        default: {
          let filter = {
            column: rowData[0],
            condition: rowData[1],
            conditionValue: rowData[2]
          };

          filters.push(filter);
          break;
        }
      }
    }

    return filters;
  }

  searchParamToFilters(searchParam) {
    let filters = [];
    if (searchParam) {
      const { filter, wildcard, range } = decamelizeKeys(searchParam);
      each(filter, (v, key) => {
        if (v) {
          const column = key;
          const condition = 'equal';
          const conditionValue = v;
          filters.push({ column, condition, conditionValue });
        }
      });
      each(wildcard, (v, key) => {
        if (v) {
          const column = key;
          const condition = 'contain';
          const conditionValue = v.replace(/\*/g, '');
          filters.push({ column, condition, conditionValue });
        }
      });
      each(range, (v, key) => {
        if (v) {
          const column = key;
          const condition = 'between';
          const conditionFrom = v.gte || v.gt;
          const conditionTo = v.lte || v.lt;
          filters.push({ column, condition, conditionFrom, conditionTo });
        }
      });
    }
    return filters;
  }

  getFilterSettings = (columnMeta = []) =>
    columnMeta
      .filter(d => d.filterConditions)
      .map(d => pick(d, 'columnName', 'displayName', 'filterConditions'));

  search(basePath, page, perPage, filters) {
    filters = this.filtersToQueryString(filters);
    browserHistory.push({
      pathname: basePath,
      query: { page, per_page: perPage, filters },
    });
  }

  onSearchFactory = (basePath, perPage) => (filters) => this.search(basePath, 1, perPage, filters);

  goToPageFactory = (basePath, perPage, filters) => (page) => this.search(basePath, page, perPage, filters);

  updateRowsPerPageFactory = (basePath, filters) => (perPage) => this.search(basePath, 1, perPage, filters);
}

export default new FilterHelper();
