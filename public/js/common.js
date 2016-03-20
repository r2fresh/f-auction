(function(){
	window.Auction = window.Auction || {};

	Auction.HOST = 'http://dry-castle-75128.herokuapp.com'
	//Auction.HOST = ''
})();

(function(Auction){
	Auction.util = {};

	_.extend(Auction.util,{

		parseHash : function(){
			var hash;

			if(!location.hash.length){
				return null;
			}

			hash = location.hash.split('/');

			hash[0] = hash[0].replace('#','');

			return hash;
		}

	})
})(Auction);
