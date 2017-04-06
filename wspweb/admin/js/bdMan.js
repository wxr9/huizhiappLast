require(['jqueryUpload','jquery', 'bootstrap', 'datatables','pm', 'ckeditor','cropper','bootstrapvalidator', 'select2'], function(jqueryUpload) {
    var dToption = {
        "bAutoWidth": true, //自动宽度
        "dom": '<"top"i>rt<"bottom"lp><"clear">',
        "serverSide": true,
        "bDestory": true,
        "info": false,
        "ordering": false,
        "lengthChange": false,
        "sPaginationType": "full_numbers",
        "sEmptyTable": "未查找到信息",
        "ajax": {
            url: '/Setting/LivingCenterAdver/List',
            dataSrc: "result"
        },
        "aoColumns": [{
            "sTitle": "标题",
            "data": "title"
        }, {
            "sTitle": "发布单位",
            "data": "merchant.name"
        },{
            "sTitle": '排序',
            "data": 'orderA'
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
            render: function (data, type, row) {
                var username = row.objectid;
                var html = [];
                html.push('<a class="operate editBtn" data-toggle="modal" data-target="#editModal"  data-id=' + username + '>编辑</a>')
                if (row.isBan === 1) {
                    html.push('<a class="operate operateBtn" data-id=' + username + ' data-deleteFlag="'+row.isBan+'">启用</a>');
                } else { //defalut 0
                    html.push('<a class="operate operateBtn" data-id=' + username + ' data-deleteFlag="'+row.isBan+'">禁用</a>');
                }
               // html.push('<a target="blank" href="/web/serviceCenter.html">预览</a>');
                return html.join('');
            },
            targets: 3
        }],
        //初始化结束
        "initComplete": function () {
            $('#activityPubList').width("100%");
        },
        //加载结束
        "drawCallback": function () {

        }

    }

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


        //清空新增
        // var upl = jqueryUpload({
        //     file : 'fileUpload',
        //     url : '/FileUpload/SimpleUploadFile',
        //     extData:{
        //         type: 'png'
        //     },
        //     name: 'imgUrl',
        //     fileName: 'file',
        //     statusName : 'success',
        //     preview: {
        //         prevUrl : '/',
        //         //target : jqueryDom,
        //     },
        //     path: 'response path data',
        //     success: function(data){
        //     },
        //     error: function(data){
        //
        //     }
        // });
        var imgSize = {width:450,height:150}
        $('.upload-box').bind('click',function(e){
            var target = e.target;
            var id = target.id;
            switch(id){
                case "fakeInput":
                    $('#input').trigger('click');
                    $('#uploadImg').removeClass('disabled');
                    break;
                case "uploadImg":
                    if(!$(target).hasClass('disabled')){
                        uploadImage($(target),function(){
                            $('#addForm').data('bootstrapValidator').updateStatus('imgUrl', 'VALID');
                            $('.image-box').hide();
                        });
                    }else{
                        $('.image-box').hide();
                    }
                    break;
            }
        });
        $('#input').bind('change',function(){
            if($(this).val() != ""){
                readImage($('#image'),imgSize);
                $('#realInput').val('');
                $('#addForm').data('bootstrapValidator').updateStatus('imgUrl', 'NOT_VALIDATED');
            }
        });


        var table = $("#memberTable").DataTable(dToption);
        var usertable = $("#memberTable")
        //禁用
        //启用
        usertable.on('click','.operateBtn',function(){
            var flag,objectid,content, submit;
            var deleteFlag = $(this).attr('data-deleteFlag');
            objectid = $(this).attr('data-id');

            if(deleteFlag == 1){
                flag = 2;
                submit = '启用';
            }else{
                flag = 1;
                submit = '禁用'
            }
            content = '是否' + submit + '？'
            var gt = getModal({
                title : '提示',
                content: content,
                callback : function(data){
                    $.ajax({
                        type: "post",
                        url: "/Setting/LivingCenterAdver/isBan/",
                        data:{
                            isBan:flag,
                            objectid: objectid
                        },
                        dataType: "json",
                        success: function(data) {
                            table.ajax.reload();
                            gt.modal('hide');
                        }
                    });
                },
                submit : submit,
                error : function(e){
                },
            })
        });

        //获取下拉列表？
        loadSelect({
            url:'/Setting/Merchant/List/0/0',
            target: '#type'
        })

        var fieldsList = {
            title: {
                validators: {
                    notEmpty: {
                        message: '标题不能为空'
                    },
                    stringLength: {
                        max: 50,
                        message: '限50个字符以内'
                    }
                }
            },
            orderA: {
                validators: {
                    notEmpty: {
                        message: '排序不能为空'
                    }
                }
            },
            imgUrl: {
                validators: {
                    notEmpty: {
                        message: '图片不能为空'
                    },
                }
            },
            merchantId: {
                validators: {
                    callback: {
                        callback: function (value, validator) {
                            if (value == 0) {
                                return {
                                    valid: false,
                                    message: '请选择发布单位'
                                }
                            }
                            return true;
                        }
                    }
                }
            },
            isShow: {
                validators: {
                    callback: {
                        callback: function (value, validator) {
                            if (value == 0) {
                                return {
                                    valid: false,
                                    message: '请选择是否跳转'
                                }
                            }
                            return true;
                        }
                    }
                }
            },
        }
        
        //初始化验证
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
            $('input[name=isBan]').val('2')
            CKEDITOR.instances.editor.setData('');
            $(".objectid").attr('name','')
            $('#addForm').data('bootstrapValidator').resetForm();
            $('#type').val('').select2();
            $("#addForm").attr('action', '/Setting/LivingCenterAdver/Add').get(0).reset()
            // upl.reset();
            $('#image').cropper('destroy');
            initCropper($('#image'),imgSize);
            $('.image-box').hide();
        })



        //编辑
        usertable.on('click', '.editBtn', function () {
            $('#addForm').data('bootstrapValidator').resetForm();
            $('input[name=isBan]').val('2');
            $("#addModal").modal('toggle');
            $("#addForm").attr('action','/Setting/LivingCenterAdver/Update')
            $(".objectid").attr('name','objectid')
            var objectid = $(this).attr("data-id");
            $('input[name="isShow"]').removeAttr('checked');
            $.ajax({
                type: 'GET',
                url: '/Setting/LivingCenterAdver/Edit/' + objectid,
                dataType: 'json',
                success: function (data) {

                    $.each(data,function(ind,val){
                        var tar = $('input[name="'+ind+'"]');
                        if(tar.attr('type') != 'radio'){
                            tar.val(val)
                        }
                    });
                    $('input[name=isShow]').each(function(){
                        if($(this).val()==data.isShow){
                            this.checked = true;
                        }
                    })
                    $('#type').val(data.merchantId).select2();
                    // upl.setData(data.imgUrl);
                    $('#image').cropper('destroy');
                    initCropper($('#image'),imgSize);
                    $('.image-box').show();
                    $('#image').cropper('replace','/'+ data.imgUrl);
                    $('#addForm').data('bootstrapValidator').updateStatus('imgUrl', 'VALID');
                    CKEDITOR.instances.editor.setData(data.content);
                }
            })
        });
    })

});


