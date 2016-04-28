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
	'js/chart/ChartPrice',
	'js/chart/ChartRate'
],
function(io, ChartPrice, ChartRate){
	/**
	 * 초기 실행 함수
	 */
	function init(){
		Auction.io = io();
		ChartPrice.render();
		ChartRate.render();
	}
	init();
})
