
require(['jqueryUpload','jquery', 'bootstrap','datepicker', 'datatables','pm','select2','bootstrapvalidator', 'ckeditor'], function(jqueryUpload) {
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
            url: ' /Cultivate/Course/List',
            dataSrc: "result"
        },
        "aoColumns": [{
            "sTitle": "ID",
            "data": "objectid"
        }, {
            "sTitle": "名称",
            "data": "name"
        }, {
            "sTitle": '报名日期',
            "data": 'createDate'
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
                html.push('<a href="/admin/courseApplyMan.html?objectid='+username+'" >报名情况 </a>');
                html.push('<a target="blank" href="/web/services/myCultivateDetail.html?objectid=' +row.objectid+
                    '">'+name+'预览</a>');
                if (row.deleteFlag == -1) {
                    html.push('<a class="operate enableBtn" data-id=' + username + '>启用</a>');
                } else { //defalut 1
                    html.push('<a class="operate disableBtn" data-id=' + username + '>禁用</a>');
                }

                //html.push('<a class="operate disableBtn"data-toggle="modal" data-target="#disableBtn"  data-id=' + username + '>禁用</a>');
                html.push('<a class="operate editBtn" href="#"  data-id=' + username + '>编辑</a>');
                html.push('<a class="operate exportBtn" href="/Cultivate/UserCultivate/Export/List/" target="_blank" data-id=' + username + '>导出</a>');
                return html.join('');
            },
            targets: 3
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
                    url: "/Cultivate/Course/Enable/Delete/" + objectid +'/'+ flag,
                    dataType: "json",
                    success: function(data) {

                        $("#disableModal").modal('hide');
                        table.ajax.reload( null, false );
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
                    url: "/Cultivate/Course/Enable/Delete/" + objectid +'/'+ flag,
                    dataType: "json",
                    success: function(data) {
                        table.ajax.reload( null, false );
                        $("#enableModal").modal('hide');
                    }
                });
            });
        });
        //新增验证&&提交更新
        var fieldsList = {
            name: {
                validators:{
                    notEmpty: {
                        message: '课程名称不能为空'
                    },
                    stringLength: {
                        max: 50,
                        message: '限50个字符以内'
                    }
                }
            },
            pic: {
                validators:{
                    notEmpty: {
                        message: '请上传图片'
                    }
                }
            },
            courseOutline: {
                validators:{
                    notEmpty: {
                        message: '课程大纲不能为空'
                    },
                    stringLength: {
                        max: 100,
                        message: '限100个字符以内'
                    }
                }
            },
            sponsor: {
                validators:{
                    notEmpty: {
                        message: '主办方不能为空'
                    }
                }
            },
            price: {
                validators:{
                    notEmpty: {
                        message: '参考价格不能为空'
                    }
                }
            }
        }
        var upl =jqueryUpload({
            file : 'fileUpload',
            url : '/FileUpload/SimpleUploadFile',
            extData:{
                type: 'png'
            },
            name: 'pic',
            fileName: 'file',
            statusName : 'success',
            preview: {
                prevUrl : '/',
                //target : jqueryDom,
            },
            path: 'response path data',
            success: function(data){
            },
            error: function(data){

            }
        });
        //初始化验证

        $("#add").on('click', function(){
            $("#addForm").get(0).reset();
        })
        $('#addModal').on('click','button[data-dismiss="modal"]',function(){
            $('#addForm').data('bootstrapValidator').resetForm();

        })
        initBootstrapValidator(fieldsList, {
        prev: function(){
            $('textarea[name="content"]').val(CKEDITOR.instances.editor.getData());
        },
        end: function(){
            $("#addForm").get(0).reset();
            upl.reset()
            CKEDITOR.instances.editor.setData("");
            $("addModel").hide();
            table.ajax.reload( null, false );
        }});
        //新增
        $("#add").on('click', function(){
            upl.reset();
            CKEDITOR.instances.editor.setData('');
            $(".objectid").attr('name','')
            $('#addForm').data('bootstrapValidator').resetForm();
            $('#type').val('').select2();
            $("#addForm").attr('action', '/Cultivate/Course/Add').get(0).reset();
            $(".deleteFlag").attr('value','-1');

        });
        //编辑
        usertable.on('click', '.editBtn', function () {
            $('#addForm').data('bootstrapValidator').resetForm();
            $("#addModal").modal('toggle');
            $("#addForm").attr('action','/Cultivate/Course/Update')
            $(".objectid").attr('name','objectid')
            var objectid = $(this).attr("data-id");
            $.ajax({
                type: 'GET',
                url: ' /Cultivate/Course/Edit/' + objectid,
                dataType: 'json',
                success: function (data) {
                    $.each(data,function(ind,val){
                        var tar = $('input[name="'+ind+'"]');
                        if(tar.attr('type') != 'radio'){
                            tar.val(val)
                        }
                    });
                    upl.setData(data.pic);
                    CKEDITOR.instances.editor.setData(data.content);
                }
            })
        });
        //导出
        usertable.on('click','.exportBtn',function(){

            var objectid = $(this).attr('data-id');
            var target='/Cultivate/UserCultivate/Export/List/'+objectid;
            $(this).attr('href',target)

        });

    //报名情况
        var applyOption = {
            "bAutoWidth": true, //自动宽度
            "dom": '<"top">rt<"bottom"lp><"clear">',
            "serverSide": true,
            "bDestory": true,
            "info": false,
            "ordering": false,
            "lengthChange": false,
            "sPaginationType": "full_numbers",
            "ajax": {
                url: '/Cultivate/UserCultivate/Apply/All/List',
                data:function(d){
                    d.searchName= $('#searchName').val();
                },
                dataSrc: "result"
            },
            "aoColumns": [{
                "sTitle": "课程名称",
                "data": "course.name"
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
                    html.push('<a class="operate infoBtn" data-toggle="modal" data-target="#applyModal" data-id=' + username + '>详情</a>');
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

        var applyTable = $("#applyTable");
        var apply= applyTable.DataTable(applyOption);

        //查询
        $('#searchBtn').on('click',function(){
            apply.ajax.reload();
        })
        //清除查询
        $('#clearBtn').on('click',function(){
            $('#searchName').val("")
            apply.ajax.reload();
        })
        $('#export').click(function() {
            var target = '/Cultivate/UserCultivate/Export/List/All';
            $(this).attr('href', target)
        })
        //详情
        applyTable.on('click', '.infoBtn', function() {
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
        applyTable.on('click','.deleteBtn', function(){

            var objectid = $(this).attr('data-id');

            $('#deleteBtn').click(function() {
                $.ajax({
                    type: 'GET',
                    url: '/Cultivate/UserCultivate/Delete/' + objectid,
                    dataType: 'json',
                    success: function (data) {
                        $('#deleteModal').modal('hide');
                        showAlert(data.msg);
                        apply.ajax.reload( null, false );
                    }
                })
            })

        })
    });
});
