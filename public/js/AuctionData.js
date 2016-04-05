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
    },
    // 'startPrices': {
    //     'frequency' : [
    //         {
    //             'name': 'A',
    //             'bandWidth':40,
    //             'hertz':'700',
    //             'type':'wideBand',
    //             'winBidder': '',
    //             'winPrice': 1200,
    //             'bidders': [
    //                 {'name':'KT', 'price':1200, 'vs':'win'},
    //                 {'name':'SK', 'price':1200, 'vs':'win'},
    //                 {'name':'LG', 'price':1200, 'vs':'win'}
    //             ]
    //         },
    //         {
    //             'name': 'B',
    //             'bandWidth':20,
    //             'hertz':'18',
    //             'type':'narrow',
    //             'winBidder': '',
    //             'winPrice': 2300,
    //             'bidders': [
    //                 {'name':'KT', 'price':2300, 'vs':'win'},
    //                 {'name':'SK', 'price':2300, 'vs':'win'},
    //                 {'name':'LG', 'price':2300, 'vs':'win'}
    //             ]
    //         },
    //         {
    //             'name': 'C',
    //             'bandWidth':20,
    //             'hertz':'21',
    //             'type':'wideBand',
    //             'winBidder': '',
    //             'winPrice': 3150,
    //             'bidders': [
    //                 {'name':'KT', 'price':3150, 'vs':'win'},
    //                 {'name':'SK', 'price':3150, 'vs':'win'},
    //                 {'name':'LG', 'price':3150, 'vs':'win'}
    //             ]
    //         },
    //         {
    //             'name': 'D',
    //             'bandWidth':40,
    //             'hertz':'26',
    //             'type':'wideBand',
    //             'winBidder': '',
    //             'winPrice': 3816,
    //             'bidders': [
    //                 {'name':'KT', 'price':3816, 'vs':'win'},
    //                 {'name':'SK', 'price':3816, 'vs':'win'},
    //                 {'name':'LG', 'price':3816, 'vs':'win'}
    //             ]
    //         },
    //         {
    //             'name': 'E',
    //             'bandWidth':20,
    //             'hertz':'26',
    //             'type':'narrow',
    //             'winBidder': '',
    //             'winPrice': 3277,
    //             'bidders': [
    //                 {'name':'KT', 'price':3277, 'vs':'win'},
    //                 {'name':'SK', 'price':3277, 'vs':'win'},
    //                 {'name':'LG', 'price':3277, 'vs':'win'}
    //             ]
    //         },
    //     ]
    // },

    // 'frequency' : [
    //     {
    //         'name': 'A',
    //         'bandWidth':40,
    //         'hertz':'700',
    //         'type':'wideBand',
    //         'winBidder': '',
    //         'winPrice': 0,
    //         'bidders': [
    //             {'name':'KT', 'price':0, 'vs':'win'},
    //             {'name':'SK', 'price':0, 'vs':'win'},
    //             {'name':'LG', 'price':0, 'vs':'win'}
    //         ]
    //     },
    //     {
    //         'name': 'B',
    //         'bandWidth':20,
    //         'hertz':'18',
    //         'type':'narrow',
    //         'winBidder': '',
    //         'winPrice': 0,
    //         'bidders': [
    //             {'name':'KT', 'price':0, 'vs':'win'},
    //             {'name':'SK', 'price':0, 'vs':'win'},
    //             {'name':'LG', 'price':0, 'vs':'win'}
    //         ]
    //     },
    //     {
    //         'name': 'C',
    //         'bandWidth':20,
    //         'hertz':'21',
    //         'type':'wideBand',
    //         'winBidder': '',
    //         'winPrice': 0,
    //         'bidders': [
    //             {'name':'KT', 'price':0, 'vs':'win'},
    //             {'name':'SK', 'price':0, 'vs':'win'},
    //             {'name':'LG', 'price':0, 'vs':'win'}
    //         ]
    //     },
    //     {
    //         'name': 'D',
    //         'bandWidth':40,
    //         'hertz':'26',
    //         'type':'wideBand',
    //         'winBidder': '',
    //         'winPrice': 0,
    //         'bidders': [
    //             {'name':'KT', 'price':0, 'vs':'win'},
    //             {'name':'SK', 'price':0, 'vs':'win'},
    //             {'name':'LG', 'price':0, 'vs':'win'}
    //         ]
    //     },
    //     {
    //         'name': 'E',
    //         'bandWidth':20,
    //         'hertz':'26',
    //         'type':'narrow',
    //         'winBidder': '',
    //         'winPrice': 0,
    //         'bidders': [
                // {'name':'KT', 'price':0, 'vs':'win'},
                // {'name':'SK', 'price':0, 'vs':'win'},
                // {'name':'LG', 'price':0, 'vs':'win'}
    //         ]
    //     },
    // ],

    // 'frequency' : [
    //     {
    //         'name': 'A',
    //         'bandWidth':40,
    //         'hertz':'700',
    //         'type':'wideBand',
    //         'winBidder': '',
    //         'winPrice': 0,
    //         'bidders': [
    //             {'name':'KT', 'price':0},
    //             {'name':'SK', 'price':0},
    //             {'name':'LG', 'price':0}
    //         ],
    //     },
    //     {
    //         'name': 'B',
    //         'bandWidth':20,
    //         'hertz':'18',
    //         'type':'narrow',
    //         'winBidder': '',
    //         'winPrice': 0,
    //         'bidders': [
    //             {'name':'KT', 'price':0},
    //             {'name':'SK', 'price':0},
    //             {'name':'LG', 'price':0}
    //         ],
    //     },
    //     {
    //         'name': 'C',
    //         'bandWidth':20,
    //         'hertz':'21',
    //         'type':'wideBand',
    //         'winBidder': '',
    //         'winPrice': 0,
    //         'bidders': [
    //             {'name':'KT', 'price':0},
    //             {'name':'SK', 'price':0},
    //             {'name':'LG', 'price':0}
    //         ],
    //     },
    //     {
    //         'name': 'D',
    //         'bandWidth':40,
    //         'hertz':'26',
    //         'type':'wideBand',
    //         'winBidder': '',
    //         'winPrice': 0,
    //         'bidders': [
    //             {'name':'KT', 'price':0},
    //             {'name':'SK', 'price':0},
    //             {'name':'LG', 'price':0}
    //         ],
    //     },
    //     {
    //         'name': 'E',
    //         'bandWidth':20,
    //         'hertz':'26',
    //         'type':'narrow',
    //         'winBidder': '',
    //         'winPrice': 0,
    //         'bidders': [
    //             {'name':'KT', 'price':0},
    //             {'name':'SK', 'price':0},
    //             {'name':'LG', 'price':0}
    //         ],
    //     },
    // ],
    // color: "black",
    // size: "unisize"
});
