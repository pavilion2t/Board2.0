export default angular
  .module('message', [])
  .directive('message', function (messageFactory) {
    'ngInject';
    return {
      restrict: 'EA',
      templateUrl: 'app/shared/directive/message/message.html',
      replace: true,
      link: function (scope, element, attrs) {
        scope.messages = messageFactory.messageList;
        scope.cookClass = function (type) {
          return '-' + type;
        };

        scope.remove = function (message) {
          messageFactory.remove(message)
        };
      }
    };
  })
  .factory('messageFactory', function ($timeout) {
    'ngInject';
    var pauseTime = 5000;
    var messageList = [];

    var add = function (message, type) {
      if (!message) {
        return
      }
      type = type || 'error';

      var newMessage = {
        text: message,
        type: type
      }
      messageList.unshift(newMessage);

      if (type === 'error') {
        pauseTime = 15000;
      } else {
        pauseTime = 50000;
      }

      $timeout(function () {
        remove(newMessage)
      }, pauseTime);
    };

    var remove = function (message) {
      _.pull(messageList, message);
    };
    var clear = function () {
      messageList.length = 0
    }

    return {
      messageList: messageList,
      add: add,
      remove: remove,
      clear: clear,
    };
  })

