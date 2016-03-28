define([
   'module',
   'text!tpl/login.html',
   'js/Model'
   ],
   function(module, Login, Model){

	'use strict'

 	module.exports = new (Backbone.View.extend({
        socket : null,
 		el: '.login',
 		events :{
            'click ._login_btn' : 'onLogin'
 		},
 		initialize:function(){
		},
        render:function(){
            this.$el.html(Login);
        },

        // sessionCheck:function(){
        //
        //     var flag = Auction.session.get('user_info');
        //
        //     if(!flag){
        //         Cookies.remove('user', bidder.val());
        //     }
        //
        // },

        /**
         * 로그인 이벤트 함수
         */
        onLogin:function(e){

            e.preventDefault();

            var bidder = this.$el.find('._login_bidder input[name=login_bidder]:checked').val();

            Model.postLogin({
                 url: '/login',
                 method : 'POST',
                 data : {
                     'bidder' : bidder
                 },
                 dataType : 'json',
                 contentType:"application/x-www-form-urlencoded; charset=UTF-8",
                 success : Function.prototype.bind.call(this.postLoginSuccess,this),
                 error : Function.prototype.bind.call(this.postLoginError,this),
             })
        },

        postLoginSuccess:function(data, textStatus, jqXHR){

            //입찰자 정보
            var bidder = this.$el.find('._login_bidder input[name=login_bidder]:checked');

            //제한 대역폭
            var hertz = this.$el.find('._login_hertz input[name=hertz]:checked');

            //입찰전략
            var bid_strategy = this.$el.find('._login_bidder_strategy');

            //로그인 유저 타입
            var type = (bidder.val() === 'admin') ? 'admin' : 'bidder';

            if(textStatus === 'success'){
                if(!data.result){
                    alert(bidder.val() + '로 로그인한 사용자가 있습니다.');
                    bid_strategy.val('')
                    return;
                }
            }

            Auction.session.set('user_info',{'type':type, 'user':bidder.val(), 'strategy':bid_strategy.val(), 'hertz':hertz.val()})
            Cookies.set('user', bidder.val());

            window.location.reload();
            //window.location = '/#' + type;

            //var basil = new window.Basil({storages:['session'], expireDays:1})

            //Basil.sessionStorage.get(key);
            //basil.sessionStorage.set('user_info', {'type':type, 'user':bidder, 'strategy':bid_strategy, 'hertz':hertz});

            //입찰자 정보
            //var bidder = this.$el.find('._login_bidder input[name=login_bidder]:checked').val();

            //제한 대역폭
            //var hertz = this.$el.find('._login_hertz input[name=hertz]:checked').val();

            //입찰전략
            //var bid_strategy = this.$el.find('._login_bidder_strategy').val();



            //Auction.session.set('user_info',{'type':type, 'user':bidder, 'strategy':bid_strategy, 'hertz':hertz})
            //Cookies.set('user', bidder);

            //window.location = '/#' + type;



            //console.log( Cookies.getJSON('user_info').type)
            //sessionStorage.setItem('user_info',JSON.stringify({'type':type, 'user':bidder, 'strategy':bid_strategy, 'hertz':hertz}))

            // options = {
            //   // Namespace. Namespace your Basil stored data
            //   // default: 'b45i1'
            //   namespace: 'foo',
            //
            //   // storages. Specify all Basil supported storages and priority order
            //   // default: `['local', 'cookie', 'session', 'memory']`
            //   storages: ['cookie', 'local']
            //
            //   // expireDays. Default number of days before cookies expiration
            //   // default: 365
            //   expireDays: 31
            //
            // };
        },

        postLoginError:function(jsXHR, textStatus, errorThrown){
        },


        // checkLogin:function(msg){
        //
        //     console.log(Auction.io.id())
        //
        //     console.log(msg)
        //
        //
        //     //입찰자 정보
        //     var bidder = this.$el.find('._login_bidder input[name=login_bidder]:checked').val();
        //
        //     //제한 대역폭
        //     var hertz = this.$el.find('._login_hertz input[name=hertz]:checked').val();
        //
        //     //입찰전략
        //     var bid_strategy = this.$el.find('._login_bidder_strategy').val();
        //
        //     //로그인 유저 타입
        //     var type = (bidder === 'admin') ? 'admin' : 'bidder';
        //
        //     var koreanType = (bidder === 'admin') ? '관리자' : bidder;
        //
        //     console.log('returnvalu : ' + msg)
        //
        //     // 로그인 화면에 있는 다른 사람이 로그인이 안되도록 하는 것
        //     if(Auction.io.id() !== msg) {
        //         // 관리자 또는 같은 입찰자로 로그인 된 경우
        //         if(Auction.io.id() === ''){
        //             alert(koreanType + '로 로그인한 유저가 있습니다.\n' + koreanType + '로는 로그인이 불가능 합니다.');
        //         }
        //         return;
        //     }
        //
        //
        //
        //     //localstorage 저장
        //     //store.set('user_info',{'type':type, 'user':bidder, 'strategy':bid_strategy, 'hertz':hertz});
        //
        //     sessionStorage.setItem('user_info',{'type':type, 'user':bidder, 'strategy':bid_strategy, 'hertz':hertz})
        //
        //     window.location = '/#' + type;
        // },
        hide : function(){
            this.$el.addClass('displayNone');
        },
        show : function(){
            this.$el.removeClass('displayNone');
            $('body').css({'background-color':'#2D3E4F'})
        }
 	}))

})
