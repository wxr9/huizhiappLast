/*** Created by iris on 16/4/6.*/
require(['jquery', 'bootstrap','datepicker', 'datatables'], function() {
    var dToption = {
        "bAutoWidth": true, //自动宽度
        "dom": '<"top"if>rt<"bottom"lp><"clear">',
        "serverSide": true,
        "bDestory": true,
        "info": false,
        "ordering": false,
        "lengthChange": false,
        "sPaginationType": "full_numbers",
        "searching": false,
        "sEmptyTable" : "未查找到信息",
        "ajax": {
            url: '/Setting/MerchantReply/List',
            data: function(d){
                d.startTime = $('#startTime').val();
                d.endTime = $('#endTime').val();
            },
            dataSrc: "result"
        },
        "aoColumns": [{
            "sTitle": "商户名称",
            "data": "mMerchant"
        }, {
            "sTitle": "回复时间",
            "data": "createTime"
        }, {
            "sTitle": '回复内容',
            "data": 'content'
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
                render:function(data,type,row){
                var name = row.mMerchant.name || '';
                return name;
                },
                targets:0
            },
            {
                render:function(data,type,row){
                var html = [];
                if(row.isBlock == 1){
                    html.push('<a; data-id=' + row.objectid + '>已经禁用</a>');
                }else{ //2
                    html.push('<a class="operate infoBtn" data-id=' + row.objectid + '>禁用</a>');
                }

                return html.join('');
                },
                    targets:3
            }
        ],
        //初始化结束
        "initComplete": function() {
            $('#activityPubList').width("100%");
        },
        //加载结束
        "drawCallback": function() {

        }
    };


    $(function() {
        var table = $("#replyTable").DataTable(dToption);
        var op = $("#replyTable");
        //开始时间小于结束时间
        $('#endTime').on('change', function(){
            var start = new Date($('#startTime').val());
            var end = new Date($('#endTime').val());
            if(start>end) {
                showAlert('结束时间不小于开始时间')
            }
        });
        //选择时间
        $(".form_datetime")
            .datetimepicker({
                format: "yyyy-mm-dd",
                autoclose: true,
                todayBtn: true,
                pickerPosition: "bottom-left",
                minView: 'month',
                startDate: '2015-01-01',
                endDate: new Date()
            });
        //读取设置内容
        $.ajax({
            type:'GET',
            url:'/Setting/MerchantReplySet/Edit/1',
            typeDate:'json',
            success:function(data){
                $('input[name="content"]').val(data.content)
            }
        });

        //查询
        $('#searchBtn').on('click',function(){
            table.ajax.reload();
        });
        //清除查询
        $('#clearBtn').on('click',function(){
            $('#startTime').val("");
            $('#endTime').val("");
            table.ajax.reload();
        });
        //禁用
        op.on('click','.infoBtn',function(){
           var id= $(this).attr('data-id');
            $.ajax({
                type:'POST',
                url:'/Setting/MerchantReply/BlockReply',
                data:{"objectid":id},
                typeDate:'json',
                success:function(data){
                    if(data.success){
                        showAlert("禁用成功",'success');
                    }else{
                        showAlert("禁用失败",'danger');
                    }
                    table.ajax.reload(null,false);

                }
            })
        });
        //设置
        $('#setBtn').on('click',function(){
            $.ajax({
                type:'POST',
                url:'/Setting/MerchantReplySet/Update',
                data:{"objectid":1,"content":$('input[name="content"]').val()},
                typeDate:'json',
                success:function(data){
                    if(data.success)
                        showAlert(data.msg,'success');
                    else
                        showAlert(data.msg,'danger');
                }
            })
        })

    });
});