var fs = require('fs');
var http = require('http');
var https = require('https');

var sub = require('child_process');
var poll = sub.fork('./kubepoll.js');
var hostList = [];

var httpPort = process.env.HTTP_PORT
var httpsPort = process.env.HTTPS_PORT

var servicePort = process.env.SERVICE_PORT

poll.on('message', function(m) {
  console.log("New hostlist received: " + m);
  hostList = m
});

http.createServer(function(req, res){
  var host = hostList[Math.floor(Math.random()*hostList.length)];
  res.writeHead(200, {"Content-Type": "text/plain"});
  res.writeHead(302, 'https://' + host + ':' + servicePort + req.url);
  res.end();
}).listen(httpPort);

var ssl = {
    key: fs.readFileSync('/ssl/key.key'),
    cert: fs.readFileSync('/ssl/key.crt')
}

var httpsServer = https.createServer(ssl, function (req, res) {
  var host = hostList[Math.floor(Math.random()*hostList.length)];
  res.writeHead(200, {"Content-Type": "text/plain"});
  res.writeHead(302, 'https://' + host + ':' + servicePort + req.url);
  res.end();
}).listen(httpsPort)
