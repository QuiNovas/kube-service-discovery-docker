var fs = require('fs');
var http = require('http');
var https = require('https');
var sub = require('child_process');
var poll = sub.fork('./kubepoll.js');
var hostList = [];
var httpPort = process.env.HTTP_PORT || 80
var httpsPort = process.env.HTTPS_PORT || 443
var httpServicePort = process.env.HTTP_SERVICE_PORT || 443
var httpsServicePort = process.env.HTTPS_SERVICE_PORT || 443

poll.on('message', function(m) {
  console.log("New hostlist received: " + m);
  hostList = m
});

http.createServer(function(req, res){
  if(hostList.length == 0){
    res.writeHead(404, {"Content-Type": "text/plain"});
    res.end()
    return;
  }
  var host = hostList[Math.floor(Math.random()*hostList.length)];
  if(httpServicePort != 80){
    res.writeHead(302, 'https://' + host + ':' + httpServicePort + req.url);
  }else{
    res.writeHead(302, 'https://' + host + req.url);
  }
  res.end();
}).listen(httpPort);

var ssl = {
    key: fs.readFileSync('/ssl/key.key'),
    cert: fs.readFileSync('/ssl/key.crt')
}

var httpsServer = https.createServer(ssl, function (req, res) {
  if(hostList.length == 0){
    res.writeHead(404, {"Content-Type": "text/plain"});
    res.end()
    return;
  }
  var host = hostList[Math.floor(Math.random()*hostList.length)];
  if(httpsServicePort != 443){
    res.writeHead(302, 'https://' + host + ':' + httpsServicePort + req.url);
  }else{
    res.writeHead(302, 'https://' + host + req.url);
  }
  res.end();
}).listen(httpsPort)
