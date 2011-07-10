var Map = Backbone.View.extend({

  initialize: function() {
    this.setupGmaps();

    _.bindAll(this, 'render');
    this.collection.bind('change', this.render);
    this.collection.bind('reset', this.render);
  },

  el: '#map',

  map: null,

  markers: null,
  
  driverInfo: null,

  setupGmaps: function() {
    var options = {
      zoom: 8,
      center: new google.maps.LatLng(49, 8),
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true,
      backgroundColor: '#dce6f0'
    };

    this.map = new google.maps.Map(this.el, options);
  },

  clearMarkers: function() {
    _.each(this.markers, function(marker) { marker.setMap(null); });
    this.markers = [];
  },

  drawMarkers: function() {
    var view = this;
    this.collection.each(function(car) {
      var marker = new google.maps.Marker({
          position: new google.maps.LatLng(car.get('lat'), car.get('lng')),
          map: this.map,
          icon: car.get('icon')
      });
      
      google.maps.event.addListener(marker, "click", _.bind(this.markerClicked, this, car));

      this.markers.push(marker);
    }, this);
  },
  
  markerClicked: function(car) {
    if(this.driverInfo) {
      this.driverInfo.remove();
    }
    this.driverInfo = new DriverInfo({ model: car });
    $(document.body).append(this.driverInfo.render().el);    
  },

  render: function() {
    this.clearMarkers();
    this.drawMarkers();

    var bounds = new google.maps.LatLngBounds();
    this.collection.each(function(car){
      bounds.extend(new google.maps.LatLng(car.get('lat'), car.get('lng')));
    });

    this.map.fitBounds(bounds);
    this.map.setZoom(this.map.getZoom() - 1);
    return this;
  }
});