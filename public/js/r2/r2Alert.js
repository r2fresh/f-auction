define([
 	'module',
 	'text!tpl/r2_alert.html'
 	],
 	function(module, R2_Alert){

        'use strict'

 		module.exports = new (Backbone.View.extend({
            title : '',
            message : '',
            className : '',
            callback : null,
            events :{
                // 로그아웃
                'click #confirm' : 'onConfirm',
     		},
            render:function(obj){
                this.className = 'r2_alert';

                if(obj.callback){
                    this.callback = obj.callback;
                }

                var r2Alert = R2.Dialog.render(this.className, R2_Alert);
                this.setElement(r2Alert);
                this.$el.find('.r2-dialog-main').css({'width':obj.w})
                this.$el.find('#message').text(obj.msg);
                R2.Dialog.rePosition(obj.className)
            },
            onConfirm:function(e){
                e.preventDefault();

                if(this.callback){
                    this.callback();
                    this.callback = null;
                }

                R2.Dialog.destroy(this.className);
            },
            allDestroy:function(){
                R2.Dialog.destroy();
            }
        }))
 	}
)
