var port = process.env.PORT || 3000,
    express = require('express'),
    _ = require('underscore'),
    app = express.createServer(),
    redis = require('redis'),
    Pusher = require('pusher'),

    Car = require(__dirname+'/static/js/cars').Car,
    CarCollection = require(__dirname+'/static/js/cars').CarCollection;

// INITIALIZE REDIS
if (process.env.REDISTOGO_URL) {
  var rtg   = require("url").parse(process.env.REDISTOGO_URL);
  redis = redis.createClient(rtg.port, rtg.hostname);
  redis.auth(rtg.auth.split(":")[1]);
} else {
  redis = redis.createClient();
}

// CONSTANTS
var ALLOWED_EMAILS = process.env.FLINC_MINI_MAP_EMAILS.split('|');
var NUM_CARS = 2;

// CARS
var cars = new CarCollection();

redis.get("flinc:mini:map:cars", function (err, reply) {
  cars.reset(JSON.parse(reply));

  for(var i = cars.size() + 1; i <= NUM_CARS; i++) {
    cars.add( new Car({
      name:   'nobody ' +  i,
      id:     i,
      lat:    48 + i,
      lng:    8,
      icon:   'img/mini.png'
    }));
  }
});

// PUSHER
pusher = new Pusher({
  appId:  process.env.PUSHER_APP_ID,
  appKey: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET
});

// EXPRESS
app.configure(function(){
  app.use(express.bodyParser());
  app.set('view engine', 'jade');
  app.set('views', __dirname + '/views');
  app.use(express.static(__dirname + '/static'));
});

app.get('/', function(req, res){
  res.render('index', { layout: false, locals: { cars: JSON.stringify(cars), pusherKey: pusher.options.appKey } });
});

// support for facebook canvas post...
app.post('/', function(req, res){
  res.render('index', { layout: false, locals: { cars: JSON.stringify(cars), pusherKey: pusher.options.appKey } });
});

app.get('/driver', function(req, res){
  res.render('driver', { layout: false, locals: { cars: JSON.stringify(cars), pusherKey: pusher.options.appKey } });
});

app.put('/cars/:id/via/:email', function(req, res){
  if(!_.include(ALLOWED_EMAILS, req.params.email)) {
    return res.send('', 401);
  }

  cars.get(req.params.id).set(req.body).email(req.params.email);
  redis.set("flinc:mini:map:cars", JSON.stringify(cars));
  pusher.channel('sync').trigger('cars:update', cars);
});

app.listen(port);

console.log('Express server listening on port %d, environment: %s', app.address().port, app.settings.env);