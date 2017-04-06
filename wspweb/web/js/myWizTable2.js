/**
 * Created by Administrator on 2016/4/6.
 */
require(['jquery', 'bootstrap', 'datatables','pm','select2','bootstrapvalidator'], function() {
    var dToption = {
        "bAutoWidth": true, //自动宽度
        "dom": '<"top">rt<"bottom"lp><"clear">',
        "serverSide": true,
        "bDestory": true,
        "info": false,
        "ordering": false,
        "lengthChange": false,
        "sPaginationType": "full_numbers",
        "ajax": {
            url: '/Cultivate/UserCultivate/My/List',
            dataSrc: "result"
        },
        "aoColumns": [{
            "sTitle": "课程名称",
            "data": "course.name"
        }, {
            "sTitle": "申请时间",
            "data": "createDate"
        }, {
            "sTitle": '操作',
            "data": 'objectid'
        }],
        "oLanguage": {
            "sProcessing": "处理中",
            "sZeroRecords": "没有匹配结果",
            "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
            "sInfoPostFix": "",
            "sLengthMenu": "显示 _MENU_ 项记录",
            "sSearch": "搜索:",
            "sEmptyTable": "表中数据为空",
            "sLoadingRecords": "载入中...",
            "sInfoThousands": ",",
            "oPaginate": {
                "sFirst": "",
                "sPrevious": "«",
                "sNext": "»",
                "sLast": ""
            }
        },
        "columnDefs": [
            {
                targets:0,
                width:400,
            },{
            render: function (data, type, row) {
                var username = row.objectid;
                var html = [];
                html.push('<a target="_blank" href="/web/services/myCultivateForm.html?objectid=' + row.objectid + '">详情</a>');
                return html.join('');
            },
            targets: 2
        },
            {render: function (data, type, row) {

                var username = row.objectid;
                var courseId=row.courseId;

                var name=row.course ?  row.course.name : 'undefined';
                var html = [];
                html.push('<a href="/web/services/myCultivateDetail.html?objectid=' +courseId+ '" target="_blank">'+name+'</a>');
                return html.join('');
            },
                targets: 0
            }],
        //初始化结束
        "initComplete": function () {
            $('#recordTable').width("100%");
        },
        //加载结束
        "drawCallback": function () {

        }
    };
    $(function () {
        var table = $("#recordTableb").DataTable(dToption);
        var usertable = $("#recordTableb");
        //详情
        //usertable.on('click', '.infoBtn', function() {
        //    var objectid=$(this).attr('data-id');
        //    console.log($(this))
        //    $.ajax({
        //        type: "GET",
        //        url: " /Cultivate/UserCultivate/Edit/"+objectid ,
        //        dataType: "json",
        //        success: function(data) {
        //            var html = [];
        //            html.push("<tr><td>姓名:</td><td>"+data.chineseName+"</td></tr>");
        //            if(data.education==null){
        //
        //            }else{
        //                html.push("<tr><td>等级:</td><td>"+data.education.name+"</td></tr>");
        //            }
        //            html.push("<tr><td>联系方式:</td><td>"+data.phone +"</td></tr>");
        //            if(data.email==null){
        //
        //            }else{
        //                html.push("<tr><td>邮箱:</td><td>"+data.email +"</td></tr>");
        //            }
        //            if(data.workYear==null){
        //
        //            }else{
        //                html.push("<tr><td>工作年限:</td><td>"+data.workYear.name +"</td></tr>");
        //            }
        //            html.push("<tr><td>公司:</td><td>"+data.company+"</td></tr>");
        //            html.push("<tr><td>目前职位:</td><td>"+data.job.name +"</td></tr>");
        //            if(data.socialInsurance==null){
        //
        //            }else if (data.socialInsurance==1)
        //            {
        //                html.push("<tr><td>是否在上海缴纳社保:</td><td>是</td></tr>");
        //            }else
        //            {
        //                html.push("<tr><td>工作年限:</td><td>否</td></tr>");
        //            }
        //            if(data.censusRegister==null){
        //
        //            }else if (data.censusRegister==1)
        //            {
        //                html.push("<tr><td>是否是沪籍:</td><td>是</td></tr>");
        //            }else
        //            {
        //                html.push("<tr><td>是否是沪籍:</td><td>否</td></tr>");
        //            }
        //            html.push("<tr><td>上课时间:</td><td>周"+data.schoolTime+"</td></tr>");
        //            var modal = getModal({
        //                title:'课程申请详情',
        //                content: html.join(''),
        //                callback:function(){
        //                    modal.modal('hide');
        //                }
        //            });


             //   }
         //   });

        //});
    })
})


