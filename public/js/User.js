define([
   'module',
   'text!tpl/user.html',
   'js/AuctionData',
   'js/Model',
   ],
   function(module, User, AuctionData, Model){

	'use strict'

 	module.exports = new (Backbone.View.extend({
        //최소입찰증분 (단위는 퍼센트)
        lowestBidAdd : 4,

        //시작가(최저입찰가격) 리스트 템플릿
        auctionStartPriceTpl : null,

        //최소입찰가격 배열
        lowestBidPrices : null,

        //최소입찰가격 리스트 템플릿
        lowestBidPricesTpl : null,

        //통신사마다 가능한 대역폭 상한서
        ableBandWidth : 60,

 		el: '.user',
 		events :{
            'click .bid_btn' : 'onBid',
            'click .test_btn' : 'postBidSuccess'
 		},
 		initialize:function(){

		},
        render:function(){
            this.$el.html(User);

            this.auctionStartPriceTpl   = this.$el.find(".auction_start_price_tpl").html();
            this.lowestBidPricesTpl   = this.$el.find(".lowest_bid_prices_tpl").html();

            var template = Handlebars.compile(this.auctionStartPriceTpl);
            this.$el.find('.auction_start_price').append(template({'prices':AuctionData.auctionStartPrices}));

            this.setLowestBidPrices();
        },
        setLowestBidPrices : function(){
            this.lowestBidPrices = _.map(AuctionData.auctionStartPrices, Function.prototype.bind.call(function(frequency){
                    frequency.price = Math.ceil( frequency.price + (frequency.price*this.lowestBidAdd/100) )
                    return frequency
                },this))

            var template = Handlebars.compile(this.lowestBidPricesTpl);
            this.$el.find('.lowest_bid_prices').append(template({'prices':this.lowestBidPrices}));
        },
        onBid : function(){

            // 빈 입찰가격 체크 (true : 입찰가격모두빈칸, false : 입찰가격을 하나라도 입력했을경우)
            var emptyCheck = _.every(this.$el.find('.bid_price'),function(element){
                return $(element).val() === '';
            })
            if(emptyCheck) {
                alert('입찰가격을 입력하여 주십시오');
                return;
            }

            // 통신사 대역폭 체크
            var bidPriceArr = _.map(AuctionData.auctionStartPrices,Function.prototype.bind.call(function(frequency, index){

                var result = 0;

                if( $(this.$el.find('.bid_price')[index]).val() != '' ){
                    result = frequency.bandWidth
                } else {
                    result = 0;
                }
                return result
            },this))
            var maxBandWidth = _.reduce(bidPriceArr, function(memo, num){ return memo + num; }, 0);
            if(maxBandWidth > this.ableBandWidth){
                alert('정해진 대역폭을 초과 하셨습니다.');
                return;
            }

            // 광대역은 하나만 신청가능하다는 것을 체크
            var wideBandArr = _.filter(this.$el.find('.bid_price'),function(element, index){
                return AuctionData.auctionStartPrices[index].type === 'wideBand'
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

            Model.postElkEvent({
                 url: Elkplus.HOST + '/logmon/events' + eventId,
                 method : (this.writeType === 'edit') ? 'PUT' : 'POST',
                 contentType:"application/json; charset=UTF-8",
                 data : JSON.stringify(this.content),
                 success : Function.prototype.bind.call(this.postElkEventSuccess,this),
                 error : Function.prototype.bind.call(this.postElkEventError,this)
             })

            // var wideBandArr =  _.filter(AuctionData.auctionStartPrices,Function.prototype.bind.call(function(frequency, index){
            //
            //     var result = null;
            //
            //     if(frequency.type === 'wideBand'){
            //
            //     }
            //
            //     var result = 0;
            //
            //     if( $(this.$el.find('.bid_price')[index]).val() != '' ){
            //         result = frequency.bandWidth
            //     } else {
            //         result = 0;
            //     }
            //     return result
            // },this))


            //console.log(emptyCheck)

            // $.each(this.$el.find('.bid_price'),function(index,element){
            //     console.log($(element).val()
            // })

            // _.each(this.$el.find('.bid_price'),function(index,element){
            //     console.log($(element).val()
            // })

            //console.log(this.$el.find('.bid_price'))

        },
        postBidSuccess : function(data, textStatus, jqXHR){

            var frequencyData = [
                {
                    'name': 'A',
                    'bandWidth':40,
                    'hertz':'700',
                    'type':'wideBand',
                    'user':[
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
                    'user':[
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
                    'user':[
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
                    'user':[
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
                    'user':[
                        {'name':'KT', 'price':7620, 'vs':'win'},
                        {'name':'SK', 'price':5000, 'vs':'lose'},
                        {'name':'LG', 'price':6000, 'vs':'lose'}
                    ]

                }

                // {
                //     'KT': [
                //         {'name': 'A', 'bandWidth':40,'hertz':'700', 'type':'wideBand', 'price' : 7620},
                //         {'name': 'B', 'bandWidth':20, 'hertz':'18', 'type':'narrow', 'price' : 6553},
                //         {'name': 'C', 'bandWidth':20, 'hertz':'21', 'type':'wideBand', 'price' : 4513},
                //         {'name': 'D', 'bandWidth':40, 'hertz':'26', 'type':'wideBand', 'price' : 3816},
                //         {'name': 'E', 'bandWidth':20, 'hertz':'26', 'type':'narrow', 'price' : 3277},
                //     ],
                // },
                // {
                //     'SK': [
                //         {'name': 'A', 'bandWidth':40,'hertz':'700', 'type':'wideBand', 'price' : 7620},
                //         {'name': 'B', 'bandWidth':20, 'hertz':'18', 'type':'narrow', 'price' : 6553},
                //         {'name': 'C', 'bandWidth':20, 'hertz':'21', 'type':'wideBand', 'price' : 4513},
                //         {'name': 'D', 'bandWidth':40, 'hertz':'26', 'type':'wideBand', 'price' : 3816},
                //         {'name': 'E', 'bandWidth':20, 'hertz':'26', 'type':'narrow', 'price' : 3277},
                //     ],
                // },
                // {
                //     'LG': [
                //         {'name': 'A', 'bandWidth':40,'hertz':'700', 'type':'wideBand', 'price' : 7620},
                //         {'name': 'B', 'bandWidth':20, 'hertz':'18', 'type':'narrow', 'price' : 6553},
                //         {'name': 'C', 'bandWidth':20, 'hertz':'21', 'type':'wideBand', 'price' : 4513},
                //         {'name': 'D', 'bandWidth':40, 'hertz':'26', 'type':'wideBand', 'price' : 3816},
                //         {'name': 'E', 'bandWidth':20, 'hertz':'26', 'type':'narrow', 'price' : 3277},
                //     ],
                // }
            ]

            
        },
 	}))

})
