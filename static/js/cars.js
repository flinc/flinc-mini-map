if(typeof require == "function") {
  var Backbone = require(__dirname+'/backbone'),
      gravatar = require('gravatar');
}

(function (exports) {

  var Car = Backbone.Model.extend({
    initialize: function() {
      this.gravatarUrl();
    },

    _email: 'user@example.com',

    email: function(newEmail) {
      if(!newEmail) return this._email;

      this._email = newEmail;
      this.gravatarUrl();
      return this;
    },

    gravatarUrl: function() {
      // can't set gravatar on the client
      if(!gravatar) return false;

      return this.set({
        gravatar: gravatar.url(this.email(), { s: '60' }, true)
      });
    },

    url: function() {
      return '/cars/' + this.get('id') + '/via/' + encodeURIComponent(this.email());
    }
  });

  var CarCollection = Backbone.Collection.extend({
    model: Car
  });

  exports.Car = Car;
  exports.CarCollection = CarCollection;
})('object' === typeof module ? module.exports : window);