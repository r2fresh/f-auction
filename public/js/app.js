var _gaq = _gaq || [];


requirejs.config({
	baseUrl: './',
	paths: {
		'text':'lib/text/text',
		'tpl':'template'
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
	'js/Login',
	'js/Admin',
	'js/User'
],
function(Login, Admin, User){

	/**
	 * 초기 실행 함수
	 */
	function init(){

		var app, appName, hash = Auction.util.parseHash();

		routeStart();

		if(hash) {
			routers.navigate(hash.join('/'), { trigger: false, replace: true });
		} else {
			routers.navigate('', { trigger: true, replace: true });
		}
	}

	/**
	 * hash를 사용하여 페이지 전환 설정
	 */
	function routeStart(){

		window.router = routers = new (Backbone.Router.extend());

		routers.route('','defaultGuide', changeHash);
		routers.route('*guideType', 'changeGuide', changeHash);
		// routers.route('*guideType/:main', 'changeMainMenu', changeHash);
		// routers.route('*guideType/:main/:sub', 'changeSubMenu', changeHash);

		Backbone.history.start({pushstate:true})

	}

	/**
	 * #의 router가 변경되면 처음에 실행 되는 함수
	 * @param {String} guideType 		선택된 가이드
	 */
	function changeHash( guideType){

		switch(guideType){
			case 'admin' :
				Admin.render();
			break;
			case 'user' :
				User.render();
			break;
			default :
				Login.render();
			break;
		}
	}

	//Login.render();
	init();

})
