import { createSelector } from 'reselect';
import { get } from 'lodash';

const getDiscountOptions = state=>state.components.selectDiscount.discounts

const getFilterValue = state=>state.components.selectDiscount.filter

export const getFilteredDiscountOptions = createSelector(
  [getDiscountOptions, getFilterValue],
  (options, filter) => options.filter(opt=>opt.name.indexOf(filter)>-1)
)

export const getSelected = state=>state.components.selectDiscount.selected

export const getSelectedDiscount = createSelector(
  [getDiscountOptions, getSelected],
  (options, selectedId) => options.find(discount=>discount.id===selectedId),
);

export const getComponentState = (state) => get(state, 'components.selectDiscount', {});

export const getIsOpen = createSelector(
  [
    (state, props) => get(props, 'name', 'discount'),
    getComponentState,
  ],
  (componentName, state) => componentName === state.name && state.isOpen,
);

export const getLoading = createSelector(
  [getIsOpen, getComponentState],
  (isOpen, state) => isOpen && state.loading,
);
