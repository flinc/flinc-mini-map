var Driver = Backbone.View.extend({

  initialize: function() {
    _.bindAll(this, 'render', 'error');
    this.form = $('#driver_setup');
    this.info = $('#info span');
  },

  events: {
    'click #ok':  'register',
    'click .car': 'setCar'
  },

  el: 'body',

  form: null,

  car: null,

  watchId: null,

  setCar: function(e) {
    e.preventDefault();
    var el = $(e.target);
    this.form.find('button.car').removeClass('active');
    el.addClass('active');
  },

  register: function(e) {
    e.preventDefault();
    var carId = this.form.find('button.car.active').data('car') * 1,
        name  = this.form.find('input.name').val(),
        email = this.form.find('input.email').val();

    this.car = mini.cars.get(carId);

    this.car.set({ name: name });
    this.car.email(email);

    mini.router.navigate([ 'login', encodeURIComponent(email), name ].join('/'), true);

    this.watchId = navigator.geolocation.watchPosition(_.bind(this.position, this));

    this.form.remove();
  },

  position: function(position) {
    var pos = position.coords;

    this.car.save({
      lat: pos.latitude,
      lng: pos.longitude
    }, {
      error: this.error
    });

    this.updateInfo();
  },

  updateInfo: function() {
    var date = new Date(),
        dateStr = [
          date.getHours(),
          date.getMinutes(),
          date.getSeconds()
        ].join(':');

    this.info.text('Last Update: ' + dateStr);
  },

  error: function(model, response) {
    if(response.status == 503) {
      this.info.text('Timeout. Will try again later');
      return;
    }

    this.info.addClass('error').text('Something went wrong. Call Christian. :P');
    navigator.geolocation.clearWatch(this.watchId);
  }
});

$(window).load(function(){
  mini.driver = new Driver();
  mini.router = new DriverLogin();
  Backbone.history.start();
});