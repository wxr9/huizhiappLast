require(['jquery', 'bootstrap', 'datatables', 'pm', 'cookie'], function () {
    // var data = [];

    var zdfp = $("#businessTable").DataTable({
        // "ordering": false,
        // "info": false,
        // "pagingType": "full_numbers",
        // "dom": '<"top"if>rt<"bottom"lp><"clear">',
        "bAutoWidth": true, //自动宽度
        "dom": '<"top"if>rt<"bottom"lp><"clear">',
        "serverSide": true,
        "bDestory": true,
        "info": false,
        "ordering": false,
        "lengthChange": false,
        "sPaginationType": "full_numbers",
        "ajax": {
            url: '/workflow/api/taskinstanceslist/my_todo/list',
            dataSrc: "result"
        },
        "aoColumns": [{
            "sTitle": "流水号",
            "data": "sn"
        }, {
            "sTitle": "服务类别",
            "data": "process_name"
        }, {
            "sTitle": '申请人',
            "data": 'creator'
        }, {
            "sTitle": "当前节点",
            "data": "task_name"
        }, {
            "sTitle": "状态",
            "data": "display_state"
        }, {
            "sTitle": "申请时间",
            "data": "addtime"
        }, {
            "sTitle": "逾期时间",
            "data": "duetime"
        }, {
            "sTitle": '操作',
            "data": 'id'
        }],
        // "paging": false,
        "language": {
            "sProcessing": "处理中",
            "sZeroRecords": "没有匹配结果",
            "sInfo": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
            "sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
            "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
            "sInfoPostFix": "",
            "lengthMenu": "显示 _MENU_ 条",
            "sSearch": "搜索:",
            "sEmptyTable": "表中数据为空",
            "sLoadingRecords": "载入中...",
            "sInfoThousands": ",",
            "oPaginate": {
                "sFirst": "首页",
                "sPrevious": "<<",
                "sNext": ">>",
                "sLast": "末页"
            },
            "oAria": {
                "sSortAscending": ": 以升序排列此列",
                "sSortDescending": ": 以降序排列此列"
            }
        },
        "columnDefs": [{
            render: function (data, type, row) {
                var html = [];
                html.push('<a href="javascript:void(0)" class="viewTable" data-id="' + row.id + '" data-iid="'+row.identity_field_value+'">编辑</a>');
                if(row.pre_task_instance == "true"){
                    html.push('<a href="javascript:void(0)" style="margin-left:10px;" class="sendBack" data-id="' + row.id + '" data-iid="'+row.identity_field_value+'">回退</a>');
                }
                return html.join('');
            },
            targets: 7
        },{
            render: function(data, type, row){
                if (row.duetime == null || row.duetime == "null"){
                    row.duetime = ""
                }
                return row.duetime
            },
            targets: 6
        }
        ]
    });

    $("#businessTable").on('click', '.viewTable', function () {
        var modal = getModal({
            title: '业务流转',
            content:'w sh内容',
            submit: '确定名字',
            callback: function () {
                    modal.modal('hide')
            }
        });
    });
});
