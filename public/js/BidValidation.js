define([
    'module',
    'js/AuctionData',
    'js/r2/r2Alert'
],function(module, AuctionData, R2Alert){
    module.exports = {
        ableBandWidth:null,
        lowestBidPrices:null,
        /**
         * 제한 대역폭
         */
        setAbleBandWidth:function(data){
            this.ableBandWidth = data;
        },
        getAbleBandWidth:function(){
            return this.ableBandWidth;
        },
        /**
         * 최소입찰액 리스트
         */
        setlowestBidPrices:function(data){
            this.lowestBidPrices = data;
        },
        getlowestBidPrices:function(){
            return this.lowestBidPrices;
        },
        /**
         * 1순위 블록 필요 입찰액
         */
        check : function(elements){

            var bidPriceElementList = elements;

            // 빈 주파수 입력창 체크
            if(!this.checkEmptyBidField(bidPriceElementList)){
                return false;
            }

            // 최대 대역폭 체크
            if(!this.checkBidBandWidth(bidPriceElementList)){
                return false;
            }

            // 광대역은 하나만 신청 가능 체크
            if(!this.checkBidWideBand(bidPriceElementList)){
                return false;
            }

            // 입찰금액이 최소입찰금액 이상인지 체크 하는 함수
            if(!this.checkBidPrice(bidPriceElementList)){
                return false;
            }

            return true;
        },
        /**
         * 빈 주파수 입력창 체크
         */
        checkEmptyBidField:function(elements){
            var flag = true;
            // 빈 필드 체크 (모드 빈필드이면 : true, 하나라도 있으면 : false)
            var emptyCheck = _.every(elements, function(element){
                return $(element).val() === '';
            })
            // 빈 필드에서 승자가 있는지 체크 (승자가 하나라도 있으면 : true, 없으면 : false)
            var winCheck = _.some(elements, function(element){
                var attr = $(element).attr('vs');
                return (typeof attr !== typeof undefined && attr !== false && attr === 'win')
            })

            if(emptyCheck) {
                if(!winCheck){
                    R2Alert.render({'msg':'한 주파수 이상의 입찰금액을 입력해 주시기 바랍니다.','w':400});
                    flag = false;
                }
            }
            return flag;
        },
        /**
         * 가능 대역폭 체크
         */
        checkBidBandWidth:function(elements){
            var flag = true;
            var defaultPriceList = JSON.parse(JSON.stringify(AuctionData.defaultPriceList));

            // 통신사 대역폭 체크
            var maxBandWidth = _.reduce(
                _.map(defaultPriceList, Function.prototype.bind.call(function(item, index){
                    // 입력 폼
                    var bidPriceValue = $(elements[index]).val();

                    //승자인 주파수 포함
                    var attr = $(elements[index]).attr('vs');
                    var winFlag = (typeof attr !== typeof undefined && attr !== false && attr === 'win')

                    return ( bidPriceValue != '' || winFlag === true) ? item.bandWidth : 0;
                },this)),
                function(memo, num){ return memo + num; },0
            );

            if(maxBandWidth > this.ableBandWidth){
                R2Alert.render({'msg':'정해진 대역폭을 초과 하셨습니다.','w':400});
                flag = false;
            } else if(maxBandWidth < (this.ableBandWidth/2)){
                R2Alert.render({'msg':'대역폭은 지정된 대역폭의 절반 이상을 입찰하셔야 합니다.','w':400});
                flag = false;
            }

            return flag;
        },
        /**
         * 광대역 한개만 신청 가능 한거 체크
         */
        checkBidWideBand:function(elements){
            var flag = true;
            var defaultPriceList = JSON.parse(JSON.stringify(AuctionData.defaultPriceList));

            var wideBandList = _.filter(elements,function(element,index){
                // 입력 폼
                var bidPriceValue = $(elements[index]).val();

                //승자인 주파수 포함
                var attr = $(elements[index]).attr('vs');
                var winFlag = (typeof attr !== typeof undefined && attr !== false && attr === 'win')

                return ( (bidPriceValue != '' || winFlag === true) && defaultPriceList[index].type == 'wideBand' )
            })

            if(wideBandList.length > 1) {
                R2Alert.render({'msg':'광대역은 하나만 신청 가능합니다.','w':350});
                flag = false;
            }
            return flag;
        },
        /**
         * 입찰금액이 최소입찰금액 이상인지 체크 하는 함수
         */
        checkBidPrice:function(elements){
            var flag = true;
            var priceList = _.filter(elements,Function.prototype.bind.call(function(element,index){
                // 입력 폼
                var bidPriceValue = $(elements[index]).val();

                //승자인 주파수 포함
                var attr = $(elements[index]).attr('vs');
                var winFlag = (typeof attr !== typeof undefined && attr !== false && attr === 'win')

                return (bidPriceValue != '' && winFlag === false && parseInt(bidPriceValue,10) < this.lowestBidPrices[index].price)
            },this));
            if(priceList.length > 0){
                R2Alert.render({'msg':'입찰금액은 최소입찰액 이상으로 입력하셔야 합니다.','w':400});
                flag = false;
            }
            return flag;
        },
    }
});
