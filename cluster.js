var cluster = require('cluster');
var numCPUs = require('os').cpus().length;
var size = numCPUs >= 2 ? numCPUs : 2;

console.log('setup ' + size + ' forks');

if (cluster.isMaster) {
  var i = 0;
  while (i < size) {
    cluster.fork();
    i++;
  }
  cluster.on('exit', function(worker){
    console.log('worker' + worker.process.pid + 'disconnected.');
  });
} else {
  require('./server');
}