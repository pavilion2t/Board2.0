import arrayToTree from 'array-to-tree';

import * as actions from '~/actions/formActions/departmentSelection';
import { cloneDeep, get } from 'lodash';
import { createReducer } from '~/helpers/reduxHelper';

const selectDepartmentDeep = (department, checked) => {
  department.checked = checked;
  (department.children||[]).forEach(d => selectDepartmentDeep(d, checked));
};

const findSelectedDeep = (departments = []) => {
  let selected = [];
  (departments||[]).forEach(d => {
    if (d.checked){
      selected.push(d);
    }
    selected = selected.concat(findSelectedDeep(d.children||[]));
  });
  return selected;
};

const initialState = {
  isOpen: false,
  all: [],
  selected: [],
  params: null
};

const actionHandlers = {
  [actions.TOGGLE_ALL_DEPARTMENT_SELECTION]: (state, action) => {
    let selected;
    let all = cloneDeep(state.all||[]);
    if (action.empty) {
      all.forEach(d => selectDepartmentDeep(d, false));
      selected = [];
    } else {
      all.forEach(d => selectDepartmentDeep(d, true));
      selected = findSelectedDeep(all);
    }
    return Object.assign({}, state, { all, selected });
  },
  [actions.OPEN_DEPARTMENT_SELECTION]: (state, action) => {
    const { all, selected, params } = action;
    let allItems = all.map(d => ({
      department_id: d.id,
      label: d.name,
      department_name: d.name,
      checkbox: true,
      parent_id: d.parent_id
    }));
    let nested = arrayToTree(allItems, { customID: 'department_id' });
    return Object.assign({}, state, { isOpen: true, all: nested, selected, params });
  },
  [actions.CLOSE_DEPARTMENT_SELECTION]: () => initialState,
  [actions.SAVE_DEPARTMENT_SELECTION]: () => initialState,
  [actions.TOGGLE_DEPARTMENT_COLLAPSED]: (state, action) => {
    const { path, collapsed } = action;
    let paths = (path || '').split('.');
    paths = Array.isArray(paths) ? paths : paths ? [] : [paths];
    if (paths.length > 0) {
      let { all } = state;
      all = cloneDeep(all);
      const pathStr = paths.reduce((p, c, i) => {
        const prefix = i > 0 ? '.children' : '';
        return `${p}${prefix}[${c}]`;
      }, '');
      const target = get(all, pathStr);
      if (target){
        target.collapsed = collapsed;
        return Object.assign({}, state, { all });
      }
    }
    return state;
  },
  [actions.TOGGLE_DEPARTMENT_SELECTION]: (state, action) => {
    const { path, checked } = action;
    let paths = (path || '').split('.');
    paths = Array.isArray(paths) ? paths : paths ? [] : [paths];
    if (paths.length > 0) {
      let { all } = state;
      all = cloneDeep(all);
      const pathStr = paths.reduce((p, c, i) => {
        const prefix = i > 0 ? '.children' : '';
        return `${p}${prefix}[${c}]`;
      }, '');
      const target = get(all, pathStr);
      if (target){
        selectDepartmentDeep(target, checked);
        const selected = findSelectedDeep(all);
        return Object.assign({}, state, { all, selected });
      }
    }
    return state;
  }
};

export default createReducer(initialState, actionHandlers);
