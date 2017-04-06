/**
 * Created by Administrator on 2016/4/1.
 */
require(['jquery', 'bootstrap', 'datatables','pm','select2','bootstrapvalidator'], function() {
    var couseId=queryString("objectid")
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
            url: '/Cultivate/UserCultivate/Apply/List/'+couseId,
            data:function(d){
                d.courseid= couseId;
                d.searchName= $('#searchName').val();
            },
            dataSrc: "result"
        },
        "aoColumns": [{
            "sTitle": "ID",
            "data": "objectid"
        },{
            "sTitle": "名称",
            "data": "chineseName"
        }, {
            "sTitle": '申请日期',
            "data": 'createDate'
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
        "columnDefs": [{
            render: function(data, type, row) {
                var username = row.objectid;
                var html = [];
                html.push('<a class="operate infoBtn" data-toggle="modal" data-target="#infoModal" data-id=' + username + '>详情</a>');
                html.push('<a class="operate deleteBtn"data-toggle="modal" data-target="#deleteModal"  data-id=' + username + '>删除</a>');
                return html.join('');
            },
            targets:3
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
        //详情
        usertable.on('click', '.infoBtn', function() {
            var objectid = $(this).attr("data-id");
            $.ajax({
                type: "GET",
                url: " /Cultivate/UserCultivate/Edit/" + objectid,
                dataType: "json",
                success: function(data) {
                    var html = [];
                    html.push("<tr><td>姓名:</td><td>"+data.chineseName+"</td></tr>");
                    if(data.education==null){

                    }else{
                        html.push("<tr><td>等级:</td><td>"+data.education.name+"</td></tr>");
                    }
                    html.push("<tr><td>联系方式:</td><td>"+data.phone +"</td></tr>");
                    if(data.email==null){

                    }else{
                        html.push("<tr><td>邮箱:</td><td>"+data.email +"</td></tr>");
                    }
                    if(data.workYear==null){

                    }else{
                        html.push("<tr><td>工作年限:</td><td>"+data.workYear.name +"</td></tr>");
                    }
                    html.push("<tr><td>公司:</td><td>"+data.company+"</td></tr>");
                    html.push("<tr><td>目前职位:</td><td>"+data.job.name +"</td></tr>");
                    if(data.socialInsurance==null){

                    } else if (data.socialInsurance==1)
                    {
                        html.push("<tr><td>是否在上海缴纳社保:</td><td>是</td></tr>");
                    } else
                    {
                        html.push("<tr><td>工作年限:</td><td>否</td></tr>");
                    }
                    if(data.censusRegister==null){

                    } else if (data.censusRegister==1)
                    {
                        html.push("<tr><td>是否是沪籍:</td><td>是</td></tr>");
                    } else
                    {
                        html.push("<tr><td>是否是沪籍:</td><td>否</td></tr>");
                    }
                    html.push("<tr><td>上课时间:</td><td>"+data.schoolTime+"</td></tr>");
                    $("#parkInfo").empty().append(html.join(""));
                }
            });
        });
        //删除
        usertable.on('click','.deleteBtn', function(){

            var objectid = $(this).attr('data-id');

            $('#deleteBtn').click(function() {
                $.ajax({
                    type: 'GET',
                    url: '/Cultivate/UserCultivate/Delete/' + objectid,
                    dataType: 'json',
                    success: function (data) {
                        $('#deleteModal').modal('hide');
                        showAlert(data.msg);
                        table.ajax.reload( null, false );
                    }
                })
            })

        })
        $('#add').click(function() {

            var target = '/Cultivate/UserCultivate/Export/List/' + couseId;
            $(this).attr('href', target)
        })
        //查询
        $('#searchBtn').on('click',function(){
            table.ajax.reload();
        })
        //清除查询
        $('#clearBtn').on('click',function(){
            $('#searchName').val("")
            table.ajax.reload();
        })

    })
});



