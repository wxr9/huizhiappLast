/**
 * Created by iris on 16/2/25.
 */
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
            url: '/Setting/LoginLog/List',
            data: function(d){
                d.startDate = $('#startDate').val();
                d.endDate = $('#endDate').val()
                d.userName = $('#userName').val();
            },
            dataSrc: "result"
        },
        "aoColumns": [{
            "sTitle": "用户名",
            "data": "userName"
        }, {
            "sTitle": "IP",
            "data": "ipAddr"
        }, {
            "sTitle": '浏览器',
            "data": 'browser'
        }, {
            "sTitle": '登录时间',
            "data": 'createTime'
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
            { render:function(data,type,row){
                },
              target:2,
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
        var table = $("#logTable").DataTable(dToption);
        //开始时间小于结束时间
        $('#endDate').on('change', function(){
            var start = new Date($('#startDate').val());
            var end = new Date($('#endDate').val());
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
            })
        //查询
        $('#searchBtn').on('click',function(){
            table.ajax.reload();
        })
        //清除查询
        $('#clearBtn').on('click',function(){
            $('#startDate').val("");
            $('#endDate').val("");
            $('#userName').val("");
            table.ajax.reload();
        })

    });
});

