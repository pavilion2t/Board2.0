import discountService from '~/services/discountService'

export const OPEN_SELECT_DISCOUNT_MODAL = 'OPEN_SELECT_DISCOUNT_MODAL';
export const CLOSE_SELECT_DISCOUNT_MODAL = 'CLOSE_SELECT_DISCOUNT_MODAL';

export const LOAD_DISCOUNT_OPTIONS = 'LOAD_DISCOUNT_OPTIONS'
export const LOAD_DISCOUNT_OPTIONS_SUCCESS = 'LOAD_DISCOUNT_OPTIONS_SUCCESS'
export const LOAD_DISCOUNT_OPTIONS_FAIL = 'LOAD_DISCOUNT_OPTIONS_FAIL'

export const FILTER_CHANGE = 'FILTER_CHANGE'
export const SELECT_DISCOUNT = 'SELECT_DISCOUNT'

export const openSelectDiscountModal = (name, modalInitState) => ({
  type: OPEN_SELECT_DISCOUNT_MODAL,
  payload: { name, modalInitState },
});

export const closeSelectDiscountModal = () => ({
  type: CLOSE_SELECT_DISCOUNT_MODAL,
});

function loadDiscountOptionsSuccess(discounts) {
  return {
    type: LOAD_DISCOUNT_OPTIONS_SUCCESS,
    discounts
  }
}

export const loadDiscountOptions = (storeId)=> dispatch=> {
  dispatch({type:LOAD_DISCOUNT_OPTIONS})
  try {
    return discountService.getList(storeId)
    .then(response=>response.data.map(item=>item.discount))
    .then(discounts=> dispatch(loadDiscountOptionsSuccess(discounts)))
  } catch (err){
    console.error(err);
    dispatch({
      type: LOAD_DISCOUNT_OPTIONS_FAIL,
      err
    })
  }
}

export const filterChange = (value)=> {
  return {
    type: FILTER_CHANGE,
    value
  }
}

export const selectDiscount = ({id}) => ({
  type: SELECT_DISCOUNT,
  id
})
