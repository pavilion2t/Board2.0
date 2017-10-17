import { combineReducers } from 'redux';

import { default as productionOrderIndex } from './productionOrderIndex';
import inventoryVarianceIndex  from './inventoryVarianceIndex';

const formsReducer = combineReducers({
  productionOrderIndex,
  inventoryVarianceIndex
});

export default formsReducer;
