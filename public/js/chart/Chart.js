define([
   'module',
   'js/chart/ChartData'
   ],
   function(module, ChartData){

       'use strict'

       var KTWideBandList = null;
       var KTWideBandChartList = null;

       var SKTWideBandList = null;
       var SKTWideBandChartList = null;

       var LGUWideBandList = null;
       var LGUWideBandChartList = null;

       var KTNarrowList = null;
       var KTNarrowChartList = null;

       var SKTNarrowList = null;
       var SKTNarrowChartList = null;

       var LGUNarrowList = null;
       var LGUNarrowChartList = null;

    	module.exports = new (Backbone.View.extend({
           el:'._chart',
           patternChart:null,
           render:function(){
               this.setBiddingPattern();
               //this.setBiddingIncrease();

               this.$el.find('#biddingPattern').hide();

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

               console.log(KTWideBandList)

               KTNarrowList = ChartData.getNarrowList('KT',chartData);
               KTNarrowChartList = _.pluck(KTNarrowList,'price');

               SKTWideBandList = ChartData.getWideBandList('SK', chartData);
               SKTWideBandChartList = _.pluck(SKTWideBandList,'price');

               SKTNarrowList = ChartData.getNarrowList('SK',chartData);
               SKTNarrowChartList = _.pluck(SKTNarrowList,'price');

               LGUWideBandList = ChartData.getWideBandList('LG', chartData);
               LGUWideBandChartList = _.pluck(LGUWideBandList,'price');

               LGUNarrowList = ChartData.getNarrowList('LG',chartData);
               LGUNarrowChartList = _.pluck(LGUNarrowList,'price');

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

               this.patternChart.series[3].update({
                   data : SKTWideBandChartList,
                   dataLabels : {
                       allowOverlap : true,
                       formatter: function () {
                           var round = SKTWideBandList[this.point.index].round;
                           return '<span style="color:rgba(0, 114, 255, 1)">' + round + '</span>/' + this.y;
                       }
                   }
               });

               this.patternChart.series[4].update({
                   data : SKTNarrowChartList,
                   dataLabels : {
                       allowOverlap : true,
                       formatter: function () {
                           var round = SKTNarrowList[this.point.index].round;
                           return '<span style="color:rgba(0, 114, 255, 1)">' + round + '</span>/' + this.y;
                       },
                   }
               });

               this.patternChart.series[5].update({
                   data : LGUWideBandChartList,
                   dataLabels : {
                       allowOverlap : true,
                       formatter: function () {
                           var round = LGUWideBandList[this.point.index].round;
                           return '<span style="color:rgba(46, 181, 2, 1)">' + round + '</span>/' + this.y;
                       }
                   }
               });

               this.patternChart.series[6].update({
                   data : LGUNarrowChartList,
                   dataLabels : {
                       allowOverlap : true,
                       formatter: function () {
                           var round = LGUNarrowList[this.point.index].round;
                           return '<span style="color:rgba(46, 181, 2, 1)">' + round + '</span>/' + this.y;
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
                       zoomType:'xy'
                   },
                   exporting:{
                       enabled:false,
                       sourceWith:775,
                       sourceHeight:1277
                   },
                   credits: { enabled:false },
                   title: { text: '입찰 패턴 분석' },
                   xAxis: {
                       tickInterval:1,
                       plotLines: [
                           { color: '#C9D405', width: 1, value: 0.5, zIndex:5 },
                           { color: '#C9D405', width: 1, value: 3.5, zIndex:5 },
                           { color: '#C9D405', width: 1, value: 6.5, zIndex:5 },
                           { color: '#C9D405', width: 1, value: 9.5, zIndex:5 },
                           { color: '#C9D405', width: 1, value: 12.5, zIndex:5 },
                           { color: '#C9D405', width: 1, value: 15.5, zIndex:5 }
                       ],
                       plotBands: [
                           {
                               //color: '#FCFFC5',
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
                           ,{
                               //color: '#FFFFFF',
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
                           ,{
                               //color: '#FCFFC5',
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
                           ,{
                               //color: '#FFFFFF',
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
                               //color: '#FCFFC5',
                               from: 12.5,
                               to: 15.5,
                               label: {
                                   verticalAlign:'bottom',
                                   text: 'E 2.6MHz(협)',
                                   rotation: 0,
                                   textAlign: 'center',
                                   y:40
                               }
                           }
                       ],
                       labels: {
                           formatter: function () {
                               var company = '';
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
                           }
                       }
                   },
                   yAxis: {
                       title: { text: '입찰액' },
                       tickInterval:500,
                       min: 3277
                   },
                   tooltip: { enabled:false },
                   plotOptions: {
                       line: {
                           marker: {
                               enabled: true
                           },
                           dataLabels: {
                             enabled: true,
                             style:{'fontSize':'14px'},
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
                       },
                       series: {
                           lineWidth: 0,
                           marker: {
                               radius: 8
                           },
                       }
                   },
                   legend: { itemMarginTop: 15 },
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
           },
           setBiddingIncrease:function(){
               var round = 0;
               var alpha = ['A','B','C','D','E']

               var options = {
                   chart: {
                       renderTo:$('#biddingIncrease')[0],
                       type: 'line',
                       inverted: true
                   },
                   title: {
                       text: '누적 입찰 증분 분석'
                   },
                   // subtitle: {
                   //     text: 'According to the Standard Atmosphere Model'
                   // },
                   xAxis: {
                       reversed: false,
                       title: {
                           enabled: true,
                           text: '(추정)누적입찰증분'
                       },
                       labels: {
                           formatter: function () {
                               return this.value;
                           }
                       },
                       maxPadding: 0.05,
                       showLastLabel: true
                   },
                   yAxis: {
                       title: {
                           text: '주파수'
                       },
                       labels: {
                           formatter: function () {
                               return this.value + '°';
                               //console.log(this)
                               //return 'A'
                           }
                       },
                       lineWidth: 2
                   },
                   legend: {
                       enabled: false
                   },
                   tooltip: {
                       headerFormat: '<b>{series.name}</b><br/>',
                       pointFormat: '{point.y}°C : {point.x} km '
                   },
                   /*
                   plotOptions: {
                       spline: {
                           marker: {
                               enable: false
                           }
                       }
                   },
                   */
                   plotOptions: {
                       line: {
                           dataLabels: {
                               enabled: true,
                               formatter: function () {
                               		//console.log(this)
                               		round = this.point.index + 1;
                                   return this.x
                               },
                               x:17,
                               y:11
                           },
                           enableMouseTracking: false,
                           lineWidth:0.5
                       }
                   },
                   credits : {
                   	enabled : true
                   },
                   legend: {
                       enabled: true
                   },
                   series: [{
                       name: 'KT 광대역',
                       color: '#FF0000',
                       data: [[3400, -100], [3401, -100], [3900, -100], [3450, null],[4000, null],
                           [4100, -40], [4200, -40], [4300, -40], [4400, -40]]
                   },
                   {
                       name: 'KT 협대역',
                       data: [[3300, -100], [3400, -100], [3900, -100], [3450, null],[4000, null],
                           [4100, -40], [4200, -40], [4300, -40], [4400, -40]]
                   },
                   {
                       name: 'SKT 광대역',
                       data: [[3400, -40], [3500, -80], [3800, -80], [3900, 15], [4000, -22.1],
                           [4100, -2.5], [4200, -27.7], [4300, -55.7], [4400, -76.5]]
                   }
                   ]
               };

               var chart = new Highcharts.Chart(options);
           }
    	}))
})
