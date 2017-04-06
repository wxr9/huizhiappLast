/**
 * Created by Administrator on 2016/3/22.
 */
require(['jquery', 'bootstrap', 'datatables','pm','select2','bootstrapvalidator'], function() {
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

            url: '/Setting/MerchantEvaluate/List',
            data:function(d){
                d.username='customer'
            },
            dataSrc: "result"
        },
        "aoColumns": [{
            "sTitle": "商户ID",
            "data": "mMerchant.name"
        },{
            "sTitle": "评价时间",
            "data": "createTime"
        },{
            "sTitle": "评价内容",
            "data": "comment"
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
            {
               targets:2,
                width:400
            },
            {
                render: function(data,type,row){

                    return row.mMerchant.name;
                },
                targets:0
            }
        ],
        //初始化结束
        "initComplete": function() {
            $('#merchantEva').width("100%");
        },
        //加载结束
        "drawCallback": function() {

        }
    };

    $(document).ready(function() {
        var table = $("#merchantEva").DataTable(dToption);

    }); //$
    $(function(){
        $("#eval").mouseover(function(){
            $("#box").toggle();
        }).mouseout(function(){
            $("#box").toggle();
        })
    })
});


