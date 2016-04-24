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
           postRound: null,

           /**
           * 현재 라운드 데이터
           */
           nowRoundData : null,

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
           * 현재 라운드 데이터 설정
           */
           setNowRoundData : function( roundData ){
               this.nowRoundData = JSON.parse(JSON.stringify(roundData));;
           },

           /**
           * 각 주파수에 대한 각 입찰자의 시작가 대비 최종 가격 증분율
           * 주파수의 승자가 가격이 아닌 입찰자가 입찰한 가장 마지막 가격
           */
           setRoundRateIncreaseList:function( callback ){

               this.postRound = callback;

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
                   data.push( JSON.parse(JSON.stringify(this.nowRoundData)) )
                   var rateIncreaseList = this.getRoundRateIncreaseList(data);
                   var roundData = this.setNowRoundRateIncrease(rateIncreaseList)
                   this.postRound(roundData);
               }
           },

           /**
           * 증분율 리스트 구하는 함수
           */
           getRoundRateIncreaseList:function(data){

               var roundList        = JSON.parse(JSON.stringify(data));
               var startPriceList   = JSON.parse(JSON.stringify(AuctionData.startPriceList));
               var rateIncreaseList = JSON.parse(JSON.stringify(AuctionData.defaultPriceList));
               var bidderList       = [{'name':'KT'},{'name':'SK'},{'name':'LG'}]

               // 기본 변수 설정
               _.each(rateIncreaseList,function(item){
                   item.historyPriceList = [];
                   item.hertzFlag = null;
               })

               _.each(bidderList, function(item){
                   item.rateIncreaseList = JSON.parse(JSON.stringify(rateIncreaseList));
               })

               // 각 라운드 별 입찰자에 해당하는 가격리스트와 미신청 주파수 설정
               for(var i=0; i<roundList.length; ++i){
                   for(var j=0; j<roundList[i].frequency.length; ++j){
                       for(var k=0; k<roundList[i].frequency[j].bidders.length; ++k){
                           //if(roundList[i].frequency[j].bidders[k].name == this.bidder_company){
                           var bidderPrice = roundList[i].frequency[j].bidders[k].price;
                           var price = (bidderPrice == '') ? 0 : bidderPrice;
                           bidderList[k].rateIncreaseList[j].historyPriceList.push(price);
                           bidderList[k].rateIncreaseList[j].hertzFlag = roundList[i].frequency[j].bidders[k].hertzFlag;
                           //}
                       }
                   }
               }

               // 라운들별 각 주파수에 입찰자가 입찰한 입찰가 중 최고가를 구하고
               // 구해진 최고가에서 시작가와의 현 증분율을 구하는 함수
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

               console.table(bidderList)

               return bidderList;
           },

           /**
           * 계산한 현 증분율을 현재 라운드 데이터에 적용
           */
           setNowRoundRateIncrease:function(data){

               var nowRoundData = JSON.parse(JSON.stringify(this.nowRoundData))
               var bidderList = JSON.parse(JSON.stringify(data))

               // 각 라운드 별 입찰자에 해당하는 가격리스트와 미신청 주파수 설정
               for(var j=0; j<nowRoundData.frequency.length; ++j){
                   for(var k=0; k<nowRoundData.frequency[j].bidders.length; ++k){
                       nowRoundData.frequency[j].bidders[k].rateIncrease = parseFloat(bidderList[k].rateIncreaseList[j].rateIncrease)
                   }
               }

               return nowRoundData;
           },

           /**
           * 입찰자에 해당하는 현 증분율 데이터 가지고 오기
           */
           getRoundRateIncrease:function(data){
               console.log(roundData)
               var roundData = data;
               var rateIncreaseList = JSON.parse(JSON.stringify(AuctionData.defaultPriceList));

               // 기본 변수 설정
               _.each(rateIncreaseList,function(item){
                   item.rateIncrease = null;
                   item.hertzFlag = null;
               })

               for(var i=0; i<roundData.frequency.length; ++i){
                   for(var j=0; j<roundData.frequency[i].bidders.length; ++j){
                       if(roundData.frequency[i].bidders[j].name == this.bidder_company){
                           var rateIncrease = roundData.frequency[i].bidders[j].rateIncrease;
                          // var price = (bidderPrice == '') ? 0 : bidderPrice;
                           rateIncreaseList[i].rateIncrease = (rateIncrease == '') ? 0 : parseFloat(rateIncrease)
                           rateIncreaseList[i].hertzFlag = roundData.frequency[i].bidders[j].hertzFlag;
                       }
                   }
               }

               return rateIncreaseList;
           }
       }
   }
)
