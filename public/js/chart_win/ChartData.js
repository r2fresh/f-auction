define([
   'module',
   'js/Model'
   ],
   function(module, Model){

       module.exports = {

           setChartDataList:null,

           getRoundList:function(callback){

               this.setChartDataList = callback;

               //라운드 전체 리스트 호출
               Model.getRoundList({
                    url: '/round',
                    method : 'GET',
                    contentType:"application/json; charset=UTF-8",
                    success : Function.prototype.bind.call(this.getRoundListSuccess,this),
                    error : function(jsXHR, textStatus, errorThrown){}
                })

           },

           getRoundListSuccess:function(data, textStatus, jqXHR){
               console.log(data)
               if(textStatus == 'success'){
                   var chartData = data;
                   this.setChartDataList(chartData);
               }
           },

           getWideBandList:function(company, data){

               var roundList = JSON.parse(JSON.stringify(data));

               var roundNum = null;

               var chartList = [];

               var frequencyName = '';

               var priceArr = ['priceA','priceB','priceC','priceD','priceE'];

               _.each(roundList, function(round){
                   roundNum = round.name;
                   _.each(round.frequency, function(frequency){

                       frequencyName = frequency.name;

                       if(frequencyName == company){
                           _.each(frequency.bidders,function(bidder){
                               if(bidder.price != '' && bidder.vs == 'win'){

                                  // var minusNum = (company == 'KT') ? 2 : (company == 'SK') ? 1 : 0

                                   var x = (parseInt(priceArr.indexOf(company),10) + 1)-0.3//*3-minusNum;

                                   chartList.push({
                                       'round':(roundNum).toString(),
                                       'name':(bidder.name).toString(),
                                       'price':[x,parseInt(bidder.price,10)]
                                   })
                               };
                           });
                       };
                   });
               });

              var wideBandList = this.deleteOverlap(chartList);

              console.dir(wideBandList)

               return wideBandList;
           },


           getNarrowList:function(company, data){

               var roundList = JSON.parse(JSON.stringify(data));

               var roundNum = null;

               var chartList = [];

               var frequencyName = '';

               var priceArr = ['priceA','priceB','priceC','priceD','priceE'];

               _.each(roundList, function(round){
                   roundNum = round.name;
                   _.each(round.frequency, function(frequency){

                       frequencyName = frequency.name;

                       if(frequency.type == 'narrow'){
                           _.each(frequency.bidders,function(bidder){
                               if(bidder.price != '' && bidder.vs == 'win'){

                                   var minusNum = (company == 'KT') ? 2 : (company == 'SK') ? 1 : 0

                                   var x = (parseInt(priceArr.indexOf(frequencyName),10) + 1)*3-minusNum;

                                   chartList.push({'round':(roundNum).toString(), 'price':[x,parseInt(bidder.price,10)]})
                               };
                           });
                       };
                   });
               });

               return this.deleteOverlap(chartList);
           },

           deleteOverlap:function(data){
               var chartList = JSON.parse(JSON.stringify(data))
               var priceChartList = [];
               var temp = null;
               var num = null;
               _.each(chartList, function(item,index){
                   if(index == 0){
                       temp = item;
                       if(chartList.length-1 == index){
                           priceChartList.push(temp);
                       }
                   } else {
                       if(temp.price[1] == item.price[1]){
                          var roundArr = temp.round.split('~');
                          if( roundArr.length > 1 ){
                              temp.round = roundArr[0] + '~' + item.round;
                          } else {
                              temp.round = temp.round + '~' + item.round;
                          }


                      } else {
                          priceChartList.push(temp);
                          temp = item;
                      }

                      if(chartList.length-1 == index){
                          priceChartList.push(temp);
                      }
                   }
                })

                return priceChartList;
           }

       }
   }
)
