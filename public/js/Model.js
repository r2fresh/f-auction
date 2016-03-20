define(function(require, exports, module){

	function postAuction(data){
		$.ajax(data);
	}

	function postBid(data){
		$.ajax(data);
	}

	function getAuctionInfo(data){
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
		getAuctionInfo:getAuctionInfo,
		getRoundList : getRoundList,
		getAuctionList : getAuctionList
	}))

})
