require(['jquery', 'bootstrap', 'datatables', 'pm', 'cookie'], function () {
    // var data = [];

    var zdfp = $("#businessTable").DataTable({
        // "ordering": false,
        // "info": false,
        // "pagingType": "full_numbers",
        // "dom": '<"top"if>rt<"bottom"lp><"clear">',
        "bAutoWidth": true, //自动宽度
        "dom": '<"top">rt<"bottom"lp><"clear">',
        "serverSide": true,
        "bDestory": true,
        "info": false,
        "ordering": false,
        "lengthChange": false,
        "sPaginationType": "full_numbers",
        "ajax": {
            url: '/workflow/api/taskinstanceslist/my_todo/list',
            data:function(d){
                d.sn__contains=$('input[name=sn__contains]').val()
            },
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
            "sTitle": "发起时间",
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
                var type = row.sn.slice(0, 2);
                html.push('<a href="javascript:void(0)" class="viewTable" data-id="' + row.id + '" data-iid="' + row.identity_field_value + '" data-type="' + type + '">编辑</a>');
                if (row.pre_task_instance == "true") {
                    html.push('<a href="javascript:void(0)" style="margin-left:10px;" class="sendBack" data-id="' + row.id + '" data-iid="' + row.identity_field_value + '">回退</a>');
                }
                return html.join('');
            },
            targets: 7,
            width: '70px'
        }, {
            render: function (data, type, row) {
                if (row.duetime == null || row.duetime == "null") {
                    row.duetime = ""
                }
                return row.duetime
            },
            targets: 6
        }, {
            render: function(data,type, row){
              return filterSN(row);
            },
            targets: 0
        }
        ]
    });

    $("#businessTable").on('click', '.sendBack', function () {
        var id = $(this).attr('data-id');
        $.ajax({
            url: ' /workflow/api/sendback/' + id,
            method: 'post',
            success: function (data) {
                if (data.success === true) {
                    showAlert(data.msg);
                    zdfp.ajax.reload();
                } else {
                    showAlert(data.msg, 'warn');
                }
            }
        })
    });

    $("#businessTable").on('click', '.viewTable', function () {
        var id = $(this).attr('data-id');
        var type = $(this).attr('data-type');
        var idv = $(this).attr('data-iid');
        var nextUrl = '/workflow/api/HadTransfer';
        var mustSave = true;
        if (!(type == 'WY' || type == "IT")) {
            nextUrl = '/workflow/api/CommonHadTransfer'
        }
        var notMustArray = ['PX', 'LP', 'GG', 'ZZ'];
        $(notMustArray).each(function (ind, val) {
            if (type == val) {
                mustSave = false;
                return;
            }
        })
        var modal = getModal({
            title: '业务流转',
            size: 'large',
            url: '/workflow/api/edit/' + id,
            extData: {
                idv: idv
            },
            type: 'workflowA',
            submit: '流转下一步',
            disabled: mustSave,
            callback: function () {
                var s1 = $('select[name="task_id"]:enabled');
                var s2 = $('select[name="task_user"]:enabled');
                s1.on('change',function(){
                    if (s1.val() == 'undefined') {
                        showAlert('请选择任务节点', 'warn');
                        $('#disableCfm').attr('disabled','disabled');
                    }else{
                        s2.trigger('change');
                    }
                })
                s2.on('change',function(){
                    if(s2.val() == 'undefined' && s2.length > 0){
                        showAlert('请选择处理人员', 'warn');
                        $('#disableCfm').attr('disabled','disabled');
                    }else{
                        $('#disableCfm').removeAttr('disabled');
                    }
                })

                if (s2.length = 0) {
                    if (s1.val() == 'undefined') {
                        showAlert('请选择任务节点', 'warn');
                        return false
                    }
                } else {
                    if (s1.val() == 'undefined') {
                        showAlert('请选择任务节点', 'warn');
                        return false
                    } else if (s2.val() == 'undefined') {
                        showAlert('请选择处理人员', 'warn');
                        return false
                    }
                }
                var self = this;
                var da = self.data;
                var da2 = this.ele.serializeObj();
                da.process_id = da.process;
                da.identity_field_value = self.idv;
                assign(da, da2);
                //mark
                da.title = id;
                //TODO-自动分配
                zdfp.ajax.reload(null,false);
                $.ajax({
                    url: nextUrl,
                    method: 'POST',
                    data: da,
                    success: function (data) {
                        data.success === true ? showAlert(data.msg) : showAlert(data.msg, 'warn');
                        zdfp.ajax.reload(null,false);
                        modal.modal('hide')
                    }
                });
            }
        });
    });

    //查询
    $('input[name=sn__contains]').bind('keydown', function (e) {
        var key = e.which;
        if (key == 13) {
            zdfp.ajax.reload();
        }
    })
    $('#searchBtn').on('click',function(){
        zdfp.ajax.reload();
    })
    //清除查询
    $('#clearBtn').on('click',function(){
        $('input[name=sn__contains]').val("");
        zdfp.ajax.reload();
    })
});
