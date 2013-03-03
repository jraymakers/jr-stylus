var async = require('async');
var fs = require('fs');
var fse = require('fs-extra');
var jrStylus = require('../');
var path = require('path');

describe('jr-stylus', function () {

  var inDir = path.join('test', 'in');
  var outFile = path.join('test', 'out.css');

  afterEach(function (done) {
    async.parallel([
      async.apply(fse.remove, inDir),
      async.apply(fse.remove, outFile)
    ], done);
  });

  it('should produce the correct output file for a single input file', function (done) {
    async.waterfall([
      async.apply(fse.outputFile, path.join(inDir, 'body.styl'), 'body\n  margin 0'),
      async.apply(jrStylus, { inDir: inDir, outFile: outFile }),
      async.apply(fs.readFile, outFile, 'utf-8'),
      function (data, cb) {
        if (data === 'body {\n  margin: 0;\n}\n') {
          cb();
        } else {
          cb(new Error('Unexpected output file contents: ' + data));
        }
      }
    ], done);
  });

  it('should produce the correct output file for multiple input files', function (done) {
    async.waterfall([
      async.apply(fse.outputFile, path.join(inDir, 'body.styl'), 'body\n  margin 0'),
      async.apply(fse.outputFile, path.join(inDir, 'p.styl'), 'p\n  color red'),
      async.apply(jrStylus, { inDir: inDir, outFile: outFile }),
      async.apply(fs.readFile, outFile, 'utf-8'),
      function (data, cb) {
        if (data === 'body {\n  margin: 0;\n}\np {\n  color: #f00;\n}\n') {
          cb();
        } else {
          cb(new Error('Unexpected output file contents: ' + data));
        }
      }
    ], done);
  });

  it('should produce an empty output file for no input files', function (done) {
    async.waterfall([
      async.apply(fse.mkdir, inDir),
      async.apply(jrStylus, { inDir: inDir, outFile: outFile }),
      async.apply(fs.readFile, outFile, 'utf-8'),
      function (data, cb) {
        if (data === '') {
          cb();
        } else {
          cb(new Error('Unexpected output file contents: ' + data));
        }
      }
    ], done);
  });

});