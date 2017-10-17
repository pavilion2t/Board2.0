// run unit test cases
import UnitTestSpec from './unit/index';
UnitTestSpec();

// require all source code for testing in `project/client/helpers/**/*.js`
const helpersContext = require.context('../client/helpers', true, /\.jsx?$/);
helpersContext.keys().forEach(helpersContext);

// require all source code for testing in `project/client/services/**/*.js`
const servicesContext = require.context('../client/services', true, /\.jsx?$/);
servicesContext.keys().forEach(servicesContext);

// require all source code for testing in `project/client/actions/**/*.js`
const actionsContext = require.context('../client/actions', true, /\.jsx?$/);
actionsContext.keys().forEach(actionsContext);

// require all source code for testing in `project/client/store/**/*.js`
const storeContext = require.context('../client/store', true, /\.jsx?$/);
storeContext.keys().forEach(storeContext);

// require all source code for testing in `project/client/components/**/*.js`
const componentsContext = require.context('../client/components', true, /\.jsx?$/);
componentsContext.keys().forEach(componentsContext);

// require all source code for testing in `project/client/pages/**/*.js`
const pagesContext = require.context('../client/pages', true, /\.jsx?$/);
pagesContext.keys().forEach(pagesContext);
