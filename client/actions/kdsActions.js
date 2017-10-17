import kdsService from '~/services/kdsService';

import { startFetch, stopFetch } from './baseActions';

import {
  SET_ENTITIES,
  UPDATE_ENTITY,
  REMOVE_ENTITY,
  ADD_ENTITY
} from './entityActions';

export const SET_STATIONS_STATUS = 'SET_STATIONS_STATUS';
export const LINK_STATION_TO_STORE = 'LINK_STATION_TO_STORE';


export function updateStationsFilters(filters = []){
  let status ={
    filters: filters
  };

  return {
    type: SET_STATIONS_STATUS,
    data: status
  };
}

export function updateStationsStatus(data){
  return {
    type: SET_STATIONS_STATUS,
    data
  };
}

export function getStations(storeId, page, count, orderBy, filters = []) {
  return dispatch => {
    dispatch(startFetch());
    dispatch({ type: SET_STATIONS_STATUS, data: {loading: true} });

    return kdsService.getStations(storeId, page, count, orderBy, filters)
      .then(data => {
        const { totalCount, totalPages, page, count } = data;

        let entities = {};
        if (data.data && data.data.stations){
          data.data.stations.forEach(station => {
            let { id } = station;
            entities[id] = station;
          });
        }
        let status = {
          totalCount,
          totalPages,
          page,
          count,
          filters: filters,
          loading: false,
        };

        dispatch({ type: SET_STATIONS_STATUS, data: status });
        dispatch({ type: SET_ENTITIES, collection: 'stations', data: entities });
        dispatch(stopFetch());

      }).catch(ex => {
        dispatch(stopFetch());


        let listingStatus = {
          loading: false,
        };

        dispatch({ type: SET_STATIONS_STATUS, data: listingStatus });
      });
  };
}

export function updateStation(data, id, storeId) {
  return dispatch => {
    dispatch(startFetch());

    return kdsService.updateStation(data, id, storeId)
      .then(data => {
        dispatch({ type: UPDATE_ENTITY, collection: 'stations', id, data });
        dispatch(stopFetch());
        return { data };
      })
      .catch(e =>{
        dispatch(stopFetch());
        return { error: e };
      });
  };
}

export function removeStation(id, storeId) {
  return dispatch => {
    dispatch(startFetch());

    return kdsService.removeStation(id, storeId)
      .then(data => {
        dispatch({ type: REMOVE_ENTITY, collection: 'stations', id});
        dispatch(stopFetch());
      })
      .catch(e => {
        dispatch(stopFetch());
      });
  };
}

export function linkStationToStore(stationKey, storeId) {
  return dispatch => {
    dispatch(startFetch());

    return kdsService.linkStationToStore({station_key: stationKey}, storeId).then(data => {
        let { station, message } = data;
        if (station) {
          const { id } = station;
          dispatch({ type: ADD_ENTITY, collection: 'stations', id, data: station});
          dispatch({ type: SET_STATIONS_STATUS, data: { loading: false } });
          dispatch(stopFetch());
          return { id };
        }
        if (message) {
          return { error: new Error(message)};
        }
      }).catch(e => {
        dispatch({ type: SET_STATIONS_STATUS, data: { loading: false } });
        dispatch(stopFetch());
        return { error: e };
      });
  };
}

export function getStation(stationId, storeId) {
  return dispatch => {
    dispatch(startFetch());

    return kdsService.getStation(stationId, storeId).then(result => {
        let { station } = result;
        if (station) {
          const { id } = station;
          dispatch({ type: ADD_ENTITY, collection: 'stations', id, data: station});
          dispatch({ type: SET_STATIONS_STATUS, data: { loading: false } });
          dispatch(stopFetch());
        }
        return { station };
      }).catch(e => {
        dispatch({ type: SET_STATIONS_STATUS, data: { loading: false } });
        dispatch(stopFetch());
        return { error: e };
      });
  };
}
