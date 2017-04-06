require(['jquery', 'bootstrap','datepicker', 'datatables','pm','cropper','select2','bootstrapvalidator'], function() {
    $(function() {

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
                url: '/Setting/Merchant/History/List/1',
                dataSrc: "result"
            },
            "aoColumns": [{
                "sTitle": 'ID',
                "data": 'objectid'
            },{
                "sTitle": '提交时间',
                "data": 'createTime'
            },{
                "sTitle": '审核状态',
                "data": 'status'
            },{
                "sTitle": "审核说明",
                "data": "memo"
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
                    if(row.isCheck == 2){
                        html.push("已审核")
                    }else if(row.isCheck == 1){
                        html.push("待审核")
                    }else{//3
                        html.push("未通过")
                    }

                    return html.join('');
                },
                targets: 2
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
        var table = $("#businessTable").DataTable(dToption);

        $.ajax({
            type: 'GET',
            url: '/Setting/Merchant/GetMerchantCenterInfo',
            dataType: "json",
            success: function(data) {

                var objectid = data[0].objectid;
                getDate(objectid);
                table.ajax.url('/Setting/Merchant/History/List/'+objectid).load();
            }
        });
        //图片上传
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
                            $('#merchantInfo').data('bootstrapValidator').updateStatus('avar', 'VALID');
                            $('.image-box').hide();
                        });
                    }else{
                        $('.image-box').hide();
                    }
                    break;
            }
        });
        $('#input').bind('change',function(){
            if($(this).val() != "") {
                readImage();
                $('#realInput').val('');
                $('#merchantInfo').data('bootstrapValidator').updateStatus('avar', 'NOT_VALIDATED');
            }
        });
        // var showImg;
        // //图片上传
        // require(['jqueryUpload'], function(UploadImg) {
        //     showImg =UploadImg({
        //         file: 'photoUrl',
        //         url: '/FileUpload/SimpleUploadFile',
        //         extData: {
        //             type: 'png'
        //         },
        //         fileName: 'file',
        //         name:'avar',
        //         loadingImg: '/lib/images/loading.gif',
        //         validatorImg: '/lib/images/validator.png',
        //         path: 'response path data',
        //         statusName: 'success',
        //         preview: {
        //             prevUrl: '/'
        //         },
        //         success: function (data) {
        //             showAlert('上传成功');
        //         },
        //         error: function (data) {
        //             showAlert('上传失败');
        //         }
        //     })
        // })
        //商户类型字典public.js
        getTypeDict({ele:$('#type'),param:'-1',id:''});
        //如果商户类型有子类型,显示选择子类型
        $('#type').on('change',function(){
            if($(this).val() != ''){
                getTypeDict({ele:$('#typeChild'),param:$(this).val(),id:''});
            }
        });
        getDict({selector:$('#label'),type:'merchantClass'});
        //初始化园区选择
        getPark($('#park'));
        function getDate(objectid){
            $.ajax({
                type: "GET",
                url: "/Setting/Merchant/Edit/" + objectid,
                dataType: "json",
                success: function(data) {
                    if(data != undefined){

                        $('input[name="objectid"]').val(data.objectid);
                        $('input[name="name"]').val(data.name);
                        $('input[name="workStartTime"]').val(data.workStartTime);
                        $('input[name="workEndTime"]').val(data.workEndTime);


                        //商户类型及子类型选择
                        getTypeDict({ele:$('#type'),param:'-1',id:data.type, cb:function(){
                            if(data.isCheck == 1){
                                $('#type').select2('readonly',true);
                            }else
                                $('#type').select2('readonly',false);
                        }});
                        if(data.childType != 0){
                            $('#childBox').show();
                            getTypeDict({ele:$('#type'),param:data.type,id:data.childType, cb:function(){
                                $('#typeChild').select2();
                                if(data.isCheck == 1){
                                    $('#typeChild').select2('readonly',true);
                                }else{
                                    $('#typeChild').select2('readonly',false);
                                }

                            }});
                        }

                        //商户类型标签
                        var optionLabel = {
                            selector:$('#label'),
                            type:'merchantClass',
                            id:data.parkType,
                            cb:function(){
                                if(data.isCheck == 1){
                                    $('#label').select2('readonly',true);
                                }else
                                    $('#label').select2('readonly',false);
                            }
                        };
                        getDict(optionLabel);
                        //所属园区
                        getPark($('#park'),data.park,function(){
                            if(data.isCheck == 1){
                                $('#park').select2('readonly',true);
                            }else
                                $('#park').select2('readonly',false);
                        });

                        // $('.previewBox').append('<img src="/'+data.avar+'">');
                        $('input[name="address"]').val(data.address);
                        if(data.isInvite == 1){
                            $('input[name="isInvite"]').eq(0).attr('checked','checked');
                        }else{
                            $('input[name="isInvite"]').eq(1).attr('checked','checked');
                        }

                        $('input[name="phone"]').val(data.phone);
                        $('textarea[name="shortIntro"]').val(data.shortIntro);


                        //判断审核状态
                        if(data.isCheck == 1){//正在审核
                            // showImg.setData(data.avar,'png');
                            $('.upload-box').empty().height(240).append("<img width='360' height='240' src='/"+data.avar+"'/>");
                            $('#check').css('display','block');
                            $('#merchantInfo  input').attr('readonly','true');
                            $('textarea').attr('readonly','true');
                            $('.submit-box').css('display','none');
                            //不显示上传文件的按钮
                            // $('.uploadHBox').hide();
                        } else{
                            // $('.uploadHBox').show();
                            //读取图片
                            $('#image').cropper('destroy');
                            initCropper($('#image'));
                            $("#image").cropper('replace','/'+data.avar);
                            $('input[name="avar"]').val(data.avar);
                            $('#merchantInfo').data('bootstrapValidator').updateStatus('avar', 'VALID');

                            if(data.isCheck == 2){
                                //审核已通过
                                $('#check1').css('display','block');
                            }else{
                                //审核未通过
                                $('#check2').css('display','block');
                            }
                            $('#merchantInfo  input').removeAttr('readonly');
                            $('textarea').removeAttr('readonly');
                            $('.submit-box').css('display','block');
                        }
                    }




                }
            });

        }

        //选择营业时间
        $(".form_datetime")
            .datetimepicker({
                format: "hh:ii",
                autoclose: true,
                pickerPosition: "bottom-left",
                minView: 0,
                startView: 1,
                todayBtn:false
            });
        $('.table-condensed').children('thead').css({'visibility': 'hidden','height':0,'overflow':'hidden'})
            .find('th').css({'visibility':'hidden'}).find('span').css({'visibility':'hidden'});

        //新增验证&&提交更新
        var fieldsList = {
            name: {
                validators:{
                    notEmpty: {
                        message: '商户名称不能为空'
                    },
                    stringLength: {
                        max: 50,
                        message: '限50个字符以内'
                    }
                }
            },
            workStartTime: {
                validators: {
                    notEmpty: {
                        message: '开始时间不能为空'
                    }
                }
            },
            workEndTime: {
                validators: {
                    notEmpty: {
                        message: '结束时间不能为空'
                    }
                }
            },
            type: {
                validators:{
                    notEmpty: {
                        message: '商户类型不能为空'
                    }
                }
            },
            avar: {
                validators:{
                    notEmpty: {
                        message: '请上传图片'
                    }
                }
            },
            address: {
                validators:{
                    notEmpty: {
                        message: '地址不能为空'
                    },
                    stringLength: {
                        max: 100,
                        message: '限100个字符以内'
                    }
                }
            },
            park: {
                validators:{
                    notEmpty: {
                        message: '所属园区不能为空'
                    }
                }
            },
            parkType: {
                validators:{
                    notEmpty: {
                        message: '商户类型标签不能为空'
                    }
                }
            },
            phone: {
                validators:{
                    notEmpty: {
                        message: '联系方式不能为空'
                    }
                }
            },
            shortIntro: {
                validators:{
                    stringLength: {
                        max: 200,
                        message: '限200个字符以内'
                    }
                }
            }
        };

        $('#merchantInfo').attr('action','/Setting/Merchant/Update');
        //初始化验证

        initBootstrapValidator(fieldsList,function(){
            setTimeout(function(){
                window.location.reload();
            },3000)
        });


        //时间更改验证
        $('.form_datetime')
            .on('change', function(e) {
                $('#merchantInfo')
                // Get the bootstrapValidator instance
                    .data('bootstrapValidator')
                    // Mark the field as not validated, so it'll be re-validated when the user change date
                    .updateStatus('workStartTime', 'NOT_VALIDATED', null)
                    .updateStatus('workEndTime', 'NOT_VALIDATED', null)
                    // Validate the field
                    .validateField('workStartTime')
                    .validateField('workEndTime');
            });

        table.ajax.reload();
        function getPark(selector,id,cb){
            $.ajax({
                type:"GET",
                url: "/Setting/Park/0/0",
                dataType:'json',
                success: function(data){
                    var options = [];
                    var List = data.result;
                    options.push("<option value='' selected></option>")
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
            });
            cb ? cb() : "";
        }

        function getTypeDict(option){
            var param = option.param;
            var selector = option.ele;
            var id = option.id;
            var cb = option.cb;
            $.ajax({
                type:"GET",
                url: "/Setting/Merchant/GetMenuList/" + param,
                dataType:'json',
                success: function(data){
                    if(param != -1 && data!=''){
                        $('#childBox').show();
                    }else{
                        $('#childBox').hide();
                    }
                    if(data !=''){
                        var options = [];
                        var List = data;
                        options.push("<option value='' selected></option>");
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
            cb ? cb() : "";
        }

    });

});

