/**
 * Created by z on 2016/10/31.
 */
require(['jquery', 'bootstrap', 'datatables', 'pm'], function () {

    var dToption = {
        "bAutoWidth": true, //自动宽度
        "dom": '<"top"if>rt<"bottom"lp><"clear">',
        "serverSide": true,
        "bDestory": true,
        "info": false,
        "ordering": false,
        "searching": false,
        "lengthChange": false,
        "sPaginationType": "full_numbers",
        "ajax": {
            url: '/CardApply/Enterprise/Me/List/',
            dataSrc: "result"
        },
        "aoColumns": [{
            "sTitle": "流水号",
            "data": "sn"
        }, {
            "sTitle": "申请人",
            "data": "username"
        }, {
            "sTitle": '公司',
            "data": 'company'
        }, {
            "sTitle": '联系方式',
            "data": 'contact'
        }, {
            "sTitle": '操作',
            "data": 'id'
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
                render: function (data, type, row) {
                    var html = [];
                    var status = row.status;
                    if(status == 3){
                        html.push('<a target="_blank" href="/web/services/applyCompanyCard.html?objectid=' + row.id + '">编辑</a>');
                    }else{
                        html.push('<a target="_blank" href="/web/services/applyCompanyCard.html?objectid=' + row.id + '">查看</a>');
                    }
                    return html.join('');
                },
                targets: 4
            }],
        //初始化结束
        "initComplete": function () {
        },
        //加载结束
        "drawCallback": function () {

        }
    };
    $(function () {
        var table = $("#recordTabled").DataTable(dToption);
    })
})


