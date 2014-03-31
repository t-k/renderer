var CONFIG = require('./config/node/config');
var PORT = CONFIG.port || 8000;

require('./lib/index').listen(PORT);