define([
   'module',
   'text!tpl/admin.html',
   'js/Model',
   'js/Process',
   'js/AuctionData'
   ],
   function(module, Admin, Model, Pro, AuctionData){

	'use strict'

 	module.exports = new (Backbone.View.extend({
        auctionID : 0,

        roundNum : 1,

        roundPriceListTpl : "",

        intervalAuctionInfo : null,
 		el: '.admin',
 		events :{
            'click ._logout_btn' : 'onLogout',
            'click ._auction_start_btn' : 'onAuctionStart',
            'click ._clear_interval_btn' : 'onClearInterval'
 		},
        onClearInterval:function(){
            clearInterval(this.intervalAuctionInfo)
        },
 		initialize:function(){

		},
        render:function(){
            this.$el.html(Admin);
            //this.getRoundList();
            //this.intervalRoundList();

            this.setTpl();

            this.auctionID = 1;

            this.intervalAuctionInfo_fn();
            //this.getAuctionInfo();
        },

        /**
         * 템플릿 정의
         */
        setTpl:function(){
            this.roundPriceListTpl   = this.$el.find(".round_price_list_tpl").html();
        },

        intervalRoundList:function(){
            //var intervalID = window.setInterval(Function.prototype.bind.call(this.getRoundList,this), 500);
            this.getRoundList();
        },

        onAuctionStart:function(e){
            this.postAuction();
        },

        /**
         * 옥션 생성
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
         * 옥션 생성 성공
         */
        postAuctionSuccess:function(data, textStatus, jqXHR){
            if(textStatus === 'success'){
                console.log('auction Data :' + data)
                this.auctionID = data.id;
                this.intervalAuctionInfo_fn();
            }
        },

        /**
         * 옥션 생성 실패
         */
        postAuctionError:function(jsXHR, textStatus, errorThrown){

        },

        /**
         * 옥션 경매 정보를 호출 인터벌 함수
         */
        intervalAuctionInfo_fn:function(){
            this.intervalAuctionInfo = window.setInterval(Function.prototype.bind.call(this.getAuctionInfo,this), 500);
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
         * 옥션 경매 정보 호출 완료
         */
        getAuctionInfoSuccess:function(data, textStatus, jqXHR){
            if(textStatus === 'success'){
                console.log('auctionInfo : ', data)

                this.secondFormat(data);
            }
        },

        secondFormat : function(data){
            this.roundNum = this.roundTotal = Math.ceil(data.length/3);

            var roundList = [];

            for(var i=0; i<this.roundTotal ; ++i){

                roundList.push({
                    'round' : i + 1,
                    'companys' : _.filter(data, function(round){
                        return (round.roundNum === (i+1))
                    })
                })

            }

            this.thirdFormat(roundList);
        },

        thirdFormat : function(data){

            var roundList = [];

            for(var i=0; i<data.length ; ++i){

                roundList.push({
                    'round' : i + 1,
                    'frequency' : this.frequencyFormat(data[i].companys)
                })

            }

            console.log(roundList)

            this.setRoundListUI(roundList);
        },

        frequencyFormat : function(data){

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


                // var ktArr = _.filter(data,function(company){
                //     return company.companyName === 'KT';
                // })
                //
                // if(ktArr.length === 1){
                //     bidders.push({
                //         'name' :ktArr[0].companyName,
                //         'price' : ktArr[0][priceArr[i]]
                //     })
                // }
                //
                // var skArr = _.filter(data,function(company){
                //     return company.companyName === 'SK';
                // })
                //
                // if(skArr.length === 1){
                //     bidders.push({
                //         'name' :skArr[0].companyName,
                //         'price' : skArr[0][priceArr[i]]
                //     })
                // }
                //
                // var lgArr = _.filter(data,function(company){
                //     return company.companyName === 'LG';
                // })
                //
                // if(lgArr.length === 1){
                //     bidders.push({
                //         'name' :lgArr[0].companyName,
                //         'price' : lgArr[0][priceArr[i]]
                //     })
                // }

                // frequencyList.push({
                //     'bidders' : bidders
                // })

                //frequencyFormat[i].bidders = bidders;
            }




            //
            // var bidderArr = ['KT', 'SK', 'LG']
            //
            // var priceArr = ['priceA','priceB','priceC','priceD','priceE']
            //
            // for(var i=0; i<priceArr.length; ++i){
            //
            //     var bidders = []
            //
            //     for(var j=0; j<data.length; ++j){
            //
            //         bidders.push({
            //             'name' : bidderArr[j],
            //             'price' : (_.filter(data,function(company){
            //                 return company.name === bidderArr[j];
            //             }))[priceArr[i]]
            //         })
            //
            //     }
            //
            //     frequencyList.push({
            //         'bidders' : bidders
            //     })
            //
            // }

            // for (var i=0; i<6; ++i){
            //
            //     for(var j=0; j<bidderArr.length; ++j){
            //
            //         frequencyList.push({
            //             'bidders' : [
            //                 {
            //                     'name':'KT',
            //                     'price': (_.filter('data',function(bidder){
            //                         return bidder.companyName === 'KT')[0].price
            //                     }),
            //                 },
            //                 {
            //                     'name':'SK',
            //                     'price': _.filter('data',function(bidder){
            //                         return bidder.companyName === 'SK'
            //                     }),
            //                 },
            //                 {
            //                     'name':'LG',
            //                     'price': _.filter('data',function(bidder){
            //                         return bidder.companyName === 'LG'
            //                     }),
            //                 }
            //             ]
            //         })
            //
            //     }
            //
            // }

            return frequencyFormat;

        },

        setRoundListUI:function(roundList){

            console.log(roundList)

            this.$el.find('.round_price_list').remove();

            var template = Handlebars.compile(this.roundPriceListTpl);
            this.$el.find('.start_price_list').after(template({'roundList':roundList}));

        },

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

        testkkk:function(data){



            //roundData.name = 'ksy';

            //console.log(AuctionData.round);
            //console.log(roundData)

            // roundlist : [
            //     {
            //         round : 1,
            //         frequency : [
            //             {
            //                 'name': 'A',
            //                 'bandWidth':40,
            //                 'hertz':'700',
            //                 'type':'wideBand',
            //                 'winBidder': '',
            //                 'winPrice': 0,
            //                 'bidders': [
            //                     {'name':'KT', 'price':0, 'vs':'win'},
            //                     {'name':'SK', 'price':0, 'vs':'win'},
            //                     {'name':'LG', 'price':0, 'vs':'win'}
            //                 ]
            //             },
            //             {
            //                 'name': 'A',
            //                 'bandWidth':40,
            //                 'hertz':'700',
            //                 'type':'wideBand',
            //                 'winBidder': '',
            //                 'winPrice': 0,
            //                 'bidders': [
            //                     {'name':'KT', 'price':0, 'vs':'win'},
            //                     {'name':'SK', 'price':0, 'vs':'win'},
            //                     {'name':'LG', 'price':0, 'vs':'win'}
            //                 ]
            //             },
            //         ]
            //     }
            // ]

            // {
            //     "id": 1,
            //     "auctionNum": 5,
            //     "roundNum": 1,
            //     "companyName": "KT",
            //     "priceA": 2000,
            //     "priceB": 1000,
            //     "priceC": 1000000000,
            //     "priceD": 0,
            //     "priceE": 0
            //   },

            var roundList = [];

            for(var i=0; i<data.length; ++i) {

                var frequencyFormat = JSON.parse( JSON.stringify( AuctionData.round.frequency ) );
                roundList.push({'round':i+1,'frequency':frequencyFormat})

                for(var j=0; j<frequencyFormat.lengh ; ++j){


                    for(var h=0 ; h<3; ++h){data
                        var companyName = roundList.frequency[j].bidders[h].name;

                        var fff = _.filter(data[i].round,function(frequency){
                            return frequency.companyName === companyName;
                        });

                        //roundList.frequency[j].bidders[h].price = fff.
                    }


                }

            }

        },


        /**
         * 옥션 경매 정보 호출 완료
         */
        getAuctionInfoError:function(jsXHR, textStatus, errorThrown){

        },




        getRoundList:function(){
            Model.getRoundList({
                 url: Auction.HOST + '/api/bidding',
                 method : 'GET',
                 contentType:"application/json; charset=UTF-8",
                 data : JSON.stringify(this.content),
                 success : Function.prototype.bind.call(this.getRoundListSuccess,this),
                 error : Function.prototype.bind.call(this.getRoundListError,this)
             })
        },
        getRoundListSuccess:function(data, textStatus, jqXHR){
            //console.log(data);
            //console.log(Pro.getRoundList(data))
        },
        getRoundListError:function(jsXHR, textStatus, errorThrown){

        },
        onLogout : function(e){
            e.preventDefault();
            store.remove('user_info')
            window.location.reload(true);
        },
        hide : function(){
            this.$el.addClass('displayNone');
        },
        show : function(){
            this.$el.removeClass('displayNone');
            $('body').css({'background-color':'#FFFFFF'})
        }


 	}))

})
