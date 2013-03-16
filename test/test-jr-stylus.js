var async = require('async');
var fs = require('fs');
var fse = require('fs-extra');
var jrStylus = require('../');
var path = require('path');

function outputFileError(contents) {
  return new Error('Unexpected output file contents: ' + contents.replace(/\r/g, '\\r').replace(/\n/g, '\\n'));
}

function checkOutputFileData(data, expected, cb) {
  if (data === expected) {
    cb();
  } else {
    cb(outputFileError(data));
  }
}

describe('jr-stylus', function () {

  var testFilesDir = path.join('test', 'files');

  var inDir = path.join(testFilesDir, 'in');
  var inFileA = path.join(inDir, 'a.styl');
  var inFileB = path.join(inDir, 'b.styl');
  var parentFile = path.join(inDir, 'parent.styl');
  var libDir = path.join(testFilesDir, 'lib');
  var childFile = path.join(libDir, 'child.styl');
  var outFile = path.join(testFilesDir, 'out.css');

  var stylusA = 'body\n  margin 0';
  var cssA = 'body {\n  margin: 0;\n}\n';
  var stylusB = 'p\n  color red';
  var cssB = 'p {\n  color: #f00;\n}\n';
  var importStylus = "@import '../lib/child'\n";

  afterEach(function (done) {
    fse.remove(testFilesDir, done);
  });

  it('should produce an empty output file for no input files', function (done) {
    async.waterfall([
      async.apply(fse.mkdir, testFilesDir),
      async.apply(fse.mkdir, inDir),
      async.apply(jrStylus, { inDir: inDir, outFile: outFile }),
      async.apply(fs.readFile, outFile, 'utf-8'),
      function (data, cb) {
        checkOutputFileData(data, '', cb);
      }
    ], done);
  });

  it('should produce the correct output file for a single input file', function (done) {
    async.waterfall([
      async.apply(fse.outputFile, inFileA, stylusA),
      async.apply(jrStylus, { inDir: inDir, outFile: outFile }),
      async.apply(fs.readFile, outFile, 'utf-8'),
      function (data, cb) {
        checkOutputFileData(data, cssA, cb);
      }
    ], done);
  });

  it('should produce the correct output file for multiple input files', function (done) {
    async.waterfall([
      async.apply(fse.outputFile, inFileA, stylusA),
      async.apply(fse.outputFile, inFileB, stylusB),
      async.apply(jrStylus, { inDir: inDir, outFile: outFile }),
      async.apply(fs.readFile, outFile, 'utf-8'),
      function (data, cb) {
        checkOutputFileData(data, cssA + cssB, cb);
      }
    ], done);
  });

  it('should handle import correctly', function (done) {
    async.waterfall([
      async.apply(fse.outputFile, parentFile, importStylus + stylusA),
      async.apply(fse.outputFile, childFile, stylusB),
      async.apply(jrStylus, { inDir: inDir, outFile: outFile }),
      async.apply(fs.readFile, outFile, 'utf-8'),
      function (data, cb) {
        checkOutputFileData(data, cssB + cssA, cb);
      }
    ], done);
  });

});