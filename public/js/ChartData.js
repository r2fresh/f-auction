define([
   'module',
   'js/Model'
   ],
   function(module, Model){

       module.exports = {

           setChartDataList:null,

           getRoundList:function(callback){

               this.setChartDataList = callback;

               //라운드 전체 리스트 호출
               Model.getRoundList({
                    url: '/round',
                    method : 'GET',
                    contentType:"application/json; charset=UTF-8",
                    success : Function.prototype.bind.call(this.getRoundListSuccess,this),
                    error : function(jsXHR, textStatus, errorThrown){}
                })

           },

           getRoundListSuccess:function(data, textStatus, jqXHR){
               if(textStatus == 'success'){
                   var chartData = [
                              {
                                "name": 1,
                                "frequency": [
                                  {
                                    "name": "priceA",
                                    "bandWidth": 40,
                                    "hertz": "700",
                                    "type": "wideBand",
                                    "winBidder": "",
                                    "winPrice": "",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "",
                                        "hertzFlag": false,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "",
                                        "hertzFlag": false,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "",
                                        "hertzFlag": false,
                                        "vs": "",
                                        "className": "text-gray"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceB",
                                    "bandWidth": 20,
                                    "hertz": "18",
                                    "type": "narrow",
                                    "winBidder": "SK",
                                    "winPrice": "4513",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "4513",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-SK-l"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceC",
                                    "bandWidth": 20,
                                    "hertz": "21",
                                    "type": "wideBand",
                                    "winBidder": "SK",
                                    "winPrice": "3816",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "3816",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-SK-l"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceD",
                                    "bandWidth": 40,
                                    "hertz": "26",
                                    "type": "wideBand",
                                    "winBidder": "KT",
                                    "winPrice": "6553",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "6553",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-KT-l"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "6553",
                                        "hertzFlag": true,
                                        "vs": "lose",
                                        "className": "text-gray"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceE",
                                    "bandWidth": 20,
                                    "hertz": "26",
                                    "type": "narrow",
                                    "winBidder": "",
                                    "winPrice": "",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      }
                                    ]
                                  }
                                ]
                              },
                              {
                                "name": 2,
                                "frequency": [
                                  {
                                    "name": "priceA",
                                    "bandWidth": 40,
                                    "hertz": "700",
                                    "type": "wideBand",
                                    "winBidder": "",
                                    "winPrice": "",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "",
                                        "hertzFlag": false,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "",
                                        "hertzFlag": false,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "",
                                        "hertzFlag": false,
                                        "vs": "",
                                        "className": "text-gray"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceB",
                                    "bandWidth": 20,
                                    "hertz": "18",
                                    "type": "narrow",
                                    "winBidder": "SK",
                                    "winPrice": "4513",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "4513",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-SK-l"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceC",
                                    "bandWidth": 20,
                                    "hertz": "21",
                                    "type": "wideBand",
                                    "winBidder": "LG",
                                    "winPrice": "3845",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "3816",
                                        "hertzFlag": true,
                                        "vs": "lose",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "3845",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-LG-l"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceD",
                                    "bandWidth": 40,
                                    "hertz": "26",
                                    "type": "wideBand",
                                    "winBidder": "KT",
                                    "winPrice": "6553",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "6553",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-KT-l"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceE",
                                    "bandWidth": 20,
                                    "hertz": "26",
                                    "type": "narrow",
                                    "winBidder": "LG",
                                    "winPrice": "3277",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "3277",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-LG-l"
                                      }
                                    ]
                                  }
                                ]
                              },
                              {
                                "name": 3,
                                "frequency": [
                                  {
                                    "name": "priceA",
                                    "bandWidth": 40,
                                    "hertz": "700",
                                    "type": "wideBand",
                                    "winBidder": "",
                                    "winPrice": "",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "",
                                        "hertzFlag": false,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "",
                                        "hertzFlag": false,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "",
                                        "hertzFlag": false,
                                        "vs": "",
                                        "className": "text-gray"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceB",
                                    "bandWidth": 20,
                                    "hertz": "18",
                                    "type": "narrow",
                                    "winBidder": "SK",
                                    "winPrice": "4513",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "4513",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-SK-l"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceC",
                                    "bandWidth": 20,
                                    "hertz": "21",
                                    "type": "wideBand",
                                    "winBidder": "LG",
                                    "winPrice": "3845",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "3845",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-LG-l"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceD",
                                    "bandWidth": 40,
                                    "hertz": "26",
                                    "type": "wideBand",
                                    "winBidder": "SK",
                                    "winPrice": "6603",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "6553",
                                        "hertzFlag": true,
                                        "vs": "lose",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "6603",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-SK-l"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceE",
                                    "bandWidth": 20,
                                    "hertz": "26",
                                    "type": "narrow",
                                    "winBidder": "LG",
                                    "winPrice": "3277",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "3277",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-LG-l"
                                      }
                                    ]
                                  }
                                ]
                              },
                              {
                                "name": 4,
                                "frequency": [
                                  {
                                    "name": "priceA",
                                    "bandWidth": 40,
                                    "hertz": "700",
                                    "type": "wideBand",
                                    "winBidder": "",
                                    "winPrice": "",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "",
                                        "hertzFlag": false,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "",
                                        "hertzFlag": false,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "",
                                        "hertzFlag": false,
                                        "vs": "",
                                        "className": "text-gray"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceB",
                                    "bandWidth": 20,
                                    "hertz": "18",
                                    "type": "narrow",
                                    "winBidder": "KT",
                                    "winPrice": "4559",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "4559",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-KT-l"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "4513",
                                        "hertzFlag": true,
                                        "vs": "lose",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceC",
                                    "bandWidth": 20,
                                    "hertz": "21",
                                    "type": "wideBand",
                                    "winBidder": "KT",
                                    "winPrice": "3884",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "3884",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-KT-l"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "3845",
                                        "hertzFlag": true,
                                        "vs": "lose",
                                        "className": "text-gray"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceD",
                                    "bandWidth": 40,
                                    "hertz": "26",
                                    "type": "wideBand",
                                    "winBidder": "SK",
                                    "winPrice": "6603",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "6603",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-SK-l"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceE",
                                    "bandWidth": 20,
                                    "hertz": "26",
                                    "type": "narrow",
                                    "winBidder": "LG",
                                    "winPrice": "3277",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "3277",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-LG-l"
                                      }
                                    ]
                                  }
                                ]
                              },
                              {
                                "name": 5,
                                "frequency": [
                                  {
                                    "name": "priceA",
                                    "bandWidth": 40,
                                    "hertz": "700",
                                    "type": "wideBand",
                                    "winBidder": "",
                                    "winPrice": "",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "",
                                        "hertzFlag": false,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "",
                                        "hertzFlag": false,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "",
                                        "hertzFlag": false,
                                        "vs": "",
                                        "className": "text-gray"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceB",
                                    "bandWidth": 20,
                                    "hertz": "18",
                                    "type": "narrow",
                                    "winBidder": "KT",
                                    "winPrice": "4559",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "4559",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-KT-l"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceC",
                                    "bandWidth": 20,
                                    "hertz": "21",
                                    "type": "wideBand",
                                    "winBidder": "LG",
                                    "winPrice": "3914",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "3884",
                                        "hertzFlag": true,
                                        "vs": "lose",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "3914",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-LG-l"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceD",
                                    "bandWidth": 40,
                                    "hertz": "26",
                                    "type": "wideBand",
                                    "winBidder": "SK",
                                    "winPrice": "6603",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "6603",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-SK-l"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceE",
                                    "bandWidth": 20,
                                    "hertz": "26",
                                    "type": "narrow",
                                    "winBidder": "LG",
                                    "winPrice": "3277",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "3277",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-LG-l"
                                      }
                                    ]
                                  }
                                ]
                              },
                              {
                                "name": 6,
                                "frequency": [
                                  {
                                    "name": "priceA",
                                    "bandWidth": 40,
                                    "hertz": "700",
                                    "type": "wideBand",
                                    "winBidder": "",
                                    "winPrice": "",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "",
                                        "hertzFlag": false,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "",
                                        "hertzFlag": false,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "",
                                        "hertzFlag": false,
                                        "vs": "",
                                        "className": "text-gray"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceB",
                                    "bandWidth": 20,
                                    "hertz": "18",
                                    "type": "narrow",
                                    "winBidder": "KT",
                                    "winPrice": "4559",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "4559",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-KT-l"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceC",
                                    "bandWidth": 20,
                                    "hertz": "21",
                                    "type": "wideBand",
                                    "winBidder": "KT",
                                    "winPrice": "3954",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "3954",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-KT-l"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "3914",
                                        "hertzFlag": true,
                                        "vs": "lose",
                                        "className": "text-gray"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceD",
                                    "bandWidth": 40,
                                    "hertz": "26",
                                    "type": "wideBand",
                                    "winBidder": "SK",
                                    "winPrice": "6603",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "6603",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-SK-l"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceE",
                                    "bandWidth": 20,
                                    "hertz": "26",
                                    "type": "narrow",
                                    "winBidder": "SK",
                                    "winPrice": "3302",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "3302",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-SK-l"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "3277",
                                        "hertzFlag": true,
                                        "vs": "lose",
                                        "className": "text-gray"
                                      }
                                    ]
                                  }
                                ]
                              },
                              {
                                "name": 7,
                                "frequency": [
                                  {
                                    "name": "priceA",
                                    "bandWidth": 40,
                                    "hertz": "700",
                                    "type": "wideBand",
                                    "winBidder": "",
                                    "winPrice": "",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "",
                                        "hertzFlag": false,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "",
                                        "hertzFlag": false,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "",
                                        "hertzFlag": false,
                                        "vs": "",
                                        "className": "text-gray"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceB",
                                    "bandWidth": 20,
                                    "hertz": "18",
                                    "type": "narrow",
                                    "winBidder": "KT",
                                    "winPrice": "4559",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "4559",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-KT-l"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceC",
                                    "bandWidth": 20,
                                    "hertz": "21",
                                    "type": "wideBand",
                                    "winBidder": "KT",
                                    "winPrice": "3954",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "3954",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-KT-l"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceD",
                                    "bandWidth": 40,
                                    "hertz": "26",
                                    "type": "wideBand",
                                    "winBidder": "LG",
                                    "winPrice": "6653",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "6603",
                                        "hertzFlag": true,
                                        "vs": "lose",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "6653",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-LG-l"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceE",
                                    "bandWidth": 20,
                                    "hertz": "26",
                                    "type": "narrow",
                                    "winBidder": "SK",
                                    "winPrice": "3302",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "3302",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-SK-l"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      }
                                    ]
                                  }
                                ]
                              },
                              {
                                "name": 8,
                                "frequency": [
                                  {
                                    "name": "priceA",
                                    "bandWidth": 40,
                                    "hertz": "700",
                                    "type": "wideBand",
                                    "winBidder": "",
                                    "winPrice": "",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "",
                                        "hertzFlag": false,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "",
                                        "hertzFlag": false,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "",
                                        "hertzFlag": false,
                                        "vs": "",
                                        "className": "text-gray"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceB",
                                    "bandWidth": 20,
                                    "hertz": "18",
                                    "type": "narrow",
                                    "winBidder": "KT",
                                    "winPrice": "4559",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "4559",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-KT-l"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceC",
                                    "bandWidth": 20,
                                    "hertz": "21",
                                    "type": "wideBand",
                                    "winBidder": "SK",
                                    "winPrice": "3984",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "3954",
                                        "hertzFlag": true,
                                        "vs": "lose",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "3984",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-SK-l"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceD",
                                    "bandWidth": 40,
                                    "hertz": "26",
                                    "type": "wideBand",
                                    "winBidder": "LG",
                                    "winPrice": "6653",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "6653",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-LG-l"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceE",
                                    "bandWidth": 20,
                                    "hertz": "26",
                                    "type": "narrow",
                                    "winBidder": "SK",
                                    "winPrice": "3302",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "3302",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-SK-l"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      }
                                    ]
                                  }
                                ]
                              },
                              {
                                "name": 9,
                                "frequency": [
                                  {
                                    "name": "priceA",
                                    "bandWidth": 40,
                                    "hertz": "700",
                                    "type": "wideBand",
                                    "winBidder": "",
                                    "winPrice": "",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "",
                                        "hertzFlag": false,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "",
                                        "hertzFlag": false,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "",
                                        "hertzFlag": false,
                                        "vs": "",
                                        "className": "text-gray"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceB",
                                    "bandWidth": 20,
                                    "hertz": "18",
                                    "type": "narrow",
                                    "winBidder": "KT",
                                    "winPrice": "4559",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "4559",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-KT-l"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceC",
                                    "bandWidth": 20,
                                    "hertz": "21",
                                    "type": "wideBand",
                                    "winBidder": "SK",
                                    "winPrice": "3984",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "3984",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-SK-l"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceD",
                                    "bandWidth": 40,
                                    "hertz": "26",
                                    "type": "wideBand",
                                    "winBidder": "LG",
                                    "winPrice": "6653",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "6653",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-LG-l"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceE",
                                    "bandWidth": 20,
                                    "hertz": "26",
                                    "type": "narrow",
                                    "winBidder": "SK",
                                    "winPrice": "3302",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "3302",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-SK-l"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      }
                                    ]
                                  }
                                ]
                              },
                              {
                                "name": 10,
                                "frequency": [
                                  {
                                    "name": "priceA",
                                    "bandWidth": 40,
                                    "hertz": "700",
                                    "type": "wideBand",
                                    "winBidder": "",
                                    "winPrice": "",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "",
                                        "hertzFlag": false,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "",
                                        "hertzFlag": false,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "",
                                        "hertzFlag": false,
                                        "vs": "",
                                        "className": "text-gray"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceB",
                                    "bandWidth": 20,
                                    "hertz": "18",
                                    "type": "narrow",
                                    "winBidder": "KT",
                                    "winPrice": "4559",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "4559",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-KT-l"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceC",
                                    "bandWidth": 20,
                                    "hertz": "21",
                                    "type": "wideBand",
                                    "winBidder": "KT",
                                    "winPrice": "4024",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "4024",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-KT-l"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "3984",
                                        "hertzFlag": true,
                                        "vs": "lose",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceD",
                                    "bandWidth": 40,
                                    "hertz": "26",
                                    "type": "wideBand",
                                    "winBidder": "LG",
                                    "winPrice": "6653",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "6653",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-LG-l"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceE",
                                    "bandWidth": 20,
                                    "hertz": "26",
                                    "type": "narrow",
                                    "winBidder": "SK",
                                    "winPrice": "3302",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "3302",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-SK-l"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      }
                                    ]
                                  }
                                ]
                              },
                              {
                                "name": 11,
                                "frequency": [
                                  {
                                    "name": "priceA",
                                    "bandWidth": 40,
                                    "hertz": "700",
                                    "type": "wideBand",
                                    "winBidder": "",
                                    "winPrice": "",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "",
                                        "hertzFlag": false,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "",
                                        "hertzFlag": false,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "",
                                        "hertzFlag": false,
                                        "vs": "",
                                        "className": "text-gray"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceB",
                                    "bandWidth": 20,
                                    "hertz": "18",
                                    "type": "narrow",
                                    "winBidder": "KT",
                                    "winPrice": "4559",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "4559",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-KT-l"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceC",
                                    "bandWidth": 20,
                                    "hertz": "21",
                                    "type": "wideBand",
                                    "winBidder": "KT",
                                    "winPrice": "4024",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "4024",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-KT-l"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceD",
                                    "bandWidth": 40,
                                    "hertz": "26",
                                    "type": "wideBand",
                                    "winBidder": "SK",
                                    "winPrice": "6703",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "6703",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-SK-l"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "6653",
                                        "hertzFlag": true,
                                        "vs": "lose",
                                        "className": "text-gray"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceE",
                                    "bandWidth": 20,
                                    "hertz": "26",
                                    "type": "narrow",
                                    "winBidder": "SK",
                                    "winPrice": "3302",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "3302",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-SK-l"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      }
                                    ]
                                  }
                                ]
                              },
                              {
                                "name": 12,
                                "frequency": [
                                  {
                                    "name": "priceA",
                                    "bandWidth": 40,
                                    "hertz": "700",
                                    "type": "wideBand",
                                    "winBidder": "",
                                    "winPrice": "",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "",
                                        "hertzFlag": false,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "",
                                        "hertzFlag": false,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "",
                                        "hertzFlag": false,
                                        "vs": "",
                                        "className": "text-gray"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceB",
                                    "bandWidth": 20,
                                    "hertz": "18",
                                    "type": "narrow",
                                    "winBidder": "LG",
                                    "winPrice": "4594",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "4559",
                                        "hertzFlag": true,
                                        "vs": "lose",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "4594",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-LG-l"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceC",
                                    "bandWidth": 20,
                                    "hertz": "21",
                                    "type": "wideBand",
                                    "winBidder": "LG",
                                    "winPrice": "4055",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "4024",
                                        "hertzFlag": true,
                                        "vs": "lose",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "4055",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-LG-l"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceD",
                                    "bandWidth": 40,
                                    "hertz": "26",
                                    "type": "wideBand",
                                    "winBidder": "SK",
                                    "winPrice": "6703",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "6703",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-SK-l"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceE",
                                    "bandWidth": 20,
                                    "hertz": "26",
                                    "type": "narrow",
                                    "winBidder": "SK",
                                    "winPrice": "3302",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "3302",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-SK-l"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      }
                                    ]
                                  }
                                ]
                              },
                              {
                                "name": 13,
                                "frequency": [
                                  {
                                    "name": "priceA",
                                    "bandWidth": 40,
                                    "hertz": "700",
                                    "type": "wideBand",
                                    "winBidder": "",
                                    "winPrice": "",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "",
                                        "hertzFlag": false,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "",
                                        "hertzFlag": false,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "",
                                        "hertzFlag": false,
                                        "vs": "",
                                        "className": "text-gray"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceB",
                                    "bandWidth": 20,
                                    "hertz": "18",
                                    "type": "narrow",
                                    "winBidder": "LG",
                                    "winPrice": "4594",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "4594",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-LG-l"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceC",
                                    "bandWidth": 20,
                                    "hertz": "21",
                                    "type": "wideBand",
                                    "winBidder": "LG",
                                    "winPrice": "4055",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "4055",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-LG-l"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceD",
                                    "bandWidth": 40,
                                    "hertz": "26",
                                    "type": "wideBand",
                                    "winBidder": "KT",
                                    "winPrice": "6771",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "6771",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-KT-l"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "6703",
                                        "hertzFlag": true,
                                        "vs": "lose",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceE",
                                    "bandWidth": 20,
                                    "hertz": "26",
                                    "type": "narrow",
                                    "winBidder": "SK",
                                    "winPrice": "3302",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "3302",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-SK-l"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      }
                                    ]
                                  }
                                ]
                              },
                              {
                                "name": 14,
                                "frequency": [
                                  {
                                    "name": "priceA",
                                    "bandWidth": 40,
                                    "hertz": "700",
                                    "type": "wideBand",
                                    "winBidder": "",
                                    "winPrice": "",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "",
                                        "hertzFlag": false,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "",
                                        "hertzFlag": false,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "",
                                        "hertzFlag": false,
                                        "vs": "",
                                        "className": "text-gray"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceB",
                                    "bandWidth": 20,
                                    "hertz": "18",
                                    "type": "narrow",
                                    "winBidder": "LG",
                                    "winPrice": "4594",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "4594",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-LG-l"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceC",
                                    "bandWidth": 20,
                                    "hertz": "21",
                                    "type": "wideBand",
                                    "winBidder": "SK",
                                    "winPrice": "4086",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "4086",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-SK-l"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "4055",
                                        "hertzFlag": true,
                                        "vs": "lose",
                                        "className": "text-gray"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceD",
                                    "bandWidth": 40,
                                    "hertz": "26",
                                    "type": "wideBand",
                                    "winBidder": "KT",
                                    "winPrice": "6771",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "6771",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-KT-l"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceE",
                                    "bandWidth": 20,
                                    "hertz": "26",
                                    "type": "narrow",
                                    "winBidder": "SK",
                                    "winPrice": "3302",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "3302",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-SK-l"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      }
                                    ]
                                  }
                                ]
                              },
                              {
                                "name": 15,
                                "frequency": [
                                  {
                                    "name": "priceA",
                                    "bandWidth": 40,
                                    "hertz": "700",
                                    "type": "wideBand",
                                    "winBidder": "",
                                    "winPrice": "",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "",
                                        "hertzFlag": false,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "",
                                        "hertzFlag": false,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "",
                                        "hertzFlag": false,
                                        "vs": "",
                                        "className": "text-gray"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceB",
                                    "bandWidth": 20,
                                    "hertz": "18",
                                    "type": "narrow",
                                    "winBidder": "LG",
                                    "winPrice": "4594",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "4594",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-LG-l"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceC",
                                    "bandWidth": 20,
                                    "hertz": "21",
                                    "type": "wideBand",
                                    "winBidder": "LG",
                                    "winPrice": "4117",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "4086",
                                        "hertzFlag": true,
                                        "vs": "lose",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "4117",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-LG-l"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceD",
                                    "bandWidth": 40,
                                    "hertz": "26",
                                    "type": "wideBand",
                                    "winBidder": "KT",
                                    "winPrice": "6771",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "6771",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-KT-l"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceE",
                                    "bandWidth": 20,
                                    "hertz": "26",
                                    "type": "narrow",
                                    "winBidder": "SK",
                                    "winPrice": "3302",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "3302",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-SK-l"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      }
                                    ]
                                  }
                                ]
                              },
                              {
                                "name": 16,
                                "frequency": [
                                  {
                                    "name": "priceA",
                                    "bandWidth": 40,
                                    "hertz": "700",
                                    "type": "wideBand",
                                    "winBidder": "",
                                    "winPrice": "",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "",
                                        "hertzFlag": false,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "",
                                        "hertzFlag": false,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "",
                                        "hertzFlag": false,
                                        "vs": "",
                                        "className": "text-gray"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceB",
                                    "bandWidth": 20,
                                    "hertz": "18",
                                    "type": "narrow",
                                    "winBidder": "LG",
                                    "winPrice": "4594",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "4594",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-LG-l"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceC",
                                    "bandWidth": 20,
                                    "hertz": "21",
                                    "type": "wideBand",
                                    "winBidder": "LG",
                                    "winPrice": "4117",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "4117",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-LG-l"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceD",
                                    "bandWidth": 40,
                                    "hertz": "26",
                                    "type": "wideBand",
                                    "winBidder": "SK",
                                    "winPrice": "6822",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "6771",
                                        "hertzFlag": true,
                                        "vs": "lose",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "6822",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-SK-l"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceE",
                                    "bandWidth": 20,
                                    "hertz": "26",
                                    "type": "narrow",
                                    "winBidder": "SK",
                                    "winPrice": "3302",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "3302",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-SK-l"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      }
                                    ]
                                  }
                                ]
                              },
                              {
                                "name": 17,
                                "frequency": [
                                  {
                                    "name": "priceA",
                                    "bandWidth": 40,
                                    "hertz": "700",
                                    "type": "wideBand",
                                    "winBidder": "",
                                    "winPrice": "",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "",
                                        "hertzFlag": false,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "",
                                        "hertzFlag": false,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "",
                                        "hertzFlag": false,
                                        "vs": "",
                                        "className": "text-gray"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceB",
                                    "bandWidth": 20,
                                    "hertz": "18",
                                    "type": "narrow",
                                    "winBidder": "LG",
                                    "winPrice": "4594",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "4594",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-LG-l"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceC",
                                    "bandWidth": 20,
                                    "hertz": "21",
                                    "type": "wideBand",
                                    "winBidder": "LG",
                                    "winPrice": "4117",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "4117",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-LG-l"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceD",
                                    "bandWidth": 40,
                                    "hertz": "26",
                                    "type": "wideBand",
                                    "winBidder": "KT",
                                    "winPrice": "6891",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "6891",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-KT-l"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "6822",
                                        "hertzFlag": true,
                                        "vs": "lose",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      }
                                    ]
                                  },
                                  {
                                    "name": "priceE",
                                    "bandWidth": 20,
                                    "hertz": "26",
                                    "type": "narrow",
                                    "winBidder": "SK",
                                    "winPrice": "3302",
                                    "bidders": [
                                      {
                                        "name": "KT",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      },
                                      {
                                        "name": "SK",
                                        "price": "3302",
                                        "hertzFlag": true,
                                        "vs": "win",
                                        "className": "label label-SK-l"
                                      },
                                      {
                                        "name": "LG",
                                        "price": "",
                                        "hertzFlag": true,
                                        "vs": "",
                                        "className": "text-gray"
                                      }
                                    ]
                                  }
                                ]
                              }
                            ]
                   this.setChartDataList(chartData);
               }
           },

           getKTWideBandList:function(data){

               var roundList = JSON.parse(JSON.stringify(data));

               var roundNum = null;

               var chartList = [];

               var frequencyName = '';

               var priceArr = ['priceA','priceB','priceC','priceD','priceE'];

               _.each(roundList, function(round){
                   roundNum = round.name;
                   _.each(round.frequency, function(frequency){

                       frequencyName = frequency.name;

                       if(frequency.type == 'wideBand'){
                           _.each(frequency.bidders,function(bidder){
                               if(bidder.name == 'KT' && bidder.price != ''){

                                   var x = (parseInt(priceArr.indexOf(frequencyName),10) + 1)*3-2;

                                   chartList.push({'round':roundNum, 'price':[x,parseInt(bidder.price,10)]})
                               };
                           });
                       };
                   });
               });

               console.log(chartList);

               return chartList;

           }

       }
   }
)
