var system = require('system');
var webpage = require('webpage');

var CONFIG = require('../config/phantomjs/config');

createWebPage = function() {
  var page;
  page = webpage.create();
  page.viewportSize = CONFIG.viewportSize || {
    width: 1900,
    height: 1200
  };
  page.settings.resourceTimeout = CONFIG.resourceTimeout || 30000;
  page.settings.userAgent = CONFIG.userAgent || 'Phantomjs';
  page.settings.loadImages = false;
  return page;
};

var httpStatus, headers;

var requestPage = function() {
  var page, endpoint, httpStatus, headers;
  endpoint = system.args[1];
  page = createWebPage();
  page.onResourceRequested = function(requestData, networkRequest) {
    // abort request for GA and GTM
    if (/^http(|s):\/\/www\.(google-analytics|googletagmanager)\.com/.test(requestData.url)) {
      networkRequest.abort();
    }
  };
  page.onResourceReceived = function(resource) {
    if (endpoint === resource.url) {
      httpStatus = resource.status;
      headers = resource.headers;
    }
  };
  page.onLoadFinished = function(status) {
    var content = page.content;
    page.evaluate(function() {
      try {
        if (setTitle) { setTitle(); }
        if (setDescription) { setDescription(); }
        if (setImage) { setImage(); }
      } catch( e ){ }
    });
    page.close();
    data = {
      content: content,
      status: httpStatus,
      headers: headers
    }
    console.log(JSON.stringify(data));
    return phantom.exit();
  };
  return page.open(endpoint);
};

requestPage();