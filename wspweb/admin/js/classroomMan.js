/**
 * Created by Administrator on 2016/3/23.
 */
require(['jqueryUpload','jquery', 'bootstrap','ckeditor','datepicker', 'datatables','pm','select2','bootstrapvalidator'], function(jqueryUpload) {
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
            url: '/Classroom/Classroom/List',
            dataSrc: "result"
        },
        "aoColumns": [{
            "sTitle": "ID",
            "data": "objectid"
        }, {
            "sTitle": "教室名称",
            "data": "name"
        }, {
            "sTitle": '发布日期',
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
                var objectid = row.objectid;
                var username = $(this).attr('data-id');
                var html = [];
                if (row.deleteFlag == -1) {
                    html.push('<span>预订</span>');
                    html.push('<a class="operate resetBtn" target="_blank" objectid=' + objectid + ' href="/web/services/classroomDetail.html?objectid='+row.objectid+'">预览</a>');
                    html.push('<a class="operate enableBtn" objectid=' + objectid + '>启用</a>');
                } else { //defalut 1
                    html.push('<a class="operate infoBtn" href="/admin/classroomEdit.html?objectid='+objectid+'&name='+row.name+'">预订</a>');
                    html.push('<a class="operate resetBtn" target="_blank" objectid=' + objectid + ' href="/web/services/classroomDetail.html?objectid='+row.objectid+'">预览</a>');
                    html.push('<a class="operate disableBtn" objectid=' + objectid + '>禁用</a>');
                }
                html.push('<a class="operate editBtn" objectid=' + objectid + '>编辑</a>');
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

        var table = $("#classroomTable").DataTable(dToption);
        var usertable = $("#classroomTable");

        //禁用
        usertable.on('click','.disableBtn',function(){
            $("#disableModal").modal('show');
            var objectid = $(this).attr('objectid');
            var flag = -1;

            $("#disableModal").on('click', '#disableCfm', function() {
                $.ajax({
                    type: "GET",
                    url: "/Classroom/Classroom/Enable/Delete/" + objectid +'/'+ flag,
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
            var objectid = $(this).attr('objectid');
            var flag = 1;

            $("#enableModal").on('click', '#enableCfm', function() {
                $.ajax({
                    type: "GET",
                    url: "/Classroom/Classroom/Enable/Delete/" + objectid +'/'+ flag,
                    dataType: "json",
                    success: function(data) {
                        table.ajax.reload( null, false );
                        $("#enableModal").modal('hide');
                    }
                });
            });
        });

        //$("input[name='projector']").get(0).click()
        $("input[type='checkbox']").click(function () {
            if ($(this).is(':checked') == true) {
                $(this).val(1);
            } else {
                $(this).val(-1);
                //$("input[name='projector']").get(0).click()
            }
        })

        var fieldsList = {
            name: {
                validators: {
                    notEmpty: {
                        message: "教室名不能为空"
                    },
                    stringLength: {
                        min: 1,
                        max: 50,
                        message: '限50字以内'
                    }
                }
            },
            pic: {
                validators: {
                    notEmpty: {
                        message: '图片不能为空'
                    }
                }
            },
            location: {
                validators: {
                    notEmpty: {
                        message: "教室位置不能为空"
                    },
                    stringLength: {
                        min: 1,
                        max: 50,
                        message: '限50字以内'
                    }
                }
            },
            peoples: {
                validators: {
                    notEmpty: {
                        message: "可容纳人数不能为空"
                    },
                    regexp: {
                        regexp: /^\d+$/,
                        message: '请输入大于等于零的数字'
                    }
                }
            },
            price: {
                validators: {
                    notEmpty: {
                        message: '参考价格不能为空'
                    },
                }
            },

            area: {
                validators: {
                    notEmpty: {
                        message: '面积不能为空'
                    }
                }
            }
        }

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

        //富文本2
        var initSample = (function() {
            var wysiwygareaAvailable = isWysiwygareaAvailable(),
                isBBCodeBuiltIn = !!CKEDITOR.plugins.get('bbcode');
            return function() {
                var editorElement = CKEDITOR.document.getById('editor1');
                if (isBBCodeBuiltIn) {
                    editorElement.setHtml(
                        'Hello world!\n\n'
                    );
                }
                if (wysiwygareaAvailable) {
                    CKEDITOR.replace('editor1');
                } else {
                    editorElement.setAttribute('contenteditable', 'true');
                    CKEDITOR.inline('editor1');
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


        //图片上传
        var upl= jqueryUpload({
            file : 'pic',
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
        initBootstrapValidator(fieldsList, {
            prev: function(){
                $('textarea[name="content"]').val(CKEDITOR.instances.editor.getData());
                $('textarea[name="readme"]').val(CKEDITOR.instances.editor1.getData());
            },
            end: function(){
                $("addModel").hide();
                CKEDITOR.instances.editor.setData('');
                CKEDITOR.instances.editor1.setData('');
                table.ajax.reload( null, false );
            }});

        //新增
        $("#add").on('click', function(){
            CKEDITOR.instances.editor.setData('');
            CKEDITOR.instances.editor1.setData('');
            $('#addForm').data('bootstrapValidator').resetForm();
            $('#type').val('').select2();
            $("#addForm").attr('action', '/Classroom/Classroom/Add').get(0).reset()
            $('#objectid').attr('name','')
            upl.reset();
            $('input[type=checkbox]').attr('checked',false);
        })


        //编辑
        usertable.on('click', '.editBtn', function () {
            $("#addModal").modal('toggle');
            $('#addForm').data('bootstrapValidator').resetForm();
            $("#addForm").attr('action','/Classroom/Classroom/Update')
            //$('input[name=isRead]').attr("checked",false)
            //$('input[type=checkbox]').attr('checked',false);
            var objectid = $(this).attr("objectid");
            $('#objectid').attr('name','objectid')
            $.ajax({
                type: 'GET',
                url: '/Classroom/Classroom/Edit/' + objectid,
                dataType: 'json',
                success: function (data) {
                    $.each(data,function(ind,val){
                        var tar = $('input[name="'+ind+'"]');
                        if(tar.attr('type') != 'radio'){
                            tar.val(val)
                        }
                    });
                    $('#objectid').val(data.objectid);
                    $('input[name=isRead]').removeAttr('checked');
                    $('input[name=isRead]').each(function(){
                        if($(this).val()==data.isRead){
                            this.checked = true;
                        }
                    })
                    upl.setData(data.pic);
                    CKEDITOR.instances.editor.setData(data.content);
                    CKEDITOR.instances.editor1.setData(data.readme);
                    setCheckbox('microphone',data.microphone);
                    setCheckbox('projector',data.projector);
                    setCheckbox('computer',data.computer);
                    function setCheckbox(name,val){
                        var inputs=$('input[name='+name+']');
                        if(typeof(val)!='number'){
                            var radio=val.split(',');
                            inputs.each(function(){
                                for(var i=0;i<radio.length;i++){
                                    if($(this).val()==radio[i]){
                                        this.checked = true;
                                    }
                                }
                            })
                        }else{
                            if(val==1){
                                inputs[0].checked = true;
                            }else{
                                inputs[0].checked = false;
                            }
                        }
                    }
                }
            })
        });
    });
});
