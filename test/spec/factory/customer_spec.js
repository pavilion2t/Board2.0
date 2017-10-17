(function () {
    'use strict';
    describe('CustomerFactory', function () {
      beforeEach(function() {
        this.token = 'testAccess';
        this.cookies.put('access_token', this.token);
        this.customerFactory = this.injector.get('CustomerFactory');
      });
      describe('update', function() {
        beforeEach(function() {
          this.data = {id:123, name:'joe blow'};
        });
        describe('as an admin', function() {
          beforeEach(function() { this.sandbox.stub(this.AuthFactory,'isAdmin').returns(true); } );
          it('should have an update method to update the customer', function() {
            this.http.expectPUT(this.scope.api+'/api/v2/admin/customers/123', {'customer':this.data}).respond(null);
            this.customerFactory.update(this.data);
            this.http.flush();
          });
          it('should return the promise of the $http', function() {
            this.http.whenPUT(this.scope.api+'/api/v2/admin/customers/123').respond(this.data);
            var promise = this.customerFactory.update(this.data);
            this.customerFactory.update(this.data);
            this.http.flush();
            promise.then(function(c) { expect(c).toBe(this.data); });
          });
        });
        describe('as a user', function() {
          beforeEach(function() { this.sandbox.stub(this.AuthFactory,'isAdmin').returns(false); } );
          it('should have an update method to update the customer', function() {
            this.http.expectPUT(this.scope.api+'/api/v2/stores/123/customers/123', {'customer':this.data}).respond(null);
            this.customerFactory.update(this.data);
            this.http.flush();
          });
          it('should return the promise of the $http', function() {
            this.http.whenPUT(this.scope.api+'/api/v2/stores/123/customers/123').respond(this.data);
            var promise = this.customerFactory.update(this.data);
            this.customerFactory.update(this.data);
            this.http.flush();
            promise.then(function(c) { expect(c).toBe(this.data); });
          });
        });
      });
      describe('destroy', function() {
        beforeEach(function() {
          this.data = {id:123, name:'joe blow'};
        });
        describe('as an admin', function() {
          beforeEach(function() { this.sandbox.stub(this.AuthFactory,'isAdmin').returns(true); } );
          it('should have an update method to update the customer', function() {
            this.http.expectDELETE(this.scope.api+'/api/v2/admin/customers/123').respond(null);
            this.customerFactory.destroy(this.data);
            this.http.flush();
          });
          it('should return the promise of the $http', function() {
            this.http.whenDELETE(this.scope.api+'/api/v2/admin/customers/123').respond(this.data);
            var promise = this.customerFactory.destroy(this.data);
            this.customerFactory.destroy(this.data);
            this.http.flush();
            promise.then(function(c) { expect(c).toBe(this.data); });
          });
        });
        describe('as a user', function() {
          beforeEach(function() { this.sandbox.stub(this.AuthFactory,'isAdmin').returns(false); } );
          it('should have an update method to update the customer', function() {
            this.http.expectDELETE(this.scope.api+'/api/v2/stores/123/customers/123').respond(null);
            this.customerFactory.destroy(this.data);
            this.http.flush();
          });
          it('should return the promise of the $http', function() {
            this.http.whenDELETE(this.scope.api+'/api/v2/stores/123/customers/123').respond(this.data);
            var promise = this.customerFactory.destroy(this.data);
            this.customerFactory.destroy(this.data);
            this.http.flush();
            promise.then(function(c) { expect(c).toBe(this.data); });
          });
        });
      });
    });
})();
