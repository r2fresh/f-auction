var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var cookieParser = require('./src/cookie-parser')

var app = express();

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

var roundList = [

];

/**
 * 로그인 함수
 */
app.post('/login', function(req, res) {
    var result = false;
    var bodyData = req.body;

    for(var i=0; i<loginData.length ;++i){

        if(loginData[i].name === bodyData.bidder){
            if(!loginData[i].state){
                loginData[i].state = true;
                result = true;
            } else {
                result = false;
            }
        }
    }
    res.send({'result':result})
})

app.post('/round', function(req, res) {
    var result = false;
    var bodyData = req.body;

    console.log(bodyData.round)

    roundList.push(bodyData.round);

    res.send(bodyData.round)
})

app.get('/round', function(req, res) {
    var result = false;
    var bodyData = req.body;

    res.send(roundList)
})

/**
 * index.html router
 */
app.get('/',function(req, res){
    res.sendFile(__dirname + '/index.html')
})

/**
 * express server start
 */
var server = app.listen(app.get('port'), function () {
    console.log('Example app listening on port 5000!');
});


var io = require('socket.io')(server);

io.on('connection', function(socket){

    console.log('connection')

    socket.on('disconnect', function(){

        console.log('disconnection');

        //var str = this.handshake.headers.cookie
        var cookieData = cookieParser.get( this.handshake.headers.cookie );

        // cookieData 없을 경우 리턴
        if(!cookieData.user) return;

        _.each(loginData,function(item){
            if(item.name === cookieData.user){
                item.state = false;
            }
        })

        var logFlag = _.every(loginData,function(item){
            return item.state == false;
        })

        if(logFlag){
            roundList = null;
            roundList = [];
        }

        console.log(roundList)

        io.emit('LOGIN_CHECK',JSON.stringify(loginData))
    })

    socket.on('LOGIN_CHECK',function(msg){
        console.log(msg)
        io.emit('LOGIN_CHECK',JSON.stringify(loginData))
    })

    socket.on('AUCTION_ID',function(msg){
        console.log(msg)
        io.emit('AUCTION_ID',msg)
    })

    socket.on('ROUND_START',function(msg){
        console.log(msg)
        io.emit('ROUND_START',msg)
    })

    socket.on('BID',function(msg){
        console.log(msg)
        io.emit('BID',msg)
    })

    socket.on('ROUND_RESULT',function(msg){
        console.log(msg)
        io.emit('ROUND_RESULT',msg)
    })

    /**
     * 오른입찰완료 알림 이벤트
     */
    socket.on('ASCENDING_BIDDING_FINISH',function(msg){
        console.log(msg)
        io.emit('ASCENDING_BIDDING_FINISH',msg)
    })

    /**
     * 밀봉입찰시작 알림 이벤트
     */
    socket.on('SEAL_BID_START',function(msg){
        io.emit('SEAL_BID_START',msg)
    })

    socket.on('SEAL_LOWEST_BID_PRICE',function(msg){
        console.log(msg)
        io.emit('SEAL_LOWEST_BID_PRICE',msg)
    })

    /**
     * 입찰자 밀봉입찰
     */
    socket.on('SEAL_BID_PRICE',function(msg){
        io.emit('SEAL_BID_PRICE',msg);
    })

    /**
     * 입찰자 밀봉입찰
     */
    socket.on('SEAL_BID_FINISH',function(msg){
        io.emit('SEAL_BID_FINISH',msg);
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
