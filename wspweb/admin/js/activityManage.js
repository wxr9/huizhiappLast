require(['jqueryUpload','jquery', 'bootstrap', 'datatables','pm', 'ckeditor','cropper','bootstrapvalidator', 'select2', 'datepicker'], function(jqueryUpload) {
    var dToption = {
        "bAutoWidth": true, //自动宽度
        "dom": '<"top">rt<"bottom"lp><"clear">',
        "serverSide": true,
        "bDestory": true,
        "info": false,
        "ordering": false,
        "lengthChange": false,
        "sPaginationType": "full_numbers",
        "sEmptyTable": "未查找到信息",
        "ajax": {
            url: '/ActivityCenter/ActivityMain/List',
            data:function(d){
                d.title = $('#userName').val();
            },
            dataSrc: "result"
        },
        "aoColumns": [{
            "sTitle": "活动名称",
            "data": "title"
        }, {
            "sTitle": "时间",
            "data": "startTime"
        },{
            "sTitle": '地址',
            "data": 'address'
        },{
            "sTitle": "类别",
            "data": "mType.name"
        },{
            "sTitle": "是否需要登陆后可查看",
            "data": "needLogin"
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
            },
        },
        "columnDefs": [
            {
               targets:0,
                width:'250px'
            },{
                targets:2,
                width:'250px'
            },
            {
                targets:4,
                render:function(data, type, row){
                    return row.needLogin == 1 ? "是" : "否";
                }
            },
            {
                render: function (data, type, row) {
                var username = row.objectid;
                var html = [];
                    var link = row.details;
                html.push('<a class="operate editBtn" data-toggle="modal" data-target="#editModal"  data-id=' + username + '>编辑</a>')
                if (row.isBan === 1) {
                    html.push('<a class="operate operateBtn" data-id=' + username + ' data-deleteFlag="'+row.isBan+'">禁用</a>');
                } else { //defalut 0
                    html.push('<a class="operate operateBtn" data-id=' + username + ' data-deleteFlag="'+row.isBan+'">启用</a>');
                }
                 if(link !=""){
                     html.push('<a target="_blank" href="'+row.details+'" >详情 </a>');
                 }else{
                     html.push('<a target="_blank" href="/web/activity/activityDetail.html?objectid='+row.objectid+'" >详情 </a>');
                 }
                html.push('<a class="operate leadBtn" target="_blank" data-id="'+username+'" data-toggle="modal" data-target="#leadModal" >导入 </a>');
                return html.join('');
            },
            targets: 5
        }],
        //初始化结束
        "initComplete": function () {
            $('#activityPubList').width("100%");
        },
        //加载结束
        "drawCallback": function () {

        }

    }
    //查询
    var table = $("#businessTable").DataTable(dToption);
    $('#searchBtn').on('click',function(){
        table.ajax.reload();
    })
    $('#publish').click(function(){
        publish();
    })
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

        // var upl = jqueryUpload({
        //     file : 'fileUpload',
        //     url : '/FileUpload/SimpleUploadFile',
        //     extData:{
        //         type: 'png'
        //     },
        //     name: 'image',
        //     fileName: 'file',
        //     statusName : 'success',
        //     preview: {
        //         prevUrl : '/',
        //         //target : jqueryDom,
        //     },
        //     path: 'response path data',
        //     success: function(data){
        //
        //     },
        //     error: function(data){
        //
        //     }
        // });
        //图片
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
                            $('#addForm').data('bootstrapValidator').updateStatus('image', 'VALID');
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
                readImage();
                $('#realInput').val('');
                $('#addForm').data('bootstrapValidator').updateStatus('image', 'NOT_VALIDATED');
            }
        });

        var usertable = $("#businessTable")
        //禁用
        //启用
        usertable.on('click','.operateBtn',function(){
            var flag,objectid,content, submit;
            var deleteFlag = $(this).attr('data-deleteFlag');
            objectid = $(this).attr('data-id');

            if(deleteFlag == 1){
                flag = 2;
                submit = '禁用';
            }else{
                flag = 1;
                submit = '启用'
            }
            content = '是否' + submit + '？'
            var gt = getModal({
                title : '提示',
                content: content,
                callback : function(data){
                    $.ajax({
                        type: "post",
                        url: "/ActivityCenter/ActivityMain/BanSet",
                        data:{
                            isBan:flag,
                            objectId: objectid
                        },
                        dataType: "json",
                        success: function(data) {
                            table.ajax.reload( null, false );
                            gt.modal('hide');
                        }
                    });
                },
                submit : submit,
                error : function(e){
                },
            })
        });

        var fieldsList = {
            title: {
                validators:{
                    notEmpty: {
                        message: '活动名称不能为空'
                    },
                    stringLength: {
                        max: 50,
                        message: '限50个字符以内'
                    }
                }
            },
            image: {
                validators:{
                    notEmpty: {
                        message: '请上传图片'
                    }
                }
            },
            startTime: {
                validators:{
                    notEmpty: {
                        message: '活动时间不能为空'
                    },
                }
            },
            address: {
                validators:{
                    notEmpty: {
                        message: '地址不能为空'
                    }
                }
            },
            type: {
                validators: {
                    callback: {
                        callback: function (value, validator) {
                            if (value == 0) {
                                return {
                                    valid: false,
                                    message: '请选择类别'
                                }
                            }
                            return true;
                        }
                    }
                }
            },
            //details: {
            //    validators:{
            //        notEmpty: {
            //            message: '地址连接不能为空'
            //        },
            //    }
            //}
        }
        //选择时间
        $(".form_datetime")
            .datetimepicker({
                format: "yyyy/mm/dd hh:ii:00",
                autoclose: true,
                todayBtn: true,
                pickerPosition: "bottom-left",
                minView: 0,
                forceParse: false,
                startDate: new Date()
            })
            .on('change', function(e) {
                $('#addForm')
                // Get the bootstrapValidator instance
                    .data('bootstrapValidator')
                    // Mark the field as not validated, so it'll be re-validated when the user change date
                    .updateStatus('startTime', 'NOT_VALIDATED', null)
                    // Validate the field
                    .validateField('startTime')
            });
        //时间
        var mydate = new Date();
        var year=mydate.getFullYear(); //获取完整的年份(4位,1970-????)
        var month=(mydate.getMonth()+1)<10?'0'+(mydate.getMonth()+1):(mydate.getMonth()+1); //获取当前月份(0-11,0代表1月)
        var day=mydate.getDate()<10?'0'+mydate.getDate():mydate.getDate(); //获取当前日(1-31)
        var hour=mydate.getHours()<10?'0'+mydate.getHours():mydate.getHours(); //获取当前小时数(0-23)
        var minute=mydate.getMinutes()<10?'0'+mydate.getMinutes():mydate.getMinutes(); //获取当前分钟数(0-59)
        var time=year+'/'+month+'/'+day+' '+hour+':'+minute+':00';
        //初始化验证
        initBootstrapValidator(fieldsList, {
            prev: function(){
               $('textarea[name="richText"]').val(CKEDITOR.instances.editor.getData());
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
            $("#addForm").attr('action', '/ActivityCenter/ActivityMain/Add').get(0).reset();
            $('input[name=startTime]').val(time);
            $('input[name=isBan]').val('1');
            $('#image').cropper('destroy');
            initCropper($('#image'));
            $('.image-box').hide();
            $('input[type="radio"]:last-child').attr('checked');
        })


        //编辑
        usertable.on('click', '.editBtn', function () {
            $("#addModal").modal('show');
            $('#addForm').data('bootstrapValidator').resetForm();
            $("#addForm").attr('action','/ActivityCenter/ActivityMain/Update');
            $(".objectid").attr('name','objectid');
            $('input[type="radio"]').removeAttr('checked');
            var objectid = $(this).attr("data-id");
            $.ajax({
                type: 'GET',
                url: '/ActivityCenter/ActivityMain/Edit/' + objectid,
                dataType: 'json',
                success: function (data) {
                    $.each(data,function(ind,val){
                        var tar = $('input[name="'+ind+'"]');
                        if(tar.attr('type') != 'radio'){
                            tar.val(val)
                        }

                    });
                    CKEDITOR.instances.editor.setData(data.richText);
                    $('input[type="radio"]').get(parseInt(data.needLogin)-1).checked = true;
                    var options = {
                        selector: $('#type'),
                        type: 'activityType',
                        id: data.type
                    };
                    getDict(options);

                    $('input[name="isShow"]').eq(data.isShow+1).attr("checked",'checked');

                    // upl.setData(data.image);
                    $('#image').cropper('destroy');
                    initCropper($('#image'));
                    $('.image-box').show();
                    $('#image').cropper('replace','/'+data.image);
                    $('#addForm').data('bootstrapValidator').updateStatus('image', 'VALID');
                }
            })
        });
        $('#addModal').on("shown.bs.modal",function(){
            $('#addForm').data('bootstrapValidator').resetForm();
        });
        //导入
        var objectid;
        usertable.on('click', '.leadBtn', function () {
            $('.uploadHBox').hide();
            objectid = $(this).attr("data-id");
            jqueryUpload({
                file : 'fileUpload1',
                url : '/ActivityCenter/ActivityApply/ExcelImport',
                extData:{
                    type: 'xlsx',
                    objectid:objectid
                },
                name: 'file',
                fileName: 'file',
                statusName : 'success',
                //path: 'response path data',
                success: function(data){
                },
                error: function(data){
                    showAlert('数据格式错误')
                }
            });
        });

        getType($("#type"));
        //获取类型
        function getType(selector,id){
            $.ajax({
                type:"GET",
                url: "/Setting/SettingDict/0/0/?type=activityType",
                dataType:'json',
                success: function(data){

                    var options = [];
                    var List = data.result;
                    if(List==null){
                        showAlert('没有类别');
                    }else{
                        options.push("<option value='0' selected></option>")
                        for(var i=0,len=List.length; i<len; i++){
                            options.push("<option value=\'"+ List[i].objectid +"\'>"+List[i].name+"</option>");
                        }
                        selector.empty().append(options.join(""));
                        if(id){
                            selector.val(id).select2();
                        }else{
                            var d = selector.children().eq(0).val();
                            selector.val("value", d);
                            selector.val(d).select2();
                        }
                    }
                }
            })
        }

        //清除查询
        $('#clearBtn').on('click',function(){
            $('#userName').val("");
            table.ajax.reload( null, false );
        })
    })

});


