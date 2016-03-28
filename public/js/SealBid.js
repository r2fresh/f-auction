define([
   'module',
   'js/AuctionData'
   ],
   function(module, AuctionData){

       module.exports = {
           sealBidBidderList:null,
           getSealBidBidderList:function(){
               return this.sealBidBidderList;
           },
           sealBandWidthList:[
               {'name':'KT','ableBandWidth':0},
               {'name':'SK','ableBandWidth':0},
               {'name':'LG','ableBandWidth':0}
           ],


           /**
            * 입찰자들의 신청 가능 대역폭 저장
            */
           setSealBandWidthCheck:function(data){
               var bidder = data;
               _.each(this.sealBandWidthList,Function.prototype.bind.call(function(item){
                   if(item.name === bidder.name){
                       item.ableBandWidth = bidder.ableBandWidth;
                   }
               },this));
           },
           /**
            * 밀봉입찰액 기본 테이블 생성
            */
           setSealBidPrice:function(){
               var bidderList = JSON.parse( JSON.stringify(AuctionData.binderList) );
               this.sealBidBidderList = _.map(bidderList,function(item){
                   var defaultPriceList = JSON.parse( JSON.stringify(AuctionData.defaultPriceList) );
                   var priceList = _.map(defaultPriceList,function(item){
                       item.price = '';
                       return item
                   })
                   return _.extend(item,{'priceList':priceList});
               })
               console.log(this.sealBidBidderList);
               this.setSealBidPriceUI(this.sealBidBidderList)
           },




           getCombinationList:function(data){

               var frequencyList = this.setSealBidCombinationFrequency(data);

               var combinationList = this.setCombinationList(frequencyList);

               return combinationList
           },
           /**
            * 통신사로 구분된 배열을 주파수로 구분된 배열로 변경
            */
           setSealBidCombinationFrequency(data){

               var sealBidPriceList = JSON.parse(JSON.stringify(data));

               var frequencyList = [[],[],[],[],[]];

               for(var i=0;i<data.length;++i){
                   var frequency = data[i].priceList;
                   for(var j=0;j<frequency.length;++j){
                       frequencyList[j][i] = frequency[j]
                   }
               }
               console.log(sealBidPriceList);
               console.log(frequencyList);

               return tihs.setCombinationList(frequencyList);
           },
           /**
            * 주파수로 구성된 배열을 사용하여 밀봉입찰을 조합하는 함수
            */
           setCombinationList:function(data){

               var frequencyList = JSON.parse(JSON.stringify(data));

               var combinationList = []

               //priceA
               for(var i=0; i<frequencyList[0].length; ++i){
                   //priceB
                   for(var ii=0; ii<frequencyList[1].length; ++ii){
                       //priceC
                       for(var iii=0; iii<frequencyList[2].length; ++iii){
                           //priceD
                           for(var iiii=0; iiii<frequencyList[3].length; ++iiii){
                               //priceE
                               for(var iiiii=0; iiiii<frequencyList[4].length; ++iiiii){

                                   var A = frequencyList[0]
                                   var B = frequencyList[1]
                                   var C = frequencyList[2]
                                   var D = frequencyList[3]
                                   var E = frequencyList[4]

                                   var combination = [A[i],B[ii],C[iii],D[iiii],E[iiiii]];

                                   if(this.setCombinationWideBandOverlapCheck(combination)){
                                       if(this.setCombinationBandWidthCheck(combination)){
                                           if(this.setCombinationWideBandCheck(combination)){
                                               combinationList.push(combination);
                                           }
                                       }
                                   }
                               }
                           }
                       }
                   }
               }

               var combinationSumList = this.setCombinationPriceSum(combinationList);
               var combinationSumSortList = this.setCombinationSumSort(combinationSumList);
               var combinationReverseList = this.setCombinationReverse(combinationSumSortList);
               var combinationRankingList = this.setCombinationRanking(combinationReverseList);

               console.log(combinationRankingList)

               return combinationRankingList;
           },
           /**
            * 밀봉 조합에서 광대역이 두개 들어가 있는 지 체크 하는 함수
            */
           setCombinationWideBandOverlapCheck:function(data){

               var companyList = ['KT','SK','LG'];
               var combination = data;
               var flag = true;

               for(var i=0; i<companyList.length; ++i){
                   var companyDissolve = _.filter(combination,function(item){
                       return item.company === companyList[i];
                   })

                   if(companyDissolve.length>1){
                       var wideBandList = _.filter(companyDissolve,function(item){
                           return item.type === 'wideBand';
                       })
                       if(wideBandList.length>1){ flag = false}
                   }

                   if(flag === false){break;}
               }

               return flag
           },
           /**
            * 밀봉 조합에서 대역폭 체크 하는 함수
            */
           setCombinationBandWidthCheck:function(data){
               //console.log(this.sealBandWidthList);

               var companyList = ['KT','SK','LG'];
               var combination = data;
               var flag = true;

               for(var i=0; i<companyList.length; ++i){
                   var companyDissolve = _.filter(combination,function(item){
                       return item.company === companyList[i];
                   })

                   var bandWidthList   = _.pluck(companyDissolve,'bandWidth');

                   var bandWidthSum    = _.reduce(bandWidthList, function(memo, num){ return memo + num; }, 0);

                   var ableBandWidth = null;

                   _.each(this.sealBandWidthList,function(item){
                       if(item.name === companyList[i]){
                           ableBandWidth = item.ableBandWidth;
                       }
                   })

                   console.log('bandWidthSum : ' + bandWidthSum)
                   console.log('ableBandWidth : ' + ableBandWidth)

                   if(bandWidthSum > ableBandWidth){
                       flag = false;
                   }

                   if(bandWidthSum < ableBandWidth/2){
                       flag = false;
                   }
               }

               return flag
           },
       }
   }
)
