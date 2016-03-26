(function(){
	window.Auction = window.Auction || {};

	Auction.HOST = 'https://nameless-citadel-87760.herokuapp.com/'
	//Auction.HOST = ''

	//Auction.basil = null;

	Auction.io = null;
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

(function(Auction){

	Auction.interval = {
		intervalArr:[],
		set:function(name,fn){
			this.intervalArr.push({
				'name':name,
				'fn':setInterval(fn,1000),
			})
		},
		clear:function(name){
			if(!name){
				var arr = _.filter(this.intervalArr,function(interval){
					return interval.name === name;
				})
				clearInterval(arr[0].fn);
			} else {
				_.each(this.intervalArr,function(interval){
					clearInterval(interval.fn);
				})
			}
		},
		has:function(name){
			var arr = _.filter(this.intervalArr,function(interval){
				return interval.name === name;
			});
			return arr.length > 0;
		}
	};

})(Auction);

(function(Auction){

	Auction.io = {
		socketio:null,
		set:function(socket){
			this.socketio = socket;
		},
		get:function(){
			return this.socketio;
		}
	};

})(Auction);

(function(Auction){

	Auction.session = {
		set:function(key,value){
			sessionStorage.setItem(key,JSON.stringify(value));
		},
		get:function(key){
			return JSON.parse( sessionStorage.getItem(key) );
		}
	};

})(Auction);
