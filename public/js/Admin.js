define([
   'module',
   'text!tpl/admin.html',
   'js/Model',
   'js/Process'
   ],
   function(module, Admin, Model, Pro){

	'use strict'

 	module.exports = new (Backbone.View.extend({
        auctionID : 0,
        intervalAuctionInfoID : null,
 		el: '.admin',
 		events :{
            'click ._logout_btn' : 'onLogout',
            'click ._auction_start_btn' : 'postAuction'
 		},
 		initialize:function(){

		},
        render:function(){
            this.$el.html(Admin);
            //this.getRoundList();
            this.intervalRoundList();
        },
        intervalRoundList:function(){
            //var intervalID = window.setInterval(Function.prototype.bind.call(this.getRoundList,this), 500);
            this.getRoundList();
        },

        /**
         * Create Auction
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
         * Success Auction Create
         */
        postAuctionSuccess:function(data, textStatus, jqXHR){
            if(textStatus === 'success'){
                this.auctionID = data.id;
                this.intervalAuctionInfo();
            }
        },

        /**
         * Error Auction Create
         */
        postAuctionError:function(jsXHR, textStatus, errorThrown){

        },

        intervalAuctionInfo:function(){
            this.intervalAuctionInfoID = window.setInterval(Function.prototype.bind.call(this.getAuctionInfo,this), 500);
        },

        getAuctionInfo:function(){
            Model.getAuctionInfo({
                 url: Auction.HOST + '/api/auctioninfo/' + this.auctionID,
                 method : 'GET',
                 contentType:"application/json; charset=UTF-8",
                 success : Function.prototype.bind.call(this.getAuctionInfoSuccess,this),
                 error : Function.prototype.bind.call(this.getAuctionInfoError,this)
             })
        },
        getAuctionInfoSuccess:function(data, textStatus, jqXHR){
            if(textStatus === 'success'){
                console.log('auctionInfo : ' + data)
            }
        },
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
            console.log(data);
            console.log(Pro.getRoundList(data))
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
