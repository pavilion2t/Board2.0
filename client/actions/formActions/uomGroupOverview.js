import { getGroup, update as updateGroup, create as createGroup } from '~/actions/uomGroupActions';
import { pick, differenceBy, intersectionBy } from 'lodash';
import routeHelper from '~/helpers/routeHelper';

export const OPEN_WORKFLOW_OVERVIEW_REQUEST = 'OPEN_WORKFLOW_OVERVIEW_REQUEST';
export const OPEN_WORKFLOW_OVERVIEW_SUCCESS = 'OPEN_WORKFLOW_OVERVIEW_SUCCESS';
export const OPEN_WORKFLOW_OVERVIEW_FAILURE = 'OPEN_WORKFLOW_OVERVIEW_FAILURE';
export const CLOSE_WORKFLOW_OVERVIEW = 'CLOSE_WORKFLOW_OVERVIEW';
export const CHANGE_UOM_GROUP_NAME = 'CHANGE_UOM_GROUP_NAME';
export const CHANGE_UOM_UNIT_NAME = 'CHANGE_UOM_UNIT_NAME';
export const CHANGE_UOM_UNIT_RATIO = 'CHANGE_UOM_UNIT_RATIO';
export const ADD_UOM_UNIT = 'ADD_UOM_UNIT';
export const REMOVE_UOM_UNIT = 'REMOVE_ROM_UNIT';
export const ENABLE_UOM_OVERVIEW_EDITMODE = 'ENABLE_UOM_OVERVIEW_EDITMODE';
export const SUBMIT_UOM_GROUP_REQUEST = 'SUBMIT_UOM_GROUP_REQUEST';
export const SUBMIT_UOM_GROUP_SUCCESS = 'SUBMIT_UOM_GROUP_SUCCESS';
export const SUBMIT_UOM_GROUP_FAILURE = 'SUBMIT_UOM_GROUP_FAILURE';

export const open = (storeId, unitGroupId) => (dispatch) => {
  dispatch({ type: OPEN_WORKFLOW_OVERVIEW_REQUEST, unitGroupId, storeId });
  if (unitGroupId) {
    dispatch(getGroup(unitGroupId, storeId))
      .then(resp => {
        let { data, error } = resp;
        if (!error) {
          dispatch({ type: OPEN_WORKFLOW_OVERVIEW_SUCCESS, data });
          return { groupData: data };
        } else {
          alert(error.message);
          dispatch({ type: OPEN_WORKFLOW_OVERVIEW_FAILURE, error });
          return { error };
        }
      });
  }
};
export const close = () => ({ type: CLOSE_WORKFLOW_OVERVIEW });
export const enableEditMode = () => ({ type: ENABLE_UOM_OVERVIEW_EDITMODE });
export const changeGroupName = (value) => ({ type: CHANGE_UOM_GROUP_NAME, value });
export const changeUnitName = (value, index) => ({ type: CHANGE_UOM_UNIT_NAME, value, index });
export const changeUnitRatio = (value, index) => ({ type: CHANGE_UOM_UNIT_RATIO, value, index });
export const addUomUnit = () => ({ type: ADD_UOM_UNIT });
export const removeUnit = (index) => ({ type: REMOVE_UOM_UNIT, index });
export const submit = () => (dispatch, getState) => {
  const state = getState();
  const data = state.forms.uomOverview;
  const { units, groupName, isCreating, storeId, initialValues, referenceUnit } = data;
  if (!groupName) {
    alert('Please enter group name.');
    return;
  }
  if (!referenceUnit.name) {
    alert('Please enter reference unit.');
    return;
  }
  let noName = units.map((group, i) => group.name ? null :  i).filter(i => !!i);
  if (noName.length) {
    alert(`Please enter unit name.`);
    return;
  }
  let noRatio = units.map((group, i) => group.ratio !== null && group.ratio !== undefined ? null : i).filter(i => !!i);
  if (noRatio.length) {
    alert('Please enter unit ratio.');
    return;
  }

  let allName = units.map(u => u.name).concat([referenceUnit.name]);

  let deplicatedName = allName.filter((n, i) => allName.indexOf(n) !== i);
  if (deplicatedName.length) {
    alert(`Please check duplicated name: ${deplicatedName.join(', ')}.`);
    return;
  }

  let groupData = {
    units_attributes: []
  };
  dispatch({ type: SUBMIT_UOM_GROUP_REQUEST });
  if (isCreating) {
    groupData.name = groupName;
    groupData.units_attributes = units.map(cleanUnitData).concat([cleanUnitData(referenceUnit)]);
    dispatch(createGroup(groupData, storeId))
      .then(resp => {
        const { data, error } = resp;
        if (!error) {
          let { id } = data;
          routeHelper.goUomGroups(storeId, id);
        } else {
          alert(error.message);
          dispatch({ type: SUBMIT_UOM_GROUP_FAILURE, error });
        }
      })
      .catch(error => {
        alert(error.message);
        dispatch({ type: SUBMIT_UOM_GROUP_FAILURE, error });
      });
  } else {
    if (groupName !== initialValues.name) groupData.name = groupName;
    let initialUnits = initialValues.units || [];
    initialUnits = initialUnits.filter(u => u.isBaseUnit === false);
    let toRemove = differenceBy(initialUnits, units, 'id');
    let toAdd = differenceBy(units, initialUnits, 'id');
    let toUpdate = intersectionBy(units, initialUnits, 'id');
    toRemove.forEach(i => i['_destroy'] = true);
    groupData.units_attributes = groupData.units_attributes.concat(toAdd.map(cleanUnitData))
      .concat(toRemove.map(cleanUnitData))
      .concat(toUpdate.map(cleanUnitData));
    dispatch(updateGroup(groupData, initialValues.id, storeId))
      .then(resp => {
        let { data, error } = resp;
        if (!error) {
          dispatch({ type: SUBMIT_UOM_GROUP_SUCCESS });
          dispatch({ type: OPEN_WORKFLOW_OVERVIEW_SUCCESS, data });
        } else {
          alert(error.message);
          dispatch({ type: SUBMIT_UOM_GROUP_FAILURE, error });
        }
      });
  }
};


function cleanUnitData(data) {
  return pick(data, ['id', 'name', 'unitGroupId', 'ratio', 'isBaseUnit', '_destroy']);
}
