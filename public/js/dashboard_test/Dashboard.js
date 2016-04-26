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
                var roundList = this.setRoundList(data);
                this.setRoundListUI(JSON.parse(JSON.stringify(roundList)));
                var lastRoundData = this.setLastRoundData(roundList);
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
        setRoundList:function(data){
            var roundList = JSON.parse(JSON.stringify(data));
            // _.each(roundList,function(roundData){
            //     _.each(roundData.frequency, function(frequency){
            //         _.each(frequency.bidders, function(bidder){
            //             bidder.wonPrice = Auction.numberic.get(bidder.price);
            //         })
            //     })
            // })
            _.each(roundList,function(roundData){
                _.each(roundData.frequency, function(frequency){
                    _.each(frequency.bidders, function(bidder){
                        if(bidder.vs == 'win'){
                            //console.log(bidder.nowRateIncrease);
                            frequency.winRate = (bidder.rateIncrease == undefined) ? '' : bidder.rateIncrease + '%';
                            frequency.winNowRate = (bidder.nowRateIncrease == undefined) ? '' : bidder.nowRateIncrease + '%';
                        }
                    })
                    var winBidder = frequency.winBidder;
                    frequency.winCompanyName = (winBidder == 'SK') ? 'SKT' : (winBidder == 'LG') ? 'LGU+' : winBidder;
                    frequency.wonWinPrice = Auction.numberic.get(frequency.winPrice);
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
                companyList.push({'companyName':frequency.winBidder});

                var winPrice = parseInt(frequency.winPrice,10);
                var lowestBiddingPrice = winPrice + Math.round(winPrice*this.lowestBidAdd/100)

                lowestBiddingPriceList.push({'lowestBiddingPrice':Auction.numberic.get(lowestBiddingPrice)});
            },this))

            return {'priceList':priceList,'companyList':companyList,'lowestBiddingPriceList':lowestBiddingPriceList}
        },
        setLastRoundDataUI:function(data){
            console.log(data)
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
