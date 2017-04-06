/**
 * Created by Administrator on 2016/3/29.
 */
require(['jqueryUpload','jquery', 'bootstrap','datepicker', 'datatables','pm','select2','bootstrapvalidator', 'ckeditor'], function() {
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
            url: '/Jobs/List',
            dataSrc: "result"
        },
        "aoColumns": [{
            "sTitle": "ID",
            "data": "objectid"
        }, {
            "sTitle": "职位名称",
            "data": "name"
        }, {
            "sTitle": '发布日期',
            "data": 'createDate'
        }, {
            "sTitle": '薪资类别',
            "data": 'moneyType.name'
        },{
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
                html.push('<a class="operate editBtn" data-toggle="modal" data-target="#editModal"  data-id=' + username + '>编辑</a>');
                html.push('<a target="blank" href="/web/services/jobDetail.html?id=' +username+ '"> 预览</a>');
                if (row.deleteFlag === -1) {
                    html.push('<a class="operate enableBtn" data-id=' + username + '> 启用发布</a>');
                } else { //defalut 0
                    html.push('<a class="operate disableBtn" data-id=' + username + '> 禁用发布</a>');
                }
                html.push('<a href="/admin/postWorkMan.html?objectid='+username+'" > 应聘情况</a>');
                //html.push('<a class="operate resetBtn" href="#" download="file" target="_blank" data-id=' + username + '>导出</a>');
                return html.join('');
            },
            targets: 4
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

        //富文本
        var initSample = (function() {
            var wysiwygareaAvailable = isWysiwygareaAvailable(),
                isBBCodeBuiltIn = !!CKEDITOR.plugins.get('bbcode');
            return function() {
                var editorElement = CKEDITOR.document.getById('editor');
                if (isBBCodeBuiltIn) {
                    editorElement.setHtml(
                        'Hello world!\n\n'
                    );
                }
                if (wysiwygareaAvailable) {
                    CKEDITOR.replace('editor');
                } else {
                    editorElement.setAttribute('contenteditable', 'true');
                    CKEDITOR.inline('editor');
                }
            };

            function isWysiwygareaAvailable() {

                if (CKEDITOR.revision == ('%RE' + 'V%')) {
                    return true;
                }
                return !!CKEDITOR.plugins.get('wysiwygarea');
            }
        })();
        initSample();

        var table = $("#businessTable").DataTable(dToption);
        var usertable = $("#businessTable");
        //禁用

        usertable.on('click','.disableBtn',function(){

            $("#disableModal").modal('show');
            var objectid = $(this).attr('data-id');
            var flag = -1;

            $("#disableModal").on('click', '#disableCfm', function() {
                $.ajax({
                    type: "GET",
                    url: " /Jobs/Enable/Delete/" + objectid +'/'+ flag,
                    dataType: "json",
                    success: function(data) {

                        $("#disableModal").modal('hide');
                        table.ajax.reload( null, false);
                    }
                });
            });

        });


        //启用
        usertable.on('click','.enableBtn',function(){
            $("#enableModal").modal('show');
            var objectid = $(this).attr('data-id');
            var flag = 1;

            $("#enableModal").on('click', '#enableCfm', function() {
                $.ajax({
                    type: "GET",
                    url: " /Jobs/Enable/Delete/" + objectid +'/'+ flag,
                    dataType: "json",
                    success: function(data) {
                        table.ajax.reload( null, false );
                        $("#enableModal").modal('hide');
                    }
                });
            });
        });

        //重置密码
            usertable.on('click', '.resetBtn', function () {
                var enterpriseId = $(this).attr("data-id");
                $.ajax({
                    type: "POST",
                    url: "/Setting/Enterprise/RestEnterpriseAdminPassword/" + enterpriseId,
                    dataType: "json",
                    success: function (data) {
                        if (data.success) {
                            showAlert("密码已重置", info)
                        } else {
                            showAlert(data.msg, 'danger')
                        }
                        table.ajax.reload( null, false );
                    }
                });
            });
            //新增验证&&提交更新
            var fieldsList = {
                name: {
                    validators: {
                        notEmpty: {
                            message: '职位名称不能为空'
                        },
                        stringLength: {
                            max: 50,
                            message: '限50个字符以内'
                        }
                    }
                },
                money: {
                    validators: {
                        notEmpty: {
                            message: '薪资不能为空'
                        }
                    }
                },
                moneyTypeId: {
                    validators: {
                        callback: {
                            callback: function (value, validator) {
                                if (value == 0) {
                                    return {
                                        valid: false,
                                        message: '请选择薪资类别'
                                    }
                                }
                                return true;
                            }
                        }
                    }
                }

            }
        loadSelect({
            url:'/Setting/SettingDict/0/0?type=moneyType',
            target: '#type'
        })
        initBootstrapValidator(fieldsList, {
            prev: function(){
                $('textarea[name="content"]').val(CKEDITOR.instances.editor.getData());
            },
            end: function(){
                $("addModel").hide();
                CKEDITOR.instances.editor.setData('');
                table.ajax.reload( null, false );
            }});



        //新增
        $("#add").on('click', function(){
            CKEDITOR.instances.editor.setData('');
            $(".objectid").attr('name','')
            $('#addForm').data('bootstrapValidator').resetForm();
            $('#type').val('').select2();
            $("#addForm").attr('action', '/Jobs/Add').get(0).reset()
            $(".deleteFlag").attr('value','-1')

        })



        //编辑
        usertable.on('click', '.editBtn', function () {
            $('#addForm').data('bootstrapValidator').resetForm();
            $("#addModal").modal('toggle');
            $("#addForm").attr('action','/Jobs/Update')
            $(".objectid").attr('name','objectid')
            var objectid = $(this).attr("data-id");
            $.ajax({
                type: 'GET',
                url: '/Jobs/Edit/' + objectid,
                dataType: 'json',
                success: function (data) {
                    $.each(data,function(ind,val){
                        var tar = $('input[name="'+ind+'"]');
                        if(tar.attr('type') != 'radio'){
                            tar.val(val)
                        }
                    });
                    $('input[name="isShow"]').eq(data.isShow+1).attr("checked",'checked');
                    $('#type').val(data.moneyTypeId).select2();
                    CKEDITOR.instances.editor.setData(data.content);
                }
            })
        });
        //导出
        //usertable.on('click','.resetBtn',function(){
        //
        //    var objectid = $(this).attr('data-id');
        //    var target='/Cultivate/UserCultivate/Export/List/?courseIds='+objectid;
        //    $(this).attr('href',target)
        //
        //});

        var dToption2 = {
            "bAutoWidth": true, //自动宽度
            "dom": '<"top">rt<"bottom"lp><"clear">',
            "serverSide": true,
            "bDestory": true,
            "info": false,
            "ordering": false,
            "lengthChange": false,
            "sPaginationType": "full_numbers",
            "ajax": {
                url: '/Jobs/UserJobs/Apply/All/List',
                dataSrc: "result"
            },
            "aoColumns": [{
                "sTitle": "",
                "data": "objectid"
            },{
                "sTitle": "职位名称",
                "data": "jobs.name"
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
                targets:2
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

        var applyTable = $('#applyTable');
        var apply = applyTable.dataTable(dToption2);
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


