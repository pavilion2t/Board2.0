switch (process.env.NODE_ENV) {
  case 'production':
  case 'staging':
    module.exports = require('./configureStore.prod');
    break;

  case 'test':
    module.exports = require('./configureStore.test');
    break;

  default:
    module.exports = require('./configureStore.dev');
    break;
}
