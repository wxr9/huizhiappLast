/**
 * Created by Administrator on 2016/4/18.
 */

require(['jquery', 'bootstrap', 'datatables','pm','datepicker'],function() {
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
            url: '/Setting/PayLog/List',
            data:function(d){
                d.startDate = $('#startDate').val();
                d.endDate = $('#endDate').val();
                d.cardNo=$('input[name=cardNo]').val();
                d.mobile=$('input[name=phone]').val();
            },

            dataSrc: "result"
        },
        "aoColumns": [{
            "sTitle": "汇智卡号",
            "data": "cardNo"
        }, {
            "sTitle": "操作时间",
            "data": "createTime"
        }, {
            "sTitle": '操作类型',
            "data": 'type'
        },{
            "sTitle": '手机号',
            "data": 'mobile'
        },{
            "sTitle": 'IP地址',
            "data": 'ipAddr'
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
                var html = [];

                if (row.type == 1) {
                    html.push('充值支付');
                } else if(row.type == 2) {
                    html.push('绑定');
                } else if(row.type == 3) {
                    html.push('历史查询');
                } else if(row.type == 4) {
                    html.push('解绑');
                }
                return html.join('');
            },
            targets: 2
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
        //开始时间小于结束时间
        $('#endDate').on('change', function(){
            var start = new Date($('#startDate').val());
            var end = new Date($('#endDate').val());
            if(start>end) {
                showAlert('结束时间不小于开始时间')
            }
        });        //选择时间
        $(".form_datetime")
            .datetimepicker({
                format: "yyyy-mm-dd",
                autoclose: true,
                todayBtn: true,
                pickerPosition: "bottom-left",
                minView: 'month',
                startDate: '2015-01-01',
                endDate: new Date()
            })
        //查询
        $('#searchBtn').on('click',function(){
            table.ajax.reload();
        })
        //清除查询
        $('#clearBtn').on('click',function(){
            $('#startDate').val("");
            $('#endDate').val("");
            $('input[name=cardNo]').val("");
            $('input[name=phone]').val("");
            table.ajax.reload();
        })

    })
});