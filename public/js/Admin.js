define([
   'module',
   'text!tpl/admin.html'
   ],
   function(module, Admin){

	'use strict'

 	module.exports = new (Backbone.View.extend({
 		el: '.admin',
 		events :{
 		},
 		initialize:function(){

		},
        render:function(){
            this.$el.html(Admin);
            console.log("121221")
        }
 	}))

})
