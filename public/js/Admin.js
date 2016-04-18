define([
   'module',
   'text!tpl/admin.html',
   'text!tpl/adminRound.html',
   'text!tpl/adminBandWidth.html',
   'js/Model',
   'js/Process',
   'js/AuctionData',
   'js/SealBidCombination',
   'js/BiddingResult',
   'js/r2/r2Alert'
   ],
   function(module, Admin, AdminRound, AdminBandWidth, Model, Pro, AuctionData, SealBidCombination, BiddingResult, R2Alert){

	'use strict'

 	module.exports = new (Backbone.View.extend({
        socket : null,

        // 실행중인 경매 아이디
        auctionID : 0,
        // 생성된 경매의 이름
        auctionName : '',
        // 증분율
        lowestBidAdd : 0,
        // 현재 라운드 정보
        roundNum : 1,
        // 각 라운드 데이터
        roundData : null,
        // 시작가 리스트 템플릿
        startPriceListTpl:'',
        // 라운드 값 리스트 템플릿
        roundPriceListTpl : '',
        // 입찰 결과 템플릿
        biddingResultTpl:'',
        // 경매 원본 정보
        originCompanyList : null,
        // 타이머를 하기위한 변수
        countDown:null,

        loginCheckList : null,

        bidCountList :[
            {'name':'KT','state':false},
            {'name':'SK','state':false},
            {'name':'LG','state':false}
        ],

        winCompanyList:[
            {'name':'','price':0},
            {'name':'','price':0},
            {'name':'','price':0},
            {'name':'','price':0},
            {'name':'','price':0}
        ],

        // 밀봉입찰액 객체
        sealBidBidderList:null,

        sealBidCheckList:[
            {'name':'KT','state':false},
            {'name':'SK','state':false},
            {'name':'LG','state':false}
        ],
        // sealBandWidthList:[
        //     {'name':'KT','ableBandWidth':0},
        //     {'name':'SK','ableBandWidth':0},
        //     {'name':'LG','ableBandWidth':0}
        // ],

        roundResultCheck:[
            {'name':'KT','state':false},
            {'name':'SK','state':false},
            {'name':'LG','state':false}
        ],
        roundResultCheckFlag:false,
        hertzList : [
            {'name':'KT','hertzList':null},
            {'name':'SK','hertzList':null},
            {'name':'LG','hertzList':null},
        ],
        bandWidthList : [
            {'name':'KT','bandWidth':null},
            {'name':'SK','bandWidth':null},
            {'name':'LG','bandWidth':null},
        ],

        TIMER:1800,


 		el: '.admin',
 		events :{
            'keydown' : 'onkeydown',
            // 로그아웃
            'click ._logout_btn' : 'onLogout',
            // 라운드 시작
            'click ._round_start_btn' : 'onRoundStart',
            //오름 차순 결과
            'click ._acending_btn' : 'onBiddingResult',
            //밀봉 입찰 시작
            'click ._seal_bid_start_btn' : 'onSealBidStart',

            'click ._again_seal_bid_btn' : 'onAgainSealBid',

            'click ._tie_seal_bid_btn' : 'onTieSealBid'

            //'click ._auction_end_btn' : 'onAuctionEnd',
            // 갱매시작
            //'click ._auction_start_btn' : 'onAuctionStart',
            //'click ._clear_interval_btn' : 'onClearInterval',
 		},
 		initialize:function(){
		},
        render:function(){
            this.$el.html(Admin);
            this.getHertzList();
            this.getBandWidth();
            this.setTpl();
            this.setSocketReceiveEvent();
            this.setLowestBidAdd();
            this.setStartPriceList();
            this.setCountDown();

            // 밀봉입찰버튼 비활성화
            this.$el.find('._seal_bid_start_btn').attr('disabled','disabled');
            // 밀봉입찰탭 비활성화
            this.$el.find('._seal_bid_tap').addClass('displayNone');

            Auction.io.emit('RATE',Auction.session.get('user_info').rate);
            Auction.io.emit('LOGIN_CHECK',Auction.session.get('user_info').user);
        },
        getHertzList:function(){
            Model.getHertzList({
                 url: '/hertzList',
                 method : 'GET',
                 contentType:"application/json; charset=UTF-8",
                 success : Function.prototype.bind.call(this.getHertzListSuccess,this),
                 error : function(){}
             })
        },
        getHertzListSuccess:function(data, textStatus, jqXHR){
            if(textStatus == 'success'){
                this.hertzList = data;

                var userInfo = Auction.session.get('user_info')

                Auction.session.set('user_info',{
                        'type' : userInfo.type,
                        'user' : userInfo.user,
                        'strategy' : userInfo.strategy,
                        'bandWidth' : userInfo.bandWidth,
                        'rate' : userInfo.rate,
                        'hertzList' : this.hertzList
                    }
                )
            }
        },

        /**
        * 각 입찰자 대역폭 리스트 호출
        */
        getBandWidth:function(){
            Model.getBandWidth({
                 url: '/bandWidth',
                 method : 'GET',
                 contentType:"application/json; charset=UTF-8",
                 success : Function.prototype.bind.call(this.getBandWidthSuccess,this),
                 error : function(){}
             })
        },
        /**
        * 각 입찰자 대역폭 리스트 호출 성공
        */
        getBandWidthSuccess:function(data, textStatus, jqXHR){
            if(textStatus == 'success'){
                this.onBandWidth(JSON.stringify(data));
            }
        },

        //////////////////////////////////////////////////////////// 랜더링시 시작하는 함수 시작 ////////////////////////////////////////////////////////////
        /**
         * 템플릿 정의
         */
        setTpl:function(){
            //시작가 템플릿
            this.startPriceListTpl  = this.$el.find(".start_price_list_tpl").html();
            // 라운드 템플릿
            this.roundPriceListTpl  = AdminRound

            this.adminBandWidthTpl = AdminBandWidth

            // 밀봉입찰액 템플릿
            this.sealBidPriceListTpl = this.$el.find("._seal_bid_price_list_tpl").html();
            this.$el.find("._seal_bid_price_list_tpl").remove();


            // 밀봉입찰 조합 결과
            this.sealBidCombinationListTpl = this.$el.find("._seal_bid_combination_list_tpl").html();

            this.biddingResultTpl   = this.$el.find(".bindding_result_tpl").html();

            this.sealLowestBidPriceTpl = this.$el.find(".seal_lowest_bid_price_tpl").html();

            //접속자 유저 템플릿
            this.connectUserListTpl = this.$el.find(".connect_user_list_tpl").html();
        },
        /**
         * socket.io 서버에서 보내주는 이벤트를 받는 리시브 설정
         */
        setSocketReceiveEvent:function(){
            Auction.io.on('LOGIN_CHECK', Function.prototype.bind.call(this.onLoginCheck,this) );
            Auction.io.on('BID', Function.prototype.bind.call(this.onBid,this) );
            Auction.io.on('SEAL_BID_PRICE', Function.prototype.bind.call(this.onSealBidPrice,this) );
            Auction.io.on('ROUND_RESULT_CHECK', Function.prototype.bind.call(this.onRoundResultCheck,this) );
            Auction.io.on('HERTZ_LIST', Function.prototype.bind.call(this.onHertzList,this) );

            Auction.io.on('COUNTDOWN_START', Function.prototype.bind.call(this.onCountDownStart,this) );
            Auction.io.on('COUNTDOWN_STOP', Function.prototype.bind.call(this.onCountDownStop,this) );

            Auction.io.on('BANDWIDTH', Function.prototype.bind.call(this.onBandWidth,this) );
        },
        /**
         * 증분율 설정
         */
        setLowestBidAdd : function(){
            var userInfo = Auction.session.get('user_info');
            this.lowestBidAdd = userInfo.rate;
            this.$el.find('._bid_rate span').text(this.lowestBidAdd + '%');
        },
        /**
         * 시작가 설정
         */
        setStartPriceList:function(){
            var priceList = JSON.parse( JSON.stringify( AuctionData.startPriceList ) );
            var template = Handlebars.compile(this.startPriceListTpl);
            this.$el.find('.start_price_list').append(template({'priceList':AuctionData.startPriceList}));
        },
        setCountDown:function(){
            this.countDown = this.$el.find('.clock').FlipClock(this.TIMER, {
                autoStart: false,
        		countdown: true,
        		clockFace: 'MinuteCounter',
                callbacks: {
                    stop:function(e){
                        console.log(this)
                        //alert('stop')
                    }
                }
        	});

            //this.countDown.start();

            // var countDown = this.$el.find('.clock').timeTo({
            //     seconds : 1800,
            //     displayHours:false,
            //     start:false,
            //     //theme: "black",
            //     //displayCaptions: true,
            //     fontSize: 36,
            //     captionSize: 14
            // });
            // this.$el.find('.clock').timeTo({
            //     seconds : 1800,
            //     displayHours:false,
            //     start:true,
            //     //theme: "black",
            //     //displayCaptions: true,
            //     fontSize: 36,
            //     captionSize: 14
            // });

            //console.log(countDown);
        },
        //////////////////////////////////////////////////////////// 랜더링시 시작하는 함수 끝 ////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////// 이벤트 핸들러 함수들 시작 ////////////////////////////////////////////////////////////

        /**
        * 대역폭 리스트 설정
        */
        onBandWidth:function(msg){
            var bandWidthList = JSON.parse(msg);
            var template = Handlebars.compile(this.adminBandWidthTpl);
            this.$el.find('._bid_bandWidth').html(template({'bandWidthList':bandWidthList}));
        },

        /**
         * 로그아웃 핸들러
         */
        onLogout : function(e){
            e.preventDefault();
            Auction.session.remove('user_info');
            Cookies.remove('user');
            window.location.href = '/';
        },
        /**
         * 라운드 시작 이벤트
         */
        onRoundStart:function(){

            var notCheckStr = '';
            var companyName = '';

            var loginCheckFlag = _.every(this.loginCheckList,function(item){
                return item.state == true;
            })

            if(!loginCheckFlag){
                R2Alert.render({'msg':'로그인 안된 관리자 또는 입찰자가 있습니다.\n 모두 로그인 후 경매가 가능합니다.','w':400})
                return;
            }

            if(!this.roundResultCheckFlag && this.roundNum > 1){

                for(var i=0;i<this.roundResultCheck.length;++i){
                    var state = this.roundResultCheck[i].state;
                    if(state == false){

                        if(this.roundResultCheck[i].name == 'SK'){
                            companyName = 'SKT';
                        } else if(this.roundResultCheck[i].name == 'LG'){
                            companyName = 'LGU+'
                        } else {
                            companyName = this.roundResultCheck[i].name;
                        }

                        if(i != this.roundResultCheck.length-1){
                            notCheckStr = notCheckStr + companyName + ',';
                        } else {
                            notCheckStr = notCheckStr + companyName;
                        }

                    }
                }
                //alert(notCheckStr + ' 입찰자가 라운드 결과를 확인하지 않으셨습니다.\n 입찰자에게 확인 요청 드립니다.')
                R2Alert.render({'msg':notCheckStr + ' 입찰자가 라운드 결과를 확인하지 않으셨습니다.\n 입찰자에게 확인 요청 드립니다.','w':500})
                return;
            }

            _.each(this.roundResultCheck,function(item){
                item.state = false;
            })
            this.roundResultCheckFlag = false;

            /**
             * 라운드 입찰 여부 리스트 리셋
             */
            _.each(this.bidCountList,function(item){
                item.state = false;
            })

            this.setRoundTable();

            this.setBiddingState(this.roundNum + ' 라운드가 진행중입니다.');

            this.$el.find('._round_start_btn').attr('disabled','disabled');

            this.$el.find('._acending_btn').attr('disabled','disabled');

            Auction.io.emit('ROUND_START',this.roundNum);
        },
        /**
         * 입찰 결과 핸들러
         */
        onBiddingResult:function(e){
            var loginCheckFlag = _.every(this.loginCheckList,function(item){
                return item.state == true;
            })

            if(!loginCheckFlag){
                R2Alert.render({'msg':'로그인 안된 관리자 또는 입찰자가 있습니다.\n 모두 로그인 후 경매가 가능합니다.','w':400})
                return;
            }
            this.getRoundList();
        },
        /**
         * 밀봉 입찰 시작
         */
        onSealBidStart:function(e){
            //this.$el.find('._acending_btn').addClass('displayNone');
            //this.$el.find('._seal_bid_start_btn').addClass('displayNone');

            this.$el.find('._seal_bid_start_btn').attr('disabled','disabled');
            this.$el.find('._seal_bid_tap').removeClass('displayNone').tab('show');

            // 밀봉입찰 시작 표시
            this.setBiddingState('밀봉입찰 진행 중입니다.')


            Auction.io.emit('SEAL_BID_START','sealBidStart');
        },


        //////////////////////////////////////////////////////////// 이벤트 핸들러 함수들 끝 ////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////// socket on Event start////////////////////////////////////////////////////////////
        /**
        * Enter Key 비활성화
        */
        onkeydown : function(e){
            if (e.keyCode == 13) return false;
        },
        /**
         * 경매 참여자의 접속 체크
         */
        onLoginCheck:function(msg){
            this.loginCheckList = JSON.parse(msg);
            var list = JSON.parse(msg);
            _.each(list,function(item){
                if(item.name == 'sk'){
                    item.name = 'SKT';
                } else if(item.name == 'lg'){
                    item.name = 'LGU+'
                } else {
                    item.name = (item.name).toUpperCase();
                }
                item.className = (item.state) ? 'success' : 'danger';
            })
            this.$el.find('.connect_user_list').empty();
            var template = Handlebars.compile(this.connectUserListTpl);
            this.$el.find('.connect_user_list').html(template({'list':list}));
        },
        /**
         * 입찰을 하고
         */
        onBid:function(msg){
            var roundData = null;
            var bidData = JSON.parse(msg);
            //라운드의 데이터에 입찰자가 입찰한 데이터를 저장하는 함수
            this.insertRoundBid(bidData);
            //라운드에 입찰자가 모드 입찰을 했는지 체크하는 함수
            var flag = this.checkBidCountList(bidData);

            console.log("postRound")

            if(flag === true){
                roundData = _.extend( this.getWinBidder(this.roundData) ,{'name':this.roundNum});
                this.postRound(roundData);
            } else {
                roundData = _.extend(this.roundData,{'name':this.roundNum});
                this.setRoundUI(roundData);
            }
        },
        /**
         * 라운드의 데이터에 입찰자가 입찰한 데이터를 저장하는 함수
         */
        insertRoundBid:function(data){
            var bidData = data;
            for(var i=0; i<this.roundData.frequency.length; ++i){
                for(var j=0; j<this.roundData.frequency[i].bidders.length; ++j){
                    if(this.roundData.frequency[i].bidders[j].name === bidData.name){
                        this.roundData.frequency[i].bidders[j].price = bidData.priceList[i].price;
                        this.roundData.frequency[i].bidders[j].hertzFlag = (bidData.priceList[i].hertzFlag == 'true') ? true : false;
                    }
                }
            }
        },
        /**
         * 라운드에 입찰자가 모드 입찰을 했는지 체크하는 함수
         */
        checkBidCountList:function(data){
            var bidData = data;
            _.each(this.bidCountList,function(item){
                if(item.name === bidData.name){
                    item.state = true;
                }
            })
            return _.every(this.bidCountList,function(item){
                return item.state == true;
            })
        },
        /**
         * 입찰한 통신사에서 승자와 패자 그리고 최고금액을 구하는 함수
         */
        getWinBidder:function(data){

            var frequencyList = data.frequency;

            _.each(frequencyList,Function.prototype.bind.call(function(frequency,index){

                var emptyArr = _.filter(frequency.bidders,function(item){
                    return item.price === '';
                })

                // 주파수에 지원한 통신사가 없을 경우 (모든 값은 ''이다.)
                if(emptyArr.length === 3){
                    frequency.winBidder = '';
                    frequency.winPrice = '';
                    _.each(frequency.bidders,function(item){
                        item.vs = '';
                    })

                // 주파수에 지원한 통신사가 있을 경우
                } else {
                    // 최대 입찰 금액을 구함
                    var tempMaxBidder   = _.max(frequency.bidders, function(item){ return item.price; })
                    var maxPrice        = tempMaxBidder.price;

                    // 주파수 최대 입찰금액 확인
                    frequency.winPrice  = maxPrice;

                    // 최대값인 통신사 리스트
                    var maxBidderArr = _.filter(frequency.bidders,function(bidder){
                        return bidder.price === maxPrice;
                    })

                    // 랜덤으로 최대값 통신사
                    var randomIndex = parseInt(Math.random()*(maxBidderArr.length),10);
                    var maxBidder   = maxBidderArr[randomIndex].name;

                    // 계산한 최대값 통신사 입력
                    frequency.winBidder  = maxBidder;

                    // 계산된 최대값과 최대값 통신사를 비교하면 승자와 패자, 지원 안한자 구분하는 함수
                    _.each(frequency.bidders,function(bidder){
                        // 최대값과 통신사도 같으면 승자
                        if(bidder.name == maxBidder && bidder.price == maxPrice){
                            bidder.vs = 'win';
                        // 최대값은 같지만, 통신사는 다르면 패자
                        } else if(bidder.name != maxBidder && bidder.price == maxPrice){
                            bidder.vs = 'lose';
                        } else if(bidder.name != maxBidder && bidder.price != maxPrice){
                            if(bidder.price === ''){
                                bidder.vs = '';
                            } else {
                                bidder.vs = 'lose';
                            }
                        }
                    })
                }

                // 승자 주파수에 표시를 하기 위한 함수
                _.each(frequency.bidders,function(bidder){
                    var className = '';
                    if(bidder.vs === 'win'){
                        className = 'label label-' + bidder.name + '-l';
                    } else {
                        className = 'text-gray';
                    }
                    bidder.className = className;
                })

            },this));
            return data;
        },
        /**
         * 라운드별 주파수 정보를 저장
         */
        postRound:function(data){
            Model.postRound({
                 url: '/round',
                 method : 'POST',
                 contentType:"application/json; charset=UTF-8",
                 data : JSON.stringify({
                     'round':data
                 }),
                 success : Function.prototype.bind.call(this.postRoundSuccess,this),
                 error : function(jsXHR, textStatus, errorThrown){}
             })
        },

        /**
         * 라운드별 주파수 정보를 저장 성공
         */
        postRoundSuccess:function(data, textStatus, jqXHR){
            if(textStatus === 'success'){
                this.postRoundData = data;

                this.setRoundUI(this.postRoundData);

                //alert(this.roundNum + '라운드 모든 입찰자가 입찰하였습니다.');
                R2Alert.render({
                    'msg':this.roundNum + ' 라운드 모든 입찰자가 입찰하였습니다.',
                    'w':400,
                    'callback':Function.prototype.bind.call(this.emitRoundResult,this)
                });

                this.roundNum += 1;
                this.$el.find('._round_mark strong').text(this.roundNum);
                this.setBiddingState(this.roundNum + ' 라운드가 준비중입니다.');
                this.$el.find('._round_start_btn').removeAttr('disabled');
                this.$el.find('._acending_btn').removeAttr('disabled');

                Auction.io.emit('GET_CHART_DATA', 'getChartData');

                Auction.io.emit('COUNTDOWN_STOP', 'countdown stop');

            }
        },

        /**
         * 모든 입찰자가 입찰 완료 되었다는 것을 알림
         */
        emitRoundResult : function(){
            console.log(this.postRoundData)
            Auction.io.emit('ROUND_RESULT',JSON.stringify(this.postRoundData));
            this.postRoundData = null;
        },

        /**
        * 각 입찰자가 입찰을 하면 입찰가격에 따라 라운드 UI렌더링
        */
        setRoundUI:function(data){
            Handlebars.registerHelper('isHertz', function(options) {
              if(this.hertzFlag == true || this.hertzFlag == undefined){
                  return options.fn(this);
              } else {
                  return options.inverse(this);
              }
            });

            var template = Handlebars.compile(this.roundPriceListTpl);
            this.$el.find('.round_price_list').last().html(template( data ));
        },

        /**
         * 입찰자가 밀봉입찰을 할경우 발생하는 이벤트 핸들러
         */
        onSealBidPrice:function(msg){

            var bidder = JSON.parse(msg);

            _.each(this.sealBidBidderList,function(item){
                if(item.name == bidder.name){
                    item.priceList = _.extend(item.priceList,bidder.priceList);
                }
            })

            //밀봉입찰조합에 필요한 통신사 지원 대역폭 저장
            SealBidCombination.setSealBandWidthList(bidder);

            // true이면 밀봉입찰 조합 시작
            if(this.setSealBidCheck(bidder)) {
                //alert('모든 입찰자가 밀봉입찰 신청을 하였습니다. 밀봉입찰 결과를 출력합니다.');
                R2Alert.render({
                    'msg':'모든 입찰자가 밀봉입찰 신청을 하였습니다.\n밀봉입찰 결과를 출력합니다.',
                    'w':400,
                    'callback':Function.prototype.bind.call(this.setSealBidCombination,this)
                })
                // 오른입찰 완료 표시
                //this.$el.find('._round_mark').text('밀봉입찰 결과');
                this.setBiddingState('모든 입찰자가 밀봉입찰에 참여 하였습니다.');
                //this.$el.find('._seal_bidding_result_alert').removeClass('displayNone');
            }

            // 밀봉입찰액 UI 렌더링
            this.setSealBidPriceUI(this.sealBidBidderList);
        },
        /**
         * 입찰자가 라운드 결과를 확인했는지 체크 하는 함수
         */
        onRoundResultCheck:function(msg){
            console.log(msg)
            _.each(this.roundResultCheck,function(item){
                if(item.name == msg){
                    item.state = true;
                }
            })

            this.roundResultCheckFlag = _.every(this.roundResultCheck,function(item){
                return item.state == true;
            })
        },
        /**
        * 각 입찰자 마다 입찰한 주파수 목록
        */
        onHertzList:function(msg){
            this.getHertzList();
        },

        // onRoundStart:function(msg){
        //     var data = JSON.parse(msg);
        //     this.setCountDownStart(data.countdown_timer);
        // },

        onCountDownStart:function(msg){

            var data = JSON.parse(msg);
            var timer = data.countdown_timer;

            var a = moment(moment.unix(parseInt(timer,10)/1000).format("YYYY-MM-DD HH:mm:ss") )
            var b = moment(new Date());
            var time = a.diff(b) // 86400000

            // 타이머 시작
            this.countDown.setTime(time/1000);
            this.countDown.start();
        },

        onCountDownStop:function(msg){
            this.countDown.stop();
            this.countDown.setTime(parseInt(msg,10)/1000);
        },

        //////////////////////////////////////////////////////////// socket on Event End////////////////////////////////////////////////////////////

        /**
         * 라운드 빈 테이블 생성
         */
        setRoundTable:function(){
            var $roundPriceList = $('<tr class="round_price_list"></tr>');
            this.roundData = JSON.parse( JSON.stringify( _.extend(AuctionData.roundData,{'name':this.roundNum}) ) );

            // Handlebars.registerHelper('isHertz', function(options) {
            //
            //     console.log(this.hertzFlag)
            //
            //   if(this.hertzFlag == true || this.hertzFlag == undefined){
            //       return options.fn(this);
            //   } else {
            //       return options.inverse(this);
            //   }
            // });
            //
            // var template = Handlebars.compile(this.roundPriceListTpl);
            // $roundPriceList.html(template( _.extend(AuctionData.roundData,{'name':this.roundNum}) ));
            this.$el.find('._ascending_bidding_auction tbody').append($roundPriceList);
            this.setRoundUI(this.roundData);
        },
        /**
         * 라운드 진행 표시
         */
        setBiddingState:function(str){
            this.$el.find('._bidding_state strong').html(str);
        },
        /**
         * 전체 라운드 리스트 호출
         */
        getRoundList:function(){
            Model.getRoundList({
                 url: '/round',
                 method : 'GET',
                 contentType:"application/json; charset=UTF-8",
                 success : Function.prototype.bind.call(this.getRoundListSuccess,this),
                 error : function(jsXHR, textStatus, errorThrown){}
             })
        },
        /**
         * 전체 라운드 리스트 호출 성공
         */
        getRoundListSuccess:function(data, textStatus, jqXHR){
            if(textStatus === 'success'){
                BiddingResult.setHertzFlagList(this.hertzList)
                var biddingResultList = BiddingResult.getBiddingResult(data);
                // 오름입찰결과 UI 셋팅
                this.setAscendingBiddingResultUI(biddingResultList);
                // 오름입찰 결과에 따른 밀봉입찰 최소입찰액과 밀봉입찰액 테이블 UI 생성
                this.setSealBidding(biddingResultList);

                this.setBiddingState('오름입찰이 종료 되었습니다. 밀봉입찰을 진행해 주시기 바랍니다.')
            }
        },

        /**
        * 오름입찰결과 UI 셋팅
        */
        setAscendingBiddingResultUI:function(data){
            // 오른입찰 완료 표시
            //this.$el.find('._round_mark').text('오름입찰 완료');
            //this.$el.find('._ascending_bidding_result_alert').removeClass('displayNone');
            // 라운드 시작 버튼 비 활성화
            this.$el.find('._round_start').addClass('displayNone');

            this.$el.find('._acending_btn').attr('disabled','disabeld');

            this.$el.find('._round_mark').addClass('displayNone')

            // 오름입찰 완료 입찰자에게 알림
            Auction.io.emit('ASCENDING_BIDDING_FINISH','acendingBiddingFinish');

            var bidderList = JSON.parse(JSON.stringify(data));

            Handlebars.registerHelper('isHertz', function(options) {
                if(this.hertzFlag == true){
                  return options.fn(this);
                } else {
                  return options.inverse(this);
                }
            });

            var template = Handlebars.compile(this.biddingResultTpl);
            this.$el.find('._ascending_bidding_result tbody').html(template({'bidderList':bidderList}));
            this.$el.find('._ascending_bidding_result').removeClass('displayNone');

        },

        /**
        * 오름입찰 결과에 따른 밀봉입찰 최소입찰액과 밀봉입찰액 테이블 UI 생성
        */
        setSealBidding:function(data){

            var bidderList = JSON.parse(JSON.stringify(data));

            this.setSealLowestBidPrice(bidderList);

            // 밀봉입찰액 테이블 셋팅
            this.setSealBidPrice();
            // 밀봉입찰 시작 버튼 활성화
            this.$el.find('._seal_bid_start_btn').removeAttr('disabled');
        },

        /**
         * 밀봉 입찰 최소액 셋팅
         */
        setSealLowestBidPrice:function(data){
            var bidderList = this.secondCompanyMaxPrice(data)

            Auction.io.emit('SEAL_LOWEST_BID_PRICE',JSON.stringify(bidderList))

            Handlebars.registerHelper('isHertz', function(options) {
                if(this.hertzFlag == true){
                  return options.fn(this);
                } else {
                  return options.inverse(this);
                }
            });

            var template = Handlebars.compile(this.sealLowestBidPriceTpl);
            this.$el.find('.seal_lowest_bid_price tbody').html(template({'bidderList':bidderList}));
        },

        /**
         * 시작가와 최고가 주파수를 비교해서 최고가를 만듬
         */
        secondCompanyMaxPrice:function(data){
            var companyData = JSON.parse( JSON.stringify( data ) );
            for(var i=0; i<companyData.length; ++i){
                for(var j=0; j < companyData[i].priceList.length ;++j){
                    var companyPrice    = companyData[i].priceList[j].price;
                    var startPrice      = parseInt(AuctionData.startPriceList[j].price,10);
                    companyData[i].priceList[j].price = ( companyPrice > startPrice ) ? companyPrice : startPrice;
                }
            }
            return companyData;
        },

        /**
        * 밀봉입찰액 기본 테이블 생성
        */
        setSealBidPrice:function(){
            var bidderList = JSON.parse( JSON.stringify(AuctionData.binderList) );
            this.sealBidBidderList = _.map(bidderList,function(item){
                var defaultPriceList = JSON.parse( JSON.stringify(AuctionData.defaultPriceList) );
                var priceList = _.map(defaultPriceList,function(item){
                    item.price = '';
                    return item
                })
                return _.extend(item,{'priceList':priceList});
            })
            console.log(this.sealBidBidderList);
            this.setSealBidPriceUI(this.sealBidBidderList)
        },

        /**
         * 밀봉입찰액 템플릿 설정
         */
        setSealBidPriceUI:function(data){

            var bidderList = data;

            Handlebars.registerHelper('isHertz', function(options) {
              if(this.hertzFlag == true || this.hertzFlag == undefined){
                  return options.fn(this);
              } else {
                  return options.inverse(this);
              }
            });

            var template = Handlebars.compile(this.sealBidPriceListTpl);
            this.$el.find('._seal_bid_price tbody').html(template({'bidderList':bidderList}));
        },

        /**
         * 입찰자 모두 밀봉 입찰을 했는지 체크
         */
        setSealBidCheck:function(data){
            var bidder = data;
            _.each(this.sealBidCheckList,function(item){
                if(item.name === bidder.name){
                    item.state = true;
                }
            })
            var flag = _.every(this.sealBidCheckList,function(item){
                return item.state === true;
            })
            return flag;
        },

        /**
         * 밀봉입찰 조합 설정
         */
        setSealBidCombination:function(){
            Auction.io.emit('SEAL_BID_FINISH','sealBidFinish')
            var combinationList = SealBidCombination.getCombinationList(this.sealBidBidderList);
            this.setCombinationListUI(combinationList);

            // 조합 1위가 두개이면 재입찰
            if(SealBidCombination.checkOverlap(combinationList)){
                this.$el.find('._tie_seal_bid_btn').removeClass('displayNone');
            } else {
                this.$el.find('._again_seal_bid_btn').removeClass('displayNone');
            }
        },

        /**
         * 밀봉조합 조합 리스트를 화면에 렌더링
         */
        setCombinationListUI:function(data){
            var combinationList = JSON.parse(JSON.stringify(data));

            Handlebars.registerHelper('isHertz', function(options) {
              if(this.hertzFlag == true){
                  return options.fn(this);
              } else {
                  return options.inverse(this);
              }
            });

            var template = Handlebars.compile(this.sealBidCombinationListTpl);
            this.$el.find('._seal_bid_combination tbody').html(template({'combinationList':combinationList}));
        },

        /**
        * 1위가 2개 이상이면 재입찰 하는 함수
        */
        onAgainSealBid:function(){
            _.each(this.sealBidCheckList,function(item){
                item.state = false;
            })
            this.setSealBidPrice();
            this.$el.find('._seal_bid_combination tbody').empty();

            Auction.io.emit('AGAIN_SEAL_BID','againSealBid');

            this.$el.find('._again_seal_bid_btn').addClass('displayNone');

            this.setBiddingState('밀봉입찰을 다시 진행 중입니다.')

        },

        onTieSealBid:function(){
            _.each(this.sealBidCheckList,function(item){
                item.state = false;
            })
            this.setSealBidPrice();
            this.$el.find('._seal_bid_combination tbody').empty();

            Auction.io.emit('AGAIN_SEAL_BID','tieSealBid');

            this.$el.find('._tie_seal_bid_btn').addClass('displayNone');

            this.setBiddingState('1위 동점자 발생으로 재입찰 진행 중입니다.')
        },

        /**
         * 페이지 숨김
         */
        hide : function(){
            // 모든 인터벌 중지
            //this.onClearInterval();
            this.$el.addClass('displayNone');
        },

        /**
         * 페이지 보이기
         */
        show : function(){
            this.$el.removeClass('displayNone');
            $('body').css({'background-color':'#FFFFFF'})
        }












































        /**
         * 경매 생성
         */
        // postAuction:function(){
        //     Model.postAuction({
        //          url: Auction.HOST + '/api/auction',
        //          method : 'POST',
        //          contentType:"application/json; charset=UTF-8",
        //          data : JSON.stringify({
        //              'auctionName':moment().format('YYYY/MM/DD-HH:mm:ss'),
        //              'auctionStat':'ON'
        //          }),
        //          success : Function.prototype.bind.call(this.postAuctionSuccess,this),
        //          error : Function.prototype.bind.call(this.postAuctionError,this)
        //      })
        // },

        /**
         * 경매 생성 성공
         */
        // postAuctionSuccess:function(data, textStatus, jqXHR){
        //     if(textStatus === 'success'){
        //         this.auctionID = data.id;
        //         this.auctionName = data.auctionName;
        //
        //         Auction.io.emit('AUCTION_ID',data.id)
        //
        //         //나중에 지움
        //         //this.$el.find('#auction_id').val(data.id)
        //
        //         //this.intervalAuctionInfo_fn();
        //     } else {
        //         alert('경매 생성에 실패 하였습니다.')
        //     }
        // },
        /**
         * 경매 생성 실패
         */
        // postAuctionError:function(jsXHR, textStatus, errorThrown){
        //     alert('경매 생성에 실패 하였습니다.')
        // },




















































        /**
         * 입찰 결과 UI 렌더링
         */
        // setBiddingResult:function(data){
        //
        //     var companyArr = [
        //         {'name':'KT'},
        //         {'name':'SK'},
        //         {'name':'LG'}
        //     ];
        //
        //     var priceList = _.map(companyArr,Function.prototype.bind.call(function(company){
        //         return _.extend( company,{'priceList':this.setFrequencyList(company,data)} )
        //     },this))
        //
        //     //this.companyPercent(priceList);
        //
        //     console.log(priceList);
        //
        //
        //     var companyData = this.companyPercent(priceList);
        //     var bidderList = this.setResultRanking(companyData);
        //
        //     console.log('== 입찰결과 ==')
        //     console.log(bidderList);
        //     console.table(bidderList);
        //
        //     var template = Handlebars.compile(this.biddingResultTpl);
        //     this.$el.find('._ascending_bidding_result tbody').html(template({'bidderList':bidderList}));
        //     this.$el.find('._ascending_bidding_result').removeClass('displayNone');
        //
        //     return bidderList;
        // },
        // setFrequencyList:function(company, data){
        //
        //     var frequencyList = [[],[],[],[],[]];
        //
        //     for(var i=0;i<data.length;++i){
        //
        //         var frequency = data[i].frequency;
        //
        //         for(var j=0;j<frequency.length;++j){
        //
        //             var bidder = _.filter(frequency[j].bidders,function(item){
        //                 return item.name === company.name;
        //             })
        //
        //             console.log(bidder[0].price);
        //
        //             frequencyList[j][i] = bidder[0].price;
        //         }
        //
        //     }
        //
        //     console.log(frequencyList)
        //
        //     var priceList = this.companyMaxPrice(frequencyList);
        //
        //
        //
        //     console.log(priceList)
        //
        //     return priceList;
        // },

        /**
         * 주파수 별로 되어 있는 데이터를 통신사별로 변경하는 함수
         */
        // companyMaxPrice : function(data){
        //
        //     var priceArr = ['priceA','priceB','priceC','priceD','priceE']
        //
        //     var priceList = _.map(data,function(item,index){
        //         console.log(item)
        //         return {'name':priceArr[index], 'price':_.max(item)}
        //     })
        //
        //     console.log(priceList)
        //
        //     return priceList;
        //     // var priceArr = ['priceA','priceB','priceC','priceD','priceE']
        //     // var priceList = []
        //     // for(var i=0; i<priceArr.length; ++i){
        //     //     var arr = _.pluck(data, priceArr[i])
        //     //     priceList.push( {'name':priceArr[i], 'price':_.max(arr)} )
        //     // }
        //     // return priceList;
        // },

        /**
         * 시작가에서 입찰 결과까지의 퍼센트 추가 함수
         */
        // companyPercent:function(data){
        //
        //     console.log(data)
        //
        //     var companyData = JSON.parse( JSON.stringify( data ) );
        //     for(var i=0; i<companyData.length; ++i){
        //         for(var j=0; j < companyData[i].priceList.length ;++j){
        //             var companyPrice    = companyData[i].priceList[j].price;
        //             var startPrice      = parseInt(AuctionData.startPriceList[j].price,10)
        //             companyData[i].priceList[j].percent = Math.ceil( (companyPrice/startPrice - 1) * 100 );
        //         }
        //     }
        //
        //     return companyData;
        // },

        /**
         * 오름경매 결과에 순위를 만드는 함수
         */
        // setResultRanking:function(data){
        //
        //     //this.setReversePriceList(data);
        //
        //     var companyData = JSON.parse( JSON.stringify( data ) );
        //
        //     var sortPriceList, reversePriceList = null;
        //
        //     for(var i=0; i<companyData.length; ++i){
        //         sortPriceList = _.sortBy(companyData[i].priceList, 'percent');
        //
        //         reversePriceList = this.setReversePriceList( sortPriceList );
        //
        //         //console.log('== 입찰결과순위별 ==')
        //         //console.table(reversePriceList)
        //
        //         for(var j=0; j<companyData[i].priceList.length; ++j){
        //
        //             for(var k=0; k<reversePriceList.length; ++k){
        //
        //                 if(companyData[i].priceList[j].percent === reversePriceList[k].percent){
        //                     companyData[i].priceList[j].ranking = reversePriceList[k].ranking;
        //                     companyData[i].priceList[j].labelClass = reversePriceList[k].labelClass;
        //                 }
        //             }
        //
        //         }
        //     }
        //
        //     console.log(companyData);
        //
        //     return companyData
        //
        // },

        // setReversePriceList:function(data){
        //
        //     var reversePriceList = JSON.parse( JSON.stringify( data.reverse() ) );
        //
        //     var ranking = 1;
        //
        //     var percent = null;
        //
        //     for (var i=0; i<reversePriceList.length; ++i){
        //
        //         if(percent == null){
        //             percent = reversePriceList[i].percent;
        //             reversePriceList[i].labelClass = 'danger'
        //             reversePriceList[i].ranking= ranking;
        //         } else {
        //             if(percent == reversePriceList[i].percent){
        //                 reversePriceList[i].ranking = ranking
        //             } else {
        //                 percent = reversePriceList[i].percent;
        //                 reversePriceList[i].ranking = ranking = ranking + 1;
        //             }
        //             reversePriceList[i].labelClass = 'default'
        //         }
        //     }
        //
        //     return reversePriceList;
        //
        // },






























        // /**
        //  * 경매 시작 이벤트 핸들러
        //  */
        // onAuctionStart:function(e){
        //
        //     // var check = _.every(this.loginCheckList,function(item){
        //     //     return item.state === true;
        //     // })
        //     //
        //     // if(!check){
        //     //     alert(' 모든 경매 참가자가 참여하지 않았습니다.');
        //     //     return;
        //     // }
        //
        //     //this.$el.find(".round_price_list_tpl").remove();
        //
        //     this.postAuction();
        // },
































        /**
         * 모의경매의 낙찰이 되면 경매를 끝낸다.
         */
        // onAuctionEnd:function(){
        //     this.putAuction();
        // },

        /**
         * 경매 생성
         */
        // putAuction:function(){
        //     Model.putAuction({
        //          url: Auction.HOST + '/api/auction',
        //          method : 'PUT',
        //          contentType:"application/json; charset=UTF-8",
        //          data : JSON.stringify({
        //              'id':this.auctionID,
        //              'auctionName':this.auctionName,
        //              'auctionStat':'OFF'
        //          }),
        //          success : Function.prototype.bind.call(this.putAuctionSuccess,this),
        //          error : Function.prototype.bind.call(this.putAuctionError,this)
        //      })
        // },
        //
        // /**
        //  * 경매 생성 성공
        //  */
        // putAuctionSuccess:function(data, textStatus, jqXHR){
        //     if(textStatus === 'success'){
        //         alert('모의경매를 끝내기를 완료 하였습니다..')
        //     } else {
        //         alert('모의경매를 끝내기를 실패 하였습니다.')
        //     }
        // },
        //
        // /**
        //  * 경매 생성 실패
        //  */
        // putAuctionError:function(jsXHR, textStatus, errorThrown){
        //     alert('모의경매를 끝내기를 실패 하였습니다.')
        // },
        //
        // /**
        //  * 옥션 경매 정보를 호출 인터벌 함수
        //  */
        // intervalAuctionInfo_fn:function(){
        //     Auction.interval.set(
        //         'auctionInfo',
        //         Function.prototype.bind.call(this.getAuctionInfo,this)
        //     )
        // },
        //
        // /**
        //  * 옥션 경매 정보 호출 함수
        //  */
        // getAuctionInfo:function(){
        //     Model.getAuctionInfo({
        //          url: Auction.HOST + '/api/auctioninfo/' + this.auctionID,
        //          method : 'GET',
        //          contentType:"application/json; charset=UTF-8",
        //          success : Function.prototype.bind.call(this.getAuctionInfoSuccess,this),
        //          error : Function.prototype.bind.call(this.getAuctionInfoError,this)
        //      })
        // },
        //
        // /**
        //  * 경매 정보 호출 완료
        //  */
        // getAuctionInfoSuccess:function(data, textStatus, jqXHR){
        //     if(textStatus === 'success'){
        //         //this.secondFormat(data);
        //         this.setRoundList(data);
        //     } else {
        //         alert('경매 정보 호출에 실패하였습니다.')
        //     }
        // },

        /**
         * 경매 정보 호출 실패
         */
        // getAuctionInfoError:function(jsXHR, textStatus, errorThrown){
        //     alert('경매 정보 호출에 실패하였습니다.')
        // },
        //
        // /**
        //  * 경매정보를 UI에 랜더링 하는 함수
        //  */
        // setRoundList:function(data){
        //
        //     this.roundNum = Math.ceil(data.length/3);
        //
        //     this.originCompanyList = JSON.parse( JSON.stringify( data ) );;
        //
        //     var roundList = this.changeDataFormat(data);
        //
        //     this.$el.find('.round_price_list').remove();
        //     var template = Handlebars.compile(this.roundPriceListTpl);
        //     this.$el.find('.start_price_list').after(template({'roundList':roundList}));
        //
        // },
        //
        // /**
        //  * 서버에서 넘어온 경매 데이터를 프런트에 맞게 변경하는 함수
        //  */
        // changeDataFormat:function(data){
        //
        //     var firstData   = this.setFirstData(data);
        //     var secondData  = this.setSecondData(firstData);
        //
        //     return secondData;
        // },
        //
        // /**
        //  * 서버에서 받은 데이터를 첫번째로 그룹화를 하는 함수
        //  */
        // setFirstData : function(data){
        //
        //     var roundTotal = Math.ceil(data.length/3);
        //     var roundList = [];
        //
        //     for(var i=0; i<roundTotal ; ++i){
        //         roundList.push({
        //             'round' : i + 1,
        //             'companys' : _.filter(data, function(round){
        //                 return (round.roundNum === (i+1))
        //             })
        //         })
        //     }
        //
        //     return roundList;
        // },
        //
        // /**
        //  * 그룹화를 한 데이터를 템플릿에 맞게 변경
        //  */
        // setSecondData : function(data){
        //
        //     var roundList = [];
        //
        //     for(var i=0; i<data.length ; ++i){
        //         roundList.push({
        //             'round' : i + 1,
        //             'frequency' : this.setFrequencyData(data[i].companys)
        //         })
        //     }
        //
        //     console.log(roundList)
        //
        //     return roundList;
        // },
        //
        // /**
        //  * 그룹화된 데이터를 주파수 별로 구분하는 것으로 구조 변경
        //  */
        // setFrequencyData : function(data){
        //
        //     var frequencyList = [];
        //     var bidderArr = ['KT', 'SK', 'LG']
        //     var priceArr = ['priceA','priceB','priceC','priceD','priceE']
        //     var frequencyFormat = JSON.parse( JSON.stringify( AuctionData.frequency ) );
        //
        //     for(var i=0; i<priceArr.length; ++i){
        //
        //         var bidders =[];
        //
        //         for(var j=0; j<bidderArr.length; ++j){
        //             var companyArr = _.filter(data,function(company){
        //                 return company.companyName === bidderArr[j];
        //             })
        //
        //             if(companyArr.length === 1){
        //                 bidders.push({
        //                     'name' : bidderArr[j],
        //                     'price' : companyArr[0][priceArr[i]]
        //                 })
        //             } else {
        //                 bidders.push({
        //                     'name' : bidderArr[j],
        //                     'price' : 0
        //                 })
        //             }
        //         }
        //
        //         frequencyFormat[i].bidders = bidders;
        //         // var winPrice = ( _.max(bidders, function(bidder){ return bidder.price; }) ).price;
        //         //
        //         // var winArr = _.filter(bidders,function(bidder){
        //         //     return winPrice === bidder.price
        //         // })
        //         //
        //         // var win = null;
        //         //
        //         // if(winArr.length > 1){
        //         //     win = winArr[ parseInt(Math.random()*(winArr.length),10) ]
        //         // } else {
        //         //     win = winArr[0];
        //         // }
        //         // var winName = win.name;
        //         //
        //         //
        //         // frequencyFormat[i].bidders = _.map(bidders,function(bidder){
        //         //
        //         //     var className = '';
        //         //
        //         //     if(bidder.price === winPrice && bidder.name === winName){
        //         //         className = 'label label-' + bidder.name + '-l';
        //         //     } else {
        //         //         className = 'text-gray';
        //         //     }
        //         //
        //         //     return _.extend(bidder,{'className':className})
        //         // })
        //
        //     }
        //
        //     return frequencyFormat;
        //
        // },









 	}))

})
