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
            'click ._login_btn' : 'onLogin',
            'change ._login_bidder input[name=login_bidder]': 'onChangeBidder'
 		},
 		initialize:function(){
		},
        render:function(){
            this.$el.html(Login);

            this.$el.find('._login_password, ._login_increaseRate').show();
            this.$el.find('._login_bandWidth, ._login_bidder_strategy, ._login_hertz').hide();

            // 입찰 시 지원한 주파수 저장
            this.$el.find('._hertz:input:checkbox').each(function(){
                $(this).prop('checked', true);
            })
        },
        /**
         * 사용자 선택 핸들러
         */
        onChangeBidder:function(e){

            var radioValue = $(e.currentTarget).val();

            if(radioValue === 'admin'){
                this.$el.find('._login_password, ._login_increaseRate').show();
                this.$el.find('._login_bandWidth, ._login_bidder_strategy, ._login_hertz').hide();
            } else {
                this.$el.find('._login_password, ._login_increaseRate').hide();
                this.$el.find('._login_bandWidth, ._login_bidder_strategy, ._login_hertz').show();
            }

        },

        /**
         * 로그인 이벤트 함수
         */
        onLogin:function(e){

            e.preventDefault();

            var bidder = this.$el.find('._login_bidder input[name=login_bidder]:checked').val();

            if(bidder === 'admin'){
                var pwd = this.$el.find('._login_password input').val();
                if(pwd === ''){
                    alert('관리지는 비밀번호를 입력하셔야 합니다.');
                    return ;
                }
                var rate = parseInt( this.$el.find('._login_increaseRate option:selected').val(), 10);
            }

            console.log(bidder);
            console.log(pwd);
            console.log(rate)

            Model.postLogin({
                 url: '/login',
                 method : 'POST',
                 data : {
                     'bidder' : bidder,
                     'pwd' : pwd,
                     'rate' : rate
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

            //신청 대역폭
            var bandWidth = this.$el.find('._login_bandWidth input[name=bandWidth]:checked');

            //입찰전략
            var bid_strategy = this.$el.find('._login_bidder_strategy textarea');

            //로그인 유저 타입
            var type = (bidder.val() === 'admin') ? 'admin' : 'bidder';

            if(textStatus === 'success'){

                if(data.bidder == 'admin'){
                    if(!data.pwdResult){
                        alert('비밀번호가 틀립니다.\n다시 입력해주시기 바랍니다.');
                        return;
                    }
                } else {
                    if(data.rate == 0){
                        alert('관리자가 아직 로그인 되지 않았습니다.\n관리자 로그인 후 입찰자 로그인이 가능합니다.')
                        return;
                    }
                }

                if(!data.overlap){
                    alert(bidder.val() + '로 로그인한 사용자가 있습니다.');
                    bid_strategy.val('')
                    return;
                }
            }

            var hertzList = (data.bidder === 'admin') ? '' : this.getCheckedHertz();

            Auction.session.set('user_info',{
                    'type' : type,
                    'user' : bidder.val(),
                    'strategy' : bid_strategy.val(),
                    'bandWidth' : bandWidth.val(),
                    'rate' : data.rate,
                    'hertzList' : hertzList
                }
            )
            Cookies.set('user', bidder.val());

            window.location.reload();
        },

        /**
         * 입찰 시 지원한 주파수 저장
         */
        getCheckedHertz:function(){
            return _.map(this.$el.find('._hertz:input:checkbox'),function(element){
                var flag = $(element).prop('checked');
                return {'name':$(element).val(),'hertzFlag':flag}
            })
        },

        postLoginError:function(jsXHR, textStatus, errorThrown){
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
