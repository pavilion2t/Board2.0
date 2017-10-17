

import {
  REQUEST_VALIATATED,
  GET_IMPORTER_STATUS,
  REQUEST_UPLOAD_IMAGES,
  WAIT_SERVER_UPLOAD_IMAGES,
  UPLOADING_IMAGES,
  FINISH_UPLOAD_IMAGES,
  ERROR_UPLOAD_IMAGES
} from '../../actions/inventoryActions';

const initialState = [];

export function importerReducer(state = initialState, action) {
  switch (action.type) {

    case REQUEST_VALIATATED:
      return Object.assign({}, action.data, { upload_url: action.upload_url });

    case GET_IMPORTER_STATUS:
      return action.data;

    case REQUEST_UPLOAD_IMAGES:
      return action.data;

    case WAIT_SERVER_UPLOAD_IMAGES:
      return Object.assign({}, action.data, { status: WAIT_SERVER_UPLOAD_IMAGES });

    case UPLOADING_IMAGES:
      return Object.assign({}, action.data, { status: UPLOADING_IMAGES });

    case FINISH_UPLOAD_IMAGES:
      return Object.assign({}, { status: FINISH_UPLOAD_IMAGES, id: action.id });

    case ERROR_UPLOAD_IMAGES:
      return Object.assign({}, action.data, { status: ERROR_UPLOAD_IMAGES });
    default:
      return state;
  }
}
