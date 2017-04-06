/**
 * Created by z on 2016/9/9.
 */
require(['jquery', 'bootstrap', 'datatables','raty','pm'],function(){
    //查询
    $.ajax({
        type:"GET",
        url: "/Setting/SettingDict/0/0?type=commentType",
        dataType:'json',
        success: function(data){
            if(data.total){
                var d = data.result;
                var html = [];
                html.push('<option value="">所有类别</option>');
                for(var i=0 ,len = data.total; i<len; i++){
                    html.push('<option value="'+d[i].english+'">'+d[i].name+'</option>');
                }
                $('#type').append(html.join(""));
            }
        }
    })
    var dToption = {
        "bAutoWidth": true, //自动宽度
        "dom": '<"top">rt<"bottom"lp><"clear">',
        "serverSide": true,
        "bDestory": true,
        "info": false,
        "ordering": false,
        "lengthChange": false,
        "sPaginationType": "full_numbers",
        "sEmptyTable": "未查找到信息",
        "ajax": {
            url: '/Comment',
            data:function(d) {
                var value = $('#type').val();
                if (value)
                    d.businessType = value;
            },
            dataSrc: "result"
        },
        "aoColumns": [{
            "sTitle": "流水号",
            "data": "serialNumber"
        },{
            "sTitle": "服务类别",
            "data": "bTypeChinese"
        },{
            "sTitle": "评价人",
            "data": "userid"
        },{
            "sTitle": "评价时间",
            "data": "createTime"
        },{
            "sTitle": '评分',
            "data": 'objectid'
        },{
            "sTitle": '评价内容',
            "data": 'content'
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
            },
        },
        "columnDefs": [
            {
                render:function(data,type,row){
                    var rating = [];
                    rating.push('<ul class="raty-list"><li>响应速度: <span class="ratyStar" data-score='+row.duration+'></span></li>');
                    rating.push('<li>服务态度: <span class="ratyStar" data-score='+row.attitude+'></span></li>');
                    rating.push('<li>服务质量: <span class="ratyStar" data-score='+row.quality+'></span></li></ul>');
                    return rating.join('');
                },
                width: "200px",
                targets: 4
            }],
        //初始化结束
        "initComplete": function () {
            $('#activityPubList').width("100%");
        },
        //加载结束
        "drawCallback": function () {
            $('.ratyStar').raty({
                path:'/lib/images/',
                score: function() {
                    return $(this).attr('data-score');
                },
                readOnly: true
            });
        }

    }

    var table = $("#businessTable").DataTable(dToption);
    $('#type').on('change',function(){
        table.ajax.reload();
    })

})