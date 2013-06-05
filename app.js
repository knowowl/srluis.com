
/**
 * Module dependencies.
 */

var express = require('express')
  , cloudinary = require('cloudinary')
  , http = require('http')
  , app = express()
  , server = http.createServer(app)
  
  , flash = require('connect-flash')
  , util = require('util')
  , fs = require('fs')
  , stylus = require('stylus')
  , nib = require('nib')
  , routes = require('./routes')
  , user = require('./routes/user')  
  , path = require('path')
  , _ = require('underscore')._
  , request = require('request')
  , mongoose = require('mongoose')
  , db = mongoose.connect('mongodb://ricroid:7023341conde...@linus.mongohq.com:10028/app11422772')
  , Schema = mongoose.Schema
  , line_items = new Schema({sku:String,user_id:String, nombre: String, store: String,rAddon:[rAddon],aAddon:[aAddon],cAddon:[cAddon], price: Number})
  , rAddon = new Schema({label:String, price: Number})
  , aAddon = new Schema({label:String, price: Number})
  , cAddon = new Schema({label:String, price: Number})
  , order = mongoose.model('Order',  new Schema({user_id:String, line_items: [line_items], state: String, subtotal: Number }), "order" )
  , productSchema= new Schema({sku:String, store: String, title: String, peek: String, tags: String,rAddon:[rAddon],aAddon:[aAddon],cAddon:[cAddon], type: String, img: String, price: Number})
  , productModel = mongoose.model('product', productSchema, 'product')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , site_url='http://localhost:3000/';

var users = [
    { id: '1', username: 'ricroid', password: '2281990', email: 'ceo@know-owl.com', store: true }
  , { id: '2', username: 'guest', password: 'guest', email: 'baul.conde@gmail.com', store:false }
];

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .set('compress', true)
    .use(nib())
    .import('nib');
}
function findById(id, fn) {
  var idx = id - 1;
  if (users[idx]) {
    fn(null, users[idx]);
  } else {
    fn(new Error('User ' + id + ' does not exist'));
  }
}

function findByUsername(username, fn) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.email === username) {
      return fn(null, user);
    }
  }
  return fn(null, null);
}


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  findById(id, function (err, user) {
    done(err, user);
  });
});
passport.use(new LocalStrategy(
  function(username, password, done) {

    process.nextTick(function () {
      
      findByUsername(username, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
        if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
        return done(null, user);
      })
    });
  }
));

app.configure(function(){

 
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');

  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(stylus.middleware(
  { src: __dirname + '/public'
  , compile: compile
  }
  ))


  app.use(express.bodyParser());
  app.use(express.methodOverride());
   app.use(express.session({ secret: 'keyboard cat' }));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
  cloudinary.config({ cloud_name: 'hmoum9wou', api_key: '458182723443262', api_secret: 'tQJty_fcaJibbmk-QpDXCuEXt6A' });
  
});
app.locals.api_key = cloudinary.config().api_key;
app.locals.cloud_name = cloudinary.config().cloud_name;
app.get('/',ensureAuthenticated, loadSearch(), function(req, res, next) {
  
   var p=req.searchResults[0];
    if(req.param('q', null)==null){
      res.render('index', { productPage: false, user:req.user });
    }else{
      var typeGood;
      switch(p.Type){
        case 'comida':typeGood='food';break;
        case 'bebida':typeGood='drink';break;
        default:typeGood='product';break;
      }
      res.render('index', { 
        user:req.user,
        title: p.Title,
        type: typeGood,
        peek:  p.Peek,
        store: p.Store,
        store_id:  p.Store_id,
        sku: p.SKU,
        img:  cloudinary.url(p.Img, {width: 240, crop: "fill"}),
        id: p._id,
        price: p.Price,
        productPage: true
      });
    }
});
app.get('/contact', routes.contact);
app.get('/store/product/add', routes.store);
app.get('/users', user.list);
app.get('/login', function(req, res){

  res.render('login', { user: req.user, message: req.flash('error') });
});

app.post('/login', 
  passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login', failureFlash: true }),
  function(req, res) {
    res.redirect('/');
  });

function loadSearch() {
    return function(req, res, next) {
      req.searchResults = [];
      if(req.param('q', null) != null){             
        if(req.param('o', null)!=null){
          var url = 'http://6czgqqle:ceur22bw9iso66xu@juniper-2415144.us-east-1.bonsai.io/srluis/_search?q=_id:'+req.param('q', null);
          
        }else{
          var q=req.param('q', null).toUpperCase().replace(/([^0-9A-Z])/g,"");
          var url = 'http://6czgqqle:ceur22bw9iso66xu@juniper-2415144.us-east-1.bonsai.io/srluis/_search?q='+q;
        }
        request({ uri: url, json: true }, function(err, resp, data) {
            if (err) return res.send(500);
            req.searchResults = _(data.hits.hits).map(function(hit) {
                var r=hit._source;
                r._id=hit._id;
                return r;
            });
            next();
        });
      }else{
         next();
      }
    };
}

app.get('/search', loadSearch(), function(req, res, next) {
     res.json(req.searchResults);
});

