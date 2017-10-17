if (process.env.API_ENV === 'production') {
  module.exports = require('./config.prod');
}
else if (process.env.API_ENV === 'staging') {
  module.exports = require('./config.staging');
}
else if (process.env.NODE_ENV === 'test' || process.env.API_ENV === 'test') {
  module.exports = require('./config.test');
}
else {
  module.exports = require('./config.dev');
}
