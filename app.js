var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var cookieParser = require('./src/cookie-parser');

var logger = require('tracer').colorConsole();

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

var roundList = [];

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
            rate = parseFloat(bodyData.rate);
            pwdResult = true;
            result = true;
        } else {
            resultStr = '비밀번호가 틀립니다.\n다시 입력해주시기 바랍니다.'
            pwdResult = false;
            result = false;
        }
    } else {
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
                    logger.log("34343344")
                    overlap = true;
                    result = true;
                } else {
                    logger.log("121212")
                    overlap = false;
                    result = false;
                }
            }
        }
    }
    logger.log({'result':result, 'bidder':bodyData.bidder, 'overlap':overlap,'pwdResult':pwdResult,'rate' : rate})

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
    logger.log('Example app listening on port 5000!');
});


var io = require('socket.io')(server)//,{'pingTimeout':15000, 'pingInterval', 8000});

io.on('connection', function(socket){

    logger.log('connection')

    socket.on('disconnect', function(){

        logger.log('disconnection');

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

        logger.log(roundList)

        logger.log("======== loginData ======")
        logger.log(loginData)

        io.emit('LOGIN_CHECK',JSON.stringify(loginData))
    })

    socket.on('LOGIN_CHECK',function(msg){
        logger.log(msg)

        for(var i=0; i<loginData.length ;++i){
            if(loginData[i].name == msg){
                if(!loginData[i].state){
                    loginData[i].state = true;
                }
            }
        }

        logger.log(loginData)

        io.emit('LOGIN_CHECK',JSON.stringify(loginData))
    })

    socket.on('AUCTION_ID',function(msg){
        io.emit('AUCTION_ID',msg)
    })

    socket.on('ROUND_START',function(msg){
        io.emit('ROUND_START',msg)
    })

    socket.on('BID',function(msg){
        io.emit('BID',msg)
    })

    socket.on('ROUND_RESULT',function(msg){
        io.emit('ROUND_RESULT',msg)
    })

    /**
     * 오른입찰완료 알림 이벤트
     */
    socket.on('ASCENDING_BIDDING_FINISH',function(msg){
        io.emit('ASCENDING_BIDDING_FINISH',msg)
    })

    /**
     * 밀봉입찰시작 알림 이벤트
     */
    socket.on('SEAL_BID_START',function(msg){
        io.emit('SEAL_BID_START',msg)
    })

    socket.on('SEAL_LOWEST_BID_PRICE',function(msg){
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
        rate = parseFloat(msg,10);
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
    });

    socket.on('AGAIN_SEAL_BID',function(msg){
        io.emit('AGAIN_SEAL_BID',msg);
    })

    socket.on('GET_CHART_DATA',function(msg){
        io.emit('GET_CHART_DATA',msg);
    })
});
