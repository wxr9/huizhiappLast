/**
 * Created by Administrator on 2016/3/31.
 */
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
            url: '/Incubator/UserIncubator/List',
            data: function(d){
                d.beginDate = $('#startDate').val();
                d.endDate = $('#endDate').val();
            },
            dataSrc: "result"
        },

        "aoColumns": [{
            "sTitle": "预约人",
            "data": "chineseName"
        }, {
            "sTitle": "联系方式",
            "data": "phone"
        }, {
            "sTitle": "预约时间",
            "data": "appointmentDate"
        }, {
            "sTitle": '公司名称',
            "data": 'company'
        },{
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
                "sFirst": "首页",
                "sPrevious": "<<",
                "sNext": ">>",
                "sLast": "末页"
            }
        },
        "columnDefs": [{
            render: function(data, type, row) {

                var username = row.objectid;
                var html = [];
                html.push('<a class="infoBtn" href="#" data-toggle="modal" data-target="#infoModal" data-id=' + username + '>详情</a>');
                return html.join('');
            },
            targets: 4
        },{
            render: function(data){
                return formatDate(data)
            },
            targets:2
        }],
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
        var usertable = $("#businessTable");


        //孵化注册预约申请详情
        usertable.on('click', '.infoBtn', function() {
            var objectid = $(this).attr("data-id");
            $.ajax({
                type: "GET",
                url: "/Incubator/UserIncubator/Edit/" + objectid,
                dataType: "json",
                success: function(data) {
                    var html = [];
                    html.push("<tr><td>预约人:</td><td>"+data.chineseName+"</td></tr>");
                    html.push("<tr><td>联系方式:</td><td>"+data.phone+"</td></tr>");
                    html.push("<tr><td>公司:</td><td>"+data.company+"</td></tr>");
                    html.push("<tr><td>电子邮箱:</td><td>"+data.email+"</td></tr>");
                    if(data.rentType==1){
                        html.push("<tr><td>租赁类别：</td><td>新租1年</td></tr>")
                    }else if (data.rentType==2){
                        html.push("<tr><td>租赁类别：</td><td>续租1年</td></tr>")
                    }else {
                        html.push("<tr><td>租赁类别：</td><td>续租2年</td></tr>")
                    }
                    html.push("<tr><td>备注:</td><td>"+data.memo+"</td></tr>");


                    $("#businessInfo").empty().append(html.join(''));
                }
            });
        });
        //删除
        var objectid;
        usertable.on('click','.deleteBtn', function(){
            objectid = $(this).attr('data-id');
        })
        $('#disableCfm').click(function() {
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
            table.ajax.url('/Incubator/UserIncubator/Search/List');
            table.ajax.reload();
        })
        var target=$('.operate').attr('href');

        $("#startDate").change(function(){
            target=target+'?beginDate='+$(this).val();
        })
        $("#endDate").change(function(){
            target=target+'&endDate='+$(this).val();
        })
        $('.operate').click(function(){
            $('.operate').attr('href',target)
        })
        //清除查询
        $('#clearBtn').on('click',function(){
            table.ajax.url('/Incubator/UserIncubator/List');
            $('#startDate').val("");
            $('#endDate').val("");
            table.ajax.reload();
        })

    });
});
