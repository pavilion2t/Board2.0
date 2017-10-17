import { createSelector } from 'reselect';
import { get } from 'lodash';


import FilterHelper from '~/helpers/filterHelper';

export const getLoading = (state) => get(state, 'base.loading');

export const getCurrentPage = (state, props) => parseInt(get(props, 'location.query.page', 1));

export const getRowsPerPage = (state, props) => parseInt(get(props, 'location.query.per_page', 25));

export const getFiltersString = (state, props) => get(props, 'location.query.filters');

export const getFilters = createSelector(
  [ getFiltersString ],
  (filtersString) => FilterHelper.stringToFilters(filtersString),
);

export const getMeta = createSelector(
  [getCurrentPage, getRowsPerPage, getFilters],
  (currentPage, rowsPerPage, filters) => ({ currentPage, rowsPerPage, filters }),
);
