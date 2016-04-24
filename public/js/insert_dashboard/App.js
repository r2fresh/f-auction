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
	'js/insert_dashboard/Dashboard'
],
function(io, Dashboard){
	/**
	 * 초기 실행 함수
	 */
	function init(){
		Auction.io = io();
		Dashboard.render();
	}
	init();
})
