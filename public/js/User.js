define([
   'module',
   'text!tpl/user.html'
   ],
   function(module, User){

	'use strict'

 	module.exports = new (Backbone.View.extend({
 		el: '.user',
 		events :{
 		},
 		initialize:function(){

		},
        render:function(){
            this.$el.html(User);
            console.log("121221")
        }
 	}))

})
