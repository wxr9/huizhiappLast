require(['jquery', 'bootstrap', 'datatables', 'pm'], function () {
    //申请列表
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
            url: '/Setting/UserEnterpriseApplyInfo/ApplyList',
            dataSrc: "result"
        },
        "aoColumns": [{
            "sTitle": "姓名",
            "data": "user.realName"
        },{
            "sTitle": "昵称",
            "data": "user.name"
        }, {
            "sTitle": "性别",
            "data": "sex"
        }, {
            "sTitle": "手机号",
            "data": "user.phone"
        }, {
            "sTitle": '申请时间',
            "data": 'createDate'
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
        "columnDefs": [
            {
                render: function (data, type, row) {
                    if (row.user.sex === 1) {
                        return "男";
                    } else if (row.user.sex === 2) {
                        return "女";
                    } else {
                        return "未填写";
                    }
                },
                targets: 2
            },
            {
                render: function (data, type, row) {
                    var id = row.objectid;
                    var html = [];
                    html.push('<a class="operate passBtn" data-id=' + id + '>通过</a>');
                    html.push('<a class="operate ignoreBtn" data-id=' + id + '>忽略</a>');
                    return html.join('');
                },
                targets: 5
            }
        ],
        //初始化结束
        "initComplete": function () {},
        //加载结束
        "drawCallback": function () {

        }
    };
    //成员列表
    var memberOption = {
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
            url: '/Setting/User/EnterpriseAdminShowUser',
            dataSrc: "result"
        },
        "aoColumns": [{
            "sTitle": "姓名",
            "data": "realName"
        },{
            "sTitle": "昵称",
            "data": "name"
        }, {
            "sTitle": "性别",
            "data": "sex"
        }, {
            "sTitle": "手机号",
            "data": "phone"
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
                "sFirst": "首页",
                "sPrevious": "<<",
                "sNext": ">>",
                "sLast": "末页"
            }
        },
        "columnDefs": [
            {
                render: function (data, type, row) {
                    if (row.sex === 1) {
                        return "男";
                    } else if (row.sex === 2) {
                        return "女";
                    } else {
                        return "未填写";
                    }
                },
                targets: 2
            },
            {
                render: function (data, type, row) {
                    var id = row.enterpriseId;
                    var username = row.username;
                    var html = [];
                    if(row.enterpriseRoot != 2){
                        html.push('<a class="operate delBtn" data-id=' + id + ' username=' + username + '>删除</a>');
                    }
                    return html.join('');
                },
                targets: 4
            }
        ],
        //初始化结束
        "initComplete": function () {},
        //加载结束
        "drawCallback": function () {

        }
    };

    $(function () {
        var table = $("#applyTable").DataTable(dToption);
        var table2 = $('#memberTable').DataTable(memberOption);
        var usertable = $("#applyTable");
        var membertable = $('#memberTable');

        //通过
        usertable.on('click', '.passBtn', function () {
            $('#passModal').modal();
            var id = $(this).attr("data-id");
            var flag = 1;
            $('#passModal').on('click', '#passBtn', function () {
                $.ajax({
                    type: "POST",
                    url: "/Setting/UserEnterpriseApplyInfo/EnableEnterpriseApply/" + id + "/" + flag,
                    dataType: 'json',
                    success: function (data) {
                        table.ajax.reload();
                        $('#passModal').modal('hide');
                    }
                });
            })
        })


        //忽略
        usertable.on('click', '.ignoreBtn', function () {
            $('#ignoreModal').modal();
            var id = $(this).attr("data-id");
            var flag = 0;
            $('#ignoreModal').on('click', '#ignoreBtn', function () {
                $.ajax({
                    type: "POST",
                    url: "/Setting/UserEnterpriseApplyInfo/EnableEnterpriseApply/" + id + "/" + flag,
                    dataType: 'json',
                    success: function (data) {
                        table.ajax.reload();
                        $('#ignoreModal').modal('hide');
                    }
                });
            })
        })

        membertable.on('click', '.delBtn', function () {
            $('#delModal').modal();
            var id = $(this).attr('data-id');
            var username = $(this).attr('username');
            $('#delModal').on('click', '#delBtn', function () {
                $.ajax({
                    type: "GET",
                    url: '/Setting/User/EnterpriseBind/Delete/' + username + "/" + id,
                    dataType: 'json',
                    success: function (data) {
                        table2.ajax.reload();
                        $('#delModal').modal('hide');
                    }
                })
            })
        })


    }); //$
});
