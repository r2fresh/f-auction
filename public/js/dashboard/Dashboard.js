define([
   'module',
   'js/Model',
   'js/AuctionData'
   ],
   function(module, Model, AuctionData){

	'use strict'

 	module.exports = new (Backbone.View.extend({
        el:'#dashboard',
        startPriceListTpl:null,
        roundListTpl:null,
        lastRoundTpl:null,
        lowestBidAdd:0.75,
        initialize:function(){
            this.setTpl();
        },
        render:function(){
            this.setStartPriceList();
            this.setCountDown();
            this.getRoundList();

            Auction.io.on('DASHBOARD', Function.prototype.bind.call(this.getRoundList,this) );
        },
        /**
        * 탬플릿 설정
        */
        setTpl:function(){
            this.startPriceListTpl = this.$el.find("._start_price_list_tpl").html();
            this.$el.find("._start_price_list_tpl").remove();

            this.roundListTpl = this.$el.find('._round_list_tpl').html();
            this.$el.find('._round_list_tpl').remove();

            this.lastRoundTpl = this.$el.find('._last_round_tpl').html();
            this.$el.find('._last_round_tpl').remove();
        },

        /**
        * 시작가 리스트 설정
        */
        setStartPriceList:function(){
            var startPriceList   = JSON.parse(JSON.stringify(AuctionData.startPriceList));
            _.each(startPriceList, function(item){
                item.wonPrice = Auction.numberic.get(item.price)
            })
            var template = Handlebars.compile(this.startPriceListTpl);
            this.$el.find('._start_price_list').html(template({'startPriceList':startPriceList}));
        },

        /**
        * 타이머 설정
        */
        setCountDown:function(){
            //var data = JSON.parse(msg);
            var TIMER = 2400000
            var now = moment('2016-04-28 09:30:00').valueOf();
            //var countDown = now + TIMER;
            //var timer = countDown//data.countdown_timer;

            var a = moment(moment.unix(parseInt(now,10)/1000).format("YYYY-MM-DD HH:mm:ss") )
            var b = moment(new Date());
            var time = a.diff(b) // 86400000

            // this.countDown = this.$el.find('.count_down').FlipClock(time/1000, {
            //     autoStart: true,
            //     countdown: true,
            //     clockFace: 'HourCounter',
            //     callbacks: {
            //         stop:function(e){
            //             console.log(this)
            //             //alert('stop')
            //         }
            //     }
            // });
            //
            // //this.countDown.setTime(time/1000);
            // this.countDown.start();

            this.clock = this.$el.find('.clock').FlipClock(this.TIMER, {
                clockFace: 'TwentyFourHourClock'
            });
        },

        /**
        * 라운드 리스트 호출
        */
        getRoundList:function(){
            Model.getRoundList({
                 url: '/roundList',
                 method : 'GET',
                 contentType:"application/json; charset=UTF-8",
                 success : Function.prototype.bind.call(this.getRoundListSuccess,this),
                 error : function(jsXHR, textStatus, errorThrown){}
             })
        },

        /**
        * 라운드 리스트 호출 성공
        */
        getRoundListSuccess:function(data, textStatus, jqXHR){
            if(textStatus === 'success'){
                if(data.length == 0) {
                    this.$el.removeClass('displayNone');
                    return;
                }

                var roundList = this.setRoundList(JSON.parse(JSON.stringify(data)));
                this.setRoundListUI(JSON.parse(JSON.stringify(roundList)));

                var lastRoundList = this.setLastRoundList(JSON.parse(JSON.stringify(data)))
                var lastRoundData = this.setLastRoundData(lastRoundList);
                this.setLastRoundDataUI(lastRoundData);

                this.setRoundNumber(_.last(lastRoundList).name);

                this.$el.removeClass('displayNone')
            }
        },

        /**
        * 라운드 정보를 가공
        */
        setRoundList:function(data){
            var roundList = JSON.parse(JSON.stringify(data));

            _.each(roundList,function(roundData,index){
                _.each(roundData.frequency, function(frequency,frequencyIndex){

                    // windRate : 누적증분율
                    // winNowRate : 현증분율(이전 라운드 최고가 대비)
                    // bidderWinNowRate : 현증분율(이전 주파수에서 해당 입찰자의 최고가 대비)

                    _.each(frequency.bidders, function(bidder){
                        if(bidder.vs == 'win'){

                            frequency.winRate = (bidder.rateIncrease == 'undefined') ? '':bidder.rateIncrease;
                            frequency.bidderWinNowRate = (bidder.nowRateIncrease == 'undefined') ? '' : bidder.nowRateIncrease;

                            // 한 주파수에서 승자가 되고, 다음 라운드 같은 가격으로 계속 승자가 될때
                            // 이후 승자와 가격 표시를 하지 않기 위해 비교하는 구문
                            if((frequency.bidderWinNowRate == 0) &&
                            (frequency.winRate >= 0) &&
                            (frequency.winNowRateIncrease ==0) &&
                            (roundData.name != 1) &&
                            (roundList[index-1].frequency[frequencyIndex].winPrice != '')){
                                frequency.winRate = '';
                                frequency.winCompanyName = '';
                                frequency.wonWinPrice = '';
                                frequency.winNowRate = '';
                            } else {
                                frequency.winRate = frequency.winRate + '%';
                                var winBidder = frequency.winBidder;
                                frequency.winCompanyName = (winBidder == 'SK') ? 'SKT' : (winBidder == 'LG') ? 'LGU+' : winBidder;
                                frequency.wonWinPrice = Auction.numberic.get(frequency.winPrice);
                                frequency.winNowRate = frequency.winNowRateIncrease + '%';
                            }


                        }
                    })
                })
            })

            return roundList;
        },
        /**
        * 가공된 라운드 정보를 UI 반영
        */
        setRoundListUI:function(data){
            var template = Handlebars.compile(this.roundListTpl);
            this.$el.find('._round_list').html(template({'roundList':data.reverse()}));
        },

        /**
        * 상단의 마지막 라운드의 정보를 표시하기 위해 라운드 리스트 가공
        */
        setLastRoundList:function(data){
            var roundList = JSON.parse(JSON.stringify(data));

            _.each(roundList,function(roundData){
                _.each(roundData.frequency, function(frequency){
                    _.each(frequency.bidders, function(bidder){
                        if(bidder.vs == 'win'){
                            //console.log(bidder.nowRateIncrease);
                            frequency.winRate = (bidder.rateIncrease == 'undefined') ? '' : bidder.rateIncrease + '%';
                            frequency.winNowRate = (bidder.nowRateIncrease == 'undefined') ? '' : bidder.nowRateIncrease + '%';
                        }
                    })
                    var winBidder = frequency.winBidder;
                    frequency.winCompanyName = (winBidder == 'SK') ? 'SKT' : (winBidder == 'LG') ? 'LGU+' : winBidder;
                    frequency.wonWinPrice = Auction.numberic.get(frequency.winPrice);
                })
            })

            return roundList;
        },
        /**
        * 상단의 마지막 라운드 정보에서 가격정보, 입찰자(회사)정보, 최소입찰액 정보를 가공하여 리턴
        */
        setLastRoundData:function(data){
            var roundList = JSON.parse(JSON.stringify(data));
            var lastRoundData = _.last(roundList);

            var priceList = [];
            var companyList = [];
            var lowestBiddingPriceList = [];

            _.each(lastRoundData.frequency,Function.prototype.bind.call(function(frequency){
                priceList.push({'price' : Auction.numberic.get(frequency.winPrice), 'companyName':frequency.winBidder, 'rateIncrease':frequency.winRate});
                companyList.push({'companyName':frequency.winBidder,'winCompanyName':frequency.winCompanyName});

                if(frequency.winPrice != ''){
                    var winPrice = parseInt(frequency.winPrice,10);
                    console.log(winPrice)
                    var lowestBiddingPrice = winPrice + Math.round(winPrice*this.lowestBidAdd/100)
                    console.log(lowestBiddingPrice)
                    lowestBiddingPriceList.push({'lowestBiddingPrice':Auction.numberic.get(lowestBiddingPrice)});
                } else {
                    lowestBiddingPriceList.push({'lowestBiddingPrice':''});
                }

            },this))

            return {'priceList':priceList,'companyList':companyList,'lowestBiddingPriceList':lowestBiddingPriceList}
        },
        /**
        * 상단의 가공된 마지막 라운드 정보를 UI에 반영
        */
        setLastRoundDataUI:function(data){
            var template = Handlebars.compile(this.lastRoundTpl);
            this.$el.find('._last_round').html(template(data));
        },

        /**
        * 현재 라운드 표시
        */
        setRoundNumber:function(num){
            this.$el.find('.dashboard_header .round').html(num);
        }
 	}))
})
