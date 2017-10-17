export function ImportFactory($q, $rootScope, $http, $filter, $locale, DashboardFactory) {
  'ngInject';
  var importCSV = function(service, datakey, file, callback, progress){
    progress = progress || function () {}
    var data = new FormData();
    data.append(datakey, file);
    $.ajax({
      xhr: function() {
        var xhr = new window.XMLHttpRequest();
        xhr.upload.addEventListener("progress", function(evt) {
          if (evt.lengthComputable) {
            var percentComplete = evt.loaded / evt.total;
            progress(percentComplete);
          }
        }, false);

        return xhr;
      },
      url: $rootScope.api + '/api/v2/stores/' + DashboardFactory.getStoreId() + '/'+service+'/',
      data: data,
      cache: false,
      contentType: false,
      processData: false,
      headers: {
        'X-APPLICATION': $http.defaults.headers.common['X-APPLICATION'],
        'X-USER-ACCESS-TOKEN': $http.defaults.headers.common['X-USER-ACCESS-TOKEN'],
        'Authorization': $http.defaults.headers.common['Authorization'],
        'X-USER-DEVICE-TYPE': $http.defaults.headers.common['X-USER-DEVICE-TYPE']
      },
      type: 'POST',
      success: function (data) {
        callback(data);
      },
      error: function( jqXHR, textStatus, errorThrown ){
        callback({fail:true, errorThrown:errorThrown, textStatus: textStatus})
      }
    });
  };

  var validateCSV = function(service, importId, callback){
    $.ajax({
      url: $rootScope.api + '/api/v2/stores/' + DashboardFactory.getStoreId() + '/'+service+'/'+importId+'?timestamp='+Date.now(),
      headers: {
        'X-APPLICATION': $http.defaults.headers.common['X-APPLICATION'],
        'X-USER-ACCESS-TOKEN': $http.defaults.headers.common['X-USER-ACCESS-TOKEN'],
        'Authorization': $http.defaults.headers.common['Authorization'],
        'X-USER-DEVICE-TYPE': $http.defaults.headers.common['X-USER-DEVICE-TYPE']
      },
      type: 'GET',
      success: function (data) {
        callback(data);
      },
      error: function( jqXHR, textStatus, errorThrown ){
        callback({fail:true, errorThrown:errorThrown, textStatus: textStatus})
      }
    });
  };
  var postCSV = function(service, importId, callback){
    $.ajax({
      url: $rootScope.api + '/api/v2/stores/' + DashboardFactory.getStoreId() + '/'+service+'/'+importId +'/import',
      headers: {
        'X-APPLICATION': $http.defaults.headers.common['X-APPLICATION'],
        'X-USER-ACCESS-TOKEN': $http.defaults.headers.common['X-USER-ACCESS-TOKEN'],
        'Authorization': $http.defaults.headers.common['Authorization'],
        'X-USER-DEVICE-TYPE': $http.defaults.headers.common['X-USER-DEVICE-TYPE']
      },
      type: 'POST',
      success: function (data) {
        callback(data);
      },
      error: function( jqXHR, textStatus, errorThrown ){
        callback({fail:true, errorThrown:errorThrown, textStatus: textStatus})
      }
    });
  };
  var getImageUrl = function(service, importId, callback){
    $.ajax({
      url: $rootScope.api + '/api/v2/stores/' + DashboardFactory.getStoreId() + '/'+service+'/'+importId+'/image_import_url'+'?timestamp='+Date.now(),
      headers: {
        'X-APPLICATION': $http.defaults.headers.common['X-APPLICATION'],
        'X-USER-ACCESS-TOKEN': $http.defaults.headers.common['X-USER-ACCESS-TOKEN'],
        'Authorization': $http.defaults.headers.common['Authorization'],
        'X-USER-DEVICE-TYPE': $http.defaults.headers.common['X-USER-DEVICE-TYPE']
      },
      type: 'GET',
      success: function (data) {
        callback(data);
      },
      error: function( jqXHR, textStatus, errorThrown ){
        callback({fail:true, errorThrown:errorThrown, textStatus: textStatus})
      }
    });
  };

  var verifyImage = function(service, importId, callback){
    $.ajax({
      url: $rootScope.api + '/api/v2/stores/' + DashboardFactory.getStoreId() + '/'+service+'/'+importId+'/verify_uploaded_images'+'?timestamp='+Date.now(),
      headers: {
        'X-APPLICATION': $http.defaults.headers.common['X-APPLICATION'],
        'X-USER-ACCESS-TOKEN': $http.defaults.headers.common['X-USER-ACCESS-TOKEN'],
        'Authorization': $http.defaults.headers.common['Authorization'],
        'X-USER-DEVICE-TYPE': $http.defaults.headers.common['X-USER-DEVICE-TYPE']
      },
      type: 'PUT',
      success: function (data) {
        callback(data);
      },
      error: function( jqXHR, textStatus, errorThrown ){
        callback({fail:true, errorThrown:errorThrown, textStatus: textStatus})
      }
    });
  };
  var putImage = function(url, file, callback, postImageProgressFunction) {
    var reader = new FileReader();
    reader.onload = function() {
      var arrBuff = reader.result;
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.open("PUT", url);

      function updateProgress (oEvent) {
        var percentComplete = 0;
        if (xmlhttp.lengthComputable) {
          percentComplete = xmlhttp.loaded / xmlhttp.total;
        }
        postImageProgressFunction(percentComplete);
      }

      function transferComplete(evt) {
        callback({success:true,status:'pending_verify'});
      }

      function transferFailed(evt) {
        callback({fail:true})
      }

      function transferCanceled(evt) {
        callback({fail:true})
      }

      xmlhttp.addEventListener("progress", updateProgress);
      xmlhttp.addEventListener("load", transferComplete);
      xmlhttp.addEventListener("error", transferFailed);
      xmlhttp.addEventListener("abort", transferCanceled);


      xmlhttp.send(arrBuff);
    };
    reader.readAsArrayBuffer(file);
  };
  return {
    importCSV: importCSV,
    validateCSV: validateCSV,
    postCSV: postCSV,
    putImage:putImage,
    getImageUrl: getImageUrl,
    verifyImage: verifyImage
  };
}
