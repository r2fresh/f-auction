define([
   'module',
   'js/chart/ChartData2'
   ],
   function(module, ChartData){

	'use strict'

    var KTWideBandList = null;
    var KTWideBandChartList = null;

    var KTNarrowList = null;
    var KTNarrowChartList = null;

 	module.exports = new (Backbone.View.extend({
        el:'._chart',
        render:function(){
            this.setBiddingPattern();

            this.getChartData();

            Auction.io.on('GET_CHART_DATA', Function.prototype.bind.call(this.getChartData,this) );
        },
        getChartData:function(){
            this.$el.find('#biddingPattern').hide();
            ChartData.getRoundList(Function.prototype.bind.call(this.setChartDataList,this));
        },
        setChartDataList:function(data){

            var chartData = JSON.parse(JSON.stringify(data))

            KTWideBandList = ChartData.getWideBandList('KT', chartData);
            KTWideBandChartList = _.pluck(KTWideBandList,'price');

            KTNarrowList = ChartData.getNarrowList('KT',chartData);
            KTNarrowChartList = _.pluck(KTNarrowList,'price');

            this.patternChart.series[1].update({
                data : KTWideBandChartList,
                dataLabels : {
                    allowOverlap : true,
                    formatter: function () {
                        var round = KTWideBandList[this.point.index].round;
                        return '<span style="color:rgba(237, 31, 39, 1)">' + round + '</span>/' + this.y;
                    }
                }
            });

            this.patternChart.series[2].update({
                data : KTNarrowChartList,
                dataLabels : {
                    allowOverlap : true,
                    formatter: function () {
                        var round = KTNarrowList[this.point.index].round;
                        return '<span style="color:rgba(237, 31, 39, 1)">' + round + '</span>/' + this.y;
                    },
                }
            });

            this.$el.find('#biddingPattern').show();

            // 차트에서 가이드 관련 정보 삭제
            this.$el.find('#biddingPattern .highcharts-series-group .highcharts-series-0').remove();
            this.$el.find('#biddingPattern .highcharts-legend .highcharts-legend-item:eq(0)').remove();

            // 차트에서 광대역과 협대역을 하나로 표시 하기 위해 협대역 삭제
            this.$el.find('#biddingPattern .highcharts-legend .highcharts-legend-item:odd').remove();
        },
        setBiddingPattern:function(){

            var options = {
                chart: {
                    renderTo:$('#biddingPattern')[0],
                    type: 'line',
                    spacingRight: 0,
                },
                exporting:{
                    enabled:false,
                    sourceWith:775,
                    sourceHeight:1277
                },
                credits:{
                    enabled:false
                },
                title: {
                    text: '입찰 패턴 분석'
                },
                xAxis: {
                    //type: 'datetime',
                    /*dateTimeLabelFormats: { // don't display the dummy year
                        month: '%e. %b',
                        year: '%b'
                    },*/
               		tickInterval:1,
                    title: {
                        //text: '주파수'
                    },


                    plotLines: [
                    {
                        color: '#C9D405',
                        width: 1,
                        value: 0.5,
                        zIndex:5
                    },
                    {
                        color: '#C9D405',
                        width: 1,
                        value: 3.5,
                        zIndex:5
                    },
                    {
                        color: '#C9D405',
                        width: 1,
                        value: 6.5,
                        zIndex:5
                    },
                    {
                        color: '#C9D405',
                        width: 1,
                        value: 9.5,
                        zIndex:5
                    },
                    {
                        color: '#C9D405',
                        width: 1,
                        value: 12.5,
                        zIndex:5
                    },
                    {
                        color: '#C9D405',
                        width: 1,
                        value: 15.5,
                        zIndex:5
                    }
                    ],


                    plotBands: [{ // mark the weekend
                        color: '#FCFFC5',
                        from: 0.5,
                        to: 3.5,
                        label: {
                            verticalAlign:'bottom',
                            text: 'A 700MHz(광)',
                            rotation: 0,
                            textAlign: 'center',
                            y:40
                        }
                    }
                    ,{ // mark the weekend
                        color: '#FFFFFF',
                        from: 3.5,
                        to: 6.5,
                        label: {
                            verticalAlign:'bottom',
                            text: 'B 1.8MHz(협)',
                            rotation: 0,
                            textAlign: 'center',
                            y:40
                        }
                    }
                    ,{ // mark the weekend
                        color: '#FCFFC5',
                        from: 6.5,
                        to: 9.5,
                        label: {
                            verticalAlign:'bottom',
                            text: 'C 2.1MHz(광)',
                            rotation: 0,
                            textAlign: 'center',
                            y:40
                        }
                    }
                    ,{ // mark the weekend
                        color: '#FFFFFF',
                        from: 9.5,
                        to: 12.5,
                        label: {
                            verticalAlign:'bottom',
                            text: 'D 2.6MHz(광)',
                            rotation: 0,
                            textAlign: 'center',
                            y:40
                        }
                    }
                    ,{ // mark the weekend
                        color: '#FCFFC5',
                        from: 12.5,
                        to: 15.5,
                        label: {
                            verticalAlign:'bottom',
                            text: 'E 2.6MHz(협)',
                            rotation: 0,
                            textAlign: 'center',
                            y:40
                        }
                    }],
                    labels: {
                        formatter: function () {
                            var company = '';

                            //console.log(this.value%3)

                            var account = this.value%3;

                            switch(account){
                                case 1:
                                    company = 'KT';
                                break;
                                case 2:
                                    company = 'SKT';
                                break;
                                case 0:
                                    company = 'LGU+';
                                break;
                            }
                            return company;
                            //console.log(this)
                            //return 'A'
                        }
                    }
                },
                yAxis: {
                    title: {
                        text: '입찰액'
                    },
                    tickInterval:100,
                    //max: 6800,
                    min: 3277,

                },
                tooltip: {
                    enabled:false,
                    headerFormat: '<b>{series.name}</b><br>',
                    pointFormat: '{point.x:%e. %b}: {point.y:.2f} m'
                },

                plotOptions: {
                    line: {
                        marker: {
                            enabled: true
                        },

                        dataLabels: {
                          enabled: true,
                        //  formatter: function () {
                        //     var round = KTWideBandList[this.point.index].round;
                        //     return '(' + round + ')' + this.y;
                        //   },
                          style:{'fontSize':'6px'},
                          crop: false,
                          overflow: 'none',
                          x:35,
                          y:13
                        },
                        states: {
                            hover: {
                                enabled: false
                            }
                        }
                    }
                },

                legend: {
                    itemMarginTop: 15
                },

                series: [
                    {
                        name: '가이드',
                        marker:{
                            enabled:false,
                            lineWidth:1
                        },
                        dataLabels:{
                            enabled:false
                        },
                        data: [
                            [0.5, 3277],[15.5, 3277]
                        ]
                    },
                    {
                        name: 'KT',
                        marker:{
                            symbol:'circle'
                        },
                        color:'rgba(237, 31, 39, 1)',
                        data:[]
                    }
                ,{
                    name: 'KT 협대역',
                    marker:{
                        symbol:'circle'
                    },
                    color:'rgba(237, 31, 39, 1)',
                    data: []
                }
                ,{
                    name: 'SKT',
                    marker:{
                        symbol:'circle'
                    },
                    color:'rgba(0, 114, 255, 1)',
                    data: []
                }
                ,{
                    name: 'SKT 협대역',
                    marker:{
                        symbol:'circle'
                    },
                    color:'rgba(0, 114, 255, 1)',
                    data: []
                }
                ,{
                    name: 'LGU+',
                    marker:{
                        symbol:'circle'
                    },
                    color:'rgba(46, 181, 2, 1)',
                    data: []
                }
                ,{
                    name: 'LGU+ 협대역',
                    marker:{
                        symbol:'circle'
                    },
                    color:'rgba(46, 181, 2, 1)',
                    data: []
                }
                ]
            };

            this.patternChart = new Highcharts.Chart(options);
        }
 	}))

})
