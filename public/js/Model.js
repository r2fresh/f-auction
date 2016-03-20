define(function(require, exports, module){

	function postAuction(data){
		$.ajax(data);
	}

	function postBid(data){
		$.ajax(data);
	}

	function getRoundList(data){
		$.ajax(data);
	}

	function getAuctionList(data){
		$.ajax(data);
	}

	module.exports = new (Backbone.Model.extend({
		postAuction:postAuction,
		postBid:postBid,
		getRoundList : getRoundList,
		getAuctionList : getAuctionList
	}))

})
