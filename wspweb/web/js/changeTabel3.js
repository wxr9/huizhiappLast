/**
 * Created by Administrator on 2016/4/21.
 */
require(['jquery', 'bootstrap', 'datatables', 'pm','select2','bootstrapvalidator','raty'], function () {
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
            url: '/workflow/api/processinstances/my_apply/done',
            dataSrc: "result"
        },
        "aoColumns": [{
            "sTitle": "流水号",
            "data": "sn"
        }, {
            "sTitle": "服务类别",
            "data": "process_name"
        }, {
            "sTitle": '申请时间',
            "data": 'starttime'
        }, {
            "sTitle": '当前状态',
            "data": 'current_state'
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
        "columnDefs": [{
            render: function (data, type, row) {
                if (row.objectid) {
                    return row.serialNumber;
                } else {
                    return data
                }
            },
            targets: 0
        },
            {
                render: function (data, type, row) {
                    if (row.objectid) {
                        return [null, '物业报修', 'IT报修'][row.typeId];
                    } else {
                        return data
                    }
                },
                targets: 1
            },
            {
                render: function (data, type, row) {
                    if (row.objectid) {
                        return formatDate(row.createDate);
                    } else {
                        return data;
                    }
                },
                targets: 2
            },
            //{
            //   render: function (data, type, row) {
            //       if (row.objectid) {
            //           return "待评价";
            //       } else {
            //           return data
            //       }
            //   },
            //   targets: 3
            //},
            {
                render: function (data, type, row) {
                    var html = [];
                    if (row.objectid) {
                        html.push('<a class="operate ratyBtn" sn=' + row.serialNumber + ' type=' + row.typeId + ' repairId=' + row.objectid + '>评价</a>');
                    } else {
                        //物业报修
                        if(row.related_table=='wy'){
                            html.push('<a target="_blank" href="/web/myWorkflowDetail.html?sn='+row.sn+'&repairId='+row.identity_field_value +'">详情</a>');
                        }
                        //IT报修
                        if(row.related_table=='it'){
                            html.push('<a target="_blank" href="/web/myWorkflowDetail.html?sn='+row.sn+'&repairId='+row.identity_field_value +'">详情</a>');
                        }
                        //猎聘申请
                        if(row.related_table=='user_headhunting'){
                            html.push('<a target="_blank" href="/web/services/huntApply.html?objectid=' + row.identity_field_value + '">详情</a>');
                        }
                        //会议室预订
                        else if(row.related_table=='user_meetingroom'){
                            html.push('<a target="_blank" href="/web/services/meetingRoomForm.html?id=' + row.identity_field_value + '">详情</a>');
                        }
                        //企业培训
                        else if(row.related_table=='enterprist_cultivate'){
                            html.push('<a target="_blank" href="/web/services/companyApply.html?objectid=' + row.identity_field_value + '">详情</a>');
                        }
                        //教室预订
                        else if(row.related_table=='user_classroom'){
                            html.push('<a target="_blank" href="/web/services/classroomForm.html?id=' + row.identity_field_value + '">详情</a>');
                        }
                        //广告服务申请
                        else if(row.related_table=='user_advertisement'){
                            html.push('<a target="_blank" href="/web/services/commercialApply.html?objectid=' + row.identity_field_value + '">详情</a>');
                        }
                        //入驻申请
                        else if(row.related_table=='enter_apply'){
                            html.push('<a target="_blank" href="/web/services/hatchApply.html?objectid=' + row.identity_field_value + '">详情</a>');
                        }
                        //著作权登记
                        else if(row.related_table=='user_copyright'){
                            html.push('<a target="_blank" href="/web/services/copyrightApply.html?objectid=' + row.identity_field_value + '">详情</a>');
                        }
                        //"测试申请"
                        else if(row.related_table=='user_test_applyfor'){
                            html.push('<a target="_blank" href="/web/services/testApply.html?objectid=' + row.identity_field_value + '">详情</a>');
                        }
                        if(row.can_retrieve=='true'){
                            html.push('<a class="operate disableBtn" objectid="'+row.id+'" > 撤回</a>');
                        }

                    }
                    return html.join('');
                },
                targets: 4
            }],
        //初始化结束
        "initComplete": function () {
            $('#changeTabel3').width("100%");
        },
        //加载结束
        "drawCallback": function () {

        }
    };
    $(function () {
        var table = $("#changeTabel3").DataTable(dToption);
        var usertable = $("#changeTabel3");
    })
})


