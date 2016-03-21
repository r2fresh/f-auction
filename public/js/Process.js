define([
    'module',
    'js/AuctionData'
],function(module, AuctionData){
    module.exports = {
        getRoundList : function(data){

            var dataFormat = JSON.parse( JSON.stringify(AuctionData.round) );
            dataFormat.ksy = "sdfdsdsf"
            console.log(AuctionData.round)
            console.log(dataFormat)
            console.log(data.length)

            // var roundTotal = Math.ceil(data.length/3);
            //
            // var roundList = {};
            //
            // var round = [];
            //
            // for(var i=0; i<roundTotal; ++i){
            //
            //     var frequencyList = [];
            //
            //     for(var j=0; j<5; ++j){
            //
            //         var frequency = {},
            //
            //     }
            //
            //
            // }


            return 'dfdfdf'
        },
        roundList : function(data){

        }
    }
    /*
        roundList = {
            'round':[
                {'frequency':[
                    {
                        'name': 'A',
                        'bandWidth':40,
                        'hertz':'700',
                        'type':'wideBand',
                        'winBidder': '',
                        'winPrice': 1200,
                        'bidders': [
                            {'name':'KT', 'price':1200, 'vs':'win'},
                            {'name':'SK', 'price':1200, 'vs':'win'},
                            {'name':'LG', 'price':1200, 'vs':'win'}
                        ]
                    }
                ]},
                {},
                {},
            ]
        }

    */


});
