
/*
 * GET home page.
 */
var mongoose = require('mongoose'),
    db = mongoose.connect('mongodb://ricroid:7023341conde...@linus.mongohq.com:10028/app11422772'), 
    Schema = mongoose.Schema,   
    store = mongoose.model('Store',  new Schema({ DisplayName: String, DisplayDescription: String }), "store" );
 


exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};
exports.contact = function(req, res){
  res.render('contact', { title: 'Express' });
};




