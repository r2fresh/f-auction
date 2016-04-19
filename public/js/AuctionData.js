define({
    'binderList':[
        {'name':'KT','state':false},
        {'name':'SK','state':false},
        {'name':'LG','state':false}
    ],
    'bidders': [
        {'name':'KT', 'price':'', 'vs':'win'},
        {'name':'SK', 'price':'', 'vs':'win'},
        {'name':'LG', 'price':'', 'vs':'win'}
    ],
    'defaultPriceList':[
        {'name':'priceA','bandWidth':40,'price':'','type':'wideBand'},
        {'name':'priceB','bandWidth':20,'price':'','type':'narrow'},
        {'name':'priceC','bandWidth':20,'price':'','type':'wideBand'},
        {'name':'priceD','bandWidth':40,'price':'','type':'wideBand'},
        {'name':'priceE','bandWidth':20,'price':'','type':'narrow'}
    ],

    'startPriceList':[
        {'name':'priceA','bandWidth':40,'price':'7620','type':'wideBand'},
        {'name':'priceB','bandWidth':20,'price':'4513','type':'narrow'},
        {'name':'priceC','bandWidth':20,'price':'3816','type':'wideBand'},
        {'name':'priceD','bandWidth':40,'price':'6553','type':'wideBand'},
        {'name':'priceE','bandWidth':20,'price':'3277','type':'narrow'}
    ],
    'roundData': {
        'name':'',
        'company':[
            {'name':'KT', 'biddingType':''},
            {'name':'SK', 'biddingType':''},
            {'name':'LG', 'biddingType':''}
        ],
        'frequency' : [
            {
                'name': 'priceA',
                'bandWidth':40,
                'hertz':'700',
                'type':'wideBand',
                'winBidder': '',
                'winPrice': '',
                'bidders': [
                    {'name':'KT', 'price':''},
                    {'name':'SK', 'price':''},
                    {'name':'LG', 'price':''}
                ]
            },
            {
                'name': 'priceB',
                'bandWidth':20,
                'hertz':'18',
                'type':'narrow',
                'winBidder': '',
                'winPrice': '',
                'bidders': [
                    {'name':'KT', 'price':''},
                    {'name':'SK', 'price':''},
                    {'name':'LG', 'price':''}
                ]
            },
            {
                'name': 'priceC',
                'bandWidth':20,
                'hertz':'21',
                'type':'wideBand',
                'winBidder': '',
                'winPrice': '',
                'bidders': [
                    {'name':'KT', 'price':''},
                    {'name':'SK', 'price':''},
                    {'name':'LG', 'price':''}
                ]
            },
            {
                'name': 'priceD',
                'bandWidth':40,
                'hertz':'26',
                'type':'wideBand',
                'winBidder': '',
                'winPrice': '',
                'bidders': [
                    {'name':'KT', 'price':''},
                    {'name':'SK', 'price':''},
                    {'name':'LG', 'price':''}
                ]
            },
            {
                'name': 'priceE',
                'bandWidth':20,
                'hertz':'26',
                'type':'narrow',
                'winBidder': '',
                'winPrice': '',
                'bidders': [
                    {'name':'KT', 'price':''},
                    {'name':'SK', 'price':''},
                    {'name':'LG', 'price':''}
                ]
            },
        ]
    }
});
