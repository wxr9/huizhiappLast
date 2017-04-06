/**
 * Created by Administrator on 2016/4/19.
 */

require(['jquery', 'bootstrap','datepicker', 'datatables'],function() {
    var dToption = {
        "bAutoWidth": true, //自动宽度
        "dom": '<"top"if>rt<"bottom"lp><"clear">',
        "serverSide": true,
        "bDestory": true,
        "info": false,
        "ordering": false,
        "lengthChange": false,
        "sPaginationType": "full_numbers",
        "ajax": {
            url: '/Setting/RechargeManage/List',
            data:{
                searchName: $('input[type=search]').val()
            },
            dataSrc: "result"
        },
        "aoColumns": [{
            "sTitle": "订单号",
            "data": "orderNo"
        }, {
            "sTitle": "收据验证码",
            "data": "checkCode"
        }, {
            "sTitle": '金额',
            "data": 'amount'
        },{
            "sTitle": '汇智卡号',
            "data": 'cardNo'
        },{
            "sTitle": '账户号',
            "data": 'account'
        },{
            "sTitle": '充值时间',
            "data": 'createTime'
        },{
            "sTitle": '操作',
            "data": 'checkGet'
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
                render: function(data, type, row) {

                    return row.createTime
                },
                targets: 5
            },
            {
            render: function(data, type, row) {

                var html = [];
                var objectid=row.id;

                if (row.checkGet == 2) {
                    html.push('<span class="gray">已领收据</span>');
                } else if(row.checkGet == 1) {
                    html.push('<a href="javascript:;" class="blue" objectid="'+objectid+'">领收据</a>');
                }
                return html.join('');
            },
            targets: 6
        }],
        //初始化结束
        "initComplete": function() {
            $('#activityPubList').width("100%");
        },
        //加载结束
        "drawCallback": function() {

        }
    }
    $(function(){

        var table = $("#recordTable").DataTable(dToption);
        var usertable = $("#recordTable");
        $("label").addClass('clearfix');
        //$("label").html('<input type="search" class="search" aria-controls="recordTable"/><a href="javascript:;" class="box"><i class="fa fa-search" aria-hidden="true"></i></a>')
        $("input[type='search']").attr("placeholder", "根据订单号/收据验证码查询");
        $('.dataTables_filter input').css('border-radius','5px 0 0 5px')
        //领发票
        //
        usertable.on('click','.blue',function(){
            $("#disableModal").modal('show');
            var objectid = $(this).attr('objectid');
            $("#disableModal").on('click', '#disableCfm', function() {
                $.ajax({
                    type: "GET",
                    url: "/Setting/RechargeManage/GetCheck/" + objectid ,
                    dataType: "json",
                    success: function(data) {
                        $("#disableModal").modal('hide');
                        showAlert(data.msg);
                        table.ajax.reload();
                    }
                });
                return false;
            });

        });
        usertable.on('click','.search',function(){
            table.ajax.reload();
        })
    })
});