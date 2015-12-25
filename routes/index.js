var express = require('express');
var fs = require('fs');
var targz = require('tar.gz');
var multipart = require('connect-multiparty');
var path = require('path');
var multipartMiddleware = multipart();
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/iozone', multipartMiddleware, function(req, res, next) {
  console.log(req.body);
  console.log(req.files);
  console.log(__dirname);
  targz().extract(req.files.report.path, path.join(__dirname, '../public/' + req.body.cloud + '/' + req.body.instance + '/'), function(err){
    if(err) {
      console.log("error " + err);
    }else{
      console.log("done");
    }
    fs.unlink(req.files.report.path, function(err){});
  });
  res.send('OK');
});

module.exports = router;
