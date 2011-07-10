$(window).load(function() {
  mini.view = new Map({ collection: mini.cars }).render();

  var pusher  = new Pusher(mini.pusherKey),
      channel = pusher.subscribe('sync');

  channel.bind('cars:update', function(data) {
    mini.cars.reset(data);
  });
});