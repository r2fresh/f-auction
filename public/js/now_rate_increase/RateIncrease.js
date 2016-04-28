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
            this.$el.find('._round_number span').text(num)
        },
        setStartPriceList:function(){
            var startPriceList   = JSON.parse(JSON.stringify(AuctionData.startPriceList));
            _.each(startPriceList, function(item){
                item.wonPrice = Auction.numberic.get(item.price)
            })
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
                    _.each(bidder.rateIncreaseList,function(rateIncrease){
                        rateIncrease.wonPrice = Auction.numberic.get(rateIncrease.ratePrice);
                        if(rateIncrease.winBidder == bidder.name){}
                        rateIncrease.className = (rateIncrease.winBidder == bidder.name) ? rateIncrease.winBidder : 'darkslategrey';
                    })
                })

                var template = Handlebars.compile(this.bidderListTpl);
                this.$el.find('._bidder_list').html(template({'bidderList':bidderList}));

                this.$el.removeClass('displayNone');
            }
        },
        getNowRateIncrease:function(data){

            var roundList           =   JSON.parse(JSON.stringify(data));
            var startPriceList      =   JSON.parse(JSON.stringify(AuctionData.startPriceList));
            var rateIncreaseList    =   JSON.parse(JSON.stringify(AuctionData.defaultPriceList));
            var bidderList          =   [{'name':'KT'},{'name':'SK'},{'name':'LG'}];
            var biddingVisibleList  =   this.getBiddingVisibleList(roundList)
            var roundNumber         = 1;

            console.log(roundList)
            // 기본 변수 설정
            // _.each(rateIncreaseList,function(item){
            //     item.priceList = [];
            //     item.hertzFlag = null;
            // })

            // for(var i=0; i<roundList.length; ++i){
            //     for(var j=0; j<roundList[i].frequency.length; ++j){
            //         for(var k=0; k<roundList[i].frequency[j].bidders.length; ++k){
            //             var bidderPrice = roundList[i].frequency[j].bidders[k].price;
            //             var price = (bidderPrice == '') ? 0 : parseInt(bidderPrice);
            //             bidderList[k].rateIncreaseList[j].historyPriceList.push(price);
            //         }
            //     }
            // }


            _.each(bidderList, function(item){
                item.rateIncreaseList = JSON.parse(JSON.stringify(rateIncreaseList));
            })

            if(roundList.length == 0){
                _.each(bidderList,function(bidder){
                    _.each(bidder.rateIncreaseList,function(rateIncrease, index){
                        var startPrice = startPriceList[index].price;
                        rateIncrease.ratePrice = '';//parseInt(startPrice,10);
                        rateIncrease.rateIncrease = '';
                    })
                })
            } else {

                var roundData = _.last(roundList);

                // 각 라운드 별 입찰자에 해당하는 가격리스트와 미신청 주파수 설정
                for(var j=0; j<roundData.frequency.length; ++j){
                    for(var k=0; k<roundData.frequency[j].bidders.length; ++k){

                        var rateIncrease = roundData.frequency[j].bidders[k].rateIncrease;
                        var startPrice = startPriceList[j].price;
                        var winBidder = roundData.frequency[j].winBidder;

                        bidderList[k].rateIncreaseList[j].ratePrice = parseInt(startPrice,10) + Math.round(startPrice*rateIncrease/100);

                        if(biddingVisibleList[k].biddingVisibleList[j].visible == false){
                            bidderList[k].rateIncreaseList[j].ratePrice = '-'
                        } else {
                            bidderList[k].rateIncreaseList[j].ratePrice = parseInt(startPrice,10) + Math.round(startPrice*rateIncrease/100);
                        }

                        if(biddingVisibleList[k].biddingVisibleList[j].visible == false){
                            bidderList[k].rateIncreaseList[j].rateIncrease = '';
                        } else {
                            bidderList[k].rateIncreaseList[j].rateIncrease = '(' + rateIncrease + '%)';
                        }

                        // bidderList[k].rateIncreaseList[j].rateIncrease = (roundData.frequency[j].bidders[k].price == '') ? '-' : '(' + rateIncrease + '%)';
                        bidderList[k].rateIncreaseList[j].winBidder = winBidder;
                    }
                }

                roundNumber = roundData.name;
            }

            this.setRoundNum(roundNumber)

            return bidderList;

        },
        getBiddingVisibleList:function(data){
            var roundList           =   JSON.parse(JSON.stringify(data));
            //var biddingVisibleList  =   [{'visible':false},{'visible':false},{'visible':false},{'visible':false},{'visible':false}];

            var biddingVisibleList  =   JSON.parse(JSON.stringify(AuctionData.defaultPriceList));
            var bidderList          =   [{'name':'KT'},{'name':'SK'},{'name':'LG'}];

            _.each(biddingVisibleList, function(item){
                item.priceList = [];
            })

            _.each(bidderList, function(item){
                item.biddingVisibleList = JSON.parse(JSON.stringify(biddingVisibleList));
            })

            for(var i=0; i<roundList.length; ++i){
                for(var j=0; j<roundList[i].frequency.length; ++j){
                    for(var k=0; k<roundList[i].frequency[j].bidders.length; ++k){
                        var bidderPrice = roundList[i].frequency[j].bidders[k].price;
                        //var price = (bidderPrice == '') ? 0 : parseInt(bidderPrice);
                        bidderList[k].biddingVisibleList[j].priceList.push(bidderPrice);
                    }
                }
            }


            _.each(bidderList, function(bidder){
                _.each(bidder.biddingVisibleList,function(biddingVisible){
                    var flag = _.every(biddingVisible.priceList,function(price){
                        return price == '';
                    })

                    if(flag == true) {
                        biddingVisible.visible = false;
                    } else {
                        biddingVisible.visible = true;
                    }
                })
            })

            return bidderList;
        }
 	}))
})
