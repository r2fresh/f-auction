define([
   'module',
   'js/AuctionData',
   'js/Model'
   ],
   function(module, AuctionData, Model){

       module.exports = {
           /**
           * 현 증분율 UI 설정 함수를 저장한 변수
           */
           setRoundRateIncreaseUI : null,

           /**
           * 입찰자의 통신사
           */
           bidder_company : '',

           /**
           * 입찰자 설정
           */
           setBidderCompany:function(data){
               this.bidder_company = data;
           },

           /**
           * 각 주파수에 대한 각 입찰자의 시작가 대비 최종 가격 증분율
           * 주파수의 승자가 가격이 아닌 입찰자가 입찰한 가장 마지막 가격
           */
           setRoundRateIncrease:function( callback ){

               this.setRoundRateIncreaseUI = callback;

               //라운드 전체 리스트 호출
               Model.getRoundList({
                    url: '/round',
                    method : 'GET',
                    contentType:"application/json; charset=UTF-8",
                    success : Function.prototype.bind.call(this.getRoundListSuccess,this),
                    error : function(jsXHR, textStatus, errorThrown){}
                })
           },

           /**
           * 라운드 전체 리스트 호출 완료
           */
           getRoundListSuccess:function(data, textStatus, jqXHR){
               if(textStatus == 'success'){
                   var rateIncreaseList = this.getRoundRateIncrease(data);
                   this.setRoundRateIncreaseUI(rateIncreaseList);
               }
           },

           /**
           * 증분율 리스트 구하는 함수
           */
           getRoundRateIncrease:function(data){

               var roundList = JSON.parse(JSON.stringify(data));
               var startPriceList      = JSON.parse(JSON.stringify(AuctionData.startPriceList));
               var rateIncreaseList    = JSON.parse(JSON.stringify(AuctionData.defaultPriceList));

               // 기본 변수 설정
               _.each(rateIncreaseList,function(item){
                   item.priceList = [];
                   item.hertzFlag = null;
               })

               // 각 라운드 별 입찰자에 해당하는 가격리스트와 미신청 주파수 설정
               for(var i=0; i<roundList.length; ++i){
                   for(var j=0; j<roundList[i].frequency.length; ++j){
                       for(var k=0; k<roundList[i].frequency[j].bidders.length; ++k){
                           if(roundList[i].frequency[j].bidders[k].name == this.bidder_company){
                               var price = (roundList[i].frequency[j].bidders[k].price == '') ? 0 : parseInt(roundList[i].frequency[j].bidders[k].price,10)
                               rateIncreaseList[j].priceList.push(price);
                               rateIncreaseList[j].hertzFlag = roundList[i].frequency[j].bidders[k].hertzFlag;
                           }
                       }
                   }
               }

               // 라운들별 각 주파수에 입찰자가 입찰한 입찰가 중 최고가를 구하고
               // 구해진 최고가에서 시작가와의 현 증분율을 구하는 함수
               _.each(rateIncreaseList,function(item,index){
                   item.maxPrice = _.max(item.priceList);
                   if(item.maxPrice == 0){
                       item.rateIncrease = 0;
                   } else {
                       var startPrice = parseInt(startPriceList[index].price,10);
                       var percent = ( (item.maxPrice - startPrice)/startPrice )*100

                       // 소수점 1자리수 반올림
                       item.rateIncrease = Math.round(percent * 10)/10;
                   }
               });
               return rateIncreaseList;
           }
       }
   }
)
