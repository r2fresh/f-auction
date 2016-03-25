var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var login = [
    {'name':'admin','state':false},
    {'name':'kt','state':false},
    {'name':'sk','state':false},
    {'name':'lg','state':false}
]

app.set('port', (process.env.PORT || 5000));

app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    socket.on('login', function(msg){



      io.emit('login',msg)
    });
});

http.listen(app.get('port'), function () {
  console.log('Example app listening on port 5000!');
});

// var express = require('express');
// //var path = require('path');
// //var bodyParser = require("body-parser");
//
// var http = require('http')
// var querystring = require('querystring')
//
// var io = require('socket.io')(http);
//
// var app = express();
//
// app.set('port', (process.env.PORT || 5000));
//
// //app.use(bodyParser.urlencoded({ extended: false }));
// //app.use(bodyParser.json());
//
// app.use(express.static('public'));
//
// // app.get('/',function(req, res){
// //     res.sendFile(path.join(__dirname + '/index.html'))
// // })
//
// app.get('/',function(req, res){
//     res.sendFile(__dirname + '/index.html')
// })
//
// io.on('connection', function(socket){
//   console.log('a user connected');
// });
// app.listen(app.get('port'), function () {
//   console.log('Example app listening on port 5000!');
// });
//


// // app.use(express.bodyParser());
//
// app.get('/api/bidding', function(req, res){
//  // response.send(request.body);    // echo the result back
//
//  var postData = querystring.stringify(req.body)
//
//  var options = {
//      host: 'hidden-wildwood-10621.herokuapp.com',
//      //port: null,
//      path: '/api/bidding',
//      method: 'GET',
//      headers: {
//          'Content-Type': 'application/x-www-form-urlencoded',
//          'Content-Length': postData.length
//          //'Content-Length': Buffer.byteLength(postData, 'utf8')
//      }
//  };
//
//  var req2 = http.request(options, function(res1) {
//      res1.setEncoding('utf8');
//      res1.on('data', function (chunk) {
//          console.log("body: " + chunk);
//
//          const buf1 = new Buffer(chunk);
//
//          //returnData = chunk;
//          //res.end( decoder.write(chunk) );
//
//          // 전달 되는 값으 head값을 utf-8로 해줘야 한글이 깨지지 않는다
//          // 참고 사이트
//          // http://gakari.tistory.com/entry/Nodejs-responseend-한글-깨짐-현상-해결법
//          // https://nodejs.org/api/http.html#http_response_writehead_statuscode_statusmessage_headers
//          res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' });
//          res.end( chunk );
//      });
//  });
//
//  req2.write(postData);
//  req2.end();
// });



// app.get('/',function(req, res){
//     res.sendFile(path.join(__dirname + '/index.html'))
// })
//
// app.get('/auction',function(req, res){
//     res.sendFile(path.join(__dirname + '/preAuction.html'))
// })
//
// app.get('/login',function(req, res){
//     res.sendFile(path.join(__dirname + '/login.html'))
// })
//
// app.get('/insert',function(req, res){
//     res.sendFile(path.join(__dirname + '/insertAuction.html'))
// })
