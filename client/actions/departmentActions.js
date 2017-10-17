import map from 'lodash/map';
import { normalize , arrayOf } from 'normalizr';

import { DepartmentSchema } from '../store/middlewares/schema';
import departmentService from '../services/departmentService';
import { SET_ENTITIES } from './entityActions';


export function getDepartments(storeId, page, count, orderBy) {
  return dispatch => {
    return departmentService.getList(storeId)
      .then(data => {
        data.data = map(data.data, (d) => d.department);
        let normalizedData = normalize(data, {
          data: arrayOf(DepartmentSchema)
        });

        dispatch({ type: SET_ENTITIES, collection: 'departments', data: normalizedData.entities.departments });
      });
  };
}
