define([
   'module',
   'js/Model',
   'js/AuctionData'
   ],
   function(module, Model, AuctionData){

	'use strict'

 	module.exports = new (Backbone.View.extend({
        el:'._now_rate_increase',
        bidderListTpl : null,
        startPriceListTpl : null,
        render:function(){
            this.setTpl();
            this.setRoundNum(this.roundNumber);
            this.setStartPriceList();
            this.getRoundList();

            Auction.io.on('NOW_RATE_INCREASE', Function.prototype.bind.call(this.getRoundList,this) );
        },
        setTpl:function(){
            this.bidderListTpl = this.$el.find("._bidder_list_tpl").html();
            this.$el.find("._bidder_list_tpl").remove();

            this.startPriceListTpl = this.$el.find("._start_price_list_tpl").html();
            this.$el.find("._start_price_list_tpl").remove();

        },
        setRoundNum:function(num){
            this.$el.find('._round_number').text(num)
        },
        setStartPriceList:function(){
            var startPriceList   = JSON.parse(JSON.stringify(AuctionData.startPriceList));
            var template = Handlebars.compile(this.startPriceListTpl);
            this.$el.find('._start_price_list').html(template({'startPriceList':startPriceList}));
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
                var bidderList = this.getNowRateIncrease(data);

                _.each(bidderList,function(bidder){
                    bidder.companyName = (bidder.name == 'SK')?'SKT':(bidder.name == 'LG')?'LGU+':bidder.name;
                })

                var template = Handlebars.compile(this.bidderListTpl);
                this.$el.find('._bidder_list').html(template({'bidderList':bidderList}));

                this.$el.removeClass('displayNone');
            }
        },
        getNowRateIncrease:function(data){

            var roundList = JSON.parse(JSON.stringify(data));
            var startPriceList   = JSON.parse(JSON.stringify(AuctionData.startPriceList));
            var rateIncreaseList = JSON.parse(JSON.stringify(AuctionData.defaultPriceList));
            var bidderList       = [{'name':'KT'},{'name':'SK'},{'name':'LG'}];
            var roundNumber      = 1;

            // 기본 변수 설정
            // _.each(rateIncreaseList,function(item){
            //     item.priceList = [];
            //     item.hertzFlag = null;
            // })

            _.each(bidderList, function(item){
                item.rateIncreaseList = JSON.parse(JSON.stringify(rateIncreaseList));
            })

            if(roundList.length == 0){
                _.each(bidderList,function(bidder){
                    _.each(bidder.rateIncreaseList,function(rateIncrease, index){
                        var startPrice = startPriceList[index].price;
                        rateIncrease.ratePrice = parseInt(startPrice,10);
                        rateIncrease.rateIncrease = 0;
                    })
                })
            } else {

                var roundData = _.last(roundList);

                // 각 라운드 별 입찰자에 해당하는 가격리스트와 미신청 주파수 설정
                for(var j=0; j<roundData.frequency.length; ++j){
                    for(var k=0; k<roundData.frequency[j].bidders.length; ++k){

                        var rateIncrease = roundData.frequency[j].bidders[k].rateIncrease;
                        var startPrice = startPriceList[j].price;

                        bidderList[k].rateIncreaseList[j].ratePrice = parseInt(startPrice,10) + Math.round(startPrice*rateIncrease/100);
                        bidderList[k].rateIncreaseList[j].rateIncrease = rateIncrease;
                    }
                }

                roundNumber = roundData.name;
            }

            this.setRoundNum(roundNumber)

            return bidderList;

        }
 	}))
})
