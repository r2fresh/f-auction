define([
   'module',
   'text!tpl/login.html'
   ],
   function(module, Login){

	'use strict'

 	module.exports = new (Backbone.View.extend({
 		el: '.login',
 		events :{
            'click ._login_btn' : 'onLogin'
 		},
 		initialize:function(){

		},
        render:function(){
            this.$el.html(Login);
        },

        /**
         * 로그인 이벤트 함수
         */
        onLogin:function(e){

            e.preventDefault();

            //입찰자 정보
            var bidder = this.$el.find('._login_bidder input[name=login_bidder]:checked').val();

            //입찰전략
            var bid_strategy = this.$el.find('._login_bidder_strategy').val();

            var type = (bidder === 'admin') ? 'admin' : 'bidder';

            //localstorage 저장
            store.set('user_info',{'type':type, 'user':bidder, 'strategy':bid_strategy})

        },
        hide : function(){
            this.$el.addClass('displayNone');
        },
        show : function(){
            this.$el.removeClass('displayNone');
            $('body').css({'background-color':'#2D3E4F'})
        }
 	}))

})
