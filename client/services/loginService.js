import fetch from 'isomorphic-fetch';
import { bindo, clientId, clientSecret} from '../configs/config';

export default class LoginService {
  static login(username, password) {
    let url = bindo + '/v2/login';
    let data = {
      username: username,
      password: password,
      client_id: clientId,
      client_secret: clientSecret,
    };

    let result = fetch(url, {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          //// TODO: define more specific error
          throw new Error("Login Failed");
        }
      });

    return result;
  }

  static forgetPassword(email) {
    let url = bindo + '/v2/forgot_password';
    url = `${url}?identifier=${email}&client_id=${clientId}&client_secret=${clientSecret}`;

    let result = fetch(url)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          //// TODO: define more specific error
          throw new Error("Forget password Failed");
        }
      });

    return result;
  }
}
