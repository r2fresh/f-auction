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
                           var price = (bidderPrice == '') ? 0 : bidderPrice;
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

               _.each(bidderList,function(bidder){
                   _.each(bidder.rateIncreaseList,function(item,index){
                       item.maxPrice = _.max(item.historyPriceList);
                       if(item.maxPrice == 0){
                           item.rateIncrease = 0;
                       } else {
                           var startPrice = parseInt(startPriceList[index].price,10);
                           var percent = ( (item.maxPrice - startPrice)/startPrice )*100

                           // 소수점 2자리수 반올림
                           item.rateIncrease = Math.round(percent * 100)/100;
                       }
                   });
               })

               return bidderList;
           }
       }
   }
)
