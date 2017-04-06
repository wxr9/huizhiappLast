/**
 * Created by Administrator on 2016/5/4.
 */
require(['jquery', 'bootstrap','pm'], function() {

    $.ajax({
        type:'GET',
        url:'/ActivityCenter/ActivityMain/StatisticGraphData',
        dataType:'json',
        success:function(data){
            if(data != undefined) {
                var typeDate = data.GetActivityByType;
                $('#sumNum').html(data.TotalActivities)
                $('#peopleNum').html(data.TotalApply)
                //初始化图表
                require([
                    'echarts',
                    'echarts/chart/pie'
                ], function (ec) {
                    var typeChart = ec.init(document.getElementById('typeStatistics'));
                    typeChart.setOption(option('商户类别', typeDate));
                })
            }
        },
        error:function(e){

        }
    });
    function option(title,chartDate){

        var chartLegend = getLegendName(chartDate);
        var op = {
            title : {
                text: '活动类别',
                x:'left',
                textStyle:{
                    fontSize:18,
                    fontWeight:'bolder',
                    color: '#008acb'
                }
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient : 'vertical',
                x : 'right',
                data:chartLegend
            },
            calculable : true,
            series : [
                {
                    name:'数据详情',
                    type:'pie',
                    radius : '55%',
                    center: ['50%', '50%'],
                    data:chartDate
                }
            ]
        };
        return op;
    }

    //获取图标名
    function getLegendName(data){
        var name = [];
        var len = data.length;
        data.forEach(function(e){
            name.push(e.name);
        })

        return name;
    }
});