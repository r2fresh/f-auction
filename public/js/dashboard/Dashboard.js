define([
   'module',
   'js/Model',
   'js/AuctionData'
   ],
   function(module, Model, AuctionData){

	'use strict'

 	module.exports = new (Backbone.View.extend({
        el:'._dashboard',
        startPriceListTpl:null,
        roundListTpl:null,
        lastRoundTpl:null,
        lowestBidAdd:0.75,
        initialize:function(){
            this.setTpl();
        },
        render:function(){
            this.setStartPriceList();
            this.getRoundList();

            Auction.io.on('DASHBOARD', Function.prototype.bind.call(this.getRoundList,this) );
        },
        setTpl:function(){
            this.startPriceListTpl = this.$el.find("._start_price_list_tpl").html();
            this.$el.find("._start_price_list_tpl").remove();

            this.roundListTpl = this.$el.find('._round_list_tpl').html();
            this.$el.find('._round_list_tpl').remove();

            this.lastRoundTpl = this.$el.find('._last_round_tpl').html();
            this.$el.find('._last_round_tpl').remove();
        },
        getRoundList:function(){
            Model.getRoundList({
                 url: '/roundList',
                 method : 'GET',
                 contentType:"application/json; charset=UTF-8",
                 success : Function.prototype.bind.call(this.getRoundListSuccess,this),
                 error : function(jsXHR, textStatus, errorThrown){}
             })
        },
        getRoundListSuccess:function(data, textStatus, jqXHR){
            if(textStatus === 'success'){

                var roundList = this.setRoundList(JSON.parse(JSON.stringify(data)));
                this.setRoundListUI(JSON.parse(JSON.stringify(roundList)));

                var lastRoundList = this.setLastRoundList(JSON.parse(JSON.stringify(data)))
                var lastRoundData = this.setLastRoundData(lastRoundList);
                this.setLastRoundDataUI(lastRoundData);
                this.$el.removeClass('displayNone')
            }
        },
        setStartPriceList:function(){
            var startPriceList   = JSON.parse(JSON.stringify(AuctionData.startPriceList));
            _.each(startPriceList, function(item){
                item.wonPrice = Auction.numberic.get(item.price)
            })
            var template = Handlebars.compile(this.startPriceListTpl);
            this.$el.find('._start_price_list').html(template({'startPriceList':startPriceList}));
        },
        setLastRoundList:function(data){
            var roundList = JSON.parse(JSON.stringify(data));
            // _.each(roundList,function(roundData){
            //     _.each(roundData.frequency, function(frequency){
            //         _.each(frequency.bidders, function(bidder){
            //             bidder.wonPrice = Auction.numberic.get(bidder.price);
            //         })
            //     })
            // })

            //console.log(roundList)

            console.log(roundList)

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
        setRoundList:function(data){
            var roundList = JSON.parse(JSON.stringify(data));
            // _.each(roundList,function(roundData){
            //     _.each(roundData.frequency, function(frequency){
            //         _.each(frequency.bidders, function(bidder){
            //             bidder.wonPrice = Auction.numberic.get(bidder.price);
            //         })
            //     })
            // })

            //console.log(roundList);
            _.each(roundList,function(roundData,index){
                _.each(roundData.frequency, function(frequency,frequencyIndex){

                    // windRate : 누적증분율
                    // winNowRate : 현증분율(이전 라운드 최고가 대비)
                    // bidderWinNowRate : 현증분율(이전 주파수에서 해당 입찰의 최고가 대비)

                    _.each(frequency.bidders, function(bidder){
                        if(bidder.vs == 'win'){

                            frequency.winRate = (bidder.rateIncrease == 'undefined') ? '':bidder.rateIncrease;
                            frequency.bidderWinNowRate = (bidder.nowRateIncrease == 'undefined') ? '' : bidder.nowRateIncrease;

                            //console.log(frequency.winNowRateIncrease)

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



                    //console.log(frequency.winNowRateIncrease)





                    // if(frequency.winNowRate == '0%' && roundData.name != 1){
                    //     frequency.winRate = '';
                    //     frequency.winCompanyName = '';
                    //     frequency.wonWinPrice = '';
                    //     frequency.winNowRate = '';
                    // } else {
                        //_.each(frequency.bidders, function(bidder){




                    //}
                })
            })

            return roundList;
        },
        setRoundListUI:function(data){
            var template = Handlebars.compile(this.roundListTpl);
            this.$el.find('._round_list').html(template({'roundList':data.reverse()}));
        },
        setLastRoundData:function(data){
            var roundList = JSON.parse(JSON.stringify(data));
            var lastRoundData = _.last(roundList);

            var priceList = [];
            var companyList = [];
            var lowestBiddingPriceList = [];

            _.each(lastRoundData.frequency,Function.prototype.bind.call(function(frequency){
                priceList.push({'price' : Auction.numberic.get(frequency.winPrice), 'rateIncrease':frequency.winRate});
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
        setLastRoundDataUI:function(data){
            var template = Handlebars.compile(this.lastRoundTpl);
            this.$el.find('._last_round').html(template(data));
        },
        setDashBoardUI:function(){
            var roundList = this.getDashboardData();
            var template = Handlebars.compile(this.roundListTpl);
            this.$el.find('._round_list').html(template({'roundList':roundList}));

            this.$el.removeClass('displayNone')
        },
 	}))
})
