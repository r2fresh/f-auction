define([
   'module',
   'text!tpl/login.html',
   'js/Model',
   'js/r2/r2Alert'
   ],
   function(module, Login, Model, R2Alert){

	'use strict'

 	module.exports = new (Backbone.View.extend({
        socket : null,
 		el: '.login',
 		events :{
            'keydown ._login_btn' : 'onkeydown',
            'click ._login_btn' : 'onLogin',
            'change ._login_bidder input[name=login_bidder]': 'onChangeBidder'
 		},
        render:function(){
            this.$el.html(Login);

            this.$el.find('._login_password, ._login_increaseRate').show();
            this.$el.find('._login_bandWidth, ._login_bidder_strategy, ._login_hertz').hide();

            // 모든 주파수 체크 박스 활성화
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
        * Enter Key 비활성화
        */
        onkeydown : function(e){
            if (e.keyCode == 13) return false;
        },

        /**
         * 로그인 이벤트 함수
         */
        onLogin:function(e){
            e.preventDefault();

            var bidder = this.$el.find('._login_bidder input[name=login_bidder]:checked').val();
            var bandWidth = this.$el.find('._login_bandWidth input[name=bandWidth]:checked').val();

            if(bidder === 'admin'){
                var pwd = this.$el.find('._login_password input').val();
                if(pwd === ''){
                    R2Alert.render({'msg':'관리자는 비밀번호를 입력하셔야 합니다.','w':350})
                    return ;
                }
                var rate = parseFloat( this.$el.find('._login_increaseRate option:selected').val());
            }
            Model.postLogin({
                 url: '/login',
                 method : 'POST',
                 data : {
                     'bidder' : bidder,
                     'pwd' : pwd,
                     'rate' : rate,
                     'bandWidth' : bandWidth
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
                        R2Alert.render({'msg':'비밀번호가 틀립니다. \n 다시 입력해주시기 바랍니다.','w':350});
                        return;
                    }
                } else {
                    if(parseFloat(data.rate) == 0){
                        R2Alert.render({'msg':'관리자가 아직 로그인 되지 않았습니다.\n관리자 로그인 후 입찰자 로그인이 가능합니다.','w':400});
                        return;
                    }
                }

                if(!data.overlap){
                    var name = (bidder.val() == 'admin') ? '관리자' : (bidder.val()).toUpperCase();

                    if(bidder.val() == 'admin') {
                        name = '관리자';
                    } else if(bidder.val() == 'sk'){
                        name = 'SKT'
                    } else if(bidder.val() == 'lg'){
                        name = 'LGU+'
                    } else {
                        name = bidder.val();
                    }

                    R2Alert.render({'msg':name + '로 로그인한 사용자가 있습니다.','w':300});
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
