var http = require('http');
var CONFIG = require('../config/node/config');
var childProcess = require('child_process');
var phantomjs = require('phantomjs');
var path = require('path');

var PHANTOM = CONFIG.binPath || "/usr/local/bin/phantomjs";
var ENDPOINT = CONFIG.endpoint;

module.exports = http.createServer(function (req, res) {
  var targetURL = ENDPOINT + req.url;
  var childArgs = [
    path.resolve(__dirname, '../phantomjs', 'renderer.js'),
    targetURL
  ];
  childProcess.execFile(PHANTOM, childArgs, function(err, stdout, stderr) {
    var result = JSON.parse(stdout);
    var headers = {};
    var status = result.status || 503;
    var content = result.content || '';
    result.headers.forEach(function(header) {
      headers[header.name] = header.value;
    });
    res.writeHead(status, headers);
    res.end(content);
  });
})