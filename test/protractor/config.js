var fs = require('fs-extra')

exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',

    // Capabilities to be passed to the webdriver instance.
    capabilities: {
        'browserName': 'chrome',
        'chromeOptions': {
           // Get rid of --ignore-certificate yellow warning
           args: ['--no-sandbox', '--test-type=browser'],
           // Set download path and avoid prompting for download even though
           // this is already the default on Chrome but for completeness
           prefs: {
               'download': {
                   'prompt_for_download': false,
                   'default_directory': __dirname + '/downloads/',
               },
           },
       },
    },
    baseUrl: 'http://localhost:8001/',

    // Spec patterns are relative to the current working directly when
    // protractor is called.
    specs: [ '../../app/**/spec'],

    allScriptsTimeout: 20000,

    onPrepare: function() {
        // setup report
        var SpecReporter = require('jasmine-spec-reporter');
        jasmine.getEnv().addReporter(new SpecReporter({displayStacktrace: 'none'}));


        // empty download folder
        fs.emptyDir( __dirname + '/downloads/', function (err) {
          if (!err) console.log('empty download folder done')
        })

        // login
        browser.driver.manage().window().maximize();
        browser.get('/');

        element(by.model('user.username')).sendKeys("alan.tang@bindo.com");
        element(by.model('user.password')).sendKeys("123456");
        element(by.partialButtonText('Log In')).click();
        return browser.driver.wait(function() {
          return browser.driver.getCurrentUrl().then(function(url) {
            return /summary/.test(url);
          });
        }, 10000);

    },
    jasmineNodeOpts: {
       print: function() {}
    }
};
