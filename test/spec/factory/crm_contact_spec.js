(function () {
    'use strict';
    describe('CrmContactFactory', function () {
      beforeEach(function() {
        this.token = 'testAccess';
        this.cookies.put('access_token', this.token);
        this.contactFactory = this.injector.get('CrmContactFactory');
      });
      describe('create', function() {
        beforeEach(function() {
          this.data = {name:'joe blow'};
        });
        it('should have a create method to create the contact', function() {
          this.http.expectPOST(this.scope.api+'/api/v2/admin/crm_contacts', {'crm_contact':this.data}).respond(null);
          this.contactFactory.create(this.data);
          this.http.flush();
        });
        it('should return the promise of the $http', function() {
          this.http.expectPOST(this.scope.api+'/api/v2/admin/crm_contacts').respond(this.data);
          var promise = this.contactFactory.create(this.data);
          this.http.flush();
          promise.then(function(c) { expect(c).toBe(this.data); });
        });
      });
      describe('update', function() {
        beforeEach(function() {
          this.data = {id:123, name:'joe blow'};
        });
        it('should have an update method to update the contact', function() {
          this.http.expectPUT(this.scope.api+'/api/v2/admin/crm_contacts/123', {'crm_contact':this.data}).respond(null);
          this.contactFactory.update(this.data);
          this.http.flush();
        });
        it('should return the promise of the $http', function() {
          this.http.whenPUT(this.scope.api+'/api/v2/admin/crm_contacts/123').respond(this.data);
          var promise = this.contactFactory.update(this.data);
          this.http.flush();
          promise.then(function(c) { expect(c).toBe(this.data); });
        });
      });
    });
})();
