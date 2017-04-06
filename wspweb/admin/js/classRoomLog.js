/*** Created by iris***/
require(['jqueryUpload','jquery', 'bootstrap','ckeditor','datepicker', 'datatables','pm','select2','bootstrapvalidator'], function(jqueryUpload) {
    $(function() {

        var offset = 3600*1000*24; //一天的毫秒数
        var nowDate = new Date();   //现在的日期
        var nowDay = nowDate.getDay(); //现在的星期,0为周日,1为周一
        var offsetDay =  nowDay > 0 ? offset*(nowDay-1) : offset*6; //现在距离周一的天数
        var startDate = new Date(nowDate.getTime()-offsetDay); //初始值;周一
        var endDate = new Date(startDate.getTime()+offset*6);  //初始值;周日

        //格式化时间显示 date对象 变成 "YYYY-MM-DD"
        var formatDate = function(date){return date.toJSON().substring(0,10)};
        //初始化表格
        getDate(startDate,endDate);

        $('#pre').on('click',function(){
            $(this).addClass('active').next().removeClass('active');
            //前一周,点击一次当前日期减7天
            startDate = new Date(startDate.getTime() - offset*7);
            endDate = new Date(startDate.getTime() + offset * 6);
            getDate(startDate,endDate);
        });
        $('#next').on('click',function(){
            $(this).addClass('active').prev().removeClass('active');
            //后一周,点击一次当前日期加7天
            startDate = new Date(startDate.getTime() + offset*7);
            endDate = new Date(startDate.getTime() + offset * 6);
            getDate(startDate,endDate);
        });
        //打印表格
        $('#print').on('click',function(){
            document.body.innerHTML=document.getElementById('roomTable').innerHTML;
            window.print();
            window.location.reload();
        });
        //传入开始结束时间,获取数据
        function getDate(start,end){

            $.ajax({
                type:'GET',
                url:'/Classroom/UserClassroomVerify/Itinerary/Find',
                data:{'beginDate':formatDate(start),'endDate':formatDate(end)},
                dataType:'json',
                success:function(data){
                    titleDate(startDate);
                    classroomModel(data);
                },error:function(e){

                }
            });
        }
        //表格标题栏及时间显示
        function titleDate(startDate){
            var offset = 3600*1000*24;
            var thead = [];
            thead.push("<th><span class='week'>星期/教室</span></th>");
            var week = ['星期一','星期二','星期三','星期四','星期五','星期六','星期日'];
            for(var i=0; i<7; i++){
                var date = new Date(startDate.getTime() + offset*i);
                thead.push("<th><span>"+week[i]+"</span><span>"+formatDate(date)+"</span></th>");
            }
            $('#week').empty().append(thead.join(''));
            return false;
        }
        //各个教室的预定情况
        function classroomModel(data){
            var tbody = [];
            var num = data.length;
            for(var i=0; i<num; i++){
                var d = data[i];
                tbody.push("<tr>");
                tbody.push("<td><span class='room'>"+d.classroomName+"</span></td>");
                for(var j=0; j<7; j++){
                    tbody.push("<td>");
                    if(d.am[j] == 1){
                        tbody.push("<span class='cel used'>上午[已预定]</span>");
                    }else{
                        tbody.push("<span class='cel'>上午</span>");
                    }
                    if(d.pm[j] == 1){
                        tbody.push("<span class='cel used'>下午[已预订]</span>");
                    }else
                        tbody.push("<span class='cel'>下午</span>");
                    tbody.push("</td>")
                }
                tbody.push("</tr>")
            }
            $('#classroom').empty().append(tbody.join(''));
            return false;
        }

    })
});
