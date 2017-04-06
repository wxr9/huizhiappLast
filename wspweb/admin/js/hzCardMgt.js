/**
 * Created by z on 2016/10/31.
 */
require(['jquery', 'bootstrap', 'datatables', 'pm','datepicker'], function () {

    var eOption = {
        "bAutoWidth": true, //自动宽度
        "dom": '<"top"if>rt<"bottom"lp><"clear">',
        "serverSide": true,
        "bDestory": true,
        "info": false,
        "ordering": false,
        "searching": false,
        "lengthChange": false,
        "sPaginationType": "full_numbers",
        "ajax": {
            url: '/CardApply/Enterprise/List',
            dataSrc: "result"
        },
        "aoColumns": [{
            "sTitle": "流水号",
            "data": "sn"
        }, {
            "sTitle": "申请人",
            "data": "username"
        }, {
            "sTitle": '公司',
            "data": 'company'
        }, {
            "sTitle": '联系方式',
            "data": 'contact'
        },  {
            "sTitle": '审核状态',
            "data": 'status'
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
                "sFirst": "",
                "sPrevious": "«",
                "sNext": "»",
                "sLast": ""
            }
        },
        "columnDefs": [
            {
                targets:4,
                render:function(data, type, row){
                    var status = parseInt(data);
                    //0待处理1受理中2审核通过3审核不通过4中止
                    switch(status){
                        case 0:
                            return '待处理';
                        case 1:
                            return "受理中";
                        case 2:
                            return "通过";
                        case 3:
                            return "未通过";
                        case 4:
                            return "中止";
                        default:
                            return "未知";
                    }
                }
            },
            {
                render: function (data, type, row) {
                    var html = [];
                    var status = row.status;
                    if(status == 0){
                        html.push('<a class="operate companyCheck" data-id=' + row.id + '>审核</a>');
                    }else{
                        html.push('<a class="operate infoBtn" data-toggle="modal" data-target="#infoModal" type="Enterprise" data-id=' + row.id + '>查看</a>');
                    }
                    return html.join('');
                },
                targets: 5
            }],
        //初始化结束
        "initComplete": function () {
        },
        //加载结束
        "drawCallback": function () {

        }
    };
    var pOption = {
        "bAutoWidth": true, //自动宽度
        "dom": '<"top"if>rt<"bottom"lp><"clear">',
        "serverSide": true,
        "bDestory": true,
        "info": false,
        "ordering": false,
        "searching": false,
        "lengthChange": false,
        "sPaginationType": "full_numbers",
        "ajax": {
            url: '/CardApply/Person/List',
            dataSrc: "result"
        },
        "aoColumns": [{
            "sTitle": "流水号",
            "data": "sn"
        }, {
            "sTitle": "姓名",
            "data": "username"
        }, {
            "sTitle": '联系方式',
            "data": 'contact'
        }, {
            "sTitle": '审核状态',
            "data": 'status'
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
                "sFirst": "",
                "sPrevious": "«",
                "sNext": "»",
                "sLast": ""
            }
        },
        "columnDefs": [
            {
                targets:3,
                render:function(data, type, row){
                    var status = parseInt(data);
                    //0待处理1受理中2审核通过3审核不通过4中止
                    switch(status){
                        case 0:
                            return '待处理';
                        case 1:
                            return "受理中";
                        case 2:
                            return "通过";
                        case 3:
                            return "未通过";
                        case 4:
                            return "中止";
                        default:
                            return "未知";
                    }
                }
            },
            {
                render: function (data, type, row) {
                    var html = [];
                    var status = row.status;
                    if(status == 0){
                        html.push('<a class="operate personCheck" data-id=' + row.id + '>审核</a>');
                    }else{
                        html.push('<a class="operate infoBtn" data-toggle="modal" data-target="#infoModal" type="Person" data-id=' + row.id + '>查看</a>');
                    }
                    return html.join('');
                },
                targets: 4
            }],
        //初始化结束
        "initComplete": function () {
        },
        //加载结束
        "drawCallback": function () {

        }
    };
    $(function () {
        var table1 = $('#table1').DataTable(pOption);
        var table2 = $("#table2").DataTable(eOption);
        var postUrl = "";
        var forms = document.forms;
        var stepOne = forms.stepOne;
        var stepTwo = forms.stepTwo;
        var personForm = forms.personForm;
        var companyForm = forms.companyForm;
        var modal = document.getElementById('modal');

        $(".form_datetime")
            .datetimepicker({
                format: "yyyy-mm-dd hh:ii:ss",
                autoclose: true,
                todayBtn: true,
                pickerPosition: "bottom-left",
                startView:2,
                minView:0,
                startDate: new Date()
            });
        //"/CardApply/Enterprise/Add"
        $('#table1').on('click','.personCheck',function(){
            var id = $(this).attr('data-id');
            $('input[name="id"]').val(id);
            postUrl = "/CardApply/Person/Status/Update";
            $(modal).modal('toggle');
            var list = ['username','email','company','contact','realname','idcard','id'];
            $.ajax({
                type: "GET",
                url: "/CardApply/Person/Edit/" + id,
                dataType: "json",
                success: function(data) {
                    companyForm.style.display = "none";
                    personForm.style.display = "block";
                    for(var i=0; i<7; i++){
                        var val = list[i];
                        data[val] = data[val] != null ? data[val] :"";
                        personForm[val].value = data[val];
                    }

                }
            })
        });
        $('#table2').on('click','.companyCheck',function(){
            var id = $(this).attr('data-id');
            $('input[name="id"]').val(id);
            postUrl = "/CardApply/Enterprise/Status/Update";
            $(modal).modal('toggle');
            var list = ['username','email','company','contact'];
            $.ajax({
                type: "GET",
                url: "/CardApply/Enterprise/Edit/" + id,
                dataType: "json",
                success: function(data) {
                    personForm.style.display = "none";
                    companyForm.style.display = "block";
                    for(var i=0; i<4; i++){
                        var val = list[i];
                        data[val] = data[val] != null ? data[val] :"";
                        companyForm[val].value = data[val];
                    }
                    $('#attachmentBox').empty().append('<a class="btn btn-blue" href="/'+data.attachment+'" download>下载</a>')

                }
            })
        });

        $('#submit1').on('click',function() {
            var time = stepOne.getTime.value;
            if(time != ""){
                $.ajax({
                    type: "POST",
                    url: postUrl,
                    data: $(stepOne).serialize(),
                    success: function(msg){
                        if(msg.success){
                            $(modal).modal('hide');
                            showAlert(msg.msg,'success');
                        }else{
                            showAlert(msg.msg,'danger');
                        }
                        $(this).attr('disabled',true);
                    }
                });
            }else{
                showAlert('请填写领取时间！');
                this.disabled = true;
                return false;
            }
        });
        $('#submit2').on('click',function() {
            var memo = stepTwo.mark.value;
            if(memo == "" || memo == null){
                showAlert('请输入审核意见!');
                return false;
            }else{
                $.ajax({
                    type: "POST",
                    url: postUrl,
                    data:$(stepTwo).serialize(),
                    success: function(msg){
                        if(msg.success){
                            $(modal).modal('hide');
                            showAlert(msg.msg,'success');
                        }else{
                            showAlert(msg.msg,'danger');
                        }
                        $(this).attr('disabled',true);
                    }
                });
            }
        });

        $('table').on('click','.infoBtn',function(){
            var type = $(this).attr('type');
            var id = $(this).attr('data-id');
            $.ajax({
                type: "GET",
                url: "/CardApply/"+type+"/Edit/" + id,
                dataType: "json",
                success: function(data) {
                    var html = [];
                    var list,names;
                    if(type == "Person"){
                        list = ['username','email','company','contact','realname','idcard','mark','getTime'];
                        names = ['申请人','邮箱','公司名称','联系方式','真实姓名','身份证','审核意见','领取时间'];
                        for(var i=0; i<8; i++){
                            var val = list[i];
                            html.push("<tr><td>"+names[i]+"：</td><td>"+(data[val] || "")+"</td></tr>");
                        }
                    }else{
                        list = ['username','email','company','contact','attachment','mark','getTime'];
                        names = ['申请人','邮箱','公司名称','联系方式','附件','审核意见','领取时间'];
                        for(var i=0; i<7; i++){
                            var val = list[i];
                            if(i== 4){
                                html.push("<tr><td>"+names[i]+"：</td><td><a class='btn btn-blue' href='/"+data[val]+"' download>下载</a></td></tr>");
                            }else
                                html.push("<tr><td>"+names[i]+"：</td><td>"+(data[val] || "")+"</td></tr>");
                        }
                    }
                    $('#infoTable').empty().append(html.join(''));

                }
            })
        })
        $(modal).on('hidden.bs.modal',function(e){
            stepOne.getTime.value = "";
            stepTwo.mark.value = "";
            $(stepOne).slideDown();
            $(stepTwo).slideUp();
            table1.ajax.reload();
            table2.ajax.reload();
        });
        $('#nextStep').on('click',function() {
            $(stepOne).slideUp();
            $(stepTwo).slideDown();
        });
        $('#stop').on('click',function(){
            $(stepOne).slideUp();
            $(stepTwo).slideDown();
            stepTwo.status.value = 4;
        });
        $('#preStep').on('click',function() {
            $(stepOne).slideDown();
            $(stepTwo).slideUp();
        });
    })
})


