var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var moment = require('moment')
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

// 입찰자 정보
var companyInfoList = [
    {'name':'KT','hertzList':null,'bandWidth':null,'biddingDelayCount':0,'strategy':''},
    {'name':'SK','hertzList':null,'bandWidth':null,'biddingDelayCount':0,'strategy':''},
    {'name':'LG','hertzList':null,'bandWidth':null,'biddingDelayCount':0,'strategy':''},
];

var pwd = 'wnvktnrudao';
var rate = 0;

var countDown = null;
//var TIMER = 2400000;//40분
var TIMER = 300000;

var lastTime = '';

/**
 * 로그인 함수
 */
app.post('/login', function(req, res) {
    var result = false;
    var bodyData = req.body;
    var pwdResult = false;
    var overlap = false;

    var resultStr = '';

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

    if(result == true){

        // 중복된 로그인 체크
        for(var i=0; i<loginData.length ;++i){

            if(loginData[i].name == bodyData.bidder){
                if(!loginData[i].state){
                    loginData[i].state = true;
                    overlap = true;
                    result = true;
                } else {
                    overlap = false;
                    result = false;
                }
            }
        }
    }
    res.send({'result':result, 'bidder':bodyData.bidder, 'overlap':overlap,'pwdResult':pwdResult,'rate' : rate})
})

