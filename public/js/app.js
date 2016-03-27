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
	'js/Login',
	'js/Admin',
	'js/Bidder',
	'js/Model',
	'socketio'
],
function(Login, Admin, Bidder, Model, io){

	var prevView = null;

	var routers = null;

	/**
	 * 초기 실행 함수
	 */
	function init(){

		var app, appName, hash = Auction.util.parseHash();

		Auction.io = io();

		routeStart();

		if(hash) {
			routers.navigate(hash.join('/'), { trigger: false, replace: true });
		} else {
			routers.navigate('', { trigger: true, replace: true });
		}

		checkSession();
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

	function checkSession(){

		if(!Auction.session.get('user_info')){
			window.location = '/#login';
		} else {
			Model.postLogin({
                 url: '/login',
                 method : 'POST',
                 data : {
                     'bidder' : Auction.session.get('user_info').user
                 },
                 dataType : 'json',
                 contentType:"application/x-www-form-urlencoded; charset=UTF-8",
                 success : function(){
					 var type = Auction.session.get('user_info').type;
						window.location = '/#' + type;
				 },
                 error : function(){

				 }
             })
		}
	}

	/**
	 * #의 router가 변경되면 처음에 실행 되는 함수
	 * @param {String} guideType 		선택된 가이드
	 */
	function changeHash( guideType){
		if(prevView != null){
			prevView.hide();
		}

		switch(guideType){
			case 'login' :
				Login.render();
				prevView = Login;
				Login.show();
			break;
			case 'admin' :
				if(!Auction.session.get('user_info')) {
					window.location = '/#login';
					return;
				}
				Admin.render();
				prevView = Admin;
				Admin.show();
			break;
			case 'bidder' :
				if(!Auction.session.get('user_info')) {
					window.location = '/#login';
					return;
				}
				Bidder.render();
				prevView = Bidder;
				Bidder.show();
			break;
			default :
				if(!Auction.session.get('user_info')) {
					window.location = '/#login';
					return;
				}
				Login.render();
				prevView = Login;
				Login.show();
			break;
		}
	}

	// function changePage(guideType){
	//
	// 	Login.hide();
	// 	Admin.hide();
	// 	Bidder.hide();
	//
	// 	// if(prevView != null){
	// 	// 	prevView.hide();
	// 	// }
	//
	//
	// 	// else {
	// 	// 	var type = (store.get('user_info')).type;
	// 	// 	window.location = '/#' + type;
	// 	// }
	//
	// 	console.log('3')
	//
	// 	switch(guideType){
	// 		case 'login' :
	// 			Login.render();
	// 			prevView = Login;
	// 			Login.show();
	// 		break;
	// 		case 'admin' :
	// 			Admin.render();
	// 			prevView = Admin;
	// 			Admin.show();
	// 		break;
	// 		case 'bidder' :
	// 			Bidder.render();
	// 			prevView = Bidder;
	// 			Bidder.show();
	// 		break;
	// 		default :
	// 			Login.render();
	// 			prevView = Login;
	// 			Login.show();
	// 		break;
	// 	}
	// }

	//Management.bind('LOGIN_CHECK',guideRender);

	//Login.render();
	//init();

	//if(Management.)

	init();

})
