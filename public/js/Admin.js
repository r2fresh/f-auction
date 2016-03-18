define([
   'module',
   'text!tpl/admin.html',
   'js/Model',
   'js/Process'
   ],
   function(module, Admin, Model, Pro){

	'use strict'

 	module.exports = new (Backbone.View.extend({
 		el: '.admin',
 		events :{
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
        getRoundListError:function(){

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
