define([
   'module',
   'js/win_chart/ChartData'
   ],
   function(module, ChartData){

	'use strict'

    var A_list = null, B_list = null, C_list = null, D_list = null, E_list = null;
    var A_ChartList = null, B_ChartList = null, C_ChartList = null, D_ChartList = null, E_ChartList = null;

    //var KTNarrowList = null;
    //var KTNarrowChartList = null;

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
        formatter: function (list) {
            var round = list[this.point.index].round;
            var name = list[this.point.index].name;
            var companyName = '';

            if(name == 'KT'){
                companyName = 'KT';
            } else if(name == 'SK'){
                companyName = 'SKT';
            } else if(name == 'LG'){
                companyName = 'LGU+'
            }

            //var label = '<span class="label label-' + name + '-s">' + companyName + '</span>';
            var label = '<span class="text-' + name + '">' + companyName + '</span> / ';

            return '<span class="text-' + name + '">' + round + '</span> / ' + label + Auction.numberic.get(this.y);
        },
        setChartDataList:function(data){

            var chartData = JSON.parse(JSON.stringify(data))

            var self = this;

            A_list = ChartData.getWideBandList('priceA', chartData);
            A_ChartList = _.pluck(A_list,'price');

            B_list = ChartData.getWideBandList('priceB', chartData);
            B_ChartList = _.pluck(B_list,'price');

            C_list = ChartData.getWideBandList('priceC', chartData);
            C_ChartList = _.pluck(C_list,'price');

            D_list = ChartData.getWideBandList('priceD', chartData);
            D_ChartList = _.pluck(D_list,'price');

            E_list = ChartData.getWideBandList('priceE',chartData);
            E_ChartList = _.pluck(E_list,'price');

            this.patternChart.series[1].update({
                data : A_ChartList,
                dataLabels : {
                    align : 'left',
                    allowOverlap : true,
                    formatter: function(){
                        return (Function.prototype.bind.call(self.formatter,this))(A_list)
                        //return Auction.chart.formatter(D_list, this);
                    },
                    useHTML:true
                }
            });

            this.patternChart.series[2].update({
                data : B_ChartList,
                dataLabels : {
                    align : 'left',
                    allowOverlap : true,
                    formatter: function(){
                        return (Function.prototype.bind.call(self.formatter,this))(B_list)
                        //return Auction.chart.formatter(D_list, this);
                    },
                    useHTML:true
                }
            });

            this.patternChart.series[3].update({
                data : C_ChartList,
                dataLabels : {
                    align : 'left',
                    allowOverlap : true,
                    formatter: function(){
                        return (Function.prototype.bind.call(self.formatter,this))(C_list)
                        //return Auction.chart.formatter(D_list, this);
                    },
                    useHTML:true
                }
            });

            this.patternChart.series[4].update({
                data : D_ChartList,
                dataLabels : {
                    align : 'left',
                    allowOverlap : true,
                    formatter: function(){
                        return (Function.prototype.bind.call(self.formatter,this))(D_list)
                        //return Auction.chart.formatter(D_list, this);
                    },
                    useHTML:true
                }
            });

            this.patternChart.series[5].update({
                data : E_ChartList,
                dataLabels : {
                    align : 'left',
                    allowOverlap : true,
                    formatter: function(){
                        return (Function.prototype.bind.call(self.formatter,this))(E_list)
                        //return Auction.chart.formatter(D_list, this);
                    },
                    useHTML:true
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
                    //zoomType: 'xy'
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
                    text: ''
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
                            value: 1.5,
                            zIndex:5
                        },
                        {
                            color: '#C9D405',
                            width: 1,
                            value: 2.5,
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
                            value: 4.5,
                            zIndex:5
                        },
                        {
                            color: '#C9D405',
                            width: 1,
                            value: 5.5,
                            zIndex:5
                        }
                    ],


                    plotBands: [{ // mark the weekend
                        color: '#FCFFC5',
                        from: 0.5,
                        to: 1.5,
                        // label: {
                        //     verticalAlign:'bottom',
                        //     text: 'A 700MHz(광)',
                        //     rotation: 0,
                        //     textAlign: 'center',
                        //     y:40
                        // }
                    }
                    ,{ // mark the weekend
                        color: '#FFFFFF',
                        from: 1.5,
                        to: 2.5,
                        // label: {
                        //     verticalAlign:'bottom',
                        //     text: 'B 1.8MHz(협)',
                        //     rotation: 0,
                        //     textAlign: 'center',
                        //     y:40
                        // }
                    }
                    ,{ // mark the weekend
                        color: '#FCFFC5',
                        from: 2.5,
                        to: 3.5,
                        // label: {
                        //     verticalAlign:'bottom',
                        //     text: 'C 2.1MHz(광)',
                        //     rotation: 0,
                        //     textAlign: 'center',
                        //     y:40
                        // }
                    }
                    ,{ // mark the weekend
                        color: '#FFFFFF',
                        from: 3.5,
                        to: 4.5,
                        // label: {
                        //     verticalAlign:'bottom',
                        //     text: 'D 2.6MHz(광)',
                        //     rotation: 0,
                        //     textAlign: 'center',
                        //     y:40
                        // }
                    }
                    ,{ // mark the weekend
                        color: '#FCFFC5',
                        from: 4.5,
                        to: 5.5,
                        // label: {
                        //     verticalAlign:'bottom',
                        //     text: 'E 2.6MHz(협)',
                        //     rotation: 0,
                        //     textAlign: 'center',
                        //     y:40
                        // }
                    }],
                    labels: {
                        formatter: function () {
                            var company = '';

                            switch(this.value){
                                case 1:
                                    company = '<strong style="font-size:12px;"><span class="label label-default">A</span> 700MHz(광대역)</strong>';
                                break;
                                case 2:
                                    company = '<strong style="font-size:12px;"><span class="label label-default">B</span> 1.8GHz(협대역)</strong>';
                                break;
                                case 3:
                                    company = '<strong style="font-size:12px;"><span class="label label-default">C</span> 2.1GHz(광대역)</strong>';
                                break;
                                case 4:
                                    company = '<strong style="font-size:12px;"><span class="label label-default">D</span> 2.6GHz(광대역)</strong>';
                                break;
                                case 5:
                                    company = '<strong style="font-size:12px;"><span class="label label-default">E</span> 2.6GHz(협대역)</strong>';
                                break;
                            }
                            return company;
                        },
                        y:25,
                        useHTML : true
                    },
                    // events:{
                    //     afterSetExtremes:function(){
                    //         console.log(this.chart.options.plotOptions.line.dataLabels.style.fontSize)
                    //
                    //         this.chart.options.plotOptions.line.dataLabels.style.fontSize = '30px'
                    //         // this.update({
                    //         //     labels:{
                    //         //         style:{
                    //         //             fontSize:20
                    //         //         }
                    //         //     }
                    //         // });
                    //     }
                    //  }
                },
                yAxis: {
                    title: {
                        text: ' '
                    },
                    tickInterval:100,
                    //max: 6800,
                    min: 3277,
                    labels: {
                        formatter: function () {
                            return Auction.numberic.get(this.value);
                        }
                    }

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
                          allowOverlap:true,
                        //  formatter: function () {
                        //     var round = KTWideBandList[this.point.index].round;
                        //     return '(' + round + ')' + this.y;
                        //   },
                          style:{'fontSize':'14px'},
                          crop: false,
                          overflow: 'none',
                          x:0,
                          y:13
                        },
                        states: {
                            hover: {
                                enabled: false
                            }
                        }
                    },
                    series: {
                        color: '#666666',
                        lineWidth: 1
                    }
                },

                legend: {
                    itemMarginTop: 15,
                    enabled : false
                },

                series: [
                    {
                        name: '가이드',
                        marker:{ enabled:false, lineWidth:1 },
                        dataLabels:{ enabled:false },
                        data: [[0.5, 3277],[5.5, 3277]]
                    },
                    {
                        name: 'A-700MHz(광대역)',
                        marker:{ symbol:'circle' },
                        //color:'rgba(237, 31, 39, 1)',
                        data:[]
                    }
                    ,{
                        name: 'B-1.8GHz(협대역)',
                        marker:{ symbol:'circle' },
                        //color:'rgba(237, 31, 39, 1)',
                        data: []
                    }
                    ,{
                        name: 'C-2.1Hz(광대역)',
                        marker:{ symbol:'circle' },
                        //color:'rgba(0, 114, 255, 1)',
                        data: []
                    }
                    ,{
                        name: 'D-2.6Hz(광대역)',
                        marker:{ symbol:'circle' },
                        //color:'rgba(0, 114, 255, 1)',
                        data: []
                    }
                    ,{
                        name: 'E-2.6Hz(협대역)',
                        marker:{ symbol:'circle' },
                        //color:'rgba(46, 181, 2, 1)',
                        data: []
                    }
                ]
            };

            this.patternChart = new Highcharts.Chart(options);
        }
 	}))
})