app.post('/round', function(req, res) {
    var result = false;
    var bodyData = req.body;

    //console.log(bodyData.round);

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

app.post('/roundList', function(req, res) {
    var bodyData = req.body;
    roundList = null;
    roundList = bodyData.roundList;
    res.send(roundList)
})

app.get('/roundList', function(req, res) {
    res.send(roundList)
})



app.get('/hertzList', function(req, res) {
    var bodyData = req.body;
    res.send(companyInfoList)
})

app.get('/biddingStrategy', function(req, res) {
    var bodyData = req.body;
    res.send(companyInfoList)
})

app.get('/bandWidth', function(req, res) {
    var bodyData = req.body;
    res.send(companyInfoList);
})

app.get('/biddingDelayCount', function(req, res) {
    var bodyData = req.body;
    res.send(companyInfoList);
})

app.get('/lastTime', function(req, res) {
    var bodyData = req.body;
    res.send(lastTime);
})


/**
* 현황판 입력 화면
*/
app.get('/insert_dashboard',function(req, res){
    res.sendFile(__dirname + '/src/html/insert_dashboard.html')
})

/**
 * 총 가격, 누적, 현증분율 표시
 */
app.get('/dashboard',function(req, res){
    res.sendFile(__dirname + '/src/html/dashboard.html')
})
/**
 * 총 가격, 누적, 현증분율(잘못되어 수정해서 사용안함) 표시
 */
app.get('/dashboard_test',function(req, res){
    res.sendFile(__dirname + '/src/html/dashboard_test.html')
})
/**
 * 처음 현황판 (사용안함)
 */
app.get('/dashboard_bak',function(req, res){
    res.sendFile(__dirname + '/src/html/dashboard_bak.html')
})

/**
 * 현 증분율 표시
 */
app.get('/now_rate_increase',function(req, res){
    res.sendFile(__dirname + '/src/html/now_rate_increase.html')
})
/**
 * 통신사 구분하여 전체 리스트를 보여주는 차트
 */
app.get('/chart_line',function(req, res){
    res.sendFile(__dirname + '/src/html/chart_line.html')
})
/**
 * 통신사 구분없이 승자만을 보여주는 차트
 */
app.get('/chart_win',function(req, res){
    res.sendFile(__dirname + '/src/html/chart_win.html')
})
/**
 * 통신사를 구분하여 승자 입찰액 리스트만 보여주는 차트
 */
app.get('/chart_price',function(req, res){
    res.sendFile(__dirname + '/src/html/chart_price.html')
})

/**
 * 통신사를 구분하여 승자 누적 증분율 리스트만 보여주는 차트
 */
app.get('/chart_rate',function(req, res){
    res.sendFile(__dirname + '/src/html/chart_rate.html')
})

/**
 * 입찰가와 증분율을 한번에 보여주는 차트
 */
app.get('/chart',function(req, res){
    res.sendFile(__dirname + '/src/html/chart.html')
})

app.get('/start',function(req, res){
    res.sendFile(__dirname + '/src/html/start.html')
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


var io = require('socket.io')(server)

io.on('connection', function(socket){

    socket.on('disconnect', function(){

        var url = this.handshake.headers.referer;
        var urlArr = url.split('/');
        var pathName = urlArr[urlArr.length-1];

        if(pathName != '') return;

        if(this.handshake.headers.cookie == null || this.handshake.headers.cookie == undefined) return;

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

        _.each(companyInfoList,function(item){
            if(item.name == (cookieData.user).toUpperCase()){
                item.biddingDelayCount = 0;
            }
        })

        if(logFlag){
            roundList = null;
            roundList = [];
            rate = 0;
            countDown = null;

            _.each(companyInfoList,function(item){
                item.hertzList = null;
                item.strategy = '';
            })
        }

        io.emit('LOGIN_CHECK',JSON.stringify(loginData))
    })

    socket.on('BANDWIDTH',function(msg){
        var data = JSON.parse(msg);
        _.each(companyInfoList,function(item){
            if(item.name == (data.user).toUpperCase()){
                item.bandWidth = data.bandwidth;
            }
        })
        io.emit('BANDWIDTH',JSON.stringify(companyInfoList))
    })

    socket.on('BIDDING_DELAY_COUNT', function(msg){
        var data = JSON.parse(msg);
        _.each(companyInfoList,function(item){
            if(item.name == data.name){
                item.biddingDelayCount = data.biddingDelayCount;
            }
        })
        io.emit('BIDDING_DELAY_COUNT',JSON.stringify(companyInfoList))
    })

    socket.on('LOGIN_CHECK',function(msg){
        //logger.log(msg)

        for(var i=0; i<loginData.length ;++i){
            if(loginData[i].name == msg){
                if(!loginData[i].state){
                    loginData[i].state = true;
                }
            }
            //관리자 로그인시 리셋
            if(msg == 'admin'){
                roundList = []
            }
        }

        io.emit('LOGIN_CHECK',JSON.stringify(loginData))
    })

    socket.on('AUCTION_ID',function(msg){
        io.emit('AUCTION_ID',msg)
    })

    socket.on('ROUND_START',function(msg){

        var now = moment(new Date()).valueOf();
        countDown = now + TIMER;

        var data = {
            'round_num' : msg,
            'countdown_timer' : countDown
        }

        io.emit('ROUND_START', JSON.stringify(data))
        io.emit('COUNTDOWN_START', JSON.stringify(data))
    })

    socket.on('COUNTDOWN_STOP',function(msg){
        countDown = null;
        io.emit('COUNTDOWN_STOP',(TIMER).toString())
    })

    socket.on('BIDDING',function(msg){
        var ksy = JSON.parse(msg)
        console.log(ksy.name);
        console.log(ksy.biddingType);

        io.emit('ADMIN_BID',msg)
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

        _.each(companyInfoList,function(item){
            if(item.name == list.name){
                item.hertzList = list.hertzList;
            }
        })

        io.emit('HERTZ_LIST',JSON.stringify(companyInfoList));
    });

    /**
    * 입찰전략을 관리자에게 전달
    */
    socket.on('BIDDING_STRATEGY', function(msg){
        var data = JSON.parse(msg);
        _.each(companyInfoList,function(item){
            if(item.name == (data.name).toUpperCase()){
                item.strategy = data.strategy;
            }
        })
        io.emit('BIDDING_STRATEGY',JSON.stringify(companyInfoList));
    })

    socket.on('BANDWIDTH',function(msg){
        var data = JSON.parse(msg);
        _.each(companyInfoList,function(item){
            if(item.name == (data.user).toUpperCase()){
                item.bandWidth = data.bandwidth;
            }
        })
        io.emit('BANDWIDTH',JSON.stringify(companyInfoList))
    })

    socket.on('AGAIN_SEAL_BID',function(msg){
        io.emit('AGAIN_SEAL_BID',msg);
    })

    socket.on('GET_CHART_DATA',function(msg){
        io.emit('GET_CHART_DATA',msg);
    });

    socket.on('NOW_RATE_INCREASE',function(msg){
        io.emit('NOW_RATE_INCREASE',msg);
    });

    socket.on('DASHBOARD',function(msg){
        io.emit('DASHBOARD',msg);
    });

    /**
    * 실전 총 현황에서 카운트다운
    */
    socket.on('COUNTDOWN',function(msg){
        //마감시간 저장
        lastTime = msg;
        io.emit('COUNTDOWN',msg);
    })
});
