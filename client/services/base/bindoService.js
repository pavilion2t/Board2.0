import 'isomorphic-fetch';
import qs from 'qs';
import uuid from 'uuid';
import config from '../../configs/config';
import authDataHelper from '../../helpers/authDataHelper';
import routeHelper from '../../helpers/routeHelper';

function getHeader() {
  let header = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-APPLICATION': 'dashboard.bindo.com',
    'X-USER-DEVICE-TYPE': 'pos',
    'X-Request-ID': uuid(),
  };
  let user = authDataHelper.get();

  if (user) {
    Object.assign(header, {
      'Authorization': "OAuth " + user.access_token,
      'X-USER-ACCESS-TOKEN': user.access_token, // bindo.com, gateway, analytics are using this one
    });
  }
  return header;
}

function decodeJsonWithMeta(json, link) {
  if (link) {
    const { current_page, per_page, total_entries, total_pages } = JSON.parse(link);
    const jsonWithMeta = {
      page: current_page,
      count: per_page,
      totalCount: total_entries,
      totalPages: total_pages,
      data: json
    };
    return jsonWithMeta;
  }
  return json;
}

function getHeaderForUploadFile() {
  let user = authDataHelper.get();
  return {
    'Authorization': "OAuth " + user.access_token,
    'X-USER-ACCESS-TOKEN': user.access_token, // bindo.com, gateway, analytics are using this one
    'X-APPLICATION': 'dashboard.bindo.com',
    'X-USER-DEVICE-TYPE': 'pos',
    'X-Request-ID': uuid(),
  };
}

class ApiService {
  postFile(path, data, server = config.bindo) {

    let url = server + '/' + path;

    let result = fetch(url, {
        method: 'post',
        headers: getHeaderForUploadFile(),
        body: data
    }).then((response) => {
      if (response.status < 399) {
        return response.json();

      } else if (response.status == 401) {
        authDataHelper.clear();
        routeHelper.goLogin();

      } else {
        throw new Error(response.message);
      }
    });
    return result;
  }

  postFileWProgress(path, data, progress, server = config.bindo) {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      let url = server + '/' + path;
      xhr.open("POST", url, true);
      xhr.upload.onprogress = progress;
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          if (xhr.response === "") {
            resolve("success");
          } else {
            resolve(JSON.parse(xhr.response));
          }
        } else if (xhr.status == 401) {
          authDataHelper.clear();
          location.href='/login';
        } else {
          reject({
            status: xhr.status,
            // statusText: JSON.parse(xhr.response)
            statusText: xhr.response
          });
        }
      };
      xhr.onerror = (evt) => {
        let err_msg;
        if (xhr.response === ""){
          err_msg = "Some unknow error from server or timeout";
        } else {
          err_msg = xhr.response;
        }
        reject({
          status: "ERROR",
          statusText: err_msg
        });
      };

      let headers = getHeaderForUploadFile();
      Object.keys(headers).forEach(name => {
        xhr.setRequestHeader(name, headers[name]);
      });

      xhr.send(data);
    });
  }

  postFileWithProgress(path, data, progress, server = config.bindo) {

    return new Promise(function (resolve, reject) {
      let url = path;
      let xhr = new XMLHttpRequest();

      xhr.open("PUT", url, true);

      xhr.upload.addEventListener("progress", progress, false);

      xhr.addEventListener("load", () => {

        if (xhr.status >= 200 && xhr.status < 300) {
          if (xhr.response === "") {
            resolve("success");
          } else {
            resolve(JSON.parse(xhr.response));
          }

        } else if (xhr.status == 401) {
          authDataHelper.clear();
          routeHelper.goLogin();
        } else {
          reject({
            status: xhr.status,
            statusText: JSON.parse(xhr.response)
          });
        }

      });

      xhr.addEventListener("error", (evt) => {

        let err_msg;

        if (xhr.response === ""){
          err_msg = "Some unknow error from server or timeout";
        } else {
          err_msg = xhr.response;
        }
        reject({
            status: "ERROR",
            statusText: err_msg
          });
      });

      xhr.send(data);

    });

  }

  post(path, data, server = config.bindo) {
    let link, status;
    let url = server + '/' + path;
    let result = fetch(url, {
        method: 'post',
        headers: getHeader(),
        body: JSON.stringify(data),
      })
      .then((response) => {
        status = response.status;
        link = response.headers.get('link');
        return response.json();
      })
      .then((json) => {
        if (status < 400) {
          return decodeJsonWithMeta(json, link);
        }
         else if (status == 401) {
          authDataHelper.clear();
          routeHelper.goLogin();

        } else {
          throw json;
        }
      });

    return result;
  }

  get(path, query, server = config.bindo, customHeader) {
    let url = server + '/' + path;
    let header = getHeader();

    if (query) {
      url = url + '?' + qs.stringify(query, { arrayFormat: 'brackets' });
    }

    if (customHeader) {
      Object.assign(header, customHeader);
    }


    let link, status;
    let result = fetch(url, {
        method: 'GET',
        headers: header,
      })
      .then((response) => {
        status = response.status;
        link = response.headers.get('link');
        return response.json();
      })
      .then((json) => {
        if (status < 400) {
          return decodeJsonWithMeta(json, link);
        }
         else if (status == 401) {
          authDataHelper.clear();
          routeHelper.goLogin();

        } else {
          throw json;
        }
      }).catch(error => {
        if (error) {
          throw error;
        } else {
          throw Error(status);
        }
      });

    return result;
  }

  put(path, data, server = config.bindo) {
    let url = server + '/' + path;

    let status;

    let result = fetch(url, {
        method: 'PUT',
        headers: getHeader(),
        body: JSON.stringify(data),
      })
      .then((response) => {
        status = response.status;
        return response.json();
      })
      .then((json) => {
        if (status < 399) {
          return json;
        }
         else if (status == 401) {
          authDataHelper.clear();
          routeHelper.goLogin();

        } else {
          throw json;
        }
      });

    return result;
  }

  delete(path, query, server = config.bindo) {
    let url = server + '/' + path;

    if (query) {
      url = url + '?' + qs.stringify(query, { arrayFormat: 'brackets' });
    }

    let status;

    let result = fetch(url, {
        method: 'DELETE',
        headers: getHeader(),
      })
      .then((response) => {
        status = response.status;
        return response.json();
      })
      .then((json) => {
        if (status < 399) {
          return json;
        }
         else if (status == 401) {
          authDataHelper.clear();
          routeHelper.goLogin();

        } else {
          throw json;
        }
      });

    return result;
  }
}

export default ApiService;
