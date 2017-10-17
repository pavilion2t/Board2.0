import * as act from '~/actions/componentActions/selectDiscountActions';
import { createReducer } from '~/helpers/reduxHelper';

const initialState = {
  name: '',
  loading: false,
  isOpen: false,
  discounts: [],
};

const actionHandlers = {
  [act.OPEN_SELECT_DISCOUNT_MODAL]: (state, { payload = {} }) => {
    const { name, modalInitState = {filter:'', selected:null} } = payload;
    return {
      ...initialState,
      ...modalInitState,
      name,
      isOpen: true,
    };
  },
  [act.CLOSE_SELECT_DISCOUNT_MODAL]: (state, { payload = {} }) => {
    return {
      ...state,
      isOpen: false,
    };
  },
  [act.LOAD_DISCOUNT_OPTIONS]:(state, {payload = {} }) => {
    return {
      ...state,
      loading: true
    }
  },
  [act.LOAD_DISCOUNT_OPTIONS_SUCCESS]: (state, {discounts}) => {
    return {
      ...state,
      loading: false,
      discounts
    }
  },
  [act.FILTER_CHANGE]: (state, {value}) =>({...state, filter:value}),
  [act.SELECT_DISCOUNT]: (state, {id}) => ({...state, selected: id})
};

export default createReducer(initialState, actionHandlers);