app.post('/addProduct', function(request, response){
 var r=request.body.product;
 var product = new productModel();
 
  var imageStream = fs.createReadStream(request.files.image.path, { encoding: 'binary' })
  ,cloudStream = cloudinary.uploader.upload_stream(function(img) {
      product.sku = r.sku;
      product.title = r.title;
      product.peek = r.peek;
      product.tags = r.tags;
      product.type = r.type;
      product.store = 'srluis';
      product.store_id = 'srluis';
      
     
        product.rAddon=(r.rAddon=='')?'':JSON.parse(r.rAddon);      
      
        product.aAddon=(r.aAddon=='')?'':JSON.parse(r.aAddon);
      
     
        product.cAddon=(r.cAddon=='')?'':JSON.parse(r.cAddon);
      
      product.img = img.public_id+'.'+img.format;
      product.price = r.price;
      product.save();
      completeMsg = {
        SKU: r.sku,
        Store:'srluis',
        Store_id:'srluis',
        Title:r.title,
        Peek:r.peek,
        Tags:r.tags,
        Type:r.dep,
        Img:img.public_id+'.'+img.format,
        Price:r.price,
        Zip: '2006',
        Zone: '1'

      };
      routes.indexDocument(completeMsg);     
    });
  imageStream.on('data', cloudStream.write).on('end', cloudStream.end);
 response.redirect('/store/product/add?s=true');  
});
app.post('/uploadImage', function(req, res){
  var imageStream = fs.createReadStream(req.files.image.path, { encoding: 'binary' })
    , cloudStream = cloudinary.uploader.upload_stream(function() { res.redirect('/store/product/add'); });
  imageStream.on('data', cloudStream.write).on('end', cloudStream.end);
});
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/store/product/list', ensureAuthenticated, function(req, res){
  productModel.find({'user_id': req.user.id}, 
          function(err, p) {              
            res.render('list', {
              url:site_url,
              products: p,
              btn1:'',
              btn2:'',
              btn3:'',
              btn4:'',
              btn5:'active',
              btn6:''});
          });
});
app.get('/store/cart', ensureAuthenticated, function(req, res){
  
  order.find({'state':'cart','line_items.user_id': req.user.id}, 
          function(err, p) {    
                    
            res.render('cart', {
              user:req.user,
              url:site_url,
              cart: p,
              btn1:'',
              btn2:'active',
              btn3:'',
              btn4:'',
              btn5:'',
              btn6:''
            });
          }); 
});
app.get('/findOne', function(req, res){  
  productModel.findOne({'store_id':req.param('store', null),'sku': req.param('sku', null)}, 
          function(err, p) {
            res.json(p);
          }); 
});
app.get('/store/order', ensureAuthenticated, function(req, res){
  
  order.find({'state':'order','line_items.user_id': req.user.id}, 
          function(err, p) {    
                    
            res.render('order', {
              user:req.user,
              url:site_url,
              cart: p,
              ct: p,
              btn1:'active',
              btn2:'',
              btn3:'',
              btn4:'',
              btn5:'',
              btn6:''
            });
          }); 
});
app.get('/order', function(req, res) {
    var nOrder=new order();
    console.log(nOrder);
    res.contentType('application/json');       
    if(req.param('q', null)!="q" && req.param('q', null)!=null){
     
      var q = req.param('q', null).split('#');
     
      //Aqui quede.... tengo que pasar los parametros sku y store del ElasticSearch para buscarlos en el mongohq
     // productModel.findOne({'sku':q[1], 'store_id':q[0]}, 
      order.findOne({'user_id': 'test', 'state':'cart'}, 
        function(err0, user0) {  
          if(user0){   
           productModel.findOne({'sku':q[1]}, 
          function(err1, p) { 
              order.update({'user_id': 'test', 'state':'cart'},
                         {'$push': {'line_items':{'sku': p.sku, 'price': parseFloat(p.price), 'nombre': p.title, 'store': p.store }},
                          '$inc': {'subtotal': parseFloat(p.price) }},
              function(err2){
                
              order.findOne({'user_id': 'test', 'state':'cart'}, 
                function(err, user) {     
                  res.json(user);
               });  
              
             });
            
          });
        }else{
          productModel.findOne({'sku':q[1]}, 
          function(err1, p) {               
            
            nOrder.state='cart';
            nOrder.user_id='test';
            nOrder.subtotal=parseFloat(p.price);            
            nOrder.line_items.push({'sku': p.sku, 'price': parseFloat(p.price), 'nombre': p.title, 'store': p.store});
            
            nOrder.save(function(){
               order.findOne({'user_id': 'test', 'state':'cart'}, function(err, user) {
               res.json(user);    
                });
            });

           
          });
      
        }
       });
    }else{
      order.findOne({'user_id': 'test', 'state':'cart'}, function(err, user) {
        
        res.json(user);    
      
      });
    }
  
});

var server=http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

var io = require('socket.io').listen(server, {log: false, origins: '*:*'});
var usuariosConectados = {};
io.sockets.on('connection', function (socket) {   
    socket.on('enviarNombre', function (datos) {
      if(!usuariosConectados[datos[0]]){
        socket.nickname = datos[0];
        usuariosConectados[datos[0]] = socket.nickname;
      }
      data = [datos, usuariosConectados];
      io.sockets.emit('newUser', data);
    });

    socket.on('enviarMensaje', function (mensaje) {         
      //var data = [socket.nickname, mensaje];
      io.sockets.emit('newMessage', mensaje);
 
  });
   
});

