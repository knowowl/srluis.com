
/*
 * GET home page.
 */
var mongoose = require('mongoose'),
    db = mongoose.connect('mongodb://ricroid:7023341conde...@linus.mongohq.com:10028/app11422772'), 
    Schema = mongoose.Schema,   
    store = mongoose.model('Store',  new Schema({ DisplayName: String, DisplayDescription: String }), "store" ),
    _ = require('underscore')._,
    request = require('request');
 


exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};
exports.contact = function(req, res){
  res.render('contact', { title: 'Express' });
};

exports.elasticsearch = function() {
    return function(req, res, next) {
        var url = 'http://juniper-2415144.us-east-1.bonsai.io/stores/1/_search?q='+req.param('q', null);
        req.searchResults = [];
        request({ uri: url, json: true }, function(err, resp, data) {
            if (err) return res.send(500);
            req.searchResults = _(data.hits.hits).map(function(hit) {
                return hit._source;
            });
            next();
        });
    };
};

exports.search = function(req, res, next) {
	res.contentType('application/json');
  console.log(req.searchResults);
	);
};
