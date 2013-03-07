
/**
 * Module dependencies.
 */

var express = require('express')
  , cloudinary = require('cloudinary')
  , fs = require('fs')
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
  , line_items = new Schema({sku:String, nombre: String, store: String,rAddon:[rAddon],aAddon:[aAddon],cAddon:[cAddon], price: Number})
  , rAddon = new Schema({label:String, price: Number})
  , aAddon = new Schema({label:String, price: Number})
  , cAddon = new Schema({label:String, price: Number})
  , order = mongoose.model('Order',  new Schema({user_id:String, line_items: [line_items], state: String, subtotal: Number }), "order" )
  , productSchema= new Schema({sku:String, store: String, title: String, peek: String, tags: String,rAddon:[rAddon],aAddon:[aAddon],cAddon:[cAddon], type: String, img: String, price: Number})
  , productModel = mongoose.model('product', productSchema, 'product');

  


var app = express();
function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .set('compress', true)
    .use(nib())
    .import('nib');
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
  cloudinary.config({ cloud_name: 'hmoum9wou', api_key: '458182723443262', api_secret: 'tQJty_fcaJibbmk-QpDXCuEXt6A' });
  
});
app.locals.api_key = cloudinary.config().api_key;
app.locals.cloud_name = cloudinary.config().cloud_name;
app.get('/', loadSearch(), function(req, res, next) {
   var p=req.searchResults[0];
    if(req.param('q', null)==null){
      res.render('index', { productPage: false });
    }else{
      var typeGood;
      switch(p.Type){
        case 'comida':typeGood='food';break;
        case 'bebida':typeGood='drink';break;
        default:typeGood='product';break;
      }
      res.render('index', { 
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
app.get('/store', routes.store);
app.get('/store/add_product', routes.store_add_product);
app.get('/users', user.list);




function loadSearch() {
    return function(req, res, next) {
      req.searchResults = [];
      if(req.param('q', null) != null){
             
        if(req.param('o', null)!=null){
          var url = 'http://6czgqqle:ceur22bw9iso66xu@juniper-2415144.us-east-1.bonsai.io/srluis/_search?q=_id:'+req.param('q', null);
          console.log(url);
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
 response.redirect('/store?s=true');
  
});
app.post('/uploadImage', function(req, res){
  var imageStream = fs.createReadStream(req.files.image.path, { encoding: 'binary' })
    , cloudStream = cloudinary.uploader.upload_stream(function() { res.redirect('/store'); });

  imageStream.on('data', cloudStream.write).on('end', cloudStream.end);
});


app.get('/order', function(req, res) {
    res.contentType('application/json');       
    if(req.param('q', null)!="q" && req.param('q', null)!=null){
     
      var q = req.param('q', null).split('#');
     
      //Aqui quede.... tengo que pasar los parametros sku y store del ElasticSearch para buscarlos en el mongohq
     // productModel.findOne({'sku':q[1], 'store_id':q[0]}, 
       productModel.findOne({'sku':q[1]}, 
      function(err1, p) {
        
        order.update({'user_id': 'test', 'state':'cart'},
                     {'$push': {'line_items':{'sku': p.sku, 'price': parseFloat(p.price), 'nombre': p.title, 'store': p.store, 'rAddon':p.rAddon }},
                      '$inc': {'subtotal': parseFloat(p.price) }},
        function(err2){
          order.findOne({'user_id': 'test', 'state':'cart'}, 
          function(err, user) {     
            res.json(user);
          });     
        });
      });
    }else{
      order.findOne({'user_id': 'test', 'state':'cart'}, function(err, user) {
        res.json(user);    
      });
    }
  
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
