import { combineReducers } from 'redux';
import selectDiscount from './selectDiscountReducer';

const componentsReducer = combineReducers({
  selectDiscount,
});

export default componentsReducer;
