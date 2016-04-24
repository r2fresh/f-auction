requirejs.config({
	baseUrl: './',
	shim: {
		'socketio': {
			exports: 'io'
		}
	},
	paths: {
		'text':'lib/text/text',
		'tpl':'template',
		'socketio':'../socket.io/socket.io'
	}
})

requirejs([
	'socketio',
	'js/now_rate_increase/RateIncrease'
],
function(io, RateIncrease){
	/**
	 * 초기 실행 함수
	 */
	function init(){
		Auction.io = io();
		RateIncrease.render();
	}
	init();
})
