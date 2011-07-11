/*
 *  IE(6) doesn't like the redeclaration of a local var and
 *  will throw an error on this statement, when Backbone 
 *  was previously defined, even if how won't enter the block
 *  of the if statement.
 *
 *  if(typeof require !== 'undefined') {
 *    var Backbone = require(__dirname+'/backbone');
 *  }
 *
 *  So I have to use the global namespace to make node AND IE happy.
 *  Also I feel strange about writing all this, just because I declared
 *  one single global variable.
 */
if(typeof Backbone === 'undefined' && typeof require !== 'undefined') {
  Backbone = require(__dirname+'/backbone');
  var gravatar = require('gravatar');
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
      if(typeof gravatar === 'undefined') return false;

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