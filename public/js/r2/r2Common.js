

    (function(){
    	window.R2 = window.R2 || {};
    })();

    // window.Elkplus = window.Elkplus || {};
    //
    // window.Elkplus.flag = false;
    // window.Elkplus.HOST = (window.location.host === 'localhost:5604') ? 'http://10.5.1.188:5601' : '';

    (function(R2) {

    	window.R2 = R2 || {};

        R2.Dialog = {
            zIndex : 1000,
            getZIndex : function(){
                var dialog = document.querySelectorAll('.r2-dialog');

                var zIndex = this.zIndex;

                if(dialog.length > 0){

    				Array.prototype.forEach.call(dialog,function(element){

    					var dialogZIndex = parseInt( element.style['z-index'], 10);

    					zIndex = (dialogZIndex > zIndex) ? dialogZIndex : zIndex;
    				})
    			}

                return zIndex;
            },
            setZIndex : function(index){
                this.zIndex = index;
            },
            render : function(className, content){
                var dialog = document.createElement('div');
    			var dialogMain = null;//document.createElement('div');
    			//var dialogContent = null;//document.createElement('div');

                var dialogBackdrop = document.createElement('div');

                var zIndex = this.getZIndex();//this.getZindex();

                dialog.className = 'r2-dialog ' + className;
    			dialog.style['z-index'] = zIndex + 1;

                //dialogBackdrop.setAttribute('class', 'r2-dialog-backdrop ' + className);
                dialogBackdrop.className = 'r2-dialog-backdrop';
    			//dialogBackdrop.style['z-index'] = zIndex + 2;

    			//dialogMain.setAttribute('class', 'r2-dialog-main');
                //dialogMain.className = 'r2-dialog-main';
    			//dialogMain.style['z-index'] = zIndex + 3;

    			//dialogContent.setAttribute('class', 'r2-dialog-content');
    			//dialogContent.style['z-index'] = zIndex + 4;

    			if(typeof content === 'string'){
                    var div = document.createElement('div');
                    div.innerHTML = content;
                    dialogMain = div;
    			} else {
    				dialogMain = content;
    			}

                dialogMain.className = 'r2-dialog-main ' + dialogMain.className;

                //var dialogMain = HTMLParser(html);
                //var dialogMain = parser.parseFromString(html, "text/html");


                dialog.appendChild(dialogBackdrop);
                dialog.appendChild(dialogMain);

                //dialog.innerHTML = dialog.innerHTML + html;


                //dialog.appendChild(dialogMain);

    			//dialog.appendChild(dialogMain);
    			//dialogMain.appendChild(dialogContent);

    			document.body.appendChild(dialog);

                // var dialogBackdropHeight = dialogBackdrop.offsetHeight
    			// ,dialogMainHeight = dialogMain.offsetHeight
    			// ,dialogMainTop = Math.abs(parseInt((dialogBackdropHeight)/2,10) - parseInt(dialogMainHeight/2,10));

    			//dialogMain.style.top = dialogMainTop + 'px';

    			return dialog;

            },

            destroy:function(className){

    			var dialogs = document.querySelectorAll( '.' + (className || 'r2-dialog') );

    			if(dialogs.length === 0) return;

    			Array.prototype.forEach.call(dialogs, function(element){
    				if(element.parentNode){
    					 element.parentNode.removeChild(element);
    				}
    			})
    		},

            rePosition:function(className){
    			var modal_backdrop = document.getElementsByClassName('r2-dialog-backdrop')[0];
    			var modal = document.getElementsByClassName('r2-dialog-main')[0];

    			var modal_backdrop_h = modal_backdrop.offsetHeight
    			,modal_h = modal.offsetHeight;

    			var modal_top = 0;

    			if(modal_backdrop_h > modal_h){
    				modal_top = Math.abs(parseInt((modal_backdrop_h)/3,10) - parseInt(modal_h/3,10));
    			} else {
    				modal_top = Math.abs(parseInt(modal_h/3,10) - parseInt((modal_backdrop_h)/3,10));
    			}

    			var modal_backdrop_w = modal_backdrop.offsetWidth
    			,modal_w = modal.offsetWidth
    			//,modal_left = (modal_backdrop_w)/2 - modal_w/2;

    			modal.style.top = modal_top + 'px';
    			//modal.style.left = modal_left + 'px';
            },

    		isOpen:function(className){
    			if(!className) return;
    			var dialogs = document.querySelectorAll('.' + className);
    			return (dialogs.length > 0);
    		}

        }

        R2.Loading = {
            render : function(className, content){

                //var loading = document.createElement('div');

                var loading =
                '<div class="r2-loading">' +
                '<div class="loading-container">' +
                '<div class="loading"></div>' +
                '<div id="loading-text">loading</div>' +
                '</div>' +
                '<div class="r2-loading-title">' +
                '<span>' + content + '</span>' +
                '</div>' +
                '</div>';

                var r2Loading = R2.Dialog.render(className,loading);

                var dialogMain = r2Loading.getElementsByClassName('r2-dialog-main')[0];
                var dialogBackdrop = r2Loading.getElementsByClassName('r2-dialog-backdrop')[0];

                // var dialogBackdropWidth = dialogBackdrop.offsetWidth
    			// ,dialogMainWidth = dialogMain.offsetWidth
    			// ,dialogMainLeft = Math.abs(parseInt((dialogBackdropWidth)/2,10) - parseInt(dialogMainWidth/2,10));

                var dialogBackdropHeight = dialogBackdrop.offsetHeight
    			,dialogMainHeight = dialogMain.offsetHeight
    			,dialogMainTop = Math.abs(parseInt((dialogBackdropHeight)/2,10) - parseInt(dialogMainHeight/2,10));

                //console.log(dialogBackdropWidth)
                //console.log(dialogMainWidth)


                dialogMain.style.margin = dialogMainTop + 'px auto';
    			//dialogMain.style.top = dialogMainTop + 'px';
                //dialogMain.style.left = dialogMainLeft + 'px';

                // var modal_backdrop_w = $modal_backdrop.outerWidth(true);
    			// var modal_w = $modal.outerWidth(true);
    			// var modal_left = (modal_backdrop_w)/2 - modal_w/2;
            },
            putTitle : function(className, content){
                var r2Loading = document.getElementsByClassName('r2-dialog ' + className)[0];

                var loadingTitle = (r2Loading.getElementsByClassName('r2-loading-title')[0]).getElementsByTagName('span')[0];

                loadingTitle.innerHTML = content;
            },
            destroy : function(className) {
                R2.Dialog.destroy(className);
            }
        }




    	R2.Dialog2 = {

    		getZindex:function(){

    			var $ui_dialogs = $('.ui-dialog');

    			//var ui_dialogs = document.querySelectorAll('.ui-dialog');
    			var z_index = 3000;

    			if($ui_dialogs.length > 0){

    //				Array.prototype.forEach.call(ui_dialogs,function(element){
    //
    //					var ui_dialog_z_index = parseInt( element.style['z-index'], 10);
    //
    //					z_index = (ui_dialog_z_index > z_index) ? ui_dialog_z_index : z_index;
    //
    //				})

    				$ui_dialogs.each(function(index){
    					var ui_dialog_z_index = parseInt( $ui_dialogs.css('z-index'), 10);
    					z_index = (ui_dialog_z_index > z_index) ? ui_dialog_z_index : z_index;
    				})

    			}

    			//var dialogs = document.querySelectorAll('.iris-dialog');
    			var $dialogs = $('.iris-dialog');

    			if($dialogs.length > 0){

    //				Array.prototype.forEach.call(dialogs, function(element){
    //
    //					var dialog_z_index = parseInt( element.querySelector('.iris-modal').style['z-index'], 10);
    //
    //					z_index = (dialog_z_index > z_index) ? dialog_z_index : z_index;
    //
    //				})

    				$dialogs.each(function(index){
    					var dialog_z_index = parseInt( $(this).find('.iris-modal').css('z-index'), 10);
    					z_index = (dialog_z_index > z_index) ? dialog_z_index : z_index;
    				})

    			}

    			return z_index;
    		},

    		render : function(className, html){


    			var $dialog = $('<div/>');
    			var $modal = $('<div/>');
    			var $modal_backdrop = $('<div/>');

    			var z_index = this.getZindex();

    			$dialog
    			.attr('class','iris-dialog ' + className)
    			.css('z-index',z_index + 1)

    			$modal_backdrop
    			.attr('class','modal-backdrop fade in')
    			.css('z-index',z_index + 2)

    			$modal
    			.attr({'id':'myModal','class':'iris-modal'})
    			.css({'z-index':z_index + 3,'position':'fixed'})

    			$modal.html(html);

    			$dialog.append($modal.clone().wrapAll("<div/>").parent().html())
    			$dialog.append($modal_backdrop.clone().wrapAll("<div/>").parent().html())

    			$('body').append($dialog.clone().wrapAll("<div/>").parent().html());

    			var modal_backdrop_h = $('body').find('.' + className + ' .modal-backdrop').outerHeight(true);
    			var modal_h =$('body').find('.' + className + ' .iris-modal').outerHeight(true)
    			var modal_top = null;

    			if(modal_backdrop_h > modal_h){
    				modal_top = Math.abs(parseInt((modal_backdrop_h)/2,10) - parseInt(modal_h/2,10));
    			} else {
    				modal_top = Math.abs(parseInt(modal_h/2,10) - parseInt((modal_backdrop_h)/2,10));
    			}

    			var modal_backdrop_w = $('body').find('.' + className + ' .modal-backdrop').outerWidth(true);
    			var modal_w = $('body').find('.' + className + ' .iris-modal').outerWidth(true)
    			var modal_left = (modal_backdrop_w)/2 - modal_w/2;

    			$('body').find('.' + className + ' .iris-modal').css({top:modal_top + 'px',left:modal_left + 'px'});

    			return $('body').find('.' + className);


    			/*
    			var dialog = document.createElement('div');
    			modal = document.createElement('div');
    			modal_backdrop = document.createElement('div');

    			var z_index = this.getZindex();

    			dialog.setAttribute('class', 'iris-dialog ' + className);
    			dialog.style['z-index'] = z_index + 1;

    			modal_backdrop.setAttribute('class', 'modal-backdrop fade in');
    			modal_backdrop.style['z-index'] = z_index + 2;

    			modal.setAttribute('id','myModal');
    			modal.setAttribute('class','iris-modal');
    			modal.style['z-index'] = z_index + 3;
    			modal.style['position'] = 'fixed';

    			if(typeof html === 'string'){
    				modal.innerHTML = html;
    			} else {
    				modal.appendChild(html);
    			}

    			dialog.appendChild(modal);
    			dialog.appendChild(modal_backdrop);

    			document.body.appendChild(dialog);

    			var modal_backdrop_h = modal_backdrop.offsetHeight
    			,modal_h = modal.offsetHeight;

    			var modal_top = 0;

    			if(modal_backdrop_h > modal_h){
    				modal_top = Math.abs(parseInt((modal_backdrop_h)/2,10) - parseInt(modal_h/2,10));
    			} else {
    				modal_top = Math.abs(parseInt(modal_h/2,10) - parseInt((modal_backdrop_h)/2,10));
    			}

    			var modal_backdrop_w = modal_backdrop.offsetWidth
    			,modal_w = modal.offsetWidth
    			,modal_left = Math.abs(parseInt((modal_backdrop_w)/2,10) - parseInt(modal_w/2,10));

    			modal.style.top = modal_top + 'px';
    			modal.style.left = modal_left + 'px';

    			return dialog;
    			*/

    		},
    		rePosition : function(className){
    			/*
    			var modal_backdrop = document.getElementsByClassName('modal-backdrop')[0];
    			var modal = document.getElementsByClassName('iris-modal')[0];

    			var modal_backdrop_h = modal_backdrop.offsetHeight
    			,modal_h = modal.offsetHeight;

    			var modal_top = 0;

    			if(modal_backdrop_h > modal_h){
    				modal_top = Math.abs(parseInt((modal_backdrop_h)/2,10) - parseInt(modal_h/2,10));
    			} else {
    				modal_top = Math.abs(parseInt(modal_h/2,10) - parseInt((modal_backdrop_h)/2,10));
    			}

    			var modal_backdrop_w = modal_backdrop.offsetWidth
    			,modal_w = modal.offsetWidth
    			,modal_left = (modal_backdrop_w)/2 - modal_w/2;

    			modal.style.top = modal_top + 'px';
    			modal.style.left = modal_left + 'px';
    			*/

    			var $modal_backdrop = $('.' + className + ' .modal-backdrop');
    			var $modal = $('.' + className + ' .iris-modal');

    			var modal_backdrop_h = $modal_backdrop.outerHeight(true);
    			var modal_h = $modal.outerHeight(true);

    			var modal_top = null;

    			if(modal_backdrop_h > modal_h){
    				modal_top = Math.abs(parseInt((modal_backdrop_h)/2,10) - parseInt(modal_h/2,10));
    			} else {
    				modal_top = Math.abs(parseInt(modal_h/2,10) - parseInt((modal_backdrop_h)/2,10));
    			}

    			var modal_backdrop_w = $modal_backdrop.outerWidth(true);
    			var modal_w = $modal.outerWidth(true);
    			var modal_left = (modal_backdrop_w)/2 - modal_w/2;

    			$modal.css({'top':modal_top + 'px','left':modal_left + 'px'});
    		},

    		destroy : function(className){

    			var $dialogs = $('.' + (className || 'iris-dialog'));

    			if($dialogs.length === 0) return;

    			$dialogs.each(function(index){
    				$(this).remove();
    			})

    			/*
    			var dialogs = document.querySelectorAll('.' + (className || 'iris-dialog'));

    			if(dialogs.length === 0) return;

    			Array.prototype.forEach.call(dialogs, function(element){
    				if(element.parentNode){
    					element.parentNode.removeChild(element);
    				}
    			})
    			*/

    		},
    		isOpen : function(className){
    			if(!className) return;
    			//var dialogs = document.querySelectorAll('.' + className);

    			var $dailogs = $('.' + className);

    			return ($dailogs.length > 0);
    		}
    	}

    })(R2);

    // (function(Iris) {
    //
    // 	window.Iris = Iris || {};
    //
    // 	Iris.Loading = {
    // 			$el : null,
    // 			Loading : '<div><img src="' + Iris.CONTEXT_PATH + '/resources/img/loading.gif" alt="Loading" style="width:70px;height:70px;" /></div>',
    // 			show : function(){
    // 				this.$el = $(Iris.Dialog.render('_loadingBar',this.Loading));
    // 			},
    // 			hide : function(){
    // 				Iris.Dialog.destroy('_loadingBar');
    // 			}
    // 		}
    //
    // })(Iris);
    //
    // (function(Iris) {
    //
    // 	window.Iris = Iris || {};
    //
    // 	Iris.Utils = {
    // 		/**
    // 		 * href에서 parameter의 해당 key를 가지고 올수 있는 함수
    // 		 */
    // 		getUrlParameter : function(sParam) {
    // 		    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
    // 		        sURLVariables = sPageURL.split('&'),
    // 		        sParameterName,
    // 		        i;
    //
    // 		    for (i = 0; i < sURLVariables.length; i++) {
    // 		        sParameterName = sURLVariables[i].split('=');
    //
    // 		        if (sParameterName[0] === sParam) {
    // 		            return sParameterName[1] === undefined ? true : sParameterName[1];
    // 		        }
    // 		    }
    // 		}
    // 	}
    //
    // })(Iris);
    /*
    define(
    	[
    	],function(){

    		return {
    			parseHash : function(){
    				var hash;

    				if(!location.hash.length){
    					return null;
    				}

    				hash = location.hash.split('/');

    				hash[0] = hash[0].replace('#','');

    				return hash;
    			}
    		}

    	})
    */
