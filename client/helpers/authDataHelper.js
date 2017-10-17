import * as cookieHelper from './cookieHelper'

export default class authDataHelper {
  static save(user) {
    cookieHelper.setCookie(user)
  }

  static get(){
    if (cookieHelper.isAuthencated()){
      return cookieHelper.getCookie()
    }
    return null
  }

  static clear(){
    cookieHelper.clear()

    // Dashboard 2
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('auth');
    }
  }
}
