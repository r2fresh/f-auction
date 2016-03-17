define([
   'module',
   'text!tpl/user.html',
   'js/AuctionData',
   'js/Model',
   ],
   function(module, User, AuctionData, Model){

	'use strict'

 	module.exports = new (Backbone.View.extend({
        bidder: 'KT',

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
        ableBandWidth : 60,

        //라운드 리스트 탬플릿
        roundListPrices : null,

        roundListPricesTpl : null,

 		el: '.user',
 		events :{
            'click .bid_btn' : 'onBid',
            'click .test_btn' : 'postBidSuccess',
            'click ._accordion_btn' : 'onAccordion'
 		},
 		initialize:function(){

		},
        render:function(){
            this.$el.html(User);

            this.setTpl();

            this.setLowestRacePrices(AuctionData.startPrices);


        },

        /**
         * 사용하는 템플릿 설정
         */
        setTpl : function(){
            this.lowestRacePricesTpl   = this.$el.find(".lowest_race_prices_tpl").html();
            this.lowestBidPricesTpl   = this.$el.find(".lowest_bid_prices_tpl").html();
            this.roundListPricesTpl   = this.$el.find(".round_list_prices_tpl").html();
        },

        /*
         * 최저경쟁가격(시작가) 리스트 설정
         */
        setLowestRacePrices : function(data){
            var template = Handlebars.compile(this.lowestRacePricesTpl);
            this.$el.find('.lowest_race_prices').empty().html(template(data));

            this.setLowestBidPrices(data);
            this.setBidPrices(data);
        },

        /**
         * 최소입찰액 리스트 설정
         */
        setLowestBidPrices : function(data){
            this.lowestBidPrices = _.map(data.frequency, Function.prototype.bind.call(function(frequency){
                    frequency.winPrice = Math.ceil( frequency.winPrice + (frequency.winPrice*this.lowestBidAdd/100) )
                    return frequency
                },this))

            console.log(this.lowestBidPrices)

            var template = Handlebars.compile(this.lowestBidPricesTpl);
            this.$el.find('.lowest_bid_prices').empty().html(template({'frequency':this.lowestBidPrices}));

        },

        /**
         * 입찰금액 리스트 설정
         */
        setBidPrices : function(data){

            _.each(data.frequency,
                Function.prototype.bind.call(
                    function(frequency,index){
                        //현재 해당되는 입찰
                        if(frequency.winBidder != '' && frequency.winBidder === this.bidder) {
                            $(this.$el.find('.bid_price')[index]).prop('disabled',true)
                        } else {
                            $(this.$el.find('.bid_price')[index]).prop('disabled',false)
                        }
                    },
                    this
                )
            )

        },

        /**
         * 블록별 가격 증가율 (시작가/승자의 가격 * 100)
         */

        /**
         * 과거 최고 입찰액 (본인이 쓴 과거 최고 입찰액)
         */

        /**
          * 1순위 블록 필요 입찰액
          */

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
                return AuctionData.startPrices.frequency[index].type === 'wideBand'
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
                    result = ( this.lowestBidPrices[index].winPrice <= parseInt($(element).val(),10) ) ? true : false
                }

                return result;
            },this))
            if(!lowestBidPriceCheck){
                alert('최소입찰액 이상 입력하시기 바랍니다.');
                return;
            }

            // Model.postElkEvent({
            //      url: Elkplus.HOST + '/logmon/events' + eventId,
            //      method : (this.writeType === 'edit') ? 'PUT' : 'POST',
            //      contentType:"application/json; charset=UTF-8",
            //      data : JSON.stringify(this.content),
            //      success : Function.prototype.bind.call(this.postElkEventSuccess,this),
            //      error : Function.prototype.bind.call(this.postElkEventError,this)
            //  })

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
        postBidSuccess : function(data, textStatus, jqXHR){

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

            this.setRoundUI(roundData)

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

        setRoundUI : function(data){

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
        }
 	}))

})


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
