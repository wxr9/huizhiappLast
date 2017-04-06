require(['jquery', 'bootstrap', 'datatables','pm','raty'], function() {
    checkMust();
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
            url: '/Comment',
            dataSrc: "result"
        },
        "aoColumns": [{
            "sTitle": "流水号",
            "data": "serialNumber"
        },{
            "sTitle": "服务类别",
            "data": "businessType"
        },{
            "sTitle": "评价时间",
            "data": "createTime"
        },{
            "sTitle": "评价",
            "data": 'content'
        },{
            "sTitle": "操作",
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
            {render: function(data, type, row){
                if(data == 'commercialize'){
                    data = "广告服务申请"
                } else if(data == 'userClassroom'){
                    data = "教室预定"
                } else if(data == 'userMeetingroom'){
                    data = "会议室预定"
                } else if(data == 'enterpriseCultivate'){
                    data = "企业培训"
                } else if(data == 'userHeadhunting'){
                    data = "猎聘申请"
                } else if(data == 'enterApply'){
                    data = "入驻申请"
                } else if(data == 'userTestApplyfor'){
                    data = "测试申请"
                } else if(data == 'userCopyright'){
                    data = "著作权登记"
                } else if(data == 'WY'){
                    data = "物业报修"
                } else if(data == 'IT'){
                    data = "IT报修"
                }
                return data;
            },
            targets: 1
            },
            {
                render:function(data,type,row){
                    var rating = [];
                    rating.push('<ul class="raty-list"><li>响应速度: <span class="ratyStar" data-score='+row.duration+'></span></li>');
                    rating.push('<li>服务态度: <span class="ratyStar" data-score='+row.attitude+'></span></li>');
                    rating.push('<li>服务质量: <span class="ratyStar" data-score='+row.quality+'></span></li></ul>');



                    return rating.join('');
                },
                width: "100px",
                targets: 2
            },{
                render: function(data,type,row){

                    var name = "";
                    var cont = [];
                    if(data.length>10){
                        name = data.substring(0,10) + "...";
                        cont.push('<span title='+data+'>'+name+'</span>')
                    }else{
                        name = data;
                        cont.push(name);
                    }
                    return cont.join('');
                },
                targets:3
            },
            {
            render: function(data, type, row) {
                var html = [];

                    //物业报修
                    if(row.businessType=='WY'){
                        html.push('<a target="_blank" href="/web/myWorkflowDetail.html?sn='+row.serialNumber+'&repairId='+row.businessId +'">详情</a>');
                    }
                    //IT报修
                    if(row.businessType=='IT'){
                        html.push('<a target="_blank" href="/web/myWorkflowDetail.html?sn='+row.serialNumber+'&repairId='+row.businessId +'">详情</a>');
                    }
                    //猎聘申请
                    if(row.businessType=='userHeadhunting'){
                        html.push('<a target="_blank" href="/web/services/huntApply.html?objectid=' + row.businessId + '">详情</a>');
                    }
                    //会议室预订
                    else if(row.businessType=='userMeetingroom'){
                        html.push('<a target="_blank" href="/web/services/meetingRoomForm.html?id=' + row.businessId + '">详情</a>');
                    }
                    //企业培训
                    else if(row.businessType=='enterpriseCultivate'){
                        html.push('<a target="_blank" href="/web/services/companyApply.html?objectid=' + row.businessId + '">详情</a>');
                    }
                    //教室预订
                    else if(row.businessType=='userClassroom'){
                        html.push('<a target="_blank" href="/web/services/classroomForm.html?id=' + row.businessId + '">详情</a>');
                    }
                    //广告服务申请
                    else if(row.businessType=='commercialize'){
                        html.push('<a target="_blank" href="/web/services/commercialApply.html?objectid=' + row.businessId + '">详情</a>');
                    }
                    //入驻申请
                    else if(row.businessType=='enterApply'){
                        html.push('<a target="_blank" href="/web/services/hatchApply.html?objectid=' + row.businessId + '">详情</a>');
                    }
                    //著作权登记
                    else if(row.businessType=='userCopyright'){
                        html.push('<a target="_blank" href="/web/services/copyrightApply.html?objectid=' + row.businessId + '">详情</a>');
                    }
                    //"测试申请"
                    else if(row.businessType=='userTestApplyfor'){
                        html.push('<a target="_blank" href="/web/services/testApply.html?objectid=' + row.businessId + '">详情</a>');
                    }


                return html.join('');
            },
            targets: 4
            }
        ],
        //初始化结束
        "initComplete": function() {
            $('#ratingMgt').width("100%");
        },
        //加载结束
        "drawCallback": function() {
            $('.ratyStar').raty({
                path:'/lib/images/',
                score: function() {
                    return $(this).attr('data-score');
                },
                readOnly: true
            });
        }
    };

    $(document).ready(function() {
        var table = $("#ratingMgt").DataTable(dToption);

    }); //$
});

