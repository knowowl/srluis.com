var http = require('http')
,   stringify = require('querystring').stringify
,   request = require('request');


exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};
exports.contact = function(req, res){
  res.render('contact', { title: 'Express' });
};
exports.store = function(req, res){
  var s=req.param('s', null);
  res.render('store', { title: 'Express', success: s  });
};
exports.store_add_product = function(req, res){
  res.render('store_add_product', { title: 'Express' });
};
exports.indexDocument = function(document) {
 var data = JSON.stringify(document);
 var url='http://6czgqqle:ceur22bw9iso66xu@juniper-2415144.us-east-1.bonsai.io/srluis/product1';
 request({ uri: url, json: true, method: 'POST', body:data}, function(err, resp, data) {
          
        });
 
}


