var async = require('async');
var fs = require('fs');
var fse = require('fs-extra');
var path = require('path');
var stylus = require('stylus');
var xtend = require('xtend');

function compileStylusFile(stylusFilePath, stylusOptions, cb) {
  fs.readFile(stylusFilePath, 'utf-8', function (err, stylusStr) {
    if (err) {
      cb(err);
    } else {
      var options = xtend(stylusOptions, {
        filename: stylusFilePath
      });
      stylus.render(stylusStr, options, cb);
    }
  });
}

function compileStylusDir(inDir, outFilePath, stylusOptions, cb) {
  fs.readdir(inDir, function (err, fileNames) {
    if (err) {
      cb(err);
    } else {
      async.map(fileNames, function (fileName, fileCb) {
        if (path.extname(fileName) === '.styl') {
          compileStylusFile(path.join(inDir, fileName), stylusOptions, fileCb);
        } else {
          fileCb(null, "");
        }
      }, function (mapErr, results) {
        if (mapErr) {
          cb(mapErr);
        } else {
          fse.outputFile(outFilePath, results.join(""), cb);
        }
      });
    }
  });
}

module.exports = function (opts, cb) {
  var inDir = opts.inDir;
  var outFilePath = opts.outFile;
  var stylusOptions = opts.options;
  compileStylusDir(inDir, outFilePath, stylusOptions, cb);
};