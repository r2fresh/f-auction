/**
* 새로고침 못하게 하는 소스
*/
define([
   'module'
   ],
   function(module){
       module.exports = {
           init:function(){
               console.log("sdfsdf")
               $(document).keydown(function(e) {
                   key = e.keyCode;

                   var t = document.activeElement;

                   if (key == 8 || key == 116 || key == 17 || key == 82) {
                       if (key == 8 || key == 82) {
                           if (t.tagName != "INPUT") {
                               if (e) {
                                   e.preventDefault();
                               }
                           }
                       } else {
                           if (e) {
                               e.preventDefault();
                           }
                       }
                   }
               });

           }
       }
   }
)
