define([
   'module',
   'js/AuctionData'
   ],
   function(module, AuctionData){

       module.exports = {

           hertzFlagList : null,

           setHertzFlagList:function(data){
               this.hertzFlagList = JSON.parse(JSON.stringify(data));
           },

           /**
            * 입찰 결과 UI 렌더링
            */
           getBiddingResult:function(data){

               var companyArr = [
                   {'name':'KT'},
                   {'name':'SK'},
                   {'name':'LG'}
               ];

               var priceList = _.map(companyArr,Function.prototype.bind.call(function(company){
                   return _.extend( company,{'priceList':this.setFrequencyList(company,data)} )
               },this))

               var hertFlagList = this.setHertzFlag(priceList);

               //var companyData = this.companyPercent(priceList);
               var companyData = this.companyPercent(hertFlagList);
               var bidderList = this.setResultRanking(companyData);

               return bidderList;
           },
           /**
           * 미신청 주파수를 알기 위한 함수
           */
           setHertzFlag : function(data){
               var bidderList = JSON.parse(JSON.stringify(data));

               for(var i=0; i<bidderList.length; ++i){
                   for(var j=0; j<bidderList[i].priceList.length; ++j){
                       bidderList[i].priceList[j].hertzFlag = this.hertzFlagList[i].hertzList[j].hertzFlag;
                   }
               }
               return bidderList;
           },
           /**
           * 입찰자 기준의 컬렉션을 주파수 형태의 컬렉션으로 변경
           */
           setFrequencyList:function(company, data){

               var frequencyList = [[],[],[],[],[]];
               for(var i=0;i<data.length;++i){
                   var frequency = data[i].frequency;
                   for(var j=0;j<frequency.length;++j){
                       var bidder = _.filter(frequency[j].bidders,function(item){
                           return item.name === company.name;
                       })
                       frequencyList[j][i] = bidder[0].price;
                   }
               }

               return this.companyMaxPrice(frequencyList);
           },
           /**
            * 시작가에서 입찰 결과까지의 퍼센트 추가 함수
            */
           companyPercent:function(data){
               var companyData = JSON.parse( JSON.stringify( data ) );
               for(var i=0; i<companyData.length; ++i){
                   for(var j=0; j < companyData[i].priceList.length ;++j){
                       var companyPrice    = companyData[i].priceList[j].price;
                       var startPrice      = parseInt(AuctionData.startPriceList[j].price,10)
                       companyData[i].priceList[j].percent = Math.ceil( (companyPrice/startPrice - 1) * 100 );
                   }
               }
               return companyData;
           },
           /**
            * 오름경매 결과에 순위를 만드는 함수
            */
           setResultRanking:function(data){

               var companyData = JSON.parse( JSON.stringify( data ) );

               var sortPriceList, reversePriceList = null;

               for(var i=0; i<companyData.length; ++i){
                   sortPriceList = _.sortBy(companyData[i].priceList, 'percent');
                   reversePriceList = this.setReversePriceList( sortPriceList );

                   for(var j=0; j<companyData[i].priceList.length; ++j){
                       for(var k=0; k<reversePriceList.length; ++k){
                           if(companyData[i].priceList[j].percent === reversePriceList[k].percent){
                               companyData[i].priceList[j].ranking = reversePriceList[k].ranking;
                               companyData[i].priceList[j].labelClass = reversePriceList[k].labelClass;
                           }
                       }

                   }
               }
               return companyData
           },
           /**
           * 오른 입찰 결과에 대한 퍼센트를 기준으로 순위를 만듬
           */
           setReversePriceList:function(data){

               var reversePriceList = JSON.parse( JSON.stringify( data.reverse() ) );
               var ranking = 1;
               var percent = null;

               for (var i=0; i<reversePriceList.length; ++i){
                   if(percent == null){
                       percent = reversePriceList[i].percent;
                       reversePriceList[i].labelClass = 'danger'
                       reversePriceList[i].ranking= ranking;
                   } else {
                       if(percent == reversePriceList[i].percent){
                           reversePriceList[i].ranking = ranking
                           reversePriceList[i].labelClass = (ranking == 1) ? 'danger' : 'default';
                       } else {
                           percent = reversePriceList[i].percent;
                           reversePriceList[i].ranking = ranking = ranking + 1;
                           reversePriceList[i].labelClass = 'default'
                       }
                   }
               }
               return reversePriceList;
           },
           /**
            * 주파수 별로 되어 있는 데이터를 통신사별로 변경하는 함수
            */
           companyMaxPrice : function(data){
               var priceArr = ['priceA','priceB','priceC','priceD','priceE']
               return _.map(data,function(item,index){
                   return {'name':priceArr[index], 'price':_.max(item)}
               })
           },
       }
   }
)
