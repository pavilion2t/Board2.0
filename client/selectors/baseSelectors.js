import { createSelector } from 'reselect';
import { get } from 'lodash';

export const getLoading = (state) => get(state, 'base.loading');

export const getParams = (state, props) => get(props, 'params');

export const getStoreIdFromParams = createSelector(
  [getParams],
  (params) => get(params, 'store_id'),
);
