require(['jquery', 'bootstrap', 'datepickercn','pm'], function() {
  $(document).ready(function() {

    $.ajax({
      url : '/Setting/User/TotalUser',
      success : function(data){
          $("#sumNum").html(data.msg);
      }
    });
    $.ajax({
      url : '/Setting/User/MonthUser',
      success : function(data){
          $("#monthNum").html(data.msg);
      }
    });
    $.ajax({
      url : '/Setting/User/TodayUser',
      success : function(data){
          $("#todayNum").html(data.msg);
      }
    });

      $.ajax({
          url:'/Setting/User/MobileUserNumber',
          dataType:'json',
          success:function(data){
              $('#mobileNum').html(data.msg);
          }
      })

      //开始时间小于结束时间
      $('#endTime input').on('change', function(){
          var start = new Date($('#startTime input').val());
          var end = new Date($('#endTime input').val());
          if(start>end) {
              showAlert('结束时间不小于开始时间');
              $('#searchData').attr('disabled','disabled');
          }else{
              $('#searchData').removeAttr('disabled');
          }
      });
    $(".form_datetime").datetimepicker({
      format: "yyyy-mm-dd",
      language : 'cn',
      autoclose: true,
      todayBtn: true,
      startDate: "2015-01-01",
      endDate : new Date(),
      minView: "month"
    });

    $('#endTime').bind('change',function(){
        checktime();
    })
      $('#startTime').bind('change',function(){
          checktime();
      })
    function checktime(){
        var start = new Date($('#startTime').val());
        var end = new Date($('#endTime').val());
        if(start>end) {
            showAlert('结束时间不能晚于开始时间');
            $('#searchData').attr('disabled','disabled');
        }else if((end-start)/1000/60/60/24>30 && $('#dayOrMonth1').is(':checked')){
            showAlert('日统计查询时间不能超过30天');
            $('#searchData').attr('disabled','disabled');
        }else{
            $('#searchData').removeAttr('disabled','');
        }
    }
  $('input[name="dayOrMonth"]').on('change',function(){
      checktime();
  })

    $("#searchData").bind('click',function(){
        var flag = $('input[name="dayOrMonth"]:checked').val();
        var start = $('#startTime').val();
        var end = $('#endTime').val();
        $.ajax({
            url : "/Setting/User/StatisticsData?beginDate=" + start + "&endDate=" + end + "&flag=" + flag,
            success : function(data){
                var xData = [];
                $(data.series[0].data).each(function(ind,val){
                    xData.push(parseInt(val));
                });
                var optionWeb = {
                    title: {
                        text: '网站数据统计图',
                        subtext: ''
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['新增注册数']
                    },
                    calculable: true,
                    xAxis: [
                        {
                            type: 'category',
                            data: data.xAxis[0].data
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ],
                    series: [
                        {
                            name: '新增注册数',
                            type: 'bar',
                            data: xData
                        }
                    ]
                };

                require(
                    [
                        'echarts',
                        'echarts/chart/bar'
                    ],
                    function (ec) {
                        //生成Web图表
                        var myChartWeb = ec.init(document.getElementById('statisticsWeb'));
                        myChartWeb.setOption(optionWeb);
                    }
                );
            }
        })
    })


  });
});
