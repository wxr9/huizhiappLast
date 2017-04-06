/**
 * Created by Administrator on 2016/4/1.
 */
require(['jquery', 'bootstrap','datepicker', 'datatables','pm','select2','bootstrapvalidator'], function() {
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
            url: '/Classroom/Classroom/List',
            dataSrc: "result"
        },
        "aoColumns": [{
            "sTitle": "流水号",
            "data": "objectid"
        }, {
            "sTitle": "交易金额",
            "data": "name"
        }, {
            "sTitle": '交易时间',
            "data": 'createDate'
        }, {
            "sTitle": '交易类型',
            "data": 'objectid'
        }, {
            "sTitle": '商户名称',
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
        //初始化结束
        "initComplete": function () {
            $('#recordTable').width("100%");
        },
        //加载结束
        "drawCallback": function () {

        }
    };
    $(function () {
        var table = $("#recordTable2").DataTable(dToption);
        var usertable = $("#recordTable2");
    })
})
