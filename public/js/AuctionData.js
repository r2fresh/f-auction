define({
    'defaultPriceList':[
        {'name':'priceA','bandWidth':40,'price':0,'type':'wideBand'},
        {'name':'priceB','bandWidth':20,'price':0,'type':'narrow'},
        {'name':'priceC','bandWidth':20,'price':0,'type':'wideBand'},
        {'name':'priceD','bandWidth':40,'price':0,'type':'wideBand'},
        {'name':'priceE','bandWidth':20,'price':0,'type':'narrow'}
    ],

    'startPriceList':[
        {'name':'priceA','bandWidth':40,'price':1220,'type':'wideBand'},
        {'name':'priceB','bandWidth':20,'price':2300,'type':'narrow'},
        {'name':'priceC','bandWidth':20,'price':1150,'type':'wideBand'},
        {'name':'priceD','bandWidth':40,'price':1816,'type':'wideBand'},
        {'name':'priceE','bandWidth':20,'price':1277,'type':'narrow'}
    ],

    'startPrices': {
        'frequency' : [
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
            },
            {
                'name': 'B',
                'bandWidth':20,
                'hertz':'18',
                'type':'narrow',
                'winBidder': '',
                'winPrice': 2300,
                'bidders': [
                    {'name':'KT', 'price':2300, 'vs':'win'},
                    {'name':'SK', 'price':2300, 'vs':'win'},
                    {'name':'LG', 'price':2300, 'vs':'win'}
                ]
            },
            {
                'name': 'C',
                'bandWidth':20,
                'hertz':'21',
                'type':'wideBand',
                'winBidder': '',
                'winPrice': 3150,
                'bidders': [
                    {'name':'KT', 'price':3150, 'vs':'win'},
                    {'name':'SK', 'price':3150, 'vs':'win'},
                    {'name':'LG', 'price':3150, 'vs':'win'}
                ]
            },
            {
                'name': 'D',
                'bandWidth':40,
                'hertz':'26',
                'type':'wideBand',
                'winBidder': '',
                'winPrice': 3816,
                'bidders': [
                    {'name':'KT', 'price':3816, 'vs':'win'},
                    {'name':'SK', 'price':3816, 'vs':'win'},
                    {'name':'LG', 'price':3816, 'vs':'win'}
                ]
            },
            {
                'name': 'E',
                'bandWidth':20,
                'hertz':'26',
                'type':'narrow',
                'winBidder': '',
                'winPrice': 3277,
                'bidders': [
                    {'name':'KT', 'price':3277, 'vs':'win'},
                    {'name':'SK', 'price':3277, 'vs':'win'},
                    {'name':'LG', 'price':3277, 'vs':'win'}
                ]
            },
        ]
    },
    'round': {
        'frequency' : [
            {
                'name': 'A',
                'bandWidth':40,
                'hertz':'700',
                'type':'wideBand',
                'winBidder': '',
                'winPrice': 0,
                'bidders': [
                    {'name':'KT', 'price':0, 'vs':'win'},
                    {'name':'SK', 'price':0, 'vs':'win'},
                    {'name':'LG', 'price':0, 'vs':'win'}
                ]
            },
            {
                'name': 'B',
                'bandWidth':20,
                'hertz':'18',
                'type':'narrow',
                'winBidder': '',
                'winPrice': 0,
                'bidders': [
                    {'name':'KT', 'price':0, 'vs':'win'},
                    {'name':'SK', 'price':0, 'vs':'win'},
                    {'name':'LG', 'price':0, 'vs':'win'}
                ]
            },
            {
                'name': 'C',
                'bandWidth':20,
                'hertz':'21',
                'type':'wideBand',
                'winBidder': '',
                'winPrice': 0,
                'bidders': [
                    {'name':'KT', 'price':0, 'vs':'win'},
                    {'name':'SK', 'price':0, 'vs':'win'},
                    {'name':'LG', 'price':0, 'vs':'win'}
                ]
            },
            {
                'name': 'D',
                'bandWidth':40,
                'hertz':'26',
                'type':'wideBand',
                'winBidder': '',
                'winPrice': 0,
                'bidders': [
                    {'name':'KT', 'price':0, 'vs':'win'},
                    {'name':'SK', 'price':0, 'vs':'win'},
                    {'name':'LG', 'price':0, 'vs':'win'}
                ]
            },
            {
                'name': 'E',
                'bandWidth':20,
                'hertz':'26',
                'type':'narrow',
                'winBidder': '',
                'winPrice': 0,
                'bidders': [
                    {'name':'KT', 'price':0, 'vs':'win'},
                    {'name':'SK', 'price':0, 'vs':'win'},
                    {'name':'LG', 'price':0, 'vs':'win'}
                ]
            },
        ]
    },
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
    //             {'name':'KT', 'price':0, 'vs':'win'},
    //             {'name':'SK', 'price':0, 'vs':'win'},
    //             {'name':'LG', 'price':0, 'vs':'win'}
    //         ]
    //     },
    // ],

    'frequency' : [
        {
            'name': 'A',
            'bandWidth':40,
            'hertz':'700',
            'type':'wideBand',
            'winBidder': '',
            'winPrice': 0,
            'bidders': null,
        },
        {
            'name': 'B',
            'bandWidth':20,
            'hertz':'18',
            'type':'narrow',
            'winBidder': '',
            'winPrice': 0,
            'bidders': null,
        },
        {
            'name': 'C',
            'bandWidth':20,
            'hertz':'21',
            'type':'wideBand',
            'winBidder': '',
            'winPrice': 0,
            'bidders': null,
        },
        {
            'name': 'D',
            'bandWidth':40,
            'hertz':'26',
            'type':'wideBand',
            'winBidder': '',
            'winPrice': 0,
            'bidders': null,
        },
        {
            'name': 'E',
            'bandWidth':20,
            'hertz':'26',
            'type':'narrow',
            'winBidder': '',
            'winPrice': 0,
            'bidders': null,
        },
    ],
    'bidders': [
        {'name':'KT', 'price':0, 'vs':'win'},
        {'name':'SK', 'price':0, 'vs':'win'},
        {'name':'LG', 'price':0, 'vs':'win'}
    ],
    color: "black",
    size: "unisize"
});
