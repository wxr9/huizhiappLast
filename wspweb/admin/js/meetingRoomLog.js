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
                url:'/Mettingroom/UserMeetingroomVerify/Itinerary/Find?beginDate='+ formatDate(start) + '&endDate=' +formatDate(end),
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
                thead.push("<th><span>"+week[i]+"</span><span class='item'>"+formatDate(date)+"</span></th>");
            }
            $('#week').empty().append(thead.join(''));
            return false;
        }
        //各个会议室的预定情况
        function classroomModel(data){
            var tbody = [];
            var num = data.length;
            var roomWeek;  //每个会议室一周的预订列表
            var weeklist = $('.item'); //一周的时间列表
            for(var i=0; i<num; i++){
                var d = data[i];
                tbody.push("<tr>");
                tbody.push("<td  class='room'><span>"+d.mettingroomName+"</span></td>");
                roomWeek = DataToArray(d.data);
                for(var j=0;j<7;j++){ //初始化周一到周日的空列表
                    tbody.push("<td class='meettingRoomDay'>");
                    var weekTime = weeklist.eq(j).html(); //列的日期
                    $(roomWeek).each(function(ind,val){  //匹配预订列表与列的日期,符合的加入表中相应的列
                        if(val.apply_date == weekTime){
                            tbody.push('<p class="meettingRoomTime">'+val.begin_time + ' - ' + val.end_time+'</p>');
                            tbody.push('<p class="meettingRoomName">[ '+val.name+' ]</p>');
                        }
                    });
                    tbody.push('</td>');
                }
                tbody.push("</tr>")
            }
            $('#classroom').empty().append(tbody.join(''));
            return false;
        }
        //将数据处理成一维数组
        function DataToArray(data){
            var arr = [];
            $(data).each(function(index, value){
                if(value != ''){
                    $(value).each(function(ind,val){
                        if(val != ''){
                            arr.push(val);
                        }
                    })
                }
            });
            return arr;
        }

    })
});

