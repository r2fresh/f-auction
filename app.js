var express = require('express');
//var path = require('path');
var bodyParser = require('body-parser');

var data = require('/src/loginData')

var _ = require('underscore')

//var http = require('http')
//var querystring = require('querystring')

var app = express();

var allClients = [];

app.set('port', (process.env.PORT || 5000));

// parse application/json
app.use(bodyParser.json())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static('public'));

var loginData = [
    {'name':'admin','state':false},
    {'name':'kt','state':false},
    {'name':'sk','state':false},
    {'name':'lg','state':false}
]

app.post('/login', function(req, res) {

    console.log(req.fresh)

    var result = false;

    var bodyData = req.body;

    for(var i=0; i<loginData.length ;++i){

        if(loginData[i].name === bodyData.bidder){
            if(!loginData[i].state){
                loginData[i].state = true;
                allClients
                result = true;
            } else {
                result = false;
            }
        }
    }

    //console.log(nameList)

    //console.log(req.body)

    res.send({'result':result})
})


app.get('/',function(req, res){
    res.sendFile(__dirname + '/index.html')
})



var server = app.listen(app.get('port'), function () {
  console.log('Example app listening on port 5000!');
});


var io = require('socket.io')(server);

io.on('connection', function(socket){
  console.log('a user connected');

  allClients.push(socket)

      socket.on('disconnect', function(kkk){
          console.log('=====================')

          var str = this.handshake.headers.cookie

          //var ksy = str.split(/[;,] */);

          var obj = {}
            var pairs = str.split(/[;,] */);
            var encode = encodeURIComponent;
            var decode = decodeURIComponent;

          pairs.forEach(function(pair) {
                var eq_idx = pair.indexOf('=')
                var key = pair.substr(0, eq_idx).trim()
                var val = pair.substr(++eq_idx, pair.length).trim();

                // quoted values
                if ('"' == val[0]) {
                    val = val.slice(1, -1);
                }

                // only assign once
                if (undefined == obj[key]) {
                    obj[key] = decode(val);
                }
            });

            console.log(obj.user)

            _.each(loginData,function(item){
                if(item.name === obj.user){
                    item.state = false;
                }
            })

          //
        //   var sang = ksy[ksy.length-1];
        //
        //   console.log(ksy)
          //console.log(encodeURIComponent(JSON.parse(this.handshake.headers.cookie)))

          //var index = allClients.indexOf(socket);

          //allClients.splice(index,1);

      })

});





// var express = require('express');
// var app = express();
// var http = require('http').Server(app);
// var io = require('socket.io')(server);
// var _ = require('underscore')
//
// // var login = [
// //     {'name':'admin','state':false},
// //     {'name':'kt','state':false},
// //     {'name':'sk','state':false},
// //     {'name':'lg','state':false}
// // ]
//
// app.set('port', (process.env.PORT || 5000));
//
// app.use(express.static('public'));
//
// app.get('/', function(req, res){
//
//     req.on('close', function(){
//
//     })
//
//   res.sendFile(__dirname + '/index.html');
// });
//
// http.on('clonse',function(){
//     console.log("sdfdsfd")
// })
//
// var allClients = [];
// var loginUser = [];
// var clientID = '';
//
// io.on('connection', function(socket){
//
//     allClients.push(socket);
//
//     //console.log(allClients.length)
//     console.log(allClients)
//
//     socket.on('clientID',function(msg){
//         clientID = msg
//     })
//
//     socket.on('login', function(msg){
//
//         console.log(loginUser.indexOf(msg))
//
//         if(loginUser.indexOf(msg) < 0){
//             loginUser.push(msg);
//             io.emit('receiveLogin', clientID);
//         } else {
//             io.emit('receiveLogin', '');
//         }
//
//     });
//
//
//
//     // socket.on('disconnect', function(socket){
//     //     var index = allClients.indexOf(socket)
//     //     allClients.splice(index,1);
//     //     //loginUser.splice(index,1);
//     //     console.log("==========================")
//     //     console.log(allClients)
//     // })
//
// });
//
//
//
// var server = app.listen(app.get('port'), function () {
//   console.log('Example app listening on port 5000!');
// });

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
