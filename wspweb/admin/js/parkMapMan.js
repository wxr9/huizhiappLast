/**
 * Created by Administrator on 2016/3/30.
 */
require(['jqueryUpload','jquery', 'bootstrap', 'datatables','pm','select2','bootstrapvalidator', 'ckeditor'],function(jqueryUpload){
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
            url: '/House/List',
            dataSrc: "result"
        },
        "aoColumns": [{
            "sTitle": "名称",
            "data": "name"
        }, {
            "sTitle": '园区',
            "data": 'address'
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
                html.push('<a class="operate infoBtn" data-toggle="modal" data-target="#infoModal" data-id=' + username + '>查看详情</a>');
                html.push('<a class="operate editBtn" data-toggle="modal" data-target="#editModal"  data-id=' + username + '>编辑</a>');
                html.push('<a class="operate deleteBtn"data-toggle="modal" data-target="#deleteBtn"  data-id=' + username + '>删除</a>');
                return html.join('');
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
        //详情
        usertable.on('click', '.infoBtn', function() {
            var objectid = $(this).attr("data-id");
            $.ajax({
                type: "GET",
                url: "/House/Edit/" + objectid,
                dataType: "json",
                success: function(data) {
                    var html = [];
                    upl.setData(data.pic);
                    html.push("<tr><td>名称:</td><td>"+data.name+"</td></tr>");
                    html.push("<tr><td>园区图片:</td><td><img src='/"+data.pic+"'/></td></tr>");
                    html.push("<tr><td>园区地址:</td><td>"+data.address+"</td></tr>");
                    html.push("<tr><td>园区简介:</td><td>"+data.content+"</td></tr>");
                    $("#parkInfo").empty().append(html.join(""));
                }
            });
        });

        //删除
        usertable.on('click','.deleteBtn', function(){
            $('#deleteModal').modal('toggle');
            var objectid = $(this).attr('data-id');
            $('#disableCfm').click(function() {
                $.ajax({
                    type: 'GET',
                    url: '/House/Delete/' + objectid,
                    dataType: 'json',
                    //success: function (data) {
                    //    $('#deleteModal').modal('toggle');
                    //    showAlert(data.msg);
                    //}
                    success: function(data) {

                        $("#deleteModal").modal('hide');
                        table.ajax.reload( null, false );
                    }

                })
            })
            table.ajax.reload( null, false );

        })

        //新增验证&&提交更新
        var fieldsList = {
            name: {
                validators:{
                    notEmpty: {
                        message: '园区名称不能为空'
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
                        message: '园区图片不能为空'
                    },
                }
            },
            address: {
                validators:{
                    notEmpty: {
                        message: '园区地址不能为空'
                    },
                    stringLength: {
                        max: 50,
                        message: '限50个字符以内'
                    }
                }
            }
        }
        var upl=jqueryUpload({
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

        ////清空验证
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
            $("#addForm").attr('action', '/House/Add').get(0).reset()
            upl.reset();
            table.ajax.reload( null, false );
        })


        //编辑
        usertable.on('click', '.editBtn', function () {
            $('#addForm').data('bootstrapValidator').resetForm();
            $("#addModal").modal('toggle');
            $("#addForm").attr('action','/House/Update')
            $(".objectid").attr('name','objectid')
            var objectid = $(this).attr("data-id");
            $.ajax({
                type: 'GET',
                url: '/House/Edit/' + objectid,
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
        table.ajax.reload( null, false );
    })

});


