import forEach from 'lodash/forEach';

import {
  SET_STATIONS,
  UPDATE_STATION,
  REMOVE_STATION} from '~/actions/kdsActions';

const initialState = {
  stations: null,
};

export default function entityReducer(state = initialState, action) {
  switch (action.type) {
    case SET_STATIONS: {
      state.stations = state.stations || {};
      let newStations = {};

      forEach(action.data.stations, (station) => {
        let { id: key } = station;
        newStations[key] = Object.assign({}, state.stations[key], station);
      });

      return Object.assign({}, state, {stations: newStations});
    }

    case UPDATE_STATION: {
      let { id, data } = action;
      let targetStation = state.stations[id];

      if (targetStation) {
        let newStation = Object.assign({}, targetStation, data);
        let newStations = Object.assign({}, state.stations, {[id]: newStation });

        return Object.assign({}, state, { stations: newStations });
      } else {
        return state;
      }
    }

    case REMOVE_STATION: {
      let { id } = action;
      let { stations }  = state;
      if (stations.hasOwnProperty(id)) delete stations[id];
      return Object.assign({}, state, { stations });
    }

    default:
      return state;
  }
}
