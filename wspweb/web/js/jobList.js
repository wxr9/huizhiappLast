require(['jquery', 'bootstrap', 'datatables','pm'], function() {
    var dToption = {
        "bAutoWidth": true, //自动宽度
        "dom": '<"top"if>rt<"bottom"lp><"clear">',
        "serverSide": true,
        "bDestory": true,
        "info": false,
        "ordering": false,
        "lengthChange": false,
        "sPaginationType": "full_numbers",
        "sEmptyTable" : "未查找到信息",
        "ajax": {
            type:'get',
            url: '/Jobs/Enable/List',
            data:function(d){
                d.name=$('input[type=search]').val()
            },
            dataSrc: "result"
        },
        "aoColumns": [{
            "sTitle": "职位名称",
            "data": "name"
        }, {
            "sTitle": "发布日期",
            "data": "updateDate"
        }, {
            "sTitle": "薪资类别",
            "data": "moneyType.name"
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
                "sFirst": "首页",
                "sPrevious": "<<",
                "sNext": ">>",
                "sLast": "末页"
            }
        },
        "columnDefs": [{
            render: function(data, type, row) {
                return '<a class="viewAd" href="./jobDetail.html?id='+row.objectid+'">'+data+'</a>';

            },
            targets: 0
        },{
            render: function(data, type, row) {
                return '<a class="viewAd" href="./jobApply.html?id='+row.objectid+'&jobName='+row.name+'">申请</a>';

            },
            targets: 3
        }],
        //初始化结束
        "initComplete": function() {
            $('#activityPubList').width("100%");
        },
        //加载结束
        "drawCallback": function() {

        }
    };


    $(function() {
        var table = $("#memberTable").DataTable(dToption);
        $('#memberTable_filter').addClass('search');
        $('#memberTable_filter label').css('margin-top','-4px').html('<input type="search" class="" placeholder="请输入关键字搜索" aria-controls="memberTable" /><span class="search-icon"></span>')

        $('#memberTable_filter .search-icon').bind('click',function(){
            table.ajax.reload();
        })

    })

});

//Created by Administrator on 2016/3/15.

