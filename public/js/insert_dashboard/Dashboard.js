define([
   'module',
   'js/Model',
   'js/AuctionData',
   'js/RoundRateIncrease2',
   'js/r2/r2Alert',
   ],
   function(module, Model, AuctionData, RoundRateIncrease, R2Alert){

	'use strict'

 	module.exports = new (Backbone.View.extend({
        el:'._dashboard',
        roundList:null,
        roundListTpl:null,
        startPriceListTpl:null,
        events :{
            'click ._save_btn' : 'onSave',
            'click ._round_reset' : 'onRoundReset'
        },
        initialize:function(){
            this.setTpl();
        },
        render:function(){
            this.setStartPriceList();
            this.setDashBoardUI();
            this.getRoundList();
        },
        setTpl:function(){
            this.roundListTpl = this.$el.find('._round_list_tpl').html();
            this.$el.find('._round_list_tpl').remove();

            this.startPriceListTpl = this.$el.find("._start_price_list_tpl").html();
            this.$el.find("._start_price_list_tpl").remove();
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
                //this.roundList = JSON.parse(JSON.stringify(data));
                this.setRoundList(data);
            }
        },
        setRoundList:function(data){
            var roundList = JSON.parse(JSON.stringify(data));

            var $roundList = this.$el.find('._round_list');

            for(var i=0; i<roundList.length ;++i){
                var roundNum = i + 1;
                var $roundData = $roundList.find('._round_' + roundNum);

                for(var j=0; j<roundList[i].frequency.length ;++j){
                    var frequencyNum = j + 1;
                    var $radioList = $roundData.find('input[name=_radio_' + roundNum + '_' + frequencyNum + ']');
                    var $inputList = $roundData.find('._input_' + roundNum + '_' + frequencyNum);
                    for(var k=0; k<roundList[i].frequency[j].bidders.length ;++k){
                        if(roundList[i].frequency[j].bidders[k].vs == 'win'){
                            $($radioList[k]).prop('checked',true);
                        }
                        $($inputList[k]).val(roundList[i].frequency[j].bidders[k].price);
                    }
                }
            }
        },
        setStartPriceList:function(){
            var startPriceList   = JSON.parse(JSON.stringify(AuctionData.startPriceList));
            var template = Handlebars.compile(this.startPriceListTpl);
            this.$el.find('._start_price_list').html(template({'startPriceList':startPriceList}));
        },
        setDashBoardUI:function(){
            var roundList = this.getDashboardData();
            var template = Handlebars.compile(this.roundListTpl);
            this.$el.find('._round_list').html(template({'roundList':roundList}));

            this.$el.removeClass('displayNone')
        },
        getDashboardData:function(){
            var roundList = [];
            var roundData = {};
            for(var i=0; i<50; ++i){
                var roundData = {};
                roundData.name = i + 1;
                roundData.frequency = [];
                for(var j=0; j<5; ++j){
                    var bidders = JSON.parse(JSON.stringify(AuctionData.bidderList));
                    _.each(bidders,function(item, index){
                        item.round = i + 1
                        item.frequency = j + 1;
                        item.value = index;
                    })
                    roundData.frequency.push({'bidders':bidders})
                }
                roundList.push(roundData)
            }
            return roundList;
        },
        onRoundReset:function(e){
            e.preventDefault();

            var $roundData = $(e.currentTarget).parent().parent();

            $roundData.find('input[type=radio]').removeAttr("checked");
            $roundData.find('._bidder_price').val('');

        },
        onSave:function(){

            var roundFormDataList = this.getRoundFormDataList();
            var rateIncreaseList = this.getRoundRateIncreaseList(roundFormDataList);
            console.log(rateIncreaseList)
            this.postRoundList(rateIncreaseList);
        },
        getRoundFormDataList:function(){
            var $roundList = this.$el.find('._round_list');
            var roundList = [];
            var defaultRoundData = null;

            for(var i=0; i<50; ++i){
                var roundNum = i + 1;
                var $roundData = $roundList.find('._round_' + roundNum);

                defaultRoundData = JSON.parse(JSON.stringify(AuctionData.roundData));
                defaultRoundData.name = roundNum;

                var flag = _.every($roundData.find('._bidder_price'),function(element){
                    return $(element).val() == '';
                })

                if(flag == true) break;

                for(var j=0; j<5; ++j){
                    var frequencyNum = j + 1;
                    //console.log($roundData)

                    var $radioList = $roundData.find(' input[name=_radio_' + roundNum + '_' + frequencyNum + ']:checked');
                    var $inputList = $roundData.find('._input_' + roundNum + '_' + frequencyNum);

                    var radioValue = $radioList.val();

                    _.each(defaultRoundData.frequency[j].bidders,function(bidder, index){

                        bidder.price = $($inputList[index]).val();
                        if(bidder.price != ''){
                            if(radioValue == index){
                                defaultRoundData.frequency[j].winPrice = bidder.price;
                                defaultRoundData.frequency[j].winBidder = bidder.name;
                                bidder.vs = 'win';
                                bidder.className = 'label label-' + bidder.name + '-l';
                            } else {
                                bidder.lose = 'lose';
                                bidder.className = 'text-gray';
                            }
                        }

                    })
                }
                roundList.push(defaultRoundData);
                defaultRoundData = null;
            }

            return roundList
        },
        getRoundRateIncreaseList:function(data){

            var roundList = JSON.parse(JSON.stringify(data));
            var tempRoundList = null, tempBidderList = null, tempMaxList = null;

            for(var i=0; i<roundList.length; ++i){

                tempRoundList = [];
                for(var m=0; m<i+1; ++m){
                    tempRoundList.push( JSON.parse(JSON.stringify(roundList[m])) );
                }

                tempBidderList = this.getRoundHistoryPrice(tempRoundList);
                tempMaxList = this.getRoundMaxPrice(tempBidderList);

                // 각 라운드 별 입찰자에 해당하는 가격리스트와 미신청 주파수 설정
                for(var j=0; j<roundList[i].frequency.length; ++j){
                    for(var k=0; k<roundList[i].frequency[j].bidders.length; ++k){
                        roundList[i].frequency[j].bidders[k].rateIncrease = parseFloat(tempMaxList[k].rateIncreaseList[j].rateIncrease)
                    }
                }

                tempRoundList = null;
                tempBidderList = null;
                tempMaxList = null;
            }
            //var roundthis.getRoundHistoryPrice(data);

            // var roundList = JSON.parse(JSON.stringify(data));
            // var startPriceList   = JSON.parse(JSON.stringify(AuctionData.startPriceList));
            //
            // for(var i=0; i<roundList.length; ++i){
            //     var roundData = roundList[i];
            //     var frequencyList = roundData.frequency;
            //     for(var j=0; j<frequencyList.length; ++j){
            //         var bidderList = frequencyList[j].bidders;
            //
            //         for(var k=0; k<bidderList.length; ++k){
            //
            //             var bidder = bidderList[k];
            //
            //             var price = parseInt(bidder.price,10);
            //
            //             if(bidder.price == ''){
            //                 bidder.rateIncrease = 0;
            //             } else {
            //                 var startPrice = parseInt(startPriceList[j].price,10);
            //                 var percent = ( (price - startPrice)/startPrice )*100;
            //
            //                 bidder.rateIncrease = Math.round(percent * 100)/100;
            //             }
            //         }
            //
            //     }
            // }
            return roundList;
        },
        /**
        * 각 주파수 가격 히스토리를 구하는 함수
        */
        getRoundHistoryPrice:function(data){
            var roundList        = JSON.parse(JSON.stringify(data));
            var rateIncreaseList = JSON.parse(JSON.stringify(AuctionData.defaultPriceList));
            var bidderList       = [{'name':'KT'},{'name':'SK'},{'name':'LG'}]

            // 기본 변수 설정
            _.each(rateIncreaseList,function(item){
                item.historyPriceList = [];
            })

            _.each(bidderList, function(item){
                item.rateIncreaseList = JSON.parse(JSON.stringify(rateIncreaseList));
            })

            // 각 라운드 별 입찰자에 해당하는 가격리스트와 미신청 주파수 설정
            for(var i=0; i<roundList.length; ++i){
                for(var j=0; j<roundList[i].frequency.length; ++j){
                    for(var k=0; k<roundList[i].frequency[j].bidders.length; ++k){
                        var bidderPrice = roundList[i].frequency[j].bidders[k].price;
                        var price = (bidderPrice == '') ? 0 : bidderPrice;
                        bidderList[k].rateIncreaseList[j].historyPriceList.push(price);
                    }
                }
            }

            return bidderList;
        },
        /**
        * 각 주파수 가격 히스토리에서 최대가를 추출하고,
        * 그 가격과 시작가를 비교해서 누적 증분율을 구하는 함수
        */
        getRoundMaxPrice:function(data){

            var bidderList        = JSON.parse(JSON.stringify(data));
            var startPriceList   = JSON.parse(JSON.stringify(AuctionData.startPriceList));

            _.each(bidderList,function(bidder){
                _.each(bidder.rateIncreaseList,function(item,index){
                    item.maxPrice = _.max(item.historyPriceList);
                    if(item.maxPrice == 0){
                        item.rateIncrease = 0;
                    } else {
                        var startPrice = parseInt(startPriceList[index].price,10);
                        var percent = ( (item.maxPrice - startPrice)/startPrice )*100

                        // 소수점 2자리수 반올림
                        item.rateIncrease = Math.round(percent * 100)/100;
                    }
                });
            })

            return bidderList;
        },
        /**
         * 라운드별 주파수 정보를 저장
         */
        postRoundList:function(data){
            Model.postRound({
                 url: '/roundList',
                 method : 'POST',
                 contentType:"application/json; charset=UTF-8",
                 data : JSON.stringify({
                     'roundList':data
                 }),
                 success : Function.prototype.bind.call(this.postRoundListSuccess,this),
                 error : function(jsXHR, textStatus, errorThrown){}
             })
        },

        /**
         * 라운드별 주파수 정보를 저장 성공
         */
        postRoundListSuccess:function(data, textStatus, jqXHR){
            if(textStatus === 'success'){

                R2Alert.render({
                    'msg':'모든 라운드 정보를 입력 하셨습니다.',
                    'w':400,
                    'callback':Function.prototype.bind.call(this.emitRoundResult,this)
                });
            }
        },
        emitRoundResult : function(){
            Auction.io.emit('GET_CHART_DATA', 'getChartData');
            Auction.io.emit('NOW_RATE_INCREASE', 'now_rate_increase');
            Auction.io.emit('DASHBOARD', 'dashboard');
        }
 	}))
})
