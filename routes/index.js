
/*
 * GET home page.
 */
var mongoose = require('mongoose'),
    db = mongoose.connect('mongodb://ricroid:7023341conde...@linus.mongohq.com:10028/app11422772'),    
 store = mongoose.model('store',  new Schema({ DisplayName: String, DisplayDescription: String }) );
 var Schema = mongoose.Schema;

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};
exports.contact = function(req, res){
  res.render('contact', { title: 'Express' });
};

exports.search = function(req, res) {
	res.contentType('application/json');
	store.find({},function(err, user) {
      if (user != null) {
        console.log('Found the User:' + user.username);
        //res.JSON(user);
      }
    });
};
