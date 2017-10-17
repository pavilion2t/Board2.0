// More info on Webpack's Node API here: https://webpack.github.io/docs/node.js-api.html
// Allowing console calls below since this is a build file.
/*eslint-disable no-console */
import webpack from 'webpack';
import { argv as args } from 'yargs';
import 'colors';

process.env.NODE_ENV = process.env.NODE_ENV || 'production'; // this assures React is built in prod mode and that the Babel dev config doesn't apply.

const webpackConfig = process.env.NODE_ENV === 'staging' ? require('../../webpack.config.deploy2.staging') : require('../../webpack.config.deploy2.prod');

webpack(webpackConfig).run((err, stats) => {
  const inSilentMode = args.s; // set to true when -s is passed on the command

  if (!inSilentMode) {
    console.log('Generating minified bundle for production use via Webpack...'.bold.blue);
  }

  if (err) { // so a fatal error occurred. Stop here.
    if (typeof err.bold !== "undefined") {
      console.log(err.bold.red);
    } else {
      //when enabel --bail in config, formats of error will changed.
      console.log(err.message);
    }

    return 1;
  }

  const jsonStats = stats.toJson();

  if (jsonStats.hasErrors) {
    return jsonStats.errors.map(error => console.log(error.red));
  }

  if (jsonStats.hasWarnings && !inSilentMode) {
    console.log('Webpack generated the following warnings: '.bold.yellow);
    jsonStats.warnings.map(warning => console.log(warning.yellow));
  }

  if (!inSilentMode) {
    console.log(`Webpack stats: ${stats}`);
  }

  // if we got this far, the build succeeded.
  console.log('Your app has been compiled in production mode and written to /dist. It\'s ready to roll!'.green.bold);

  return 0;
});
