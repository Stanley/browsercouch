// Configuration
var www   = {host:'localhost', port:3000},
    couch = {host:'localhost', port:5984, db:'browsercouch'}
    
// No need to edit below
var http = require('http'),
 		p = require('sys').puts,
 		io = require('./lib/socket.io'),
    json = JSON.stringify,
    buffer = []

var server = http.createServer(function(req, res){
  
  var upstream_req
  
  if((new RegExp("^/_db[a-z0-9/_$()+-]+$")).exec(req.url))
    upstream_req = http.createClient(couch.port, couch.host).request(req.method, "/"+ couch.db + req.url.substr(4) , req.headers);
  else
    upstream_req = http.createClient(www.port, www.host).request(req.method, req.url, req.headers);
  
  upstream_req.addListener('response', function(response) {

    res.writeHead(response.statusCode, response.headers)    
    
    response.on('data', function(chunk) {
      res.write(chunk)
    })
        
    response.on('end', function() {
      res.end()
    })
  })
  
  req.on('data', function (data) {
    upstream_req.write(data);
  })
  
  req.on('end', function () {
    upstream_req.end()
  })
  
})
server.listen(8080)

// Web sockets
var listener = io.listen(server, {
  onClientConnect: function(client){
    buffer.forEach(function(chunk){
      client.send(chunk)
    })
  }
})

// Listen couchdb chanes feed
var changes_req = http.createClient(couch.port, couch.host).request('GET', "/"+ couch.db +"/_changes?feed=continuous&heartbeat=60000");
changes_req.addListener('response', function(response) {

  response.setEncoding('utf8')
  response.on('data', function(chunk) {
    buffer.push(chunk)
    listener.broadcast(chunk)
  })
})
changes_req.end()
