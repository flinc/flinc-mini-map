var DriverLogin = Backbone.Router.extend({

  routes: {
    "login/:email/:name": "login"
  },

  login: function(email, name) {
    mini.driver.form.find('input.email').val(decodeURIComponent(email));
    mini.driver.form.find('input.name').val(name);
  }

});