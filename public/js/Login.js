define([
   'module',
   'text!tpl/login.html',
   'socketio'
   ],
   function(module, Login, SocketIo){

	'use strict'

 	module.exports = new (Backbone.View.extend({
        socket : null,
 		el: '.login',
 		events :{
            'click ._login_btn' : 'onLogin'
 		},
 		initialize:function(){
            this.socket = SocketIo();
		},
        render:function(){
            this.$el.html(Login);
        },

        /**
         * 로그인 이벤트 함수
         */
        onLogin:function(e){

            e.preventDefault();

            this.socket.emit('login','admin');

            //입찰자 정보
            var bidder = this.$el.find('._login_bidder input[name=login_bidder]:checked').val();

            //제한 대역폭
            var hertz = this.$el.find('._login_hertz input[name=hertz]:checked').val();

            //입찰전략
            var bid_strategy = this.$el.find('._login_bidder_strategy').val();

            //로그인 유저 타입
            var type = (bidder === 'admin') ? 'admin' : 'bidder';

            //localstorage 저장
            store.set('user_info',{'type':type, 'user':bidder, 'strategy':bid_strategy, 'hertz':hertz});

            window.location = '/#' + type;

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
