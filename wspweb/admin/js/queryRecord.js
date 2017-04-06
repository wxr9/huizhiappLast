require(['moment' ,'jquery', 'bootstrap','datepicker', 'datatables','pm','select2','bootstrapvalidator'], function(moment) {
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
            url: '/Setting/ClmSearchLog/List',
            data: function(d){
                d.beginDate = $('#startDate').val();
                d.endDate = $('#endDate').val();
            },
            dataSrc: "result"
        },
        "aoColumns": [{
            "sTitle": "时间",
            "data": "createDate"
        }, {
            "sTitle": "单位",
            "data": "name"
        }, {
            "sTitle": '操作人',
            "data": 'username'
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
        "columnDefs": [],
        //初始化结束
        "initComplete": function() {
            $('#activityPubList').width("100%");
        },
        //加载结束
        "drawCallback": function() {

        }
    };


    $(function() {

        var table = $("#businessTable").DataTable(dToption);
        //开始时间小于结束时间
        $('#endDate').on('change', function(){
            var start = new Date($('#startDate').val());
            var end = new Date($('#endDate').val());
            if(start>end) {
                showAlert('结束时间不小于开始时间')
            }
        });
        //选择查询时间
        $(".form_datetime")
            .datetimepicker({
                format: "yyyy-mm-dd",
                autoclose: true,
                pickerPosition: "bottom-left",
                startView:2,
                minView:2,
                todayBtn:false
            })
        //查询
        $('#searchBtn').on('click',function(){
            table.ajax.url('/Setting/ClmSearchLog/Search/List');
            table.ajax.reload();
        })
        //清除查询
        $('#clearBtn').on('click',function(){
            table.ajax.url('/Setting/ClmSearchLog/List');
            $('#startDate').val("");
            $('#endDate').val("");
            table.ajax.reload();
        })

    });
});
