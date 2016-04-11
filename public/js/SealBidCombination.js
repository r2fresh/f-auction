define([
   'module',
   'js/AuctionData'
   ],
   function(module, AuctionData){

       module.exports = {
           //sealBidBidderList:null,
           sealBandWidthList:[
               {'name':'KT','ableBandWidth':0},
               {'name':'SK','ableBandWidth':0},
               {'name':'LG','ableBandWidth':0}
           ],
           /**
            * 밀봉 입찰액 객체 설정
            */
        //    setSealBidBidderList:function(data){
        //        this.sealBidBidderList = JSON.parse( JSON.stringify(data) );
        //    },
        //    getSealBidBidderList:function(){
        //        return this.sealBidBidderList;
        //    },
           /**
            * 입찰자들의 신청 가능 대역폭 저장
            */
           setSealBandWidthList:function(data){
               var bidder = data;
               _.each(this.sealBandWidthList,function(item){
                   if(item.name === bidder.name){
                       item.ableBandWidth = bidder.ableBandWidth;
                   }
               });
           },
           getSealBandWidthList:function(){
               return this.sealBandWidthList;
           },
           resetSealBandWidthList:function(){
               _.each(this.sealBandWidthList,function(item){
                   item.ableBandWidth = 0;
               });
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

               return frequencyList;
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
                                           //if(this.setCombinationWideBandCheck(combination)){
                                               combinationList.push(combination);
                                           //}
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
               var combinationNamingList = this.setCombinationNaming(combinationRankingList);

               console.log(combinationNamingList)

               return combinationNamingList;
           },
           /**
            * 밀봉 조합에서 광대역이 두개 들어가 있는 지 체크 하는 함수
            */
           setCombinationWideBandOverlapCheck:function(data){

               var companyList = ['KT','SK','LG'];
               var combination = data;
               var flag = true;

               for(var i=0; i<companyList.length; ++i){
                   // 조합에서 해당 입찰자가 포함된 객체 배열 생성
                   var companyDissolve = _.filter(combination,function(item){
                       return item.company === companyList[i];
                   })

                   // 입찰자 배열이 두개 이상이면 실행
                   if(companyDissolve.length>1){

                       // 지원하지 않은 주파수에 해당하는 입찰자 객체를 제외하고 배열 생성
                       var hertzList = _.filter(companyDissolve,function(item){
                           return item.hertzFlag == true;
                       })

                       // 입찰자 배열에서 광대역에 해당하는 입찰자 객체 배열 생성
                       var wideBandList = _.filter(hertzList,function(item){
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

                   // 지원하지 않은 주파수에 해당하는 입찰자 객체를 제외하고 배열 생성
                   var hertzList = _.filter(companyDissolve,function(item){
                       return item.hertzFlag == true;
                   })

                   var bandWidthList   = _.pluck(hertzList,'bandWidth');

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

           /**
            * 밀봉 조합에서 각 통신사 마다 광대역을 하나씩은 가지고 가는 조합을 만드는 함수 (제거 가능성 있음)
            */
           setCombinationWideBandCheck:function(data){
               var companyList = ['KT','SK','LG'];
               var combination = data;
               var flag = true;

               for(var i=0; i<companyList.length; ++i){
                   var companyDissolve = _.filter(combination,function(item){
                       return item.company === companyList[i];
                   })

                   var wideBandList = _.filter(companyDissolve,function(item){
                       return item.type === 'wideBand'
                   });

                   if(wideBandList.length === 0){
                       flag = false;
                   }
               }

               return flag;
           },

           /**
            * 밀봉조합에서 가격의 합계를 구하는 함수
            */
           setCombinationPriceSum:function(data){

               var combinationList = JSON.parse(JSON.stringify(data));

               var combinationSumList = _.map(combinationList,function(item){

                   var priceList = _.pluck(item, 'price');

                   var sum = _.reduce(priceList, function(memo, num){ return parseInt(memo,10) + parseInt(num,10); }, 0);

                   return {'priceSum':sum,'combination':item}

               })

               return combinationSumList;
           },
           /**
            * 밀봉조합의 가격의 합을 오름차순으로 정열하는 함수
            */
           setCombinationSumSort:function(data){
               var combinationSumList = JSON.parse(JSON.stringify(data));
               return _.sortBy(data,'priceSum');
           },
           /**
            * 오름차순으로 정열 된 밀봉조합을 내림차순으로 변경
            */
           setCombinationReverse:function(data){
               return JSON.parse(JSON.stringify(data.reverse()));
           },
           /**
            * 내림차순으로 정열된 밀봉조합에 순위 붙이기
            */
           setCombinationRanking:function(data){
               var combinationList = JSON.parse(JSON.stringify(data));
               var ranking = 1;
               var priceSum = null;

               for (var i=0; i<combinationList.length; ++i){
                   if(priceSum == null){
                       priceSum = combinationList[i].priceSum;
                       combinationList[i].ranking= ranking;
                   } else {
                       if(priceSum == combinationList[i].priceSum){
                           combinationList[i].ranking = ranking
                       } else {
                           priceSum = combinationList[i].priceSum;
                           combinationList[i].ranking = ranking = ranking + 1;
                       }
                   }
               }
               return combinationList;
           },
           /**
           * 각 통신사 명칭 변경 (SK -> SKT,LG -> LGU+)
           */
           setCombinationNaming:function(data){
                var combinationList = JSON.parse(JSON.stringify(data));
                var company = '';

                for (var i=0; i<combinationList.length; ++i){
                    for(var j=0; j<combinationList[i].combination.length; ++j){
                        combinationList[i].combination[j].labelClass = combinationList[i].combination[j].company;

                        if(combinationList[i].combination[j].company == 'SK'){
                            company = 'SKT';
                        } else if(combinationList[i].combination[j].company == 'LG'){
                            company = 'LGU+';
                        } else {
                            company = combinationList[i].combination[j].company;
                        }
                        combinationList[i].combination[j].company = company;
                    }
                }
                return combinationList;
           }
       }
   }
)
