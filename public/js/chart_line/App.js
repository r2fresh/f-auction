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
	'js/chart_line/Chart'
],
function(io, Chart){
	/**
	 * 초기 실행 함수
	 */
	function init(){
		Auction.io = io();
		Chart.render();
	}
	init();
})
