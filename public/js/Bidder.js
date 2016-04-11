define([
   'module',
   'text!tpl/bidder.html',
   'text!tpl/bidderRoundResult.html',
   'js/AuctionData',
   'js/Validation',
   'js/Model',
   'js/BidValidation',
   'js/RoundRateIncrease',
   'js/r2/r2Alert'
   ],
   function(module, Bidder, RoundResult, AuctionData, Validation, Model, BidValidation, RoundRateIncrease, R2Alert){

	'use strict'

 	module.exports = new (Backbone.View.extend({
        roundNum : 1,
        //입찰자 통신사
        bidder_company: '',
        //최소입찰증분 (단위는 퍼센트)
        lowestBidAdd : 4,
        //최소입찰가격 배열
        lowestBidPrices : null,
        //시작가 배열
        startPriceList : null,
        //시작가(최저입찰가격) 리스트 템플릿
        auctionStartPriceTpl : null,
        //최소입찰가격 리스트 템플릿
        lowestBidPricesTpl : null,
        //승자패자 템플릿
        bidVsTpl : null,
        //통신사마다 가능한 대역폭 상한서
        ableBandWidth : 0,
        //밀봉최소입찰액리스트
        sealLowestBidPriceList : null,
        //오른입찰신청 타입
        ascendingBiddingType : '',
        //입찰유예횟수체크
        biddingDelayCount : 0,
        //입찰유예 신청 했는짖 체크
        biddingDelayFlag : false,
        //자동입찰 체크
        autoBiddingFlag : false,
        //입찰수 주파수 리스트
        hertzList : null,


        //라운드 리스트 탬플릿
        //roundListPrices : null,
        //roundListPricesTpl : null,
        //intervalAuctionList : null,
        // 경매 원본 정보
        //originCompanyList : null,

 		el: '.bidder',
 		events :{
            'keydown' : 'onkeydown',
            // 로그아웃 이벤트
            'click ._logout_btn' : 'onLogout',
            // 입찰 이벤트
            'click ._bid_btn' : 'onBid',
            // 입찰 스킵 이벤트
            'click ._bid_skip_btn' : 'onSkipBid',
            // 입찰안함 이벤트
            'click ._not_bid_btn' : 'onNotBid',
            // 유예버튼 이벤트
            'click ._bid_delay_btn' : 'onDelayBid',
            // 포기버튼 이벤트
            'click ._giveup_bid_btn' : 'onGiveupBid',
            // 밀봉입찰 예상 증분율 확인 하는 이벤트
            'click ._seal_predict_percent_btn' : 'onSealPredictPercent',
            //밀봉입찰 버튼 클릭 이벤트
            'click ._seal_bid_price_btn' : 'onSealBidPrice'
 		},
 		initialize:function(){
		},
        render:function(){
            this.$el.html(Bidder);
            this.setTpl();
            this.setBidderCompany();
            this.setBidderLogo();
            this.setBidStrategy();
            this.setLimitBandWidth();
            this.setLowestBidAdd();
            this.setHertz();
            this.setSocketReceiveEvent();
            this.setStartPriceList();
            this.setInsertHertzUI();

            Auction.io.emit('LOGIN_CHECK',Auction.session.get('user_info').user);
            VMasker(document.querySelectorAll('._seal_bid_ranking')).maskNumber();

            this.$el.find('._seal_bid_tap').addClass('displayNone');
            //입찰 관련 버튼 모두 숨김
            this.biddingBtnListDisplay(false);
        },

        //////////////////////////////////////////////////////////// 랜더링시 시작하는 함수 시작 ////////////////////////////////////////////////////////////
        /**
         * 사용하는 템플릿 설정
         */
        setTpl : function(){
            // 시작가 템플릿
            this.startPriceListTpl          = this.$el.find(".start_price_list_tpl").html();
            // 최소입찰가격 템플릿
            this.lowestBidPricesTpl         = this.$el.find(".lowest_bid_prices_tpl").html();
            //밀봉최소입찰가격 템플릿
            this.sealLowestBidPriceTpl      = this.$el.find("._seal_lowest_bid_price_tpl").html();
            //승자패자 템플릿
            this.bidVsTpl                   = this.$el.find("._bid_vs_tpl").html();
            this.$el.find("._bid_vs_tpl").remove();

            // 밀봉 최대 입찰액 템플릿
            this.sealMaxBiddingPriceListTpl = this.$el.find("._seal_max_bid_price_list_tpl").html();

            // 입찰자 현 증분율 템플릿
            this.bidRateIncreaseTpl         = this.$el.find("._bid_rate_increase_tpl").html();
            this.$el.find("._bid_rate_increase_tpl").remove();

            this.roundResultTpl             = RoundResult
            this.sealBidPercentListTpl      = this.$el.find("._seal_bid_percent_list_tpl").html();
            //접속자 유저 템플릿
            this.connectUserListTpl         = this.$el.find(".connect_user_list_tpl").html();
            //this.roundPriceListTpl          = this.$el.find(".round_price_list_tpl").html();
        },
        /**
         * 입찰 회사 설정
         */
        setBidderCompany:function(){
            var userInfo = Auction.session.get('user_info');
            this.bidder_company = (userInfo.user).toUpperCase();
        },
        /**
         * 입찰 회사 로고 설정
         */
        setBidderLogo:function(){
            var userInfo = Auction.session.get('user_info');
            this.$el.find('._bidder_info .bidder_logo').attr('src','img/' + userInfo.user + '_logo.jpg')
        },
        /**
         * 입찰 회사 입찰 전략 설정
         */
        setBidStrategy : function(){
            var userInfo = Auction.session.get('user_info');
            var strategy = (userInfo.strategy === '') ? '입력한 입찰전략이 없습니다.' : userInfo.strategy;
            this.$el.find('._bidder_info .bid_strategy').val(strategy)
        },
        /**
         * 입찰 회사 제한 대역폭 설정
         */
        setLimitBandWidth : function(){
            var userInfo = Auction.session.get('user_info');
            this.ableBandWidth = userInfo.bandWidth;
            this.$el.find('._able_bandWidth').text('남은내역폭 : ' + userInfo.bandWidth + 'Hz');
            this.$el.find('._limit_bandWidth').text(' / 신청대역폭 : ' + userInfo.bandWidth + 'Hz');
        },

        /**
         * 증분율 설정
         */
        setLowestBidAdd : function(){
            var userInfo = Auction.session.get('user_info');
            this.lowestBidAdd = userInfo.rate;
            this.$el.find('._bid_rate').text('증분율 : ' + this.lowestBidAdd + '%');
        },

        /**
         * 입찰수 주파수 리스트 저장
         */
        setHertz : function(){
            var userInfo = Auction.session.get('user_info');
            this.hertzList = userInfo.hertzList;
            Auction.io.emit('HERTZ_LIST',JSON.stringify({'name':this.bidder_company,'hertzList':this.hertzList}))
        },

        /**
         * socket.io 서버에서 보내주는 이벤트를 받는 리시브 설정
         */
        setSocketReceiveEvent:function(){
            Auction.io.on('LOGIN_CHECK', Function.prototype.bind.call(this.onLoginCheck,this) );
            Auction.io.on('ROUND_START', Function.prototype.bind.call(this.onRoundStart,this) );
            Auction.io.on('ROUND_RESULT', Function.prototype.bind.call(this.onRoundResult,this) );
            Auction.io.on('ASCENDING_BIDDING_FINISH', Function.prototype.bind.call(this.onAscendingBiddingFinish,this) );
            Auction.io.on('SEAL_LOWEST_BID_PRICE', Function.prototype.bind.call(this.onSealLowestBidPrice,this) );
            Auction.io.on('SEAL_BID_START', Function.prototype.bind.call(this.onSealBidStart,this) );
            Auction.io.on('SEAL_BID_FINISH', Function.prototype.bind.call(this.onSealBidFinish,this) );
            Auction.io.on('AGAIN_SEAL_BID', Function.prototype.bind.call(this.onAgainSealBid,this) );
        },

        /**
         * 시작가 설정
         */
        setStartPriceList:function(){
            var priceList = JSON.parse( JSON.stringify( AuctionData.startPriceList ) );
            this.startPriceList     = JSON.parse( JSON.stringify( priceList ) );
            this.lowestBidPrices    = JSON.parse( JSON.stringify( priceList ) );
            this.setStartPriceListUI(priceList);
            this.setLowestBidPriceUI(priceList);
        },

        /**
         * 입찰한 주파수만 입력 필드를 활성화 시키는 함수
         */
        setInsertHertzUI:function(){
            console.log(this.hertzList);
            _.each( this.$el.find('._bid_price') ,Function.prototype.bind.call( function(element, index){
                if(this.hertzList[index].hertzFlag){
                    $(element).attr('hertz_flag',true).prop('disabled',false);
                } else {
                    $(element).attr({'hertz_flag':false,'placeholder':'미신청주파수'}).prop('disabled',true);
                }
            },this))
        },
        //////////////////////////////////////////////////////////// 랜더링시 시작하는 함수 끝 ////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////// 이벤트 핸들러 함수들 시작 ////////////////////////////////////////////////////////////
        /**
        * Enter Key 비활성화
        */
        onkeydown : function(e){
            if (e.keyCode == 13) return false;
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
         * 입찰버튼 클릭이벤트 핸들러
         */
        onBid:function(){

            //this.ascendingBiddingType = '';

            var bidPriceElementList = this.$el.find('._bid_price');

            //입찰 값 유효성 체크
            if(!this.autoBiddingFlag){
                if(!this.bidValidation(bidPriceElementList)) {
                    //유효성 체크 시 false이면 입차 유예 카운트는 증가 하지 않음
                    this.biddingDelayFlag = false;
                    return;
                }
            }

            //입찰유예일 경우 체크
            if(this.biddingDelayFlag){
                this.biddingDelayCount += 1;
                var countStr = '유예입찰가능횟수 : ' + (2-this.biddingDelayCount).toString();
                this.$el.find('._bid_delay_count').text(countStr);
                this.biddingDelayFlag = false;
            }

            //입찰금액을 관리자 화면에 보내는 함수
            this.sendBid(bidPriceElementList);
            //입찰 관련 버튼 모두 숨김
            this.biddingBtnListDisplay(false);

            if(this.autoBiddingFlag) {
                //alert('원하는 대역폴이 만족하여 자동입찰이 진행되었습니다.');
                //R2Alert.render({'msg':'원하는 대역폴이 만족하여 자동입찰이 진행되었습니다.','w':300})
                this.autoBiddingFlag = false;
            } else {
                //alert(this.roundNum + '라운드 입찰' + this.ascendingBiddingType + '신청이 되었습니다.');
                R2Alert.render({'msg':this.roundNum + '라운드 입찰' + this.ascendingBiddingType + '신청이 되었습니다.','w':350})
            }
            this.$el.find('._round_mark').text(this.roundNum + '라운드 입찰이 진행중입니다. 잠시만 기다려 주시기 바랍니다.');
        },

        /**
         * 스킵버튼 클릭이벤트 핸들러
         */
        onSkipBid:function(){
            this.ascendingBiddingType = '안함';
            this.resetBidPrice();
            this.onBid();
        },
        /**
         * 입찰않음 클릭이벤트 핸들러
         */
        onNotBid:function(e){
        },
        /**
         * 유예신청 클릭이벤트 핸들러
         */
        onDelayBid:function(){
            this.ascendingBiddingType = '유예';
            this.biddingDelayFlag = true;
            this.resetBidPrice();
            this.onBid();
        },
        /**
         * 포기 클릭이벤트 핸들러
         */
        onGiveupBid:function(){
        },
        /**
         * 예상증분률을 표시하는 함수
         */
        onSealPredictPercent:function(e){
            // 밀봉입찹순위 체크
            if(!this.validationSealBidRanking()) return;
            // 입력한 밀봉 입찰 금액 리스트
            var insertPriceList = this.getInsertSealBidPrice();
            // 밀봉최소입찰액과 밀봉입찰액의 입력체크
            if(!this.validationSealBidPrice(insertPriceList)) return;
            // 밀봉최소입찰금액에서 밀봉입찰금액 증액 퍼센트 구하는 함수
            var percentList = this.getSealBidPercent(insertPriceList);
            console.log(percentList)
            // 계산한 퍼센트를 순위별 랭킹으로 오른차순 정열
            var sortPercentList = this.sortSealBidPercent(percentList);

            // 1순위에 따른 최대 가능한 순위별 가능한 밀봉찰액 설정(최대입찰액설정)
            var sealMaxBiddingPrice = this.setSealMaxBiddingPrice(percentList);
            //console.dir(sealMaxBiddingPrice)
            this.setSealMaxBiddingPriceUI(sealMaxBiddingPrice);

            // 입찰한 급액의 증분율 표시
            this.setSealBidPercentUI(percentList);

            if(this.checkSealBidPercent(sortPercentList)) {
                this.$el.find('._seal_bid_role').removeClass('displayNone')
            } else {
                this.$el.find('._seal_bid_role').addClass('displayNone')
            }
        },

        /**
         * 밀봉입찰버튼 클릭 이벤트 핸들러
         */
        onSealBidPrice:function(e){
            var priceArr = ['priceA','priceB','priceC','priceD','priceE'];
            var defaultPriceList = JSON.parse(JSON.stringify(AuctionData.defaultPriceList));

            // 밀봉입찰순위 체크
            if(!this.validationSealBidRanking()) return;
            // 입력한 밀봉 입찰 금액 리스트
            var insertPriceList = this.getInsertSealBidPrice();
            // 밀봉최소입찰액과 밀봉입찰액의 입력체크
            if(!this.validationSealBidPrice(insertPriceList)) return;
            // 밀봉최소입찰금액에서 밀봉입찰금액 증액 퍼센트 구하는 함수
            var percentList = this.getSealBidPercent(insertPriceList);
            // 계산한 퍼센트를 순위별 랭킹으로 오른차순 정열
            var sortPercentList = this.sortSealBidPercent(percentList);

            // 1순위에 따른 최대 가능한 순위별 가능한 밀봉찰액 설정(최대입찰액설정)
            var sealMaxBiddingPrice = this.setSealMaxBiddingPrice(percentList);
            //console.dir(sealMaxBiddingPrice)
            this.setSealMaxBiddingPriceUI(sealMaxBiddingPrice);
            
            // 입찰한 급액의 증분율 표시
            this.setSealBidPercentUI(percentList)
            // 금액 순위별 퍼센트 룰을 잘 준수 했는데 체크 하는 함수
            if(!this.checkSealBidPercent(sortPercentList)) return;

            var priceList = _.map(percentList,Function.prototype.bind.call(function(item ,index){
                var frequency = {'name':priceArr[index],'price':item.price, 'company':this.bidder_company, 'hertzFlag':item.hertzFlag}
                return _.extend(defaultPriceList[index],frequency);
            },this));

            var bidderList = {'name':this.bidder_company,'ableBandWidth':this.ableBandWidth,'priceList':priceList};

            Auction.io.emit('SEAL_BID_PRICE', JSON.stringify(bidderList));

            //예상증분율 버튼 숨기기
            this.$el.find('._seal_predict_percent_btn').addClass('displayNone');
            //밀봉입찰 버튼 숨기기
            this.$el.find('._seal_bid_price_btn').addClass('displayNone');

            //alert('밀봉입찰 신청을 완료 했습니다.');
            R2Alert.render({'msg':'밀봉입찰 신청을 완료 했습니다.','w':300})
        },
        //////////////////////////////////////////////////////////// 이벤트 핸들러 함수들 끝 ////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////// socket on Event start////////////////////////////////////////////////////////////
        /**
         * 경매 참여자의 접속 체크
         */
        onLoginCheck:function(msg){
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
         * 라우드 시작을 알려주는 핸들러
         */
        onRoundStart:function(num){
            console.log('ROUND_NUMBER : ' + num)
            this.roundNum = num;
            //alert(this.roundNum + '라운드 입찰 진행 하시기 바랍니다.');
            this.$el.find('._round_mark').text(this.roundNum + '라운드 입찰 진행 하시기 바랍니다.');
            //입찰 관련 버튼 모두 보임
            this.biddingBtnListDisplay(true);
            // 자동입찰 체크
            console.log('this.autoBiddingFlag : ' + this.autoBiddingFlag);
            if(this.autoBiddingFlag){
                R2Alert.allDestroy();
                R2Alert.render({'msg':this.roundNum + '라운드는 지원가능한 대역폭 없습니다. \n 자동입찰이 진행되었습니다.','w':400})
                this.setAutoBidding();
            } else {
                R2Alert.allDestroy();
                R2Alert.render({'msg':this.roundNum + '라운드 입찰 진행 하시기 바랍니다.','w':300})
            }
        },
        /**
         * 라운드가 끝나면 알려주는 핸들러
         */
        onRoundResult:function(msg){
            //오름입찰타입 리셋
            this.ascendingBiddingType = '';
            var data = JSON.parse(msg);
            console.log(data);
            //최소입찰액을 설정
            this.setRoundResult(data);
            //라운드 승자의 가격만 표시
            this.setRoundWinPrice(data);
            this.$el.find('._round_mark').text(this.roundNum + '라운드 입찰이 완료되었습니다. 다음 라운드 준비중입니다.');

            //alert(this.roundNum + '라운드 입찰이 완료되었습니다.');
            R2Alert.allDestroy();
            R2Alert.render({
                'msg':this.roundNum + '라운드 입찰이 완료되었습니다.',
                'w':300,
                'callback':Function.prototype.bind.call(this.emitRoundResultCheck,this)
            })
        },
        /**
        * 결과 확인을 알려줌
        */
        emitRoundResultCheck:function(){
            Auction.io.emit('ROUND_RESULT_CHECK',this.bidder_company);
        },
        /**
         * 오름입찰완료 알림 이벤트
         */
        onAscendingBiddingFinish:function(msg){
            //alert('오름입찰이 종료되었습니다.');
            R2Alert.allDestroy();
            R2Alert.render({'msg':'오름입찰이 종료되었습니다.','w':300})
            this.$el.find('._round_mark').text('오름입찰이 종료되었습니다. 밀봉입찰 준비중입니다.');
        },
        /**
         * 밀봉입찰 시작 알림
         */
        onSealBidStart:function(msg){
            this.$el.find('._seal_bid_tap').removeClass('displayNone').tab('show');
            //alert('밀봉입찰이 시작');
            R2Alert.allDestroy();
            R2Alert.render({'msg':'밀봉입찰을 시작하시기 바랍니다.','w':300})
            this.$el.find('._round_mark').text('밀봉입찰이 진행중입니다.');
        },
        /**
         * 밀봉 최소 입찰액 설정
         */
        onSealLowestBidPrice:function(msg){
            var data = JSON.parse(msg);

            // 각 주파수 통신사 구분없이 최고가를 구함
            //var maxPriceData = JSON.parse(JSON.stringify(this.getFrequencyMaxPrice(data)));

            var bidderList = _.filter(data,Function.prototype.bind.call(function(item){
                return item.name === this.bidder_company;
            },this))
            var bidder = bidderList[0];
            this.sealLowestBidPriceList = JSON.parse(JSON.stringify(bidder));

            this.setSealLowestBidPriceUI(bidder);
            console.log(bidder)
            this.setInsertRankingPrice(bidder);
        },
        /**
         * 밀봉입찰조합완료 알림이벤트
         */
        onSealBidFinish:function(msg){
            console.log(msg)
            //alert('밀봉입찰이 완료 되었습니다.\n입찰자은 관리자에게 결과를 확인하시기 바랍니다.');
            R2Alert.allDestroy();
            R2Alert.render({'msg':'밀봉입찰이 완료 되었습니다.\n입찰자는 관리자에게 결과를 확인하시기 바랍니다.','w':400})
        },

        onAgainSealBid:function(msg){
            R2Alert.allDestroy();
            R2Alert.render({'msg':'재입찰을 진행 하시기 바랍니다.','w':300});

            //예상증분율 버튼 숨기기
            this.$el.find('._seal_predict_percent_btn').removeClass('displayNone');
            //밀봉입찰 버튼 숨기기
            this.$el.find('._seal_bid_price_btn').removeClass('displayNone');
        },
        //////////////////////////////////////////////////////////// socket on Event End////////////////////////////////////////////////////////////

        /**
        * 밀봉 최대입찰 가능 액 설정
        */
        setSealMaxBiddingPrice:function(data){

            var priceList = JSON.parse(JSON.stringify(data));
            var sortPercentList = JSON.parse(JSON.stringify( _.sortBy(priceList,'ranking') ));

            var maxPrice = null;
            var percent = null;

            var maxPriceList = [];

            for(var i=0; i<sortPercentList.length; ++i){
                if(sortPercentList[i].ranking == 1){
                    percent = sortPercentList[i].percent;
                    maxPriceList.push({'ranking':sortPercentList[i].ranking,'maxPrice':'무제한'})
                } else {
                    maxPrice = Math.ceil( parseInt(sortPercentList[i].prePrice,10) * (1+(percent/100)) );
                    maxPriceList.push({'ranking':sortPercentList[i].ranking,'maxPrice':maxPrice});
                    percent = sortPercentList[i].percent;
                }
            }

            for(var j=0; j<maxPriceList.length; ++j){
                for(var k=0;k<priceList.length; ++k){
                    if(maxPriceList[j].ranking == priceList[k].ranking){
                        priceList[k].maxPrice = maxPriceList[j].maxPrice;
                    }
                }
            }

            console.log(priceList)
            console.log(sortPercentList);
            console.log(maxPriceList);

            return priceList;
        },
        setSealMaxBiddingPriceUI:function(data){
            var maxPriceList = JSON.parse(JSON.stringify(data));

            console.log(maxPriceList);

            Handlebars.registerHelper('isHertz', function(options) {
                if(this.hertzFlag == true){
                  return options.fn(this);
                } else {
                  return options.inverse(this);
                }
            });

            var template = Handlebars.compile(this.sealMaxBiddingPriceListTpl);
            this.$el.find('._seal_max_bid_price_list').html(template({'maxPriceList':maxPriceList}));
        },

        /**
         * 밀봉 입찰 최소액 셋팅
         */
        setSealLowestBidPriceUI:function(data){
            var bidder = JSON.parse(JSON.stringify(data));
            Handlebars.registerHelper('isHertz', function(options) {
                if(this.hertzFlag == true){
                  return options.fn(this);
                } else {
                  return options.inverse(this);
                }
            });

            var template = Handlebars.compile(this.sealLowestBidPriceTpl);
            this.$el.find('._seal_lowest_bid_price').html(template(bidder));
        },
        /**
        * 미신청주파수를 밀봉입찰 하는 UI에 적용해 주는 함수
        */
        setInsertRankingPrice:function(data){
            var bidder = JSON.parse(JSON.stringify(data));
            _.each(bidder.priceList,Function.prototype.bind.call(function(item, index){

                var rankingEl   = $(this.$el.find('._seal_bid_ranking')[index])
                var priceEl     = $(this.$el.find('._seal_bid_price')[index])

                if(bidder.priceList[index].hertzFlag == true){
                    rankingEl.attr({'hertz_flag':true})
                    priceEl.attr({'hertz_flag':true})
                } else {
                    rankingEl.prop('disabled',true).attr({'placeholder':'미신청주파수','hertz_flag':false})
                    priceEl.prop('disabled',true).attr({'placeholder':'미신청주파수','hertz_flag':false})
                }

            },this));
        },

        /**
         * 각 입찰자의 순위는 다르지만 밀봉입찰최소액은 마지막 라운드 최대값으로 동일하게 하는 함수
         */
        getFrequencyMaxPrice:function(data){

            var bidderList = JSON.parse(JSON.stringify(data));
            var frequencyList = [[],[],[],[],[]];

            console.log(bidderList)

            for(var i=0; i<bidderList.length; ++i){
                for(var j=0; j<bidderList[i].priceList.length; ++j){
                    frequencyList[j][i] = (bidderList[i].priceList[j].price == '') ? 0 : parseInt(bidderList[i].priceList[j].price,10)
                }
            }

            console.log(frequencyList)

            var maxList = _.map(frequencyList,function(item){
                return _.max(item);
            })

            console.log(maxList)

            _.each(bidderList,function(bidder){
                _.each(bidder.priceList,function(priceList,index){
                    console.log('(maxList[index])' + (maxList[index]))
                    priceList.price = (maxList[index]).toString();
                })
            })

            console.log(bidderList);

            return bidderList;
        },

        /**
         * 시작가 UI 설정
         **/
        setStartPriceListUI:function(data){
            var priceList = data;
            var template = Handlebars.compile(this.startPriceListTpl);
            this.$el.find('.start_price_list').append(template({'priceList':priceList}));
        },
        /**
         * 최소 입찰액 UI 설정
         */
        setLowestBidPriceUI : function(data){
            var template = Handlebars.compile(this.lowestBidPricesTpl);
            this.$el.find('.lowest_bid_prices').empty().html(template({'priceList':data}));
        },

        /**
          * 입찰금액 유효성 검사
          */
        bidValidation : function(elements){
            // 가능 주파수 대역폭 설정
            BidValidation.setAbleBandWidth(this.ableBandWidth);
            // 최소 입찰액 리스트 설정
            BidValidation.setlowestBidPrices(this.lowestBidPrices);
            //입찰금액 체크
            return BidValidation.check(elements);
        },
        /**
         * 입찰금액을 관리자 화면에 보내는 함수
         */
        sendBid:function(elements){
            var defaultPriceList = JSON.parse(JSON.stringify(AuctionData.defaultPriceList));
            var priceList = _.map(defaultPriceList, function(item, index){

                //승자인 주파수 포함
                var winPrice = $(elements[index]).attr('price');
                var winFlag = (typeof winPrice !== typeof undefined && winPrice !== false)

                item.price = (winFlag) ? winPrice : $(elements[index]).val();

                item.hertzFlag = $(elements[index]).attr('hertz_flag');

                return item;
            })
            Auction.io.emit('BID',JSON.stringify( {'name':this.bidder_company, 'priceList':priceList} ))
        },
        /**
         * 각 라운드 입찰 완료
         */
        setRoundResult:function(data){
            console.log('ROUND RESULT : ');
            console.log(data);
            console.log('======================');

            // 입찰자 마다의 라운드별 증분율
            this.setRoundRateIncrease();

            var roundData = JSON.parse(JSON.stringify(data));

            var frequencyList = JSON.parse(JSON.stringify(roundData.frequency));
            // winPriceList 설정 (winPrice에는 ''도 있다.)
            var winPriceList = _.map(frequencyList,function(frequency){
                return {'name':frequency.name, 'bidder':frequency.winBidder, 'price':frequency.winPrice} ;
            })
            //최소 입찰액 리스트 설정
            this.lowestBidPrices = JSON.parse(JSON.stringify( this.setLowestBidPrice(winPriceList) ));
            // 최소입찰가격UI설정
            this.setLowestBidPriceUI( this.lowestBidPrices );

            // 자동입찰 체크
            this.checkAutoBidding(frequencyList);

            // 입찰 결과에 따른 입력 필드 UI 설정
            this.setBidPrices(winPriceList);
            // 승자 패자 표시 UI
            this.setBidVsUI(frequencyList);
        },

        /**
        * 각 주파수에 대한 각 입찰자의 시작가 대비 최종 가격 증분율
        * 주파수의 승자가 가격이 아닌 입찰자가 입찰한 가장 마지막 가격
        */
        setRoundRateIncrease:function(){
            RoundRateIncrease.setBidderCompany(this.bidder_company);
            RoundRateIncrease.setRoundRateIncrease(Function.prototype.bind.call(this.setRoundRateIncreaseUI,this));
        },

        /**
        * 현 증분율 UI 개발
        */
        setRoundRateIncreaseUI:function(data){
            var rateIncreaseList = JSON.parse(JSON.stringify(data));
            Handlebars.registerHelper('isHertz', function(options) {
                if(this.hertzFlag == true){
                  return options.fn(this);
                } else {
                  return options.inverse(this);
                }
            });
            var template = Handlebars.compile(this.bidRateIncreaseTpl);
            this.$el.find('._bid_rate_increase').html(template({'rateIncreaseList':rateIncreaseList}));
        },

        /**
         * 최소 입찰액 리스트 설정
         */
        setLowestBidPrice:function(data){
            var winPriceList = JSON.parse(JSON.stringify(data));
            var priceList = _.map(winPriceList, Function.prototype.bind.call(function(item,index){

                if(item.price === ''){
                    item.price = this.lowestBidPrices[index].price;
                } else {
                    item.price = parseInt(item.price,10) + Math.ceil(item.price*this.lowestBidAdd/100);
                }

                return item
            },this));
            return priceList;
        },
        /**
         * 입찰 결과에 따른 입력 필드 UI 설정
         */
        setBidPrices : function(data){

            _.each(data,Function.prototype.bind.call(function(item,index){

                if(item.bidder == this.bidder_company && item.price != ''){
                    $(this.$el.find('._bid_price')[index]).prop('disabled',true);
                    $(this.$el.find('._bid_price')[index]).attr('vs','win');
                    $(this.$el.find('._bid_price')[index]).attr('price',item.price);
                    $(this.$el.find('._bid_price')[index]).attr('placeholder','입찰불가');
                } else {
                    if(this.hertzList[index].hertzFlag == true){
                        $(this.$el.find('._bid_price')[index]).prop('disabled',this.autoBiddingFlag);
                        $(this.$el.find('._bid_price')[index]).removeAttr('vs');
                        $(this.$el.find('._bid_price')[index]).removeAttr('price');
                        $(this.$el.find('._bid_price')[index]).attr('placeholder','');
                    }
                }

            },this));

            this.resetBidPrice();
        },
        /**
         * 입찰금액 모두 리셋
         */
        resetBidPrice : function(){
            this.$el.find('._bid_price').val('')
        },
        /**
         * 각 라운드의 승자가격을 보여주는 함수
         */
        setRoundWinPrice:function(data){
            console.log(data)
            var template = Handlebars.compile(this.roundResultTpl);
            this.$el.find('._ascending_bid').append(template(data));
        },
        /**
         * 승자패자를 표시해 주는 함수
         */
        setBidVsUI:function(data){
            var vsList = [];
            var vsName = '';
            for(var i=0;i<data.length;++i){
                for(var j=0;j<data[i].bidders.length;++j){

                    if(data[i].bidders[j].name === this.bidder_company){
                        if(data[i].bidders[j].vs === 'win'){
                            vsName = '<i class="fa fa-thumbs-o-up"></i> 승자';
                        } else if(data[i].bidders[j].vs === 'lose'){
                            vsName = '<i class="fa fa-thumbs-o-down"></i> 패자';
                        } else {
                            vsName = '';
                        }
                        vsList.push({'vsName':vsName,'vs':data[i].bidders[j].vs})
                    }

                }
            }

            Handlebars.registerHelper('isVs', function(options) {
                if(this.vs == 'win' || this.vs == ''){
                  return options.fn(this);
                } else {
                  return options.inverse(this);
                }
            });

            console.log(data)
            var template = Handlebars.compile(this.bidVsTpl);
            this.$el.find('._bid_vs').html(template({'vsList':vsList}));
        },
        /**
         * 모든 입찰 신청 관련버튼들 Display 유무
         */
        biddingBtnListDisplay:function(flag){
            this.biddingBtnDisplay(flag);
            this.biddingSkipBtnDisplay(flag);
            this.biddingDelayBtnDisplay(flag);
        },
        /**
         * 입찰 신청 버튼 Display 유무
         */
        biddingBtnDisplay:function(flag){
            if(flag){
                this.$el.find('._bid_btn').removeClass('displayNone');
            } else {
                this.$el.find('._bid_btn').addClass('displayNone');
            }
        },
        /**
         * 입찰 스킵 신청 버튼 Display 유무
         */
        biddingSkipBtnDisplay:function(flag){
            if(flag){
                if(this.roundNum === 1){
                    this.$el.find('._bid_skip_btn').addClass('displayNone');
                } else {
                    this.$el.find('._bid_skip_btn').removeClass('displayNone');
                }
            } else {
                this.$el.find('._bid_skip_btn').addClass('displayNone');
            }
        },
        /**
         * 입찰 유예 신청 버튼 Display 유무
         */
        biddingDelayBtnDisplay:function(flag){
            if(flag){
                if(this.biddingDelayCount == 2){
                    this.$el.find('._bid_delay_btn').addClass('displayNone');
                } else {
                    if(this.roundNum === 1){
                        this.$el.find('._bid_delay_btn').addClass('displayNone');
                    } else {
                        this.$el.find('._bid_delay_btn').removeClass('displayNone');
                    }
                }
            } else {
                this.$el.find('._bid_delay_btn').addClass('displayNone');
            }
        },

        /**
         * 자동입찰 체크와 가능하면 자동입찰 실행
         */
        checkAutoBidding:function(data){
            var bandWidthTotal = 0;
            for(var i=0;i<data.length;++i){
                for(var j=0;j<data[i].bidders.length;++j){
                    if(data[i].bidders[j].name === this.bidder_company){
                        if(data[i].bidders[j].vs === 'win'){
                            bandWidthTotal = bandWidthTotal + data[i].bandWidth;
                        }
                    }

                }
            }
            console.log('BAND_WITH_TOTAL : ' + bandWidthTotal);
            console.log('ABLE_BAND_WIDTH : ' + this.ableBandWidth);

            this.autoBiddingFlag = (bandWidthTotal == this.ableBandWidth);
            this.$el.find('._able_bandWidth').text('지원가능주파수 : ' + (this.ableBandWidth - bandWidthTotal) + 'Hz');
        },

        /**
         * 자동입찰을 실행하는 함수
         */
        setAutoBidding:function(){
            this.ascendingBiddingType = '';
            var bidPriceElementList = this.$el.find('._bid_price');
            //입찰금액을 관리자 화면에 보내는 함수
            this.sendBid(bidPriceElementList);
            //입찰 관련 버튼 모두 숨김
            this.biddingBtnListDisplay(false);

            //alert('원하는 대역폴이 만족하여 자동입찰이 진행되었습니다.');
            //R2Alert.render({'msg':'원하는 대역폴이 만족하여 자동입찰이 진행되었습니다.','w':350})
            this.autoBiddingFlag = false;
            this.$el.find('._round_mark').text(this.roundNum + '라운드 입찰이 진행중입니다. 잠시만 기다려 주시기 바랍니다.');
        },

        /**
         * 지원 가능한 주파수를 계산하는 함수
         */
        // checkAutoBidding:function(data){
        //     var bandWidthTotal = 0;
        //     for(var i=0;i<data.length;++i){
        //         for(var j=0;j<data[i].bidders.length;++j){
        //             if(data[i].bidders[j].name === this.bidder_company){
        //                 if(data[i].bidders[j].vs === 'win'){
        //                     bandWidthTotal = bandWidthTotal + data[i].bandWidth;
        //                 }
        //             }
        //
        //         }
        //     }
        //     console.log('BAND_WITH_TOTAL : ' + bandWidthTotal);
        //     console.log('ABLE_BAND_WIDTH : ' + this.ableBandWidth);
        //
        //     this.autoBiddingFlag = (bandWidthTotal == this.ableBandWidth);
        // },

        /**
         * 밀봉입찹순위 체크 하는 함수
         */
        validationSealBidRanking:function(){
            // 밀봉입찰순위를 모두 입력했는지 체크
            var sealBidRanking = this.$el.find('._seal_bid_ranking');
            var sealBidRankingFlag = _.every(sealBidRanking,function(element){
                console.log(typeof $(element).attr('hertz_flag'))
                console.log($(element).attr('hertz_flag'))
                return $(element).val() != '' || $(element).attr('hertz_flag') == 'false'
            })

            var flag = true;
            if(!sealBidRankingFlag) {
                //alert('밀봉 입찰 순위를 모두 입력해 주시기 바랍니다.')
                R2Alert.render({'msg':'밀봉 입찰 순위를 모두 입력해 주시기 바랍니다.','w':450})
                flag = false;
            }

            return flag;
        },

        /**
         * 밀봉입찰금액 체크 하는 함수
         */
        validationSealBidPrice:function(data){
            var insertPriceList = data;
            var priceList = JSON.parse(JSON.stringify(this.sealLowestBidPriceList.priceList));
            var flag = _.every(insertPriceList,function(item,index){
                return item.price >= priceList[index].price || item.hertzFlag == false;
            })
            if(!flag){
                //alert('밀봉입찰액은 밀봉최소입착액 이상으로 입력하셔야 합니다.');
                R2Alert.render({'msg':'밀봉입찰액은 밀봉최소입착액 이상으로 입력하셔야 합니다.','w':450})
            }
            return flag
        },


        /**
         * 입력한 밀봉 입찰 금액 리스트
         */
        getInsertSealBidPrice(){
            var $sealBidPrice   = this.$el.find('._seal_bid_price');
            var $sealBidRanking = this.$el.find('._seal_bid_ranking');

            var rankingAdd = 5;

            var priceList = JSON.parse(JSON.stringify(this.sealLowestBidPriceList.priceList));
            var insertPriceList = _.map($sealBidPrice,function(item,index){
                var ranking = null;

                if($($sealBidRanking[index]).val() == ''){
                    ranking = rankingAdd = rankingAdd + 1;
                } else {
                    ranking = parseInt( $($sealBidRanking[index]).val(), 10);
                }

                var price = null;

                if($(item).val() == '' || parseInt( $(item).val(),10 ) == 0){
                     if(priceList[index].hertzFlag == true){
                         price = priceList[index].price
                     } else {
                         price = 0
                     }
                } else {
                    price = parseInt( $(item).val(),10 )
                }

                var hertzFlag = priceList[index].hertzFlag;
                return {
                    'ranking':ranking,
                    'price':price,
                    'hertzFlag':hertzFlag,
                    'name': priceList[index].name,
                    'prePrice':priceList[index].price
                }
            })
            console.dirxml(insertPriceList);
            return insertPriceList;
        },

        /**
         * 밀봉최소입찰금액에서 밀봉입찰금액 증액 퍼센트 구하는 함수
         * 밀봉입찰액 증분율 공식 (밀봉입찰액-오름입찰액)/오름입찰액
         */
        getSealBidPercent:function(data){
            var insertPriceList = JSON.parse(JSON.stringify(data));
            var percentList = _.map(this.sealLowestBidPriceList.priceList,function(item,index){
                var lowestPrice = item.price;
                var insertPrice = insertPriceList[index].price;
                //var percent = Math.ceil( ( 1-(lowestPrice/insertPrice) )*100 );
                var percent = null;
                if(item.hertzFlag == true){
                    percent = Math.ceil( ( (insertPrice-lowestPrice)/insertPrice )*100 );
                } else {
                    percent = 0;
                }
                return {
                    'ranking':insertPriceList[index].ranking,
                    'percent':percent,
                    'price':insertPrice,
                    'hertzFlag':item.hertzFlag,
                    'prePrice':item.price
                }

            })
            console.dirxml(percentList);
            return percentList;
        },
        /**
         * 계산한 퍼센트를 순위별 랭킹으로 오른차순 정열
         */
        sortSealBidPercent:function(data){
            var sortPriceList =_.sortBy(data,'ranking');
            console.dirxml(sortPriceList);
            return sortPriceList;
        },
        /**
         * 금액 순위별 퍼센트 룰을 잘 준수 했는데 체크 하는 함수
         */
        checkSealBidPercent:function(data){
            var percentList = data;
            var percent = null;
            var flag = true;
            for(var i=0; i<percentList.length; ++i){
                if(percent == null){
                    percent = percentList[i].percent;
                } else {
                    if(percent < percentList[i].percent){
                        //alert((i+1) + '순위 입찰액은 ' + i + '순위 증분 퍼센트보다 이하로 입력하셔야합니다.');
                        R2Alert.render({'msg':(i+1) + '순위 입찰액은 \n' + i + '순위 증분 퍼센트보다 이하로 입력하셔야합니다.','w':450})
                        flag = false;
                        break
                    }
                    percent = percentList[i].percent
                }
            }
            return flag;
        },

        setSealBidPercentUI:function(data){
            console.log(data)
            var percentList = JSON.parse(JSON.stringify(data));

            Handlebars.registerHelper('rtz', function(options) {
                if(this.hertzFlag == true){
                  return options.fn(this);
                } else {
                  return options.inverse(this);
                }
            });

            var template = Handlebars.compile(this.sealBidPercentListTpl);
            this.$el.find('._seal_bid_percent_list').html(template({'percentList':percentList}));
        },

















































        // /**
        //  * 입찰 급액 등록
        //  */
        // postBid:function(data){
        //
        //     // var $bidPrice = this.$el.find('.bid_price');
        //     //
        //     // var A_price = $($bidPrice[0]).val();
        //     // var B_price = $($bidPrice[1]).val();
        //     // var C_price = $($bidPrice[2]).val();
        //     // var D_price = $($bidPrice[3]).val();
        //     // var E_price = $($bidPrice[4]).val();
        //
        //     var postData = {
        //         'auctionNum':this.auctionID,
        //         'roundNum':this.roundNum,
        //         'companyName':this.bidder_company,
        //         'priceA':(data[0] === '') ? 0 : parseInt(data[0],10),
        //         'priceB':(data[1] === '') ? 0 : parseInt(data[1],10),
        //         'priceC':(data[2] === '') ? 0 : parseInt(data[2],10),
        //         'priceD':(data[3] === '') ? 0 : parseInt(data[3],10),
        //         'priceE':(data[4] === '') ? 0 : parseInt(data[4],10),
        //     }
        //
        //     Model.postBid({
        //          url: Auction.HOST + '/api/bidding',
        //          method : 'POST',
        //          contentType:"application/json; charset=UTF-8",
        //          data : JSON.stringify(postData),
        //          success : Function.prototype.bind.call(this.postBidSuccess,this),
        //          error : Function.prototype.bind.call(this.postBidError,this)
        //      })
        // },

        // postBidSuccess:function(data, textStatus, jqXHR){
        //     console.log(data);
        //
        //     if(textStatus === 'success'){
        //
        //         var priceList = Process.getBidFormatChange( data );
        //
        //         Auction.io.emit('BID',JSON.stringify( {'name':this.bidder_company, 'priceList':priceList} ))
        //     }
        //
        // },
        // postBidError:function(jsXHR, textStatus, errorThrown){
        //
        // },
        //
        // /**
        //  * 입찰하지 않음 핸들러
        //  */
        // onNotBid : function(e){
        //     //this.postBid([0,0,0,0,0])
        //     this.sendBid([0,0,0,0,0])
        // },

        /**
         * 관리자에게 입찰한 가격을 보내는 함수
         */
        // sendBid:function(data){
        //
        //     var postData = {
        //         'auctionNum':this.auctionID,
        //         'roundNum':this.roundNum,
        //         'companyName':this.bidder_company,
        //         'priceA':data[0],
        //         'priceB':data[1],
        //         'priceC':data[2],
        //         'priceD':data[3],
        //         'priceE':data[4]
        //     }
        //
        //     var priceList = Process.getBidFormatChange( postData );
        //
        //     Auction.io.emit('BID',JSON.stringify( {'name':this.bidder_company, 'priceList':priceList} ))
        // },













































































        /**
         * 밀봉최소금액 설정
         */
        // onSealLowestBidPrice:function(data){
        //     console.log(this.originCompanyList)
        //
        //     var resultArr = [
        //         {'name': this.bidder_company}
        //     ];
        //
        //     var bidderList = _.map( resultArr, Function.prototype.bind.call(function(result){
        //         var companyList = _.filter(this.originCompanyList,function(company){
        //             return company.companyName === result.name;
        //         })
        //         return _.extend(result,{'priceList':this.companyMaxPrice(companyList)})
        //
        //     },this))
        //
        //     console.log(bidderList)
        //
        //     var biddingResultList = this.setBiddingResult(bidderList)
        //
        //     //밀봉 입찰 최소액 셋팅
        //     this.setSealLowestBidPrice(biddingResultList)
        // },

        /**
         * 주파수 별로 되어 있는 데이터를 통신사별로 변경하는 함수
         */
        companyMaxPrice : function(data){
            var priceArr = ['priceA','priceB','priceC','priceD','priceE']
            var priceList = []
            for(var i=0; i<priceArr.length; ++i){
                var arr = _.pluck(data, priceArr[i])
                priceList.push( {'name':priceArr[i], 'price':_.max(arr)} )
            }
            return priceList;
        },

        /**
         * 입찰 결과 UI 렌더링
         */
        setBiddingResult:function(data){
            var companyData = this.companyPercent(data);
            var bidderList = this.setResultRanking(companyData);

            console.log('== 입찰결과 ==')
            console.log(bidderList);
            console.table(bidderList);

            //var template = Handlebars.compile(this.biddingResultTpl);
            //this.$el.find('._ascending_bidding_result tbody').html(template({'bidderList':bidderList}));
            //this.$el.find('._ascending_bidding_result').removeClass('displayNone');

            return bidderList;
        },

        /**
         * 시작가에서 입찰 결과까지의 퍼센트 추가 함수
         */
        companyPercent:function(data){

            var companyData = JSON.parse( JSON.stringify( data ) );
            for(var i=0; i<companyData.length; ++i){
                for(var j=0; j < companyData[i].priceList.length ;++j){
                    var companyPrice    = companyData[i].priceList[j].price;
                    var startPrice      = parseInt(AuctionData.startPriceList[j].price,10)
                    companyData[i].priceList[j].percent = Math.ceil( (companyPrice/startPrice - 1) * 100 );
                }
            }

            return companyData;
        },

        /**
         * 오름경매 결과에 순위를 만드는 함수
         */
        setResultRanking:function(data){

            //this.setReversePriceList(data);

            var companyData = JSON.parse( JSON.stringify( data ) );

            var sortPriceList, reversePriceList = null;



            for(var i=0; i<companyData.length; ++i){
                sortPriceList = _.sortBy(companyData[i].priceList, 'percent');

                reversePriceList = this.setReversePriceList( sortPriceList );

                //console.log('== 입찰결과순위별 ==')
                //console.table(reversePriceList)

                for(var j=0; j<companyData[i].priceList.length; ++j){

                    for(var k=0; k<reversePriceList.length; ++k){

                        if(companyData[i].priceList[j].percent === reversePriceList[k].percent){
                            companyData[i].priceList[j].ranking = reversePriceList[k].ranking;
                            companyData[i].priceList[j].labelClass = reversePriceList[k].labelClass;
                        }
                    }

                }
            }

            console.log(companyData);

            return companyData

        },

        setReversePriceList:function(data){

            var reversePriceList = JSON.parse( JSON.stringify( data.reverse() ) );

            var ranking = 1;

            var percent = null;

            for (var i=0; i<reversePriceList.length; ++i){

                if(percent == null){
                    percent = reversePriceList[i].percent;
                    reversePriceList[i].labelClass = 'danger'
                    reversePriceList[i].ranking= ranking;
                } else {
                    if(percent == reversePriceList[i].percent){
                        reversePriceList[i].ranking = ranking
                    } else {
                        percent = reversePriceList[i].percent;
                        reversePriceList[i].ranking = ranking = ranking + 1;
                    }
                    reversePriceList[i].labelClass = 'default'
                }
            }

            return reversePriceList;

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
         * 블록별 가격 증가율 (시작가/승자의 가격 * 100)
         */
































        /**
         * 옥션 리스트 호출
         */
        getAuctionList:function(){
            Model.getAuctionList({
                 url:Auction.HOST + '/api/auction',
                 method : 'GET',
                 contentType:"application/json; charset=UTF-8",
                 success : Function.prototype.bind.call(this.getAuctionListSuccess,this),
                 error : Function.prototype.bind.call(this.getAuctionListError,this)
             })
        },

        /**
         * 옥션 리스트 호출 성공
         */
        getAuctionListSuccess:function(data, textStatus, jqXHR){

            if(textStatus === 'success'){

                var auctionArr = _.filter(data,function(auction){
                    return (auction.auctionStat === 'ON')
                })

                if(auctionArr.length === 1){
                    this.auctionID = auctionArr[0].id;
                    this.postBid();
                    //window.clearInterval(this.intervalAuctionList)
                } else {
                    //alert('갱매가 중복적으로 생성되었습니다.');
                    R2Alert.render({'msg':'갱매가 중복적으로 생성되었습니다.','w':300})
                }
            }
        },

        /**
         * 옥션 리스트 호출 실패
         */
        getAuctionListError:function(jsXHR, textStatus, errorThrown){

        },










        // /**
        //  * 옥션 리스트 인터벌로 호출
        //  */
        // intervalAuctionList_fn:function(){
        //     Auction.interval.set(
        //         'auctionInfo',
        //         Function.prototype.bind.call(this.getAuctionInfo,this)
        //     )
        // },

        /**
         * 경매 라운드 리스트 호출
         */
        getAuctionInfo:function(){
            Model.getAuctionInfo({
                 url:Auction.HOST + '/api/auctioninfo/' + this.auctionID,
                 method : 'GET',
                 contentType:"application/json; charset=UTF-8",
                 success : Function.prototype.bind.call(this.getAuctionInfoSuccess,this),
                 error : Function.prototype.bind.call(this.getAuctionInfoError,this)
             })
        },

        /**
         * 경매 라운드 리스트 성공
         */
        getAuctionInfoSuccess:function(data, textStatus, jqXHR){
            if(textStatus === 'success'){

                var quotient = data.length%3;

                if(quotient === 0){
                    //UI 셋팅

                    this.roundNum += 1;

                    this.setLowestBidPrice(data);
                    this.setRoundList(data);
                } else {
                    this.getAuctionInfo();
                }

                //this.setRoundList(data);

            } else {
                //alert('경매 정보 호출에 실패하였습니다.')
                R2Alert.render({'msg':'경매 정보 호출에 실패하였습니다.','w':300})
            }
        },

        /**
         * 경매 라운드 리스트 실패
         */
        getAuctionInfoError:function(jsXHR, textStatus, errorThrown){

        },

        /**
         * 경매정보를 UI에 랜더링 하는 함수
         */
        setRoundList:function(data){
            //this.roundNum = Math.ceil(data.length/3);

            this.originCompanyList = data;

            var roundList = this.changeDataFormat(data);

            this.$el.find('.round_price_list').remove();

            var template = Handlebars.compile(this.roundPriceListTpl);
            this.$el.find('.start_price_list').after(template({'roundList':roundList}));
        },

        /**
         * 서버에서 넘어온 경매 데이터를 프런트에 맞게 변경하는 함수
         */
        changeDataFormat:function(data){

            var firstData   = this.setFirstData(data);
            var secondData  = this.setSecondData(firstData);

            return secondData;
        },

        /**
         * 서버에서 받은 데이터를 첫번째로 그룹화를 하는 함수
         */
        setFirstData : function(data){

            var roundTotal = Math.ceil(data.length/3);
            var roundList = [];

            for(var i=0; i<roundTotal ; ++i){
                roundList.push({
                    'round' : i + 1,
                    'companys' : _.filter(data, function(round){
                        return (round.roundNum === (i+1))
                    })
                })
            }

            return roundList;
        },

        /**
         * 그룹화를 한 데이터를 템플릿에 맞게 변경
         */
        setSecondData : function(data){

            var roundList = [];

            for(var i=0; i<data.length ; ++i){
                roundList.push({
                    'round' : i + 1,
                    'frequency' : this.setFrequencyData(data[i].companys)
                })
            }

            return roundList;
        },

        /**
         * 그룹화된 데이터를 주파수 별로 구분하는 것으로 구조 변경
         */
        setFrequencyData : function(data){

            var frequencyList = [];
            var bidderArr = ['KT', 'SK', 'LG']
            var priceArr = ['priceA','priceB','priceC','priceD','priceE']
            var frequencyFormat = JSON.parse( JSON.stringify( AuctionData.frequency ) );

            for(var i=0; i<priceArr.length; ++i){

                var bidders =[];

                for(var j=0; j<bidderArr.length; ++j){
                    var companyArr = _.filter(data,function(company){
                        return company.companyName === bidderArr[j];
                    })

                    if(companyArr.length === 1){
                        bidders.push({
                            'name' : bidderArr[j],
                            'price' : companyArr[0][priceArr[i]]
                        })
                    } else {
                        bidders.push({
                            'name' : bidderArr[j],
                            'price' : 0
                        })
                    }
                }


                var winPrice = ( _.max(bidders, function(bidder){ return bidder.price; }) ).price;

                var winArr = _.filter(bidders,function(bidder){
                    return winPrice === bidder.price
                })

                var win = null;

                if(winArr.length > 1){
                    win = winArr[ parseInt(Math.random()*(winArr.length),10) ]
                } else {
                    win = winArr[0];
                }
                var winName = win.name;


                frequencyFormat[i].bidders = _.map(bidders,function(bidder){

                    var className = '';

                    if(bidder.price === winPrice && bidder.name === winName){
                        className = 'label label-' + bidder.name + '-l';
                    } else {
                        className = 'text-gray';
                    }

                    return _.extend(bidder,{'className':className})
                })

            }

            return frequencyFormat;

        },











        /**
         * 경매정보 호출에 관련된 인터벌 함수 클리어 하는 함수
         */
        onClearInterval:function(){
            if(Auction.interval.has('auctionInfo')){
                Auction.interval.clear('auctionInfo')
            }
        },

        /**
         * 페이지 숨김
         */
        hide : function(){
            // 모든 인터벌 중지
            this.onClearInterval();
            this.$el.addClass('displayNone');
        },

        /**
         * 페이지 보이기
         */
        show : function(){
            this.$el.removeClass('displayNone');
            $('body').css({'background-color':'#FFFFFF'})
        }


 	}))

})
