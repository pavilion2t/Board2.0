// This file configures a web server for testing the production build
// on your local machine.

import browserSync from 'browser-sync';
import historyMiddleware from 'connect-history-api-fallback';

// Run Browsersync
browserSync({
  port: 3000,
  ui: {
    port: 3001
  },
  server: {
    baseDir: 'dist',

    middleware: [
      // Enable support html5 mode
      historyMiddleware()
    ]
  },

  files: [
    'client/*.html'
  ],

  // Open the site in Chrome
  browser: "google chrome"
});
