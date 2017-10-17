describe('Bindo First End to End Test', function(){

    beforeEach(function() {

    });

    it('should load the webpage', function() {

        browser.ignoreSynchronization = true;

        var width = 1024;
        var height = 768;
        browser.driver.manage().window().setSize(width, height);

        browser.manage().timeouts().implicitlyWait(5000);
        browser.manage().deleteAllCookies();

        browser.get('/');

        // We use ng-model to find the username and password elements

        // Expect we have username and password text fields to be present, and the log in button to be present
        expect(element(by.model('user.username')).isPresent()).toBe(true);
        expect(element(by.model('user.password')).isPresent()).toBe(true);
        expect(element(by.partialButtonText('Log In')).isPresent()).toBe(true);

    });
});

