/* global describe, it */
(function () {
    'use strict';
    beforeEach(angular.mock.module('bindoDashboard'));
    beforeEach(inject(function($injector, $rootScope, $controller, _$httpBackend_, $location, $cookieStore) 
          { 
            this.injector = $injector; 
            this.scope = $rootScope.$new();
            this.controller = $controller;
            this.http = _$httpBackend_;
            this.location = $location;
            this.cookies = $cookieStore;
            this.sandbox = sinon.sandbox.create()
            
            // Commonly called throughout the controllers
            this.storeId = 123;
            // this.commonService = this.injector.get('commonService');
            // this.commonServiceStub = this.sandbox.stub(this.commonService, 'get_current_store_id').returns(this.storeId);
            this.AuthFactory = this.injector.get('AuthFactory');
          }
        )
    );
    afterEach(function(){
      this.sandbox.restore();
    });
})();
