var _ = require('underscore');
var async = require('async');
var fs = require('fs');
var fse = require('fs-extra');
var path = require('path');
var stylus = require('stylus');

function compileStylusFile(stylusFilePath, settings, defines, cb) {
  fs.readFile(stylusFilePath, 'utf-8', function (err, stylusStr) {
    if (err) {
      cb(err);
    } else {
      var renderer = stylus(stylusStr);
      if (settings) {
        _.each(_.keys(settings), function (settingKey) {
          renderer.set(settingKey, settings[settingKey]);
        });
      }
      renderer.set('filename', stylusFilePath);
      if (defines) {
        _.each(_.keys(defines), function (defineKey) {
          renderer.define(defineKey, defines[defineKey]);
        });
      }
      renderer.render(cb);
    }
  });
}

function compileStylusDir(inDir, outFilePath, settings, defines, cb) {
  fs.readdir(inDir, function (err, fileNames) {
    if (err) {
      cb(err);
    } else {
      async.map(fileNames, function (fileName, fileCb) {
        if (path.extname(fileName) === '.styl') {
          compileStylusFile(path.join(inDir, fileName), settings, defines, fileCb);
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
  var settings = opts.settings;
  var defines = opts.defines;
  compileStylusDir(inDir, outFilePath, settings, defines, cb);
};