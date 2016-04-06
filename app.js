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
];

var roundList = [

];

var hertzList = [
    {'name':'KT','hertzList':null},
    {'name':'SK','hertzList':null},
    {'name':'LG','hertzList':null},
]

var pwd = 'wnvktnrudao';
var rate = 0;

/**
 * 로그인 함수
 */
app.post('/login', function(req, res) {
    var result = false;
    var bodyData = req.body;
    var pwdResult = false;
    var overlap = false;

    var resultStr = '';

    //console.log(loginData)

    // 관리자가 로그인을 할 경우
    if(bodyData.bidder == 'admin'){
        // 관리자는 비밀
        if(bodyData.pwd == pwd){
            rate = parseInt(bodyData.rate, 10);
            pwdResult = true;
            result = true;
        } else {
            resultStr = '비밀번호가 틀립니다.\n다시 입력해주시기 바랍니다.'
            pwdResult = false;
            result = false;
        }
    } else {
        console.log('bodyData.bidder : ' + bodyData.bidder)
        console.log('rate : ' + rate)
        if(rate > 0){
            resultStr = bodyData.bidder + '로 로그인 되었습니다.'
            result = true;
        } else {
            resultStr = '관리자가 아직 로그인 되지 않았습니다.\n관리자 로그인 후 입찰자 로그인이 가능합니다.'
            result = false;
        }
    }

    //console.log(loginData)
    //console.log('result : ' + result)

    if(result == true){

        // 중복된 로그인 체크
        for(var i=0; i<loginData.length ;++i){

            if(loginData[i].name == bodyData.bidder){
                if(!loginData[i].state){
                    loginData[i].state = true;
                    console.log("34343344")
                    overlap = true;
                    result = true;
                } else {
                    console.log("121212")
                    overlap = false;
                    result = false;
                }
            }
        }
    }
    console.log(overlap)

    res.send({'result':result, 'bidder':bodyData.bidder, 'overlap':overlap,'pwdResult':pwdResult,'rate' : rate})
})

app.post('/round', function(req, res) {
    var result = false;
    var bodyData = req.body;

    console.log(bodyData.round);

    if(bodyData.round.name == 1){
        roundList = [];
    }

    roundList.push(bodyData.round);

    res.send(bodyData.round)
})

app.get('/round', function(req, res) {
    var result = false;
    var bodyData = req.body;

    res.send(roundList)
})

app.get('/hertzList', function(req, res) {
    var bodyData = req.body;
    res.send(hertzList)
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


var io = require('socket.io')(server)//,{'pingTimeout':15000, 'pingInterval', 8000});

io.on('connection', function(socket){

    console.log('connection')

    socket.on('disconnect', function(){

        console.log('disconnection');

        //var str = this.handshake.headers.cookie
        var cookieData = cookieParser.get( this.handshake.headers.cookie );

        // cookieData 없을 경우 리턴
        if(!cookieData.user) return;

        _.each(loginData,function(item){
            if(item.name == cookieData.user){
                item.state = false;
            }
        })

        var logFlag = _.every(loginData,function(item){
            return item.state == false;
        })

        if(logFlag){
            roundList = null;
            roundList = [];
            rate = 0;

            _.each(hertzList,function(item){
                item.hertzList = null;
            })
        }

        console.log(roundList)

        console.log("======== loginData ======")
        console.log(loginData)

        io.emit('LOGIN_CHECK',JSON.stringify(loginData))
    })

    socket.on('LOGIN_CHECK',function(msg){
        console.log(msg)

        for(var i=0; i<loginData.length ;++i){

            if(loginData[i].name == msg){
                if(!loginData[i].state){
                    loginData[i].state = true;
                }
            }
        }

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

    /**
     * 입찰자가 라운드의 결과를 확인 했는지 알림 이벤트
     */
    socket.on('ROUND_RESULT_CHECK',function(msg){
        io.emit('ROUND_RESULT_CHECK',msg);
    })

    /**
     * 입찰자가 라운드의 결과를 확인 했는지 알림 이벤트
     */
    socket.on('RATE',function(msg){
        rate = parseInt(msg,10);
    })

    /**
     * 각 일찰자가 지원한 주파수 리스트를 관리자에게 전달
     */
    socket.on('HERTZ_LIST',function(msg){

        var list = JSON.parse(msg);

        _.each(hertzList,function(item){
            if(item.name == list.name){
                item.hertzList = list.hertzList;
            }
        })

        io.emit('HERTZ_LIST',JSON.stringify(hertzList));
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
