import LoginService from '../services/loginService';
import authDataHelper from '../helpers/authDataHelper';
import routeHelper from '~/helpers/routeHelper';
import { startFetch, stopFetch } from './baseActions';

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

export function requestLoginSuccess(user) {
	return {
		type: LOGIN_SUCCESS,
		user
	};
}

function requestLoginFailure() {
	authDataHelper.clear();

	return {
		type: LOGIN_FAILURE
	};
}

export function login(username, password){
	return dispatch => {
    dispatch(startFetch());

    return LoginService.login(username, password)
      .then(({user}) => {
        authDataHelper.save(user);
        dispatch(requestLoginSuccess(user));
        dispatch(stopFetch());
        routeHelper.goSiteIndex();
			})
			.catch(ex => {
        dispatch(requestLoginFailure());
        dispatch(stopFetch());
      });
  };
}
