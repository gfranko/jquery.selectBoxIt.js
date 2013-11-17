// DEPENDENCIES
// ============
var express = require("express"),
    http = require("http"),
    port = (process.env.PORT || 8081),
    server = module.exports = express();

// SERVER CONFIGURATION
// ====================
server.configure(function() {

  server.use(express["static"](__dirname));

  server.use(express.errorHandler({

    dumpExceptions: true,

    showStack: true

  }));

  server.use(express.bodyParser());

  server.use(server.router);

});

// SERVER
// ======

// Start Node.js Server
http.createServer(server).listen(port);

console.log('Please go to http://localhost:' + port + ' to start testing SelectBoxIt');