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

	function postRound(data){
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

	function postLogin(data){
		$.ajax(data);
	}

	function getHertzList(data){
		$.ajax(data);
	}

	function getBandWidth(data){
		$.ajax(data);
	}

	function getBiddingDelayCount(data){
		$.ajax(data);
	}

	function getBiddingStrategy(data){
		$.ajax(data);
	}

	function getLastTime(data){
		$.ajax(data);
	}

	module.exports = new (Backbone.Model.extend({
		postLogin:postLogin,

		getAuction:getAuction,
		postAuction:postAuction,
		putAuction:putAuction,

		postRound:postRound,

		getLastTime:getLastTime,

		getHertzList:getHertzList,
		getBandWidth:getBandWidth,
		getBiddingStrategy:getBiddingStrategy,
		getBiddingDelayCount:getBiddingDelayCount,

		postBid:postBid,
		getAuctionInfo:getAuctionInfo,
		getRoundList : getRoundList,
		getAuctionList : getAuctionList
	}))

})
