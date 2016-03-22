define(function(require, exports, module){

	function getAuction(data){
		$.ajax(data);
	}

	function postAuction(data){
		$.ajax(data);
	}

	function putAuction(data){
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
		getAuction:getAuction,
		postAuction:postAuction,
		putAuction:putAuction,

		postBid:postBid,
		getAuctionInfo:getAuctionInfo,
		getRoundList : getRoundList,
		getAuctionList : getAuctionList
	}))

})
