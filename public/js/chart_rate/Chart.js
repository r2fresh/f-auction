define([
   'module',
   'js/chart_rate/ChartData'
   ],
   function(module, ChartData){

       'use strict'

       var A_list = null, B_list = null, C_list = null, D_list = null, E_list = null;
       var A_ChartList = null, B_ChartList = null, C_ChartList = null, D_ChartList = null, E_ChartList = null;

    	module.exports = new (Backbone.View.extend({
           el:'._chart',
           patternChart:null,
           $chartEl:null,
           initialize:function(){
               this.$chartEl = this.$el.find('#biddingPattern')
           },
           render:function(){
               this.setBiddingPattern();
               //this.setBiddingIncrease();

               this.$chartEl.hide();

               this.getChartData();

               Auction.io.on('GET_CHART_DATA', Function.prototype.bind.call(this.getChartData,this) );

           },
           getChartData:function(){
               this.$chartEl.hide();
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
               var companyNameElement = '<span class="text-' + name + '">' + companyName + '</span>';
               var roundElement = '<span class="text-' + name + '">(R' + round + ')</span>';
               var priceElement = '<span class="text-' + name + '">' + Auction.numberic.get(this.y) + '%</span>';

               return (list.length-1 == this.point.index) ? roundElement + priceElement : '';
           },
           setChartDataList:function(data){

               var chartData = JSON.parse(JSON.stringify(data))

               var self = this;

               A_list = ChartData.getWideBandList('priceA', chartData);
               A_ChartList = _.pluck(A_list,'rateIncrease');

               B_list = ChartData.getWideBandList('priceB', chartData);
               B_ChartList = _.pluck(B_list,'rateIncrease');

               C_list = ChartData.getWideBandList('priceC', chartData);
               C_ChartList = _.pluck(C_list,'rateIncrease');

               D_list = ChartData.getWideBandList('priceD', chartData);
               D_ChartList = _.pluck(D_list,'rateIncrease');

               E_list = ChartData.getWideBandList('priceE',chartData);
               E_ChartList = _.pluck(E_list,'rateIncrease');

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



               this.$chartEl.show();

               // 차트에서 가이드 관련 정보 삭제
               this.$chartEl.find('.highcharts-series-group .highcharts-series-0').remove();
               this.$chartEl.find('.highcharts-legend .highcharts-legend-item:eq(0)').remove();

               // 차트에서 광대역과 협대역을 하나로 표시 하기 위해 협대역 삭제
               this.$chartEl.find('.highcharts-legend .highcharts-legend-item:odd').remove();
           },

           setBiddingPattern:function(){

               var plotBands = [];

               for(var i=0; i< 20; ++i){
                   var num = 0;
                   var plotBand = {
                       color: '#ECECEC',
                       from: num + (5*i*2),
                       to: num + (5*i*2) + 5
                   }
                   plotBands.push(plotBand);
               }

               var options = {
                   chart: {
                       renderTo:this.$chartEl[0],
                       type: 'line',
                       spacingRight: 0,
                       zoomType:'xy'
                   },
                   exporting:{
                       enabled:false,
                       sourceWith:775,
                       sourceHeight:1277
                   },
                   credits: { enabled:false },
                   title: { text: '입찰증분율차트' },
                   xAxis: {
                       tickInterval:1,
                       plotLines: [
                           { color: '#AAAAAA', width: 2, value: 0.5, zIndex:5 },
                           { color: '#AAAAAA', width: 2, value: 3.5, zIndex:5 },
                           { color: '#AAAAAA', width: 2, value: 6.5, zIndex:5 },
                           { color: '#AAAAAA', width: 2, value: 9.5, zIndex:5 },
                           { color: '#AAAAAA', width: 2, value: 12.5, zIndex:5 },
                           { color: '#AAAAAA', width: 2, value: 15.5, zIndex:5 }
                       ],
                       plotBands: [
                           {
                               //color: '#FCFFC5',
                               from: 0.5,
                               to: 3.5,
                               label: {
                                   verticalAlign:'bottom',
                                   style: {
                                        color: '#CCCCCC',
                                        fontSize:'30px'
                                    },
                                   text: 'A',
                                   rotation: 0,
                                   userHTML:false,
                                   textAlign: 'center',
                                   y:-10
                               },
                               zIndex:3
                           }
                           ,{
                               //color: '#FFFFFF',
                               from: 3.5,
                               to: 6.5,
                               label: {
                                   verticalAlign:'bottom',
                                   style: {
                                        color: '#CCCCCC',
                                        fontSize:'30px'
                                    },
                                   text: 'B',
                                   rotation: 0,
                                   userHTML:false,
                                   textAlign: 'center',
                                   y:-10
                               },
                               zIndex:3
                           }
                           ,{
                               //color: '#FCFFC5',
                               from: 6.5,
                               to: 9.5,
                               label: {
                                   verticalAlign:'bottom',
                                   style: {
                                        color: '#CCCCCC',
                                        fontSize:'30px'
                                    },
                                   text: 'C',
                                   rotation: 0,
                                   userHTML:false,
                                   textAlign: 'center',
                                   y:-10
                               },
                               zIndex:3
                           }
                           ,{
                               //color: '#FFFFFF',
                               from: 9.5,
                               to: 12.5,
                               label: {
                                   verticalAlign:'bottom',
                                   style: {
                                        color: '#CCCCCC',
                                        fontSize:'30px'
                                    },
                                   text: 'D',
                                   rotation: 0,
                                   userHTML:false,
                                   textAlign: 'center',
                                   y:-10
                               },
                               zIndex:3
                           }
                           ,{ // mark the weekend
                               //color: '#FCFFC5',
                               from: 12.5,
                               to: 15.5,
                               label: {
                                   verticalAlign:'bottom',
                                   style: {
                                        color: '#CCCCCC',
                                        fontSize:'30px'
                                    },
                                   text: 'E',
                                   rotation: 0,
                                   userHTML:false,
                                   textAlign: 'center',
                                   y:-10
                               },
                               zIndex:3
                           }
                       ],
                       labels: {
                           enabled:false,
                        //    formatter: function () {
                        //        var company = '';
                        //        var account = this.value%3;
                        //        switch(account){
                        //            case 1:
                        //                company = 'KT';
                        //            break;
                        //            case 2:
                        //                company = 'SKT';
                        //            break;
                        //            case 0:
                        //                company = 'LGU+';
                        //            break;
                        //        }
                        //        return company;
                        //    }
                       }
                   },
                   yAxis: {
                       title: { text: '증분율' },
                       tickInterval:5,
                       min: 0,
                       plotBands: plotBands
                   },
                   tooltip: { enabled:false },
                   plotOptions: {
                        line: {

                            marker: {
                                enabled: true
                            },
                            dataLabels: {
                                align:'center',
                                enabled: true,
                                style:{'fontSize':'18px'},
                                crop: false,
                                overflow: 'none',
                                x:-50,
                                y:-10
                            },
                            states: {
                                hover: {
                                    enabled: false
                                }
                            }
                        },
                        series: {
                            lineWidth: 0,
                            marker: {
                                radius: 8
                            }
                        }
                   },
                   legend: { enabled:false,itemMarginTop: 15 },
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
                               [0.5, 0],[15.5, 0]
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
