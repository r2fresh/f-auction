define([
   'module',
   'js/Model',
   'js/AuctionData',
   'js/insert_dashboard/RoundRateIncrease',
   'js/r2/r2Alert',
   ],
   function(module, Model, AuctionData, RoundRateIncrease, R2Alert){

	'use strict'

 	module.exports = new (Backbone.View.extend({
        el:'#insert_dashboard',
        roundList:null,
        roundListTpl:null,
        startPriceListTpl:null,
        events :{
            'click ._save_btn' : 'onSave',
            'click ._round_reset' : 'onRoundReset',
            'click ._timer_btn' : 'onTimer'
        },
        initialize:function(){
            this.setTpl();
        },
        render:function(){
            this.setStartPriceList();
            this.setDashBoardUI();
            this.getRoundList();

            VMasker(document.querySelectorAll('.header_hour')).maskNumber();
            VMasker(document.querySelectorAll('.header_min')).maskNumber();
            VMasker(document.querySelectorAll('._bidder_price')).maskNumber();
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
                //var roundList = store.get('roundList')
                var roundList = data;
                this.setRoundList(roundList);
            }
        },
        setRoundList:function(data){
            var roundList = JSON.parse(JSON.stringify(data));

            var $roundList = this.$el.find('._round_list');

            for(var i=0; i<roundList.length ;++i){
                var roundNum = i + 1;
                var $roundData = $roundList.find('._round_' + roundNum);

                // 입찰자 입찰 타입 정보에 따라 UI 설정
                _.each(roundList[i].company,function(item){
                    if(item.biddingType == true){
                        $roundData.find('._bidding_type:input:checkbox[value='+item.name+']').prop('checked',true);
                    }
                })

                // 주파수 정보에 따라 UI 설정
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

                // 입찰자정보 설정
                roundData.company = JSON.parse(JSON.stringify(AuctionData.bidderList));
                _.each(roundData.company,function(company, index){
                    company.round = i + 1;
                });

                // 주파수정보 설정
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
            //console.log(rateIncreaseList)
            this.postRoundList(rateIncreaseList);
        },
        onTimer:function(e){
            var hour    = this.$el.find('.dashboard_header .header_hour').val();
            var min     = this.$el.find('.dashboard_header .header_min').val();

            // hour 시간체크
            if(hour == ''){
                R2Alert.render({
                    'msg':'"시"를 입력하셔야 합니다.',
                    'w':400
                });
                return;
            }

            // hour 시간체크
            if(min == ''){
                R2Alert.render({
                    'msg':'"분"을 입력하셔야 합니다.',
                    'w':400
                });
                return;
            }

            if(parseInt(hour,10) > 23) {
                R2Alert.render({
                    'msg':'시간은 0~23시까지 입력이 가능합니다.',
                    'w':400
                });
                return;
            }

            if(parseInt(min,10) > 59) {
                R2Alert.render({
                    'msg':'시간은 0~59시까지 입력이 가능합니다.',
                    'w':400
                });
                return;
            }

            var hourAtr =(parseInt(hour,10) < 10) ? '0' + hour : hour;
            var minAtr =(parseInt(min,10) < 10) ? '0' + min : min;

            Auction.io.emit('COUNTDOWN', hourAtr + '|' + minAtr );

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

                // 입찰자 입찰 타입을 저장
                _.each(defaultRoundData.company,function(item){
                    var flag = $roundData.find('._bidding_type:input:checkbox[value='+item.name+']').prop('checked');
                    item.biddingType = flag;
                })

                // 주파수 정보 저장
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
                                bidder.vs = 'lose';
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

            var roundList = JSON.parse(JSON.stringify( this.getRoundWinRateIncreaseList(data) ));
            var tempRoundList = null, tempBidderList = null, tempMaxList = null;

            for(var i=0; i<roundList.length; ++i){

                tempRoundList = [];
                for(var m=0; m<i+1; ++m){
                    tempRoundList.push( JSON.parse(JSON.stringify(roundList[m])) );
                }

                tempBidderList = RoundRateIncrease.getRoundHistoryPrice(tempRoundList);
                tempMaxList = RoundRateIncrease.getRoundMaxPrice(tempBidderList);

                // 각 라운드 별 입찰자에 해당하는 가격리스트와 미신청 주파수 설정
                for(var j=0; j<roundList[i].frequency.length; ++j){
                    for(var k=0; k<roundList[i].frequency[j].bidders.length; ++k){
                        roundList[i].frequency[j].bidders[k].rateIncrease = parseFloat(tempMaxList[k].rateIncreaseList[j].rateIncrease)
                        roundList[i].frequency[j].bidders[k].nowRateIncrease = parseFloat(tempMaxList[k].rateIncreaseList[j].nowRateIncrease)
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

            //console.log(roundList);
            return roundList;
        },
        getRoundWinRateIncreaseList:function(data){
            var roundList = JSON.parse(JSON.stringify(data))
            return RoundRateIncrease.getRoundWinHistoryPrice(roundList)
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

                store.set('roundList',data)

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
