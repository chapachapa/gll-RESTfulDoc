var express = require('express');
var mongoHelper = require('../modules/mongoHelper');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// search using query
router.get('/restdoc/search', function(req, res){
  mongoHelper.requestSearch(req.query.q);
  var waitingForSearch = setInterval(function(){
    var data = mongoHelper.fetchSearch(req.query.q);
    console.log('attempting to fetch: ',data);
    if(typeof data.data !== 'undefined'){
      clearInterval(waitingForSearch);
      res.status(200).json({data: data.data});
    }
  }, 1000);
});

// update user data
router.put('/restdoc/update', function(req, res){
  console.log('received ',req.body);
  mongoHelper.setData(req.body.data);
  res.status(200).json({message: 'success!'});
});

module.exports = router;
