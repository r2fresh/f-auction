define([
   'module',
   'js/AuctionData',
   'js/Model'
   ],
   function(module, AuctionData, Model){

       module.exports = {
           /**
           * 각 주파수 가격 히스토리를 구하는 함수
           */
           getRoundHistoryPrice:function(data){
               var roundList        = JSON.parse(JSON.stringify(data));
               var rateIncreaseList = JSON.parse(JSON.stringify(AuctionData.defaultPriceList));
               var bidderList       = [{'name':'KT'},{'name':'SK'},{'name':'LG'}]

               // 기본 변수 설정
               _.each(rateIncreaseList,function(item){
                   item.historyPriceList = [];
               })

               _.each(bidderList, function(item){
                   item.rateIncreaseList = JSON.parse(JSON.stringify(rateIncreaseList));
               })

               // 각 라운드 별 입찰자에 해당하는 가격리스트와 미신청 주파수 설정
               for(var i=0; i<roundList.length; ++i){
                   for(var j=0; j<roundList[i].frequency.length; ++j){
                       for(var k=0; k<roundList[i].frequency[j].bidders.length; ++k){
                           var bidderPrice = roundList[i].frequency[j].bidders[k].price;
                           var price = (bidderPrice == '') ? 0 : parseInt(bidderPrice);
                           bidderList[k].rateIncreaseList[j].historyPriceList.push(price);
                       }
                   }
               }

               return bidderList;
           },
           /**
           * 각 주파수 가격 히스토리에서 최대가를 추출하고,
           * 그 가격과 시작가를 비교해서 누적 증분율을 구하는 함수
           */
           getRoundMaxPrice:function(data){

               var bidderList        = JSON.parse(JSON.stringify(data));
               var startPriceList   = JSON.parse(JSON.stringify(AuctionData.startPriceList));

               _.each(bidderList,Function.prototype.bind.call(function(bidder){
                   _.each(bidder.rateIncreaseList,Function.prototype.bind.call(function(item,index){
                       item.maxPrice = _.max(item.historyPriceList);
                       //var nowPercent = null;
                       if(item.maxPrice == 0){
                           item.rateIncrease = 0;
                           item.nowRateIncrease = 0;
                       } else {

                           var startPrice = parseInt(startPriceList[index].price,10);
                           var percent = ( (item.maxPrice - startPrice)/startPrice )*100

                           // 소수점 2자리수 반올림
                           item.rateIncrease = Math.round(percent * 100)/100;

                           item.nowRateIncrease = this.getNowRateIncrease(item.historyPriceList, item.maxPrice, startPrice);

                        //    if(item.historyPriceList.length>1){
                           //
                        //        var tempHistoryPriceList = _.map(item.historyPriceList,function(item){
                        //            return item;
                        //        })
                           //
                        //        var maxIndex = tempHistoryPriceList.indexOf(item.maxPrice);
                        //        tempHistoryPriceList.splice(maxIndex,1);
                           //
                        //        console.log(item.historyPriceList);
                        //        console.log(tempHistoryPriceList);
                           //
                        //        var secondMaxPrice = _.max(tempHistoryPriceList);
                           //
                        //        console.log(secondMaxPrice)
                           //
                        //        if(secondMaxPrice == 0){
                        //             nowPercent = ( (item.maxPrice - startPrice)/startPrice )*100;
                        //             item.nowRateIncrease = Math.round(nowPercent * 100)/100;
                        //        } else {
                        //             nowPercent = ( (item.maxPrice - secondMaxPrice)/secondMaxPrice )*100;
                        //             item.nowRateIncrease = Math.round(nowPercent * 100)/100;
                        //        }
                           //
                        //        console.log(item.nowRateIncrease)
                           //
                        //        console.log('==========================================')
                        //    } else {
                        //        item.nowRateIncrease = 0;
                        //    }


                       }
                       //nowPercent = null;
                   },this));
               },this))

               return bidderList;
           },
           /**
           * 현 증분율 구하는 함수
           */
           getNowRateIncrease:function(historyList, maxPrice, startPrice){

               var nowRateIncrease = null;
               var nowPercent = null

               if(historyList.length>1){

                   var tempHistoryPriceList = _.map(historyList,function(item){
                       return item;
                   })

                   var maxIndex = tempHistoryPriceList.indexOf(maxPrice);
                   tempHistoryPriceList.splice(maxIndex,1);

                  // console.log(item.historyPriceList);
                   //console.log(tempHistoryPriceList);

                   var secondMaxPrice = _.max(tempHistoryPriceList);

                   console.log(secondMaxPrice)

                   if(secondMaxPrice == 0){
                        nowPercent = ( (maxPrice - startPrice)/startPrice )*100;
                        nowRateIncrease = Math.round(nowPercent * 100)/100;
                   } else {
                        nowPercent = ( (maxPrice - secondMaxPrice)/secondMaxPrice )*100;
                        nowRateIncrease = Math.round(nowPercent * 100)/100;
                   }

                   console.log(nowRateIncrease)

                   console.log('==========================================')
               } else {
                   nowRateIncrease = 0;
               }

               return nowRateIncrease;
           }
       }
   }
)
