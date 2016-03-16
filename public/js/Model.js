define(function(require, exports, module){

	function postBid(data){
		$.ajax(data);
	}

	module.exports = new (Backbone.Model.extend({
		postBid:postBid
	}))

})
