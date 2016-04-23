(function(){
	window.Auction = window.Auction || {};

	Auction.HOST = 'http://14.32.174.222:8080'
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

	Auction.session = {
		set:function(key,value){
			sessionStorage.setItem(key,JSON.stringify(value));
		},
		get:function(key){
			return JSON.parse( sessionStorage.getItem(key) );
		},
		remove:function(key){
			return sessionStorage.removeItem(key);
		}
	};

})(Auction);

(function(Auction){

	Auction.numberic = {
		get:function(str){
			return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		}
	};

})(Auction);

(function(Auction){

	Auction.chart = {
		formatter:function(list,target){
			var round = list[target.point.index].round;
            var name = list[target.point.index].name;
            var companyName = '';

            if(name == 'KT'){
                companyName = 'KT';
            } else if(name == 'SK'){
                companyName = 'SKT';
            } else if(name == 'LG'){
                companyName = 'LGU+'
            }

            //var label = '<span class="label label-' + name + '-s">' + companyName + '</span>';
            var label = '<span class="text-' + name + '">' + companyName + '</span> / ';

            return label + '<span style="color:rgba(237, 31, 39, 1)">' + round + '</span> / ' + target.y;
		}
	};

})(Auction);
