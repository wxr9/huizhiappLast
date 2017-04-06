/**
 * Created by Administrator on 2016/4/27.
 */
require(['jquery', 'bootstrap', 'datepickercn','pm'],function(){
    $(function(){
        //汇智卡总数查询
        $.ajax({
            type:'get',
            url:'/BizPayment/TotalCardStatistic',
            dataType:'json',
            success:function(data){
                $('#cardCount').text(data.cardNum);
            }
        })
        //选择日期
        $(".form_datetime").datetimepicker({
            format: "yyyy-mm-dd",
            language : 'cn',
            autoclose: true,
            todayBtn: true,
            minView: "month",
            pickerPosition:'bottom-left'
        });
        //默认获取当前月
        function initDate(time){
            var myData=new Date();
            var year=myData.getFullYear();
            var mouth=(myData.getMonth()+1)>9?myData.getMonth()+1:'0'+(myData.getMonth()+1);
            var day;
            if(mouth==1||mouth==3||mouth==5||mouth==7||mouth==8||mouth==10||mouth==12){
                day=31;
            }else if(mouth==2){
                if(((year%4)==0)&&((year%100)!=0)||((year%400)==0)){
                    day=29;
                }else{
                    day=28;
                }
            }else{
                day=30;
            }
            var startDate=year+'-'+mouth+'-'+'01';
            var endDate=year+'-'+mouth+'-'+day;
            if(time == 'start'){
                return startDate;
            }else{
                return endDate;
            }

        }
        var initStartDate = initDate('start');
        var initEndDate = initDate('end');
        $('#startTime').val(initStartDate);
        $('#endTime').val(initEndDate);

        //
        checkDetail(initStartDate.replace(/-/g,''),initEndDate.replace(/-/g,''));
        //点击查询
        $('#searchBtn').click(function(){
            var start = $('input[name=startTime]').val();
            var end = $('input[name=endTime]').val();
            var t_start = new Date(start);
            var t_end = new Date(end);
            if(t_start.getTime() > t_end.getTime()){
                showAlert('开始时间应早于结束时间')
                $(this).attr('disabled','disabled');
            }else{
                $(this).removeAttr('disabled');
                start = start.replace(/-/g,'');
                end = end.replace(/-/g,'');
                checkDetail(start,end);
            }

        });
        $('#startTime').on('change',function(){
            $('#searchBtn').removeAttr('disabled');
        })
        $('#endTime').on('change',function(){
            $('#searchBtn').removeAttr('disabled');
        })
        //点击清除查询

        $('#clearBtn').click(function(){
            $('#startTime').val(initStartDate);
            $('#endTime').val(initEndDate);
        });
        //大金额处理
        function unitThou(num){
            var n = parseInt(num);
            if(n < 10e6){
                return n;
            }else{
                n = n/10e3;
                return n.toFixed(2) + '万';
            }
        }
        function checkDetail(startDate,endDate){
            // //主账号充值次数和充值金额查询
            $.ajax({
                type:'post',
                url:'/BizPayment/PrimeCardStatistic',
                data:{
                    startTime:startDate,
                    endTime:endDate
                },
                dataType:'json',
                success:function(data){
                    $('#num1').text(data.counts == null ? 0:data.counts);
                    $('#num2').text(data.counts==null?'0':unitThou(data.sums));
                }
            })
            //电子钱包充值次数和充值金额查询
            $.ajax({
                type:'post',
                url:'/BizPayment/EWalletStatistic',
                data:{
                    startTime:startDate,
                    endTime:endDate
                },
                dataType:'json',
                success:function(data){
                    $('#num3').text(data.counts == null ? 0:data.counts);
                    $('#num4').text(data.counts == 0?'0':unitThou(data.sums));
                }
            })
            //沉寂卡总数统计
            $.ajax({
                type:'post',
                url:'/BizPayment/SleepCardStatistic',
                data:{
                    startTime:startDate,
                    endTime:endDate
                },
                dataType:'json',
                success:function(data){
                    $('#num5').text(data.normalCardNum);
                    $('#num6').text(data.activeCardNum);
                    $('#num7').text(data.unActiveCardNum);
                    $('#num8').text(data.silenceCardNum);
                }
            })
        }

    })
})