define([
   'module',
   'text!tpl/admin.html',
   'js/Model',
   'js/Process',
   'js/AuctionData',
   //'socketio'
   ],
   function(module, Admin, Model, Pro, AuctionData){

	'use strict'

 	module.exports = new (Backbone.View.extend({
        socket : null,

        // 실행중인 경매 아이디
        auctionID : 0,
        // 생성된 경매의 이름
        auctionName : '',
        // 현재 라운드 정보
        roundNum : 1,
        // 시작가 리스트 템플릿
        startPriceListTpl:'',
        // 라운드 값 리스트 템플릿
        roundPriceListTpl : '',
        // 입찰 결과 템플릿
        biddingResultTpl:'',
        // 경매 원본 정보
        originCompanyList : null,

 		el: '.admin',
 		events :{
            'click ._logout_btn' : 'onLogout',
            'click ._auction_start_btn' : 'onAuctionStart',
            'click ._auction_end_btn' : 'onAuctionEnd',
            'click ._clear_interval_btn' : 'onClearInterval',
            'click ._acending_btn' : 'onBiddingResult'
 		},
 		initialize:function(){
            //this.socket = SocketIo();
            //this.setSocketEvent();
		},
        render:function(){
            console.log('12121')
            this.$el.html(Admin);

            this.setTpl();
            this.setStartPriceList();

            // Auction.io.on('loginCheck',function(msg){
            //     console.log(msg)
            // })

            //console.log(Auction.session.get('user_info').name)

            Auction.io.emit('loginCheck',Auction.session.get('user_info').user)
        },

        // setSocketEvent:function(){
            //     Auction.io.on('loginCheck',function(msg){
        //         console.log(msg)
        //     })
        // },

        /**
         * 템플릿 정의
         */
        setTpl:function(){
            this.roundPriceListTpl  = this.$el.find(".round_price_list_tpl").html();
            this.biddingResultTpl   = this.$el.find(".bindding_result_tpl").html();
            this.startPriceListTpl  = this.$el.find(".start_price_list_tpl").html();
            this.sealLowestBidPriceTpl = this.$el.find(".seal_lowest_bid_price_tpl").html();
        },

        /**
         * 시작가 설정
         */
        setStartPriceList:function(){
            var priceList = JSON.parse( JSON.stringify( AuctionData.startPriceList ) );

            var template = Handlebars.compile(this.startPriceListTpl);
            this.$el.find('.start_price_list').append(template({'priceList':AuctionData.startPriceList}));
        },

        /**
         * 경매 시작 이벤트 핸들러
         */
        onAuctionStart:function(e){
            this.postAuction();
        },

        /**
         * 경매 생성
         */
        postAuction:function(){
            Model.postAuction({
                 url: Auction.HOST + '/api/auction',
                 method : 'POST',
                 contentType:"application/json; charset=UTF-8",
                 data : JSON.stringify({
                     'auctionName':moment().format('YYYY/MM/DD-HH:mm:ss'),
                     'auctionStat':'ON'
                 }),
                 success : Function.prototype.bind.call(this.postAuctionSuccess,this),
                 error : Function.prototype.bind.call(this.postAuctionError,this)
             })
        },

        /**
         * 경매 생성 성공
         */
        postAuctionSuccess:function(data, textStatus, jqXHR){
            if(textStatus === 'success'){
                this.auctionID = data.id;
                this.auctionName = data.auctionName;

                //나중에 지움
                this.$el.find('#auction_id').val(data.id)

                this.intervalAuctionInfo_fn();
            } else {
                alert('경매 생성에 실패 하였습니다.')
            }
        },

        /**
         * 경매 생성 실패
         */
        postAuctionError:function(jsXHR, textStatus, errorThrown){
            alert('경매 생성에 실패 하였습니다.')
        },

        /**
         * 모의경매의 낙찰이 되면 경매를 끝낸다.
         */
        onAuctionEnd:function(){
            this.putAuction();
        },

        /**
         * 경매 생성
         */
        putAuction:function(){
            Model.putAuction({
                 url: Auction.HOST + '/api/auction',
                 method : 'PUT',
                 contentType:"application/json; charset=UTF-8",
                 data : JSON.stringify({
                     'id':this.auctionID,
                     'auctionName':this.auctionName,
                     'auctionStat':'OFF'
                 }),
                 success : Function.prototype.bind.call(this.putAuctionSuccess,this),
                 error : Function.prototype.bind.call(this.putAuctionError,this)
             })
        },

        /**
         * 경매 생성 성공
         */
        putAuctionSuccess:function(data, textStatus, jqXHR){
            if(textStatus === 'success'){
                alert('모의경매를 끝내기를 완료 하였습니다..')
            } else {
                alert('모의경매를 끝내기를 실패 하였습니다.')
            }
        },

        /**
         * 경매 생성 실패
         */
        putAuctionError:function(jsXHR, textStatus, errorThrown){
            alert('모의경매를 끝내기를 실패 하였습니다.')
        },

        /**
         * 옥션 경매 정보를 호출 인터벌 함수
         */
        intervalAuctionInfo_fn:function(){
            Auction.interval.set(
                'auctionInfo',
                Function.prototype.bind.call(this.getAuctionInfo,this)
            )
        },

        /**
         * 옥션 경매 정보 호출 함수
         */
        getAuctionInfo:function(){
            Model.getAuctionInfo({
                 url: Auction.HOST + '/api/auctioninfo/' + this.auctionID,
                 method : 'GET',
                 contentType:"application/json; charset=UTF-8",
                 success : Function.prototype.bind.call(this.getAuctionInfoSuccess,this),
                 error : Function.prototype.bind.call(this.getAuctionInfoError,this)
             })
        },

        /**
         * 경매 정보 호출 완료
         */
        getAuctionInfoSuccess:function(data, textStatus, jqXHR){
            if(textStatus === 'success'){
                //this.secondFormat(data);
                this.setRoundList(data);
            } else {
                alert('경매 정보 호출에 실패하였습니다.')
            }
        },

        /**
         * 경매 정보 호출 실패
         */
        getAuctionInfoError:function(jsXHR, textStatus, errorThrown){
            alert('경매 정보 호출에 실패하였습니다.')
        },

        /**
         * 경매정보를 UI에 랜더링 하는 함수
         */
        setRoundList:function(data){

            this.roundNum = Math.ceil(data.length/3);

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

            console.log(roundList)

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
         * 입찰 결과 핸들러
         */
        onBiddingResult:function(e){
            console.log(this.originCompanyList)

            var resultArr = [
                {'name':'KT'},
                {'name':'SK'},
                {'name':'LG'}
            ];

            var bidderList = _.map( resultArr, Function.prototype.bind.call(function(result){
                var companyList = _.filter(this.originCompanyList,function(company){
                    return company.companyName === result.name;
                })
                return _.extend(result,{'priceList':this.companyMaxPrice(companyList)})

            },this))

            console.log(bidderList)

            var biddingResultList = this.setBiddingResult(bidderList)

            //밀봉 입찰 최소액 셋팅
            this.setSealLowestBidPrice(biddingResultList)
        },

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

            var template = Handlebars.compile(this.biddingResultTpl);
            this.$el.find('._ascending_bidding_result tbody').html(template({'bidderList':bidderList}));
            this.$el.find('._ascending_bidding_result').removeClass('displayNone');

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



































        // intervalRoundList:function(){
        //     //var intervalID = window.setInterval(Function.prototype.bind.call(this.getRoundList,this), 500);
        //     this.getRoundList();
        // },








        // secondFormat : function(data){
        //     this.roundNum = this.roundTotal = Math.ceil(data.length/3);
        //
        //     var roundList = [];
        //
        //     for(var i=0; i<this.roundTotal ; ++i){
        //
        //         roundList.push({
        //             'round' : i + 1,
        //             'companys' : _.filter(data, function(round){
        //                 return (round.roundNum === (i+1))
        //             })
        //         })
        //
        //     }
        //
        //     this.thirdFormat(roundList);
        // },
        //
        // thirdFormat : function(data){
        //
        //     var roundList = [];
        //
        //     for(var i=0; i<data.length ; ++i){
        //
        //         roundList.push({
        //             'round' : i + 1,
        //             'frequency' : this.frequencyFormat(data[i].companys)
        //         })
        //
        //     }
        //
        //     console.log(roundList)
        //
        //     this.setRoundListUI(roundList);
        // },
        //
        // frequencyFormat : function(data){
        //
        //     var frequencyList = [];
        //
        //     var bidderArr = ['KT', 'SK', 'LG']
        //
        //     var priceArr = ['priceA','priceB','priceC','priceD','priceE']
        //
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
        //
        //
        //         var winPrice = ( _.max(bidders, function(bidder){ return bidder.price; }) ).price;
        //
        //         var winArr = _.filter(bidders,function(bidder){
        //             return winPrice === bidder.price
        //         })
        //
        //         var win = null;
        //
        //         if(winArr.length > 1){
        //             win = winArr[ parseInt(Math.random()*(winArr.length),10) ]
        //         } else {
        //             win = winArr[0];
        //         }
        //         var winName = win.name;
        //
        //
        //
        //
        //
        //         frequencyFormat[i].bidders = _.map(bidders,function(bidder){
        //
        //             var className = '';
        //
        //             if(bidder.price === winPrice && bidder.name === winName){
        //                 className = 'label label-' + bidder.name + '-l';
        //             } else {
        //                 className = 'text-gray';
        //             }
        //
        //             return _.extend(bidder,{'className':className})
        //         })
        //
        //
        //         // var ktArr = _.filter(data,function(company){
        //         //     return company.companyName === 'KT';
        //         // })
        //         //
        //         // if(ktArr.length === 1){
        //         //     bidders.push({
        //         //         'name' :ktArr[0].companyName,
        //         //         'price' : ktArr[0][priceArr[i]]
        //         //     })
        //         // }
        //         //
        //         // var skArr = _.filter(data,function(company){
        //         //     return company.companyName === 'SK';
        //         // })
        //         //
        //         // if(skArr.length === 1){
        //         //     bidders.push({
        //         //         'name' :skArr[0].companyName,
        //         //         'price' : skArr[0][priceArr[i]]
        //         //     })
        //         // }
        //         //
        //         // var lgArr = _.filter(data,function(company){
        //         //     return company.companyName === 'LG';
        //         // })
        //         //
        //         // if(lgArr.length === 1){
        //         //     bidders.push({
        //         //         'name' :lgArr[0].companyName,
        //         //         'price' : lgArr[0][priceArr[i]]
        //         //     })
        //         // }
        //
        //         // frequencyList.push({
        //         //     'bidders' : bidders
        //         // })
        //
        //         //frequencyFormat[i].bidders = bidders;
        //     }
        //
        //
        //
        //
        //     //
        //     // var bidderArr = ['KT', 'SK', 'LG']
        //     //
        //     // var priceArr = ['priceA','priceB','priceC','priceD','priceE']
        //     //
        //     // for(var i=0; i<priceArr.length; ++i){
        //     //
        //     //     var bidders = []
        //     //
        //     //     for(var j=0; j<data.length; ++j){
        //     //
        //     //         bidders.push({
        //     //             'name' : bidderArr[j],
        //     //             'price' : (_.filter(data,function(company){
        //     //                 return company.name === bidderArr[j];
        //     //             }))[priceArr[i]]
        //     //         })
        //     //
        //     //     }
        //     //
        //     //     frequencyList.push({
        //     //         'bidders' : bidders
        //     //     })
        //     //
        //     // }
        //
        //     // for (var i=0; i<6; ++i){
        //     //
        //     //     for(var j=0; j<bidderArr.length; ++j){
        //     //
        //     //         frequencyList.push({
        //     //             'bidders' : [
        //     //                 {
        //     //                     'name':'KT',
        //     //                     'price': (_.filter('data',function(bidder){
        //     //                         return bidder.companyName === 'KT')[0].price
        //     //                     }),
        //     //                 },
        //     //                 {
        //     //                     'name':'SK',
        //     //                     'price': _.filter('data',function(bidder){
        //     //                         return bidder.companyName === 'SK'
        //     //                     }),
        //     //                 },
        //     //                 {
        //     //                     'name':'LG',
        //     //                     'price': _.filter('data',function(bidder){
        //     //                         return bidder.companyName === 'LG'
        //     //                     }),
        //     //                 }
        //     //             ]
        //     //         })
        //     //
        //     //     }
        //     //
        //     // }
        //
        //     return frequencyFormat;
        //
        // },
        //
        // setRoundListUI:function(roundList){
        //
        //     console.log(roundList)
        //
        //     this.$el.find('.round_price_list').remove();
        //
        //     var template = Handlebars.compile(this.roundPriceListTpl);
        //     this.$el.find('.start_price_list').after(template({'roundList':roundList}));
        //
        // },

        // testsss:function(data){
        //
        //     var nameArr = ['KT', 'SK', 'LG']
        //
        //     var round = [];
        //
        //     for(var i=0; i<data.length; ++i){
        //         round[i] = {'round' : i+0, 'frequency' : []};
        //
        //
        //
        //         round[i].frequency[0] = data[0].round
        //     }
        //
        // },

        // testkkk:function(data){
        //
        //
        //
        //     //roundData.name = 'ksy';
        //
        //     //console.log(AuctionData.round);
        //     //console.log(roundData)
        //
        //     // roundlist : [
        //     //     {
        //     //         round : 1,
        //     //         frequency : [
        //     //             {
        //     //                 'name': 'A',
        //     //                 'bandWidth':40,
        //     //                 'hertz':'700',
        //     //                 'type':'wideBand',
        //     //                 'winBidder': '',
        //     //                 'winPrice': 0,
        //     //                 'bidders': [
        //     //                     {'name':'KT', 'price':0, 'vs':'win'},
        //     //                     {'name':'SK', 'price':0, 'vs':'win'},
        //     //                     {'name':'LG', 'price':0, 'vs':'win'}
        //     //                 ]
        //     //             },
        //     //             {
        //     //                 'name': 'A',
        //     //                 'bandWidth':40,
        //     //                 'hertz':'700',
        //     //                 'type':'wideBand',
        //     //                 'winBidder': '',
        //     //                 'winPrice': 0,
        //     //                 'bidders': [
        //     //                     {'name':'KT', 'price':0, 'vs':'win'},
        //     //                     {'name':'SK', 'price':0, 'vs':'win'},
        //     //                     {'name':'LG', 'price':0, 'vs':'win'}
        //     //                 ]
        //     //             },
        //     //         ]
        //     //     }
        //     // ]
        //
        //     // {
        //     //     "id": 1,
        //     //     "auctionNum": 5,
        //     //     "roundNum": 1,
        //     //     "companyName": "KT",
        //     //     "priceA": 2000,
        //     //     "priceB": 1000,
        //     //     "priceC": 1000000000,
        //     //     "priceD": 0,
        //     //     "priceE": 0
        //     //   },
        //
        //     var roundList = [];
        //
        //     for(var i=0; i<data.length; ++i) {
        //
        //         var frequencyFormat = JSON.parse( JSON.stringify( AuctionData.round.frequency ) );
        //         roundList.push({'round':i+1,'frequency':frequencyFormat})
        //
        //         for(var j=0; j<frequencyFormat.lengh ; ++j){
        //
        //
        //             for(var h=0 ; h<3; ++h){data
        //                 var companyName = roundList.frequency[j].bidders[h].name;
        //
        //                 var fff = _.filter(data[i].round,function(frequency){
        //                     return frequency.companyName === companyName;
        //                 });
        //
        //                 //roundList.frequency[j].bidders[h].price = fff.
        //             }
        //
        //
        //         }
        //
        //     }
        //
        // },







        // getRoundList:function(){
        //     Model.getRoundList({
        //          url: Auction.HOST + '/api/bidding',
        //          method : 'GET',
        //          contentType:"application/json; charset=UTF-8",
        //          data : JSON.stringify(this.content),
        //          success : Function.prototype.bind.call(this.getRoundListSuccess,this),
        //          error : Function.prototype.bind.call(this.getRoundListError,this)
        //      })
        // },
        // getRoundListSuccess:function(data, textStatus, jqXHR){
        //     //console.log(data);
        //     //console.log(Pro.getRoundList(data))
        // },
        // getRoundListError:function(jsXHR, textStatus, errorThrown){
        //
        // },

        /**
         * 경매정보 호출에 관련된 인터벌 함수 클리어 하는 함수
         */
        onClearInterval:function(){
            if(Auction.interval.has('auctionInfo')){
                Auction.interval.clear('auctionInfo')
            }
        },

        /**
         * 로그아웃 핸들러
         */
        onLogout : function(e){
            e.preventDefault();
            store.remove('user_info');
            window.location.href = '/';
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
