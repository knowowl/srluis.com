
/**
 * Module dependencies.
 */

var express = require('express')
  , stylus = require('stylus')
  , nib = require('nib')  
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , _ = require('underscore')._
  , request = require('request')
  , mongoose = require('mongoose')
  , db = mongoose.connect('mongodb://ricroid:7023341conde...@linus.mongohq.com:10028/app11422772')
  , Schema = mongoose.Schema
  , line_items = new Schema({sku:String, nombre: String, store: String, price: Number})
  , order = mongoose.model('Order',  new Schema({user_id:String, line_items: [line_items], state: String, subtotal: Number }), "order" );

  


var app = express();

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
}


app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');

  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(stylus.middleware(
  { src: __dirname + '/public'
  , compile: compile
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
app.get('/contact', routes.contact);
app.get('/users', user.list);

function loadSearch() {
    return function(req, res, next) {
        var url = 'http://6czgqqle:ceur22bw9iso66xu@juniper-2415144.us-east-1.bonsai.io/srluis/_search?q='+req.param('q', null);
        req.searchResults = [];
        request({ uri: url, json: true }, function(err, resp, data) {
            if (err) return res.send(500);
            req.searchResults = _(data.hits.hits).map(function(hit) {
                return hit._source;
            });
            next();
        });
    };
}

app.get('/search', loadSearch(), function(req, res, next) {
     res.json(req.searchResults);
});

app.get('/order', function(req, res) {
    res.contentType('application/json');      
    if(req.param('q', null)!=false){
      console.log("q="+req.param('q', null));
      var q = req.param('q', null).split('#');
      order.update({'user_id': 'test', 'state':'cart'},
    {'$push': {'line_items':{'sku': 'md-12', 'price': q[2], 'nombre': q[1], 'store':q[0]}},
     '$inc': {'subtotal': q[2]}});
    }
    order.findOne({'user_id': 'test', 'state':'cart'}, function(err, user) {
     
        res.json(user);
    
    });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
