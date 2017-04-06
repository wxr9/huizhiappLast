/**
 * Created by Administrator on 2016/4/5.
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
            url: '/Jobs/UserJobs/My/List',
            dataSrc: "result"
        },
        "aoColumns": [{
            "sTitle": "职位申请",
            "data": "jobs.name"
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
        "columnDefs": [{
            render: function (data, type, row) {
                var username = row.objectid;

                var html = [];
                html.push('<a target="_blank" href="/web/services/jobApply.html?objectid=' + row.objectid + '">详情</a>');
                return html.join('');
            },
            targets: 2
        },
            {render: function (data, type, row) {
                var username = row.jobsid;
                var name=row.jobs ?  row.jobs.name : 'undefined';
                var html = [];
                html.push('<a href="/web/services/jobDetail.html?id=' +username+ '" target="_blank" >'+name+'</a>');
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
        var table = $("#recordTablea").DataTable(dToption);
        var usertable = $("#recordTablea");
        //详情
        //usertable.on('click', '.infoBtn', function() {
        //    var objectid=$(this).attr('data-id');
        //    $.ajax({
        //        type: "GET",
        //        url: "/Jobs/UserJobs/Edit/"+objectid ,
        //        dataType: "json",
        //        success: function(data) {
        //            console.log(data)
        //            var html = [];
        //            html.push("<tr><td>姓名:</td><td>"+data.username+"</td></tr>");
        //            html.push("<tr><td>E-mail:</td><td>"+data.email+"</td></tr>");
        //            html.push("<tr><td>职位:</td><td>"+data.jobs.name+"</td></tr>");
        //            html.push("<tr><td>公司名:</td><td>"+data.company+"</td></tr>");
        //            html.push("<tr><td>职位要求:</td><td>"+data.jobs.content+"</td></tr>");
        //            var modal = getModal({
        //                title:'职位申请详情',
        //                content: html.join(''),
        //                callback:function(){
        //                    modal.modal('hide');
        //                }
        //            });
        //        }
        //    });
        //
        //});
    })
})


