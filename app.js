
/**
 * Module dependencies.
 */

var express = require('express')
  , stylus = require('stylus')
  , nib = require('nib')  
  , coffeeScript = require('coffee-script');
  , connectCoffeescript = require('connect-coffee-script');
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

  


var app = express();

function compileStylus(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
}
function compileCoffee(str, options, coffeePath) {
  options.bare = true;
  return coffeeScript.compile(str, options);
}

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(stylus.middleware(
  { src: __dirname + '/public'
  , compile: compileStylus
  }
  ))
  app.use(connectCoffeescript(
  { src: __dirname
  , dest: __dirname + '/public',
  compile: compileCoffee
  }
  ))

  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
