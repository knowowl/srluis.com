
/*
 * GET home page.
 */
var mongoose = require('mongoose'),
    db = mongoose.connect('mongodb://ricroid:7023341conde...@linus.mongohq.com:10028/app11422772'),
    


exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};
exports.contact = function(req, res){
  res.render('contact', { title: 'Express' });
};

exports.search = function(req, res) {
	 res.contentType('application/json');
	db.store.find(function(err, user) {
      if (user != null) {
        console.log('Found the User:' + user.username);
        res.JSON(user);
      }
    });
};
