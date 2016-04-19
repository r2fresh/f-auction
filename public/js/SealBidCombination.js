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
           /**
           * 입찰자들의 대역폭 호출
           */
           getSealBandWidthList:function(){
               return this.sealBandWidthList;
           },
           /**
           * 입차자들의 대역폭 모두 리셋
           */
           resetSealBandWidthList:function(){
               _.each(this.sealBandWidthList,function(item){
                   item.ableBandWidth = 0;
               });
           },
           /**
           * 밀봉 조합 호출
           */
           getCombinationList:function(data){
               var applyStartDataList   = this.setSealBidCombinationZeroToStart(data);
               var frequencyList        = this.setSealBidCombinationFrequency(applyStartDataList);
               var combinationList      = this.setCombinationList(frequencyList);
               return combinationList
           },
           /**
           * 통신사로 구분된 배열에서 미신청 주파수의 price를 기본값으로 변경한다.
           */
           setSealBidCombinationZeroToStart(data){
               var sealBidPriceList = JSON.parse(JSON.stringify(data));
               _.each(sealBidPriceList,function(item){
                   _.each(item.priceList,function(priceList,index){
                       if(priceList.hertzFlag == false && priceList.price == 0){
                           priceList.price = parseInt(AuctionData.startPriceList[index].price,10);
                       }
                   })
               })
               return sealBidPriceList;
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

               var combinationSumList       = this.setCombinationPriceSum(combinationList);
               var combinationMergeList     = this.setCombinationMerge(combinationSumList);
               var combinationSumSortList   = this.setCombinationSumSort(combinationMergeList);
               var combinationReverseList   = this.setCombinationReverse(combinationSumSortList);
               var combinationRankingList   = this.setCombinationRanking(combinationReverseList);
               var combinationNamingList    = this.setCombinationNaming(combinationRankingList);

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
           * 미신청주파수만 다르고 같은 것은 합쳐서 하나로 표시
           */
           setCombinationMerge : function(data){

               // 기본 배열
               var list = JSON.parse(JSON.stringify(data));
               // 중복이 있을 경우 하나씩 빠지는 배열
               var list_loop = JSON.parse(JSON.stringify(data));
               // 중복된 것만 모아서 따로 만드는 배열
               var list_temp = [];
               // 중복된 안된 것과 중복된 것은 중복 처리후 저장하는 배열
               var list_merge = [];

               var mergeFlagArr = null;
               var total = 5;

               for(var i=0; i<list.length; ++i){

                   list_temp = [];

                   for(var j=0; j<list_loop.length; ++j){

                       mergeFlagArr = [];

                       for(var k=0; k < total; ++k){

                           // 두개 모두 미선청 주파수 이면 true
                           // 두개의 객체가 같으면 true
                           if(list[i].combination[k].hertzFlag == false && list_loop[j].combination[k].hertzFlag == false){
                               mergeFlagArr.push(true);
                           } else {
                               var equalFlag = _.isEqual(list[i].combination[k],list_loop[j].combination[k]);
                               mergeFlagArr.push( equalFlag );
                           }
                       }

                       // 모두가 true 이면 같은 조합
                       var flag = _.every(mergeFlagArr,function(item){
                           return item == true;
                       })

                       // 같은 조합이면 배열에서 제거후 list_temp에 추가
                       if(flag){
                           var overlap = list_loop.splice(j,1)
                           list_temp.push(overlap[0]);
                           j = j - 1;
                       }

                       mergeFlagArr = null;

                   }

                   // 중복된 조합은 company 를 수정후 첫번째 조합에 추가하고 첫번째 조합을
                   // 중복이 제거처리한 배열에 저장한다.
                   // list_temp가 하나인 것은 중복이 없는 것이며, 바로 추가한다.
                   if(list_temp.length > 1){
                       var companyArr = ['','','','',''];
                       _.each(list_temp,function(item){
                           _.each(item.combination,function(combination,index){
                               if(companyArr[index] == ''){
                                   companyArr[index] = combination.company;
                               } else {
                                   if(companyArr[index] != combination.company){
                                       companyArr[index]  = companyArr[index] + ',' + combination.company;
                                   }
                               }
                           })
                       })
                       console.log(companyArr)

                       _.each(list_temp[0].combination,function(item, index){
                           item.company = companyArr[index];
                       })
                       list_merge.push(list_temp[0]);
                   } else if(list_temp.length == 1){
                       list_merge.push(list_temp[0]);
                   }

                   list_temp = null;

               }

               return list_merge;
           },
           /**
           * 각 통신사 명칭 변경 (SK -> SKT,LG -> LGU+)
           */
           setCombinationNaming:function(data){
                var combinationList = JSON.parse(JSON.stringify(data));
                var company = '';

                for (var i=0; i<combinationList.length; ++i){
                    for(var j=0; j<combinationList[i].combination.length; ++j){


                        if(combinationList[i].combination[j].company == 'SK'){
                            company = 'SKT';
                            combinationList[i].combination[j].labelClass = combinationList[i].combination[j].company;
                        } else if(combinationList[i].combination[j].company == 'LG'){
                            company = 'LGU+';
                            combinationList[i].combination[j].labelClass = combinationList[i].combination[j].company;
                        } else if(combinationList[i].combination[j].company == 'KT'){
                            company = 'KT';
                            combinationList[i].combination[j].labelClass = combinationList[i].combination[j].company;
                        } else {
                            var str  = combinationList[i].combination[j].company;
                            var str2 = str.replace('SK', 'SKT');
                            var str3 = str.replace('LG', 'LGU+');
                            var str4 = '';

                            if(str3.substr(str3.length-1,str3.length) === ','){
                                str4 = str3.substr(0,str3.length-1);
                            } else {
                                str4 = str3;
                            }

                            company = str4;

                            combinationList[i].combination[j].labelClass = 'ALL';
                        }
                        combinationList[i].combination[j].company = company;
                    }
                }
                return combinationList;
           },
           /**
           * 안에 내용은 다르지만 랭킹과 합계가 같은 것이 있으면
           * 재입찰 버튼을 활성화 하고, 조합을 초기화 한다.
           */
           checkOverlap:function(data){
               var combinationList = JSON.parse(JSON.stringify(data));
               var combinationRankingList = _.filter(combinationList,function(item){
                   return item.ranking == 1;
               });
               return (combinationRankingList.length>1) ? true : false;
           }
       }
   }
)
