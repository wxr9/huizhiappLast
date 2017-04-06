//  by iris 2016/4/22
require(['jquery', 'bootstrap','pm'], function() {

    $.ajax({
        type:'GET',
        url:'/Setting/Merchant/StatisticsGraphData',
        dataType:'json',
        success:function(data){
            if(data != undefined) {
                var typeDate = data.GetMerchantByType;
                var saleDate = data.GetMerchantSaleByType;
                var areaDate = data.GetMerchantByPark;
                $('#sumNum').html(data.TotalMerchants)
                //初始化图表
                require([
                    'echarts',
                    'echarts/chart/pie'
                ], function (ec) {
                    var typeChart = ec.init(document.getElementById('typeStatistics'));
                    var saleChart = ec.init(document.getElementById('saleStatistics'));
                    var areaChart = ec.init(document.getElementById('areaStatistics'));
                    typeChart.setOption(option('商户类别', typeDate));
                    saleChart.setOption(option('优惠商户统计', saleDate));
                    areaChart.setOption(option('园区商户数', areaDate));
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
                text: title,
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
                    name: '数据详情',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '50%'],
                    itemStyle: {
                        normal: {
                            label: {
                                position: 'outer',
                                formatter: "{b}\n{c}"
                            },
                            labelLine: {
                                show: true
                            }
                        },
                        emphasis: {
                            label: {
                                show: true,
                                formatter: "{b}\n{d}%"
                            }
                        }
                    },
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