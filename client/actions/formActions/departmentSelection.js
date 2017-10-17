import values from 'lodash/values';

export const OPEN_DEPARTMENT_SELECTION = 'OPEN_DEPARTMENT_SELECTION';
export const CLOSE_DEPARTMENT_SELECTION = 'CLOSE_DEPARTMENT_SELECTION';
export const TOGGLE_DEPARTMENT_SELECTION = 'TOGGLE_DEPARTMENT_SELECTION';
export const TOGGLE_DEPARTMENT_COLLAPSED = 'TOGGLE_DEPARTMENT_COLLAPSED';
export const SAVE_DEPARTMENT_SELECTION = 'SAVE_DEPARTMENT_SELECTION';
export const TOGGLE_ALL_DEPARTMENT_SELECTION = 'TOGGLE_ALL_DEPARTMENT_SELECTION';

export const openDepartmentSelection = ({ selected, params }) => {
  return (dispatch, getState) => {
    const state = getState();
    const department = state.entities.departments;
    dispatch({ type: OPEN_DEPARTMENT_SELECTION, all: values(department), selected: selected.slice(), params });
  };
};

export const toggleAllDepartmentSelection = (empty) => {
    return (dispatch, getState) => {
        dispatch({ type: TOGGLE_ALL_DEPARTMENT_SELECTION, empty});
    };
};

export const closeDepartmentSelection = () => ({ type: CLOSE_DEPARTMENT_SELECTION });

export const toggleDepartmentCollapse = (path, collapsed) => ({type: TOGGLE_DEPARTMENT_COLLAPSED, path, collapsed });

export const toggleDepartmentSelection = (path, checked) => ({ type: TOGGLE_DEPARTMENT_SELECTION, path, checked });

export const submitDepartmentSelection = (openerSubmitCallback) => {
  return (dispatch, getState) => {
    const state = getState();
    const { selected, params } = state.forms.departmentSelection;
    dispatch({ type: SAVE_DEPARTMENT_SELECTION, selected, params });
    if (typeof openerSubmitCallback === 'function') {
        openerSubmitCallback();
    }
  };
};
