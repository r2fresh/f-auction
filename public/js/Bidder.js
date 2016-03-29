define([
   'module',
   'text!tpl/bidder.html',
   'text!tpl/bidderRoundResult.html',
   'js/AuctionData',
   'js/Validation',
   'js/Model',
   'js/Process'
   ],
   function(module, Bidder, RoundResult, AuctionData, Validation, Model, Process){

	'use strict'

 	module.exports = new (Backbone.View.extend({
        auctionID : 1,

        roundNum : 1,

        bidder_company: '',

        //최소입찰증분 (단위는 퍼센트)
        lowestBidAdd : 4,

        //시작가(최저입찰가격) 리스트 템플릿
        auctionStartPriceTpl : null,

        //최소입찰가격 배열
        lowestBidPrices : null,

        //최소입찰가격 리스트 템플릿
        lowestBidPricesTpl : null,

        //입찰금액
        bidPrices : null,

        //통신사마다 가능한 대역폭 상한서
        ableBandWidth : 0,

        //라운드 리스트 탬플릿
        roundListPrices : null,

        roundListPricesTpl : null,

        intervalAuctionList : null,
        // 경매 원본 정보
        originCompanyList : null,

        startPriceList : null,

        sealLowestBidPriceList : null,

 		el: '.bidder',
 		events :{
            'click ._logout_btn' : 'onLogout',
            'click ._bid_btn' : 'onBid',
            'click ._not_bid_btn' : 'onNotBid',

            'click .test_btn' : 'testBidSuccess',
            'click ._accordion_btn' : 'onAccordion',

            // 밀봉입찰 예상 증분율 확인 하는 이벤트
            'click ._seal_predict_percent_btn' : 'onSealPredictPercent',
            //밀봉입찰 버튼 클릭 이벤트
            'click ._seal_bid_price_btn' : 'onSealBidPrice'
            //'click .bidder_seal_lowest_bid_price_btn' : 'onSealLowestBidPrice'
 		},
 		initialize:function(){
		},
        render:function(){
            this.$el.html(Bidder);
            this.setTpl();
            this.setBidderCompany();
            this.setLimitHertz();
            this.setBidderLogo();
            this.setBidStrategy();

            this.setStartPriceList();
            this.setSocketReceiveEvent();

            Auction.io.emit('loginCheck',Auction.session.get('user_info').user);

            VMasker(document.querySelectorAll('._seal_bid_ranking')).maskNumber();
            //VMasker(document.querySelectorAll('._seal_bid_price')).maskNumber();
        },

        /**
         * 사용하는 템플릿 설정
         */
        setTpl : function(){

            this.roundPriceListTpl          = this.$el.find(".round_price_list_tpl").html();

            this.roundResultTpl             = RoundResult

            this.sealLowestBidPriceTpl      = this.$el.find("._seal_lowest_bid_price_tpl").html();
            this.sealBidPercentListTpl      = this.$el.find("._seal_bid_percent_list_tpl").html();

            this.bidderStartPriceListTpl    = this.$el.find(".bidder_start_price_list_tpl").html();
            this.startPriceListTpl          = this.$el.find(".start_price_list_tpl").html();
            this.lowestRacePricesTpl        = this.$el.find(".lowest_race_prices_tpl").html();
            this.lowestBidPricesTpl         = this.$el.find(".lowest_bid_prices_tpl").html();

            //접속자 유저 템플릿
            this.connectUserListTpl = this.$el.find(".connect_user_list_tpl").html();

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
        setLimitHertz : function(){
            var userInfo = Auction.session.get('user_info');;
            this.ableBandWidth = userInfo.hertz;
            this.$el.find('#limit_hertz').text('제한주파수 : ' + userInfo.hertz + 'Hz');
        },

        /**
         * socket.io 서버에서 보내주는 이벤트를 받는 리시브 설정
         */
        setSocketReceiveEvent:function(){
            Auction.io.on('loginCheck', Function.prototype.bind.call(this.onLoginCheck,this) );
            Auction.io.on('AUCTION_ID', Function.prototype.bind.call(this.setAuctionId,this) );
            Auction.io.on('ROUND_NUMBER', Function.prototype.bind.call(this.setRoundNum,this) );
            Auction.io.on('ROUND_RESULT', Function.prototype.bind.call(this.onRoundResult,this) );
            Auction.io.on('SEAL_LOWEST_BID_PRICE', Function.prototype.bind.call(this.onSealLowestBidPrice,this) );
        },

        /**
         * 경매 ID 설정
         */
        setAuctionId:function(id){
            console.log('AUCTION_ID : ' + id)
            this.auctionID = id;
        },

        /**
         * 라우든 Number 설정
         */
        setRoundNum:function(num){
            console.log('ROUND_NUMBER : ' + num)
            this.roundNum = num;
        },

        /**
         * 경매 참여자의 접속 체크
         */
        onLoginCheck:function(msg){

            console.table(JSON.parse(msg))

            var list = JSON.parse(msg);

            _.each(list,function(item){
                item.name = (item.name).toUpperCase();
                item.className = (item.state) ? 'success' : 'danger';
            })

            this.$el.find('.connect_user_list').empty();

            var template = Handlebars.compile(this.connectUserListTpl);
            this.$el.find('.connect_user_list').html(template({'list':list}));
        },

        /**
         * 시작가 설정
         */
        setStartPriceList:function(){
            var priceList = JSON.parse( JSON.stringify( AuctionData.startPriceList ) );
            this.startPriceList = JSON.parse( JSON.stringify( priceList ) );

            var template1 = Handlebars.compile(this.bidderStartPriceListTpl);
            this.$el.find('.bidder_start_price_list').append(template1({'priceList':priceList}));

            var template2 = Handlebars.compile(this.startPriceListTpl);
            this.$el.find('.start_price_list').append(template2({'priceList':priceList}));

            this.lowestBidPrices = JSON.parse( JSON.stringify( priceList ) );

            this.setLowestBidPriceUI(priceList)
        },


        onRoundResult:function(msg){

            var data = JSON.parse(msg);

            console.log(data);

            this.setLowestBidPrice(data);

            this.setRoundWinPrice(data);
        },

        /**
         * 밀봉 최소 입찰액 설정
         */
         onSealLowestBidPrice:function(msg){
             var data = JSON.parse(msg);
             var bidderList = _.filter(data,Function.prototype.bind.call(function(item){
                 return item.name === this.bidder_company;
             },this))
             var bidder = bidderList[0];
             this.sealLowestBidPriceList = JSON.parse(JSON.stringify(bidder));
             var template = Handlebars.compile(this.sealLowestBidPriceTpl);
             this.$el.find('._seal_lowest_bid_price').html(template(bidder));
         },

        /**
         * 최소 입찰액 설정
         */
        setLowestBidPrice : function(data){

            var priceList = _.map(data.frequency,Function.prototype.bind.call(function(item,index){

                var price = 0;

                var startPrice  = this.lowestBidPrices[index].price;
                var lowestPrice = item.winPrice;

                if(item.winPrice === 0){
                    price = startPrice
                } else {
                    price = (startPrice > lowestPrice) ? startPrice : lowestPrice;
                }

                return {'name':item.name, 'price':price}
            },this));

            //this.lowestBidPrices = JSON.parse( JSON.stringify( priceList ) );

            this.setBidPrices(data.frequency);

            this.lowestBidPrices = this.runLowestBidAdd(priceList)

            this.setLowestBidPriceUI( this.lowestBidPrices );

            // var priceArr = ['priceA','priceB','priceC','priceD','priceE']
            //
            // var priceList = _.map(priceArr, Function.prototype.bind.call(function(item, index){
            //
            //     var startPrice  = this.startPriceList[index].price;
            //     var lowestPrice = _.max(_.pluck(data, item));
            //     var price = (startPrice > lowestPrice) ? startPrice : lowestPrice;
            //
            //     return {'name':item, 'price':price}
            // },this));
            //
            // this.lowestBidPrices = JSON.parse( JSON.stringify( priceList ) );
            //
            // this.setBidPrices(priceList);
            //
            // this.setLowestBidPriceUI( this.runLowestBidAdd(priceList) );

        },

        /**
         * 최소 입찰액 UI 설정
         */
        setLowestBidPriceUI : function(data){
            var template = Handlebars.compile(this.lowestBidPricesTpl);
            this.$el.find('.lowest_bid_prices').empty().html(template({'priceList':data}));
        },

        runLowestBidAdd:function(data){
            var priceList = _.map(data, Function.prototype.bind.call(function(item,index){

                var startPrice  = this.lowestBidPrices[index].price;

                if(startPrice != item.price){
                    item.price = Math.ceil( item.price + (item.price*this.lowestBidAdd/100))
                }

                return item
            },this));
            return priceList;
        },


        /**
         * 입찰금액 리스트 설정
         */
        setBidPrices : function(data){

            _.each(data,Function.prototype.bind.call(function(item,index){

                if(item.winBidder == this.bidder_company){
                    $(this.$el.find('.bid_price')[index]).prop('disabled',true)
                    $(this.$el.find('.bid_price')[index]).attr('placeholder','승자')
                } else {
                    $(this.$el.find('.bid_price')[index]).prop('disabled',false)
                    $(this.$el.find('.bid_price')[index]).attr('placeholder','')
                }

            },this));

            // _.each(this.$el.find('.bid_price'),function(element,index){
            //     if($(element).val() != '' && parseInt($(element).val(),10) === data[index].price) {
            //         $(element).prop('disabled',true)
            //         $(element).attr('placeholder','승자')
            //     } else {
            //         $(element).prop('disabled',false)
            //         $(element).attr('placeholder','')
            //     }
            // })

            this.resetBidPrice();

        },

        resetBidPrice : function(){
            this.$el.find('.bid_price').val('')
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
          * 1순위 블록 필요 입찰액
          */

        onBid : function(){

            var bidPriceEl = this.$el.find('.bid_price');

            // 빈 입찰가격 체크 (true : 입찰가격모두빈칸, false : 입찰가격을 하나라도 입력했을경우)
            var emptyCheck = _.every(bidPriceEl, function(element){
                return $(element).val() === '';
            })
            if(emptyCheck) {
                alert('입찰가격을 입력하여 주십시오');
                return;
            }

            // 통신사 대역폭 체크
            var maxBandWidth = _.reduce(
                _.map(AuctionData.defaultPriceList, Function.prototype.bind.call(function(item, index){
                    var bidPriceValue = $(this.$el.find('.bid_price')[index]).val();
                    return ( bidPriceValue != '' ) ? item.bandWidth : 0;
                },this)),
                function(memo, num){ return memo + num; },
                0
            );
            if(maxBandWidth > this.ableBandWidth){
                alert('정해진 대역폭을 초과 하셨습니다.');
                return;
            }

            // 광대역은 하나만 신청가능하다는 것을 체크
            var wideBandArr = _.filter(this.$el.find('.bid_price'),function(element, index){
                return AuctionData.defaultPriceList[index].type === 'wideBand'
            })
            var limitWideBandArr = _.filter(wideBandArr,function(element){
                return $(element).val() != '';
            })
            if(limitWideBandArr.length > 1) {
                alert('광대역하나만 신청 가능합니다.');
                return;
            }

            // 최소입찰가격이상을 입력했는지 체크
            var lowestBidPriceCheck = _.every(this.$el.find('.bid_price'), Function.prototype.bind.call(function(element, index){

                var result = null

                if($(element).val() === ''){
                    result = true;
                } else {
                    result = ( this.lowestBidPrices[index].price <= parseInt($(element).val(),10) ) ? true : false
                }

                return result;
            },this))
            if(!lowestBidPriceCheck){
                alert('최소입찰액 이상 입력하시기 바랍니다.');
                return;
            }

            this.postBid(_.map(this.$el.find('.bid_price'),function(element){
                 return $(element).val()
            }))
        },

        /**
         * 입찰 급액 등록
         */
        postBid:function(data){

            // var $bidPrice = this.$el.find('.bid_price');
            //
            // var A_price = $($bidPrice[0]).val();
            // var B_price = $($bidPrice[1]).val();
            // var C_price = $($bidPrice[2]).val();
            // var D_price = $($bidPrice[3]).val();
            // var E_price = $($bidPrice[4]).val();

            var postData = {
                'auctionNum':this.auctionID,
                'roundNum':this.roundNum,
                'companyName':this.bidder_company,
                'priceA':data[0],
                'priceB':data[1],
                'priceC':data[2],
                'priceD':data[3],
                'priceE':data[4]
            }

            Model.postBid({
                 url: Auction.HOST + '/api/bidding',
                 method : 'POST',
                 contentType:"application/json; charset=UTF-8",
                 data : JSON.stringify(postData),
                 success : Function.prototype.bind.call(this.postBidSuccess,this),
                 error : Function.prototype.bind.call(this.postBidError,this)
             })
        },

        postBidSuccess:function(data, textStatus, jqXHR){
            console.log(data);

            if(textStatus === 'success'){

                var priceList = Process.getBidFormatChange( data );

                Auction.io.emit('BID',JSON.stringify( {'name':this.bidder_company, 'priceList':priceList} ))
            }

        },
        postBidError:function(jsXHR, textStatus, errorThrown){

        },

        /**
         * 입찰하지 않음 핸들러
         */
        onNotBid : function(e){
            this.postBid([0,0,0,0,0])
        },




        onSealPredictPercent:function(e){
            // 밀봉입찹순위 체크
            if(!this.validationSealBidRanking()) return;
            // 입력한 밀봉 입찰 금액 리스트
            var insertPriceList = this.getInsertSealBidPrice();
            // 밀봉최소입찰액과 밀봉입찰액의 입력체크
            if(!this.validationSealBidPrice(insertPriceList)) return;
            // 밀봉최소입찰금액에서 밀봉입찰금액 증액 퍼센트 구하는 함수
            var percentList = this.getSealBidPercent(insertPriceList);
            // 계산한 퍼센트를 순위별 랭킹으로 오른차순 정열
            var sortPercentList = this.sortSealBidPercent(percentList);
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

            // 밀봉입찹순위 체크
            if(!this.validationSealBidRanking()) return;
            // 입력한 밀봉 입찰 금액 리스트
            var insertPriceList = this.getInsertSealBidPrice();
            // 밀봉최소입찰액과 밀봉입찰액의 입력체크
            if(!this.validationSealBidPrice(insertPriceList)) return;
            // 밀봉최소입찰금액에서 밀봉입찰금액 증액 퍼센트 구하는 함수
            var percentList = this.getSealBidPercent(insertPriceList);
            // 계산한 퍼센트를 순위별 랭킹으로 오른차순 정열
            var sortPercentList = this.sortSealBidPercent(percentList);
            // 입찰한 급액의 증분율 표시
            this.setSealBidPercentUI(percentList)
            // 금액 순위별 퍼센트 룰을 잘 준수 했는데 체크 하는 함수
            if(!this.checkSealBidPercent(sortPercentList)) return;

            var priceList = _.map(sortPercentList,Function.prototype.bind.call(function(item ,index){
                var frequency = {'name':priceArr[index],'price':item.price, 'company':this.bidder_company}
                return _.extend(defaultPriceList[index],frequency);
            },this));

            var bidderList = {'name':this.bidder_company,'ableBandWidth':this.ableBandWidth,'priceList':priceList};

            Auction.io.emit('SEAL_BID_PRICE', JSON.stringify(bidderList));
        },

        /**
         * 밀봉입찹순위 체크 하는 함수
         */
        validationSealBidRanking:function(){
            // 밀봉입찰순위를 모두 입력했는지 체크
            var sealBidRanking = this.$el.find('._seal_bid_ranking');
            var sealBidRankingFlag = _.every(sealBidRanking,function(element){ return $(element).val() != '' })
            var flag = true;
            if(!sealBidRankingFlag) {
                alert('밀봉 입찰 순위를 모두 입력해 주시기 바랍니다.')
                falg = false;
            }
            return flag;
        },

        /**
         * 밀봉입찹순위 체크 하는 함수
         */
        validationSealBidPrice:function(data){
            var insertPriceList = data;
            var priceList = JSON.parse(JSON.stringify(this.sealLowestBidPriceList.priceList));
            var flag = _.every(insertPriceList,function(item,index){
                return item.price >= priceList[index].price;
            })
            if(!flag){
                alert('밀봉입찰액은 밀봉최소입착액 이상으로 입력하셔야 합니다.')
            }
            return flag
        },

        /**
         * 입력한 밀봉 입찰 금액 리스트
         */
        getInsertSealBidPrice(){
            var $sealBidPrice   = this.$el.find('._seal_bid_price');
            var $sealBidRanking = this.$el.find('._seal_bid_ranking');

            var priceList = JSON.parse(JSON.stringify(this.sealLowestBidPriceList.priceList));
            var insertPriceList = _.map($sealBidPrice,function(item,index){
                var ranking = parseInt( $($sealBidRanking[index]).val(), 10);
                var price = ($(item).val() == '' || parseInt( $(item).val(),10 ) == 0) ? priceList[index].price : parseInt( $(item).val(),10 )
                return {'ranking':ranking, 'price':price}
            })
            console.dirxml(insertPriceList);
            return insertPriceList;
        },

        /**
         * 밀봉최소입찰금액에서 밀봉입찰금액 증액 퍼센트 구하는 함수
         */
        getSealBidPercent:function(data){
            var insertPriceList = JSON.parse(JSON.stringify(data));
            var percentList = _.map(this.sealLowestBidPriceList.priceList,function(item,index){
                var lowestPrice = item.price;
                var insertPrice = insertPriceList[index].price;
                var percent = Math.ceil( ( 1-(lowestPrice/insertPrice) )*100 );
                return {'ranking':insertPriceList[index].ranking,'percent':percent,'price':insertPrice}

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
                        alert((i+1) + '순위 입찰액은 ' + i + '순위 증분 퍼센트보다 이하로 입력하셔야합니다.');
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
            var template = Handlebars.compile(this.sealBidPercentListTpl);
            this.$el.find('._seal_bid_percent_list').html(template({'percentList':percentList}));
        },






































































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
                    var startPrice      = AuctionData.startPriceList[j].price
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
         * 밀봉 입찰 최소액 셋팅
         */
        setSealLowestBidPrice:function(data){
            var bidderList = this.secondCompanyMaxPrice(data)
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
                    var startPrice      = AuctionData.startPriceList[j].price;
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
                    alert('갱매가 중복적으로 생성되었습니다.')
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
                alert('경매 정보 호출에 실패하였습니다.')
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
         * 입찰 테이블 보이게 안보이게 하는 함수
         */
        onAccordion : function(e){

            var result = $(e.currentTarget).find('i').hasClass('fa-arrow-up');

            if(result) {
                this.$el.find('._insert_bidder table').hide();

                $(e.currentTarget).find('i').removeClass('fa-arrow-up').addClass('fa-arrow-down');

            } else {
                this.$el.find('._insert_bidder table').show();

                $(e.currentTarget).find('i').removeClass('fa-arrow-down').addClass('fa-arrow-up');
            }

        },
        testBidSuccess : function(data, textStatus, jqXHR){

            var roundData = {
                'round' : [
                    {
                        'roundNum' : 1,
                        'frequency' : [
                        {
                            'name': 'A',
                            'bandWidth':40,
                            'hertz':'700',
                            'type':'wideBand',
                            'winBidder': 'KT',
                            'winPrice': 7620,
                            'bidders':[
                                {'name':'KT', 'price':7620, 'vs':'win'},
                                {'name':'SK', 'price':5000, 'vs':'lose'},
                                {'name':'LG', 'price':6000, 'vs':'lose'}
                            ]

                        },
                        {
                            'name': 'B',
                            'bandWidth':20,
                            'hertz':'18',
                            'type':'narrow',
                            'winBidder': 'KT',
                            'winPrice': 7620,
                            'bidders':[
                                {'name':'KT', 'price':7620, 'vs':'win'},
                                {'name':'SK', 'price':5000, 'vs':'lose'},
                                {'name':'LG', 'price':6000, 'vs':'lose'}
                            ]

                        },
                        {
                            'name': 'C',
                            'bandWidth':20,
                            'hertz':'21',
                            'type':'wideBand',
                            'winBidder': 'KT',
                            'winPrice': 7620,
                            'bidders':[
                                {'name':'KT', 'price':7620, 'vs':'win'},
                                {'name':'SK', 'price':5000, 'vs':'lose'},
                                {'name':'LG', 'price':6000, 'vs':'lose'}
                            ]

                        },
                        {
                            'name': 'D',
                            'bandWidth':40,
                            'hertz':'26',
                            'type':'wideBand',
                            'winBidder': 'KT',
                            'winPrice': 7620,
                            'bidders':[
                                {'name':'KT', 'price':7620, 'vs':'win'},
                                {'name':'SK', 'price':5000, 'vs':'lose'},
                                {'name':'LG', 'price':6000, 'vs':'lose'}
                            ]

                        },
                        {
                            'name': 'E',
                            'bandWidth':20,
                            'hertz':'26',
                            'type':'narrow',
                            'winBidder': 'KT',
                            'winPrice': 7620,
                            'bidders':[
                                {'name':'KT', 'price':7620, 'vs':'win'},
                                {'name':'SK', 'price':5000, 'vs':'lose'},
                                {'name':'LG', 'price':6000, 'vs':'lose'}
                            ]

                        }]
                    },
                    {
                        'roundNum' : 2,
                        'frequency' : [
                        {
                            'name': 'A',
                            'bandWidth':40,
                            'hertz':'700',
                            'type':'wideBand',
                            'winBidder': 'KT',
                            'winPrice': 8620,
                            'bidders':[
                                {'name':'KT', 'price':8620, 'vs':'win'},
                                {'name':'SK', 'price':7000, 'vs':'lose'},
                                {'name':'LG', 'price':6000, 'vs':'lose'}
                            ]

                        },
                        {
                            'name': 'B',
                            'bandWidth':20,
                            'hertz':'18',
                            'type':'narrow',
                            'winBidder': 'KT',
                            'winPrice': 8920,
                            'bidders':[
                                {'name':'KT', 'price':8920, 'vs':'win'},
                                {'name':'SK', 'price':7000, 'vs':'lose'},
                                {'name':'LG', 'price':6000, 'vs':'lose'}
                            ]

                        },
                        {
                            'name': 'C',
                            'bandWidth':20,
                            'hertz':'21',
                            'type':'wideBand',
                            'winBidder': 'KT',
                            'winPrice': 6500,
                            'bidders':[
                                {'name':'KT', 'price':5620, 'vs':'win'},
                                {'name':'SK', 'price':5000, 'vs':'lose'},
                                {'name':'LG', 'price':6500, 'vs':'lose'}
                            ]

                        },
                        {
                            'name': 'D',
                            'bandWidth':40,
                            'hertz':'26',
                            'type':'wideBand',
                            'winBidder': 'KT',
                            'winPrice': 5000,
                            'bidders':[
                                {'name':'KT', 'price':3620, 'vs':'win'},
                                {'name':'SK', 'price':4000, 'vs':'lose'},
                                {'name':'LG', 'price':5000, 'vs':'lose'}
                            ]

                        },
                        {
                            'name': 'E',
                            'bandWidth':20,
                            'hertz':'26',
                            'type':'narrow',
                            'winBidder': 'KT',
                            'winPrice': 7000,
                            'bidders':[
                                {'name':'KT', 'price':6620, 'vs':'win'},
                                {'name':'SK', 'price':7000, 'vs':'lose'},
                                {'name':'LG', 'price':6000, 'vs':'lose'}
                            ]

                        }]
                    }
                ]
            }

            // var roundData = [
            //     {'round': [
            //         {
            //             'name': 'A',
            //             'bandWidth':40,
            //             'hertz':'700',
            //             'type':'wideBand',
            //             'bidders':[
            //                 {'name':'KT', 'price':7620, 'vs':'win'},
            //                 {'name':'SK', 'price':5000, 'vs':'lose'},
            //                 {'name':'LG', 'price':6000, 'vs':'lose'}
            //             ]
            //
            //         },
            //         {
            //             'name': 'B',
            //             'bandWidth':20,
            //             'hertz':'18',
            //             'type':'narrow',
            //             'bidders':[
            //                 {'name':'KT', 'price':7620, 'vs':'win'},
            //                 {'name':'SK', 'price':5000, 'vs':'lose'},
            //                 {'name':'LG', 'price':6000, 'vs':'lose'}
            //             ]
            //
            //         },
            //         {
            //             'name': 'C',
            //             'bandWidth':20,
            //             'hertz':'21',
            //             'type':'wideBand',
            //             'bidders':[
            //                 {'name':'KT', 'price':7620, 'vs':'win'},
            //                 {'name':'SK', 'price':5000, 'vs':'lose'},
            //                 {'name':'LG', 'price':6000, 'vs':'lose'}
            //             ]
            //
            //         },
            //         {
            //             'name': 'D',
            //             'bandWidth':40,
            //             'hertz':'26',
            //             'type':'wideBand',
            //             'bidders':[
            //                 {'name':'KT', 'price':7620, 'vs':'win'},
            //                 {'name':'SK', 'price':5000, 'vs':'lose'},
            //                 {'name':'LG', 'price':6000, 'vs':'lose'}
            //             ]
            //
            //         },
            //         {
            //             'name': 'E',
            //             'bandWidth':20,
            //             'hertz':'26',
            //             'type':'narrow',
            //             'bidders':[
            //                 {'name':'KT', 'price':7620, 'vs':'win'},
            //                 {'name':'SK', 'price':5000, 'vs':'lose'},
            //                 {'name':'LG', 'price':6000, 'vs':'lose'}
            //             ]
            //
            //         }
            //
            //
            //     ]},
            //     {'round': [
            //         {
            //             'name': 'A',
            //             'bandWidth':40,
            //             'hertz':'700',
            //             'type':'wideBand',
            //             'bidders':[
            //                 {'name':'KT', 'price':7620, 'vs':'win'},
            //                 {'name':'SK', 'price':5000, 'vs':'lose'},
            //                 {'name':'LG', 'price':6000, 'vs':'lose'}
            //             ]
            //
            //         },
            //         {
            //             'name': 'B',
            //             'bandWidth':20,
            //             'hertz':'18',
            //             'type':'narrow',
            //             'bidders':[
            //                 {'name':'KT', 'price':7620, 'vs':'win'},
            //                 {'name':'SK', 'price':5000, 'vs':'lose'},
            //                 {'name':'LG', 'price':6000, 'vs':'lose'}
            //             ]
            //
            //         },
            //         {
            //             'name': 'C',
            //             'bandWidth':20,
            //             'hertz':'21',
            //             'type':'wideBand',
            //             'bidders':[
            //                 {'name':'KT', 'price':7620, 'vs':'win'},
            //                 {'name':'SK', 'price':5000, 'vs':'lose'},
            //                 {'name':'LG', 'price':6000, 'vs':'lose'}
            //             ]
            //
            //         },
            //         {
            //             'name': 'D',
            //             'bandWidth':40,
            //             'hertz':'26',
            //             'type':'wideBand',
            //             'bidders':[
            //                 {'name':'KT', 'price':7620, 'vs':'win'},
            //                 {'name':'SK', 'price':5000, 'vs':'lose'},
            //                 {'name':'LG', 'price':6000, 'vs':'lose'}
            //             ]
            //
            //         },
            //         {
            //             'name': 'E',
            //             'bandWidth':20,
            //             'hertz':'26',
            //             'type':'narrow',
            //             'bidders':[
            //                 {'name':'KT', 'price':7620, 'vs':'win'},
            //                 {'name':'SK', 'price':5000, 'vs':'lose'},
            //                 {'name':'LG', 'price':6000, 'vs':'lose'}
            //             ]
            //
            //         }
            //
            //
            //     ]}
            // ]


            //className


            //this.setRoundUI(roundData);

            this.setRoundUI2(roundData)

            //cloneData.ksyname = 'kkkk'

            //console.log(cloneData)

            var template = Handlebars.compile(this.roundListPricesTpl);
            this.$el.find('.user_list').after(template(roundData));

            var lastRound = _.last(roundData.round)

            var lastRound2 = _.map(lastRound.frequency,function(frequency){

                frequency.price = (_.max(frequency.bidders, function(bidder){ return bidder.price; })).price;

                return frequency
            })

            this.setLowestBidPrices({'frequency':lastRound2});
        },

        setRoundUI2 : function(data){

            _.each(data.round, function(round){

                var frequency = _.map(round.frequency,function(frequency){

                    var price = _.max(_.pluck(frequency.bidders,'price'));

                    var bidders = _.map(frequency.bidders,function(bidder){

                        var className = '';

                        if(bidder.price === price){
                            className = 'label label-' + bidder.name + '-l';
                        } else {
                            className = 'text-gray';
                        }

                        return _.extend(bidder,{'className':className})
                    })

                    //frequency.bidders = bidders;

                    return bidders;

                })

            })
        },
        /**
         * 로그아웃 핸들러
         */
        onLogout : function(e){
            e.preventDefault();
            Auction.session.remove('user_info');
            window.location.href = '/';
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


        /*
         * 최저경쟁가격(시작가) 리스트 설정
         */
        // setLowestRacePrices : function(data){
        //     var template = Handlebars.compile(this.lowestRacePricesTpl);
        //     this.$el.find('.lowest_race_prices').empty().html(template(data));
        //
        //     this.setLowestBidPrices(data);
        //     this.setBidPrices(data);
        // },

        /**
         * 최소경쟁가격 리스트 설정
         */
        // setLowestBidPrices : function(data){
        //     this.lowestBidPrices = _.map(data.frequency, Function.prototype.bind.call(function(frequency){
        //             frequency.winPrice = Math.ceil( frequency.winPrice + (frequency.winPrice*this.lowestBidAdd/100) )
        //             return frequency
        //         },this))
        //
        //     console.log(this.lowestBidPrices)
        //
        //     var template = Handlebars.compile(this.lowestBidPricesTpl);
        //     this.$el.find('.lowest_bid_prices').empty().html(template({'frequency':this.lowestBidPrices}));
        //
        // },

 	}))

})
