/**
 * Created by Administrator on 2016/4/6.
 */
/**
 * Created by Administrator on 2016/4/5.
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
            url: '/Incubator/UserIncubator/My/List',
            dataSrc: "result"
        },
        "aoColumns": [{
            "sTitle": "租赁类别",
            "data": "rentType"
        }, {
            "sTitle": "预约时间",
            "data": "appointmentDate"
        },{
            "sTitle": "申请时间",
            "data": "createDate"
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
                "sFirst": "",
                "sPrevious": "«",
                "sNext": "»",
                "sLast": ""
            }
        },
        "columnDefs": [{
            render: function (data, type, row) {
                var username = row.objectid;
                var html = [];
                var yourtime=row.appointmentDate;
                yourtime = yourtime.replace("-","/");//替换字符，变成标准格式
                var d2=new Date();//取今天的日期
                var d1 = new Date(Date.parse(yourtime));
                html.push('<a target="_blank" href="/web/services/hatchForm.html?objectid=' + row.objectid + '">详情</a>');
                if(d1>d2){
                    if(row.deleteFlag!=-1){
                        html.push('<a class="deleteBtn" href="#" data-toggle="modal" data-target="#deleteModal"  data-id=' + username + '> 取消预约</a>');
                    }else if(row.deleteFlag==-1) {
                        html.push('<a  href="#"  data-id=' + username + '> 已取消</a>');
                    }
                }
                return html.join('');
            },
            targets: 3
        },
            {render: function (data, type, row) {

                var username = row.objectid;

                var name=row.rentType
                var html = [];
                if(name==1){
                    html.push('<a href="javascript:;" class="operate infoBtn" data-id=' + username + '>新租1年</a>');
                }else if(name==2){
                    html.push('<a href="javascript:;" class="operate infoBtn" data-id=' + username + '>续租1年</a>');
                }else{
                    html.push('<a href="javascript:;" class="operate infoBtn" data-id=' + username + '>续租2年</a>');
                }
                return html.join('');
            },
                targets: 0
            }],
        //初始化结束
        "initComplete": function () {
            $('#recordTable').width("100%");
        },
        //加载结束
        "drawCallback": function () {

        }
    };
    $(function () {
        var table = $("#recordTablec").DataTable(dToption);
        var usertable = $("#recordTablec");
        //取消预约
        var objectid;
        usertable.on('click','.deleteBtn', function(){
            objectid = $(this).attr('data-id');
        })
        $('#disableCfm1').click(function() {
            $.ajax({
                type: 'GET',
                url: '/Incubator/UserIncubator/Delete/' + objectid,
                dataType: 'json',
                success: function (data) {
                    $('#deleteModal').modal('toggle');
                    showAlert(data.msg);
                    table.ajax.reload( null, false );
                    setTimeout(function() {
                        window.location.reload();
                    },2000)
                }
            })
        })
    })
})



