var http = require('http');
var assert = require('assert');

var PORT = 3000;

describe('server.js', function(){
  before(function(done) {
    target = http.createServer(function(request, response) {
      var content = '<html><body><script>document.write("Hello World");</script></body></html>';
      response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
      response.end(content);
    }).listen(PORT);
    target.on("listening", function() {
      var server = require('../lib/index').listen(8000);
      server.on("listening", function() {
        done();
      });
    });
  });
  it('should return fully rendererd content', function(done){
    http.get('http://0.0.0.0:8000/', function(res) {
      assert.equal(res.statusCode, 200);
      res.on('data', function(chunk) {
        assert.equal(chunk.toString(), '<html><head></head><body><script>document.write("Hello World");</script>Hello World</body></html>');
        done();
      })
    })
  });
});