
/*
 * GET home page.
 */



exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};
exports.contact = function(req, res){
  res.render('contact', { title: 'Express' });
};
exports.store = function(req, res){
  res.render('store', { title: 'Express' });
};




