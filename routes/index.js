var express = require('express');
var fs = require('fs');
var fx = require('mkdir-recursive');
var targz = require('tar.gz');
var multipart = require('connect-multiparty');
var path = require('path');
var async = require('async');
var multipartMiddleware = multipart();
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/reports', function(req, res, next) {
  var base = path.join(__dirname, '../public/report/');
  fs.readdir(base, function(err, stat){
    var items = {};
    async.eachSeries(stat, function findInst(item, callback){
      items[item] = [];
      fs.readdir(base + item, function(err, stats){
        items[item] = stats;
        console.log(stats);
        callback(null, items);
      });
    }, function done(err, result){
      res.render('report_index', items);
    });
  });
});

router.post('/iozone', multipartMiddleware, function(req, res, next) {
  targz().extract(req.files.report.path, path.join(__dirname, '../public/report/' + req.body.cloud + '/' + req.body.instance + '/iozone'), function(err){
    if(err) {
      console.log("error " + err);
    }else{
      console.log("done");
    }
    fs.unlink(req.files.report.path, function(err){});
  });
  res.send('OK');
});

router.post('/sysbench', multipartMiddleware, function(req, res, next) {
  fx.mkdir(path.join(__dirname, '../public/report/' + req.body.cloud + '/' + req.body.instance + '/sysbench/'), function(err){
    if(err) console.log(err);
    fs.rename(req.files.report.path, path.join(__dirname, '../public/report/' + req.body.cloud + '/' + req.body.instance + '/sysbench/report.txt' ), function(err){
      if(err) console.log(err);
    });
  });
  res.send('OK');
});

router.post('/speedtest', multipartMiddleware, function(req, res, next) {
  fx.mkdir(path.join(__dirname, '../public/report/' + req.body.cloud + '/' + req.body.instance + '/speedtest/'), function(err){
    if(err) console.log(err);
    fs.rename(req.files.report.path, path.join(__dirname, '../public/report/' + req.body.cloud + '/' + req.body.instance + '/speedtest/report.txt' ), function(err){
      if(err) console.log(err);
    });
  });
  res.send('OK');
});

module.exports = router;
