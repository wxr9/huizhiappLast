/**
 * Created by Administrator on 2016/4/7.
 */
require(['jquery', 'bootstrap', 'datatables','pm','select2','bootstrapvalidator'], function() {
    var jobsId=queryString("objectid")
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
            url: '/Jobs/UserJobs/Apply/List/'+jobsId,
            data:function(d){
                d.jobsId= jobsId
            },
            dataSrc: "result"
        },
        "aoColumns": [{
            "sTitle": "",
            "data": "objectid"
        },{
            "sTitle": "名称",
            "data": "chineseName"
        }, {
            "sTitle": '日期',
            "data": 'createDate'
        }, {
            "sTitle": '联系方式',
            "data": 'phone'
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
            html.push('<input type="checkbox" downloadNum="'+row.downloadNum+'" objectid="'+row.objectid+'"/>')
            return html.join('');
        },
        targets:0
        },{
            render: function(data, type, row) {
                var html = [];
                if(row.downloadNum==0){
                    //下载次数为0时，加粗
                    html.push('<span class="namebold">'+row.chineseName+'</span>')

                }else{
                    html.push('<span>'+row.chineseName+'</span>')
                }
                return html.join('');
            },
            targets:1
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
        var table = $("#businessTable").DataTable(dToption);
        //详情
        table.on('click', '.infoBtn', function() {
            var objectid = $(this).attr("data-id");
            $.ajax({
                type: "GET",
                url: " /Cultivate/UserCultivate/Apply/List/" + objectid,
                dataType: "json",
                success: function(data) {
                    var html = [];
                    html.push("<tr><td>课程名称:</td><td>"+data.name+"</td></tr>");
                    html.push("<tr><td>封面图片:</td><td><img width='200' src='"+data.pic+"'></td></tr>");
                    html.push("<tr><td>课程大纲:</td><td>"+data.courseOutline+"</td></tr>");
                    html.push("<tr><td>主办方:</td><td>"+data.sponsor+"</td></tr>");
                    html.push("<tr><td>参考价格:</td><td>"+data.price+"</td></tr>");
                    html.push("<tr><td>课程简介:</td><td>"+data.content+"</td></tr>");
                    $("#parkInfo").empty().append(html.join(""));
                }
            });
        });
        //导出
        $('#reset').on('click', function(){
            var tar = $('input[type=checkbox]');
            var objectid;
            var target='/Jobs/UserJobs/DownloadResume?id=';
            for(var i= 0,num=0;i<tar.length;i++){
                objectid =tar[i].getAttribute('objectid');
                if(tar[i].checked==true){
                    target+=objectid+',';
                    num++;
                }
            }
            if(num==0){
                showAlert('请选择要导出的记录')
            }else{
                target=target.substr(0,target.length-1)
                //$(this).attr({'download':'file','target':'_blank'})
                $(this).attr({'target':'_blank'})
                $(this).attr('href',target);

            }
        });
    })
});



