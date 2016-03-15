define([
   'module',
   'text!tpl/login.html'
   ],
   function(module, Login){

	'use strict'

 	module.exports = new (Backbone.View.extend({
 		el: '.login',
 		events :{
 		},
 		initialize:function(){

		},
        render:function(){
            this.$el.html(Login);
            console.log('login start')
        }
 	}))

})
