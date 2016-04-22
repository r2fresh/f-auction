var _gaq = _gaq || [];

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
		// 'bootstrap':'app/lib/bootstrap/dist/js/bootstrap',
		// 'underscore':'app/lib/underscore/underscore',
		// 'backbone':'app/lib/backbone/backbone',
		//
		// 'd3':'app/lib/d3/d3',
		// 'c3':'app/lib/c3/c3',
		// 'tokenfield':'app/lib/bootstrap-tokenfield/dist/bootstrap-tokenfield',
		// 'chosen':'app/lib/chosen/chosen.jquery.min',
		// 'handlebars':'app/lib/handlebars/handlebars',
		// 'moment':'app/lib/moment/src/moment',
		// 'vanilla-masker':'app/lib/vanilla-masker/lib/vanilla-masker',
		//
		// 'tpl':'app/template',
		// 'elkModel':'app/js/model/model',
		// 'validation':'app/js/common/validation',
		// 'utils':'app/js/common/utils'
	}
})



requirejs([
	'socketio',
	'js/chart/Main'
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
