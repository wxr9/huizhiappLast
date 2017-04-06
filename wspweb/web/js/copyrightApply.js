/**
 * Created by Administrator on 2016/4/5.
 */

require(['jqueryUpload','jquery', 'bootstrap','pm','bootstrapvalidator','select2','raty'], function(jqueryUpload){
    $(function(){
        var objectid=queryString("objectid");
        if(objectid==undefined){
            checkInfo();
            //设置文本字段值
            getUserInfo(function(user){
                //姓名
                $("input[name='chineseName']").val(user.realName);
                //邮箱
                $("input[name='email']").val(user.email);
                //公司
                if (user.enterprise == null) {
                    $('input[name="company"]').val(user.enterpriseInput || "");
                } else {
                    $('input[name="company"]').val(user.enterprise.name || "");
                }
                //联系方式
                $("input[name='phone']").val(user.phone);
            })
        }
        //须知
        $.ajax({
            type: 'GET',
            url: '/Setting/Readme/Type/Edit?type=userCopyright',
            dataType: 'json',
            async: false,
            success: function (result) {
                //须知
                $("#notice").html(result.content);
                if(result.isRead==-1){
                    $('.read').remove();
                }
            }
        });
        // 验证字段
        var validatorFields = {
            chineseName:{
                validators: {
                    stringLength: {
                        min: 0,
                        max: 20,
                        message: '限20字以内'
                    },
                    regexp: {
                        regexp:/^(([\u4e00-\u9fa5]|[a-zA-Z0-9])+)$/,
                        message:  '请勿输入特殊字符'
                    }
                }
            },
            email: {
                validators: {
                    notEmpty: {
                        message: '邮箱不能为空'
                    },
                    stringLength: {
                        min:0,
                        max:50,
                        message: '邮箱总长度请不要超过50字符'
                    },
                    regexp: {
                        regexp:/^[a-zA-Z0-9][a-zA-Z0-9_]{2,16}@([a-zA-Z0-9-.])*[a-zA-Z0-9]{2,3}$/,
                        message:  '请输入正确格式的邮箱'
                    }
                }
            },
            company: {
                validators: {
                    stringLength: {
                        min: 0,
                        max: 100,
                        message: '限100字以内'
                    },
                    regexp: {
                        regexp:/^(([\u4e00-\u9fa5]|[a-zA-Z0-9\(\)\（\）])+)$/,
                        message:  '请勿输入特殊字符'
                    }
                }
            },
            phone: {
                validators: {
                    regexp: {
                        regexp: /^[0-9]{11}$/,
                        message: '请输入11位手机号'
                    }
                }
            },
            applyForm: {
                validators: {
                    notEmpty: {
                        message: '申请表不能为空'
                    }
                }
            },
            copyrightBusinessTypeId:{
                validators: {
                    callback: {
                        callback: function (value, validator) {
                            if (value == 0) {
                                return {
                                    valid: false,
                                    message: '请选择业务类型'
                                }
                            }
                            return true;
                        }
                    }
                }
            },
            copyrightTypeId:{
                validators: {
                    callback: {
                        callback: function (value, validator) {
                            if (value == 0) {
                                return {
                                    valid: false,
                                    message: '请选择申请类别'
                                }
                            }
                            return true;
                        }
                    }
                }
            },

            copyrightUnit: {
                validators: {
                    notEmpty: {
                        message: '申请单位不能为空'
                    }
                }
            },
            periodId: {
                validators: {
                    callback: {
                        callback: function (value, validator) {
                            if (value == 0) {
                                return {
                                    valid: false,
                                    message: '请选择登记周期'
                                }
                            }
                            return true;
                        }
                    }
                }
            },
            softName: {
                validators: {
                    notEmpty:{
                        message:'软件名称不能为空'
                    },
                    stringLength: {
                        min:0,
                        max:50,
                        message: '软件名称请不要超过50字'
                    }
                }
            },
            softAbbreviation: {
                validators: {
                    stringLength: {
                        min:0,
                        max:50,
                        message: '软件简称请不要超过50字'
                    }
                }
            },
            softVersion: {
                validators: {
                    notEmpty:{
                        message:'版本号不能为空'
                    },
                    stringLength: {
                        min:0,
                        max:50,
                        message: '版本号请不要超过50字'
                    }
                }
            },

        }



        //上传附件

        var file1=jqueryUpload({
            file : 'applyForm',
            url : '/FileUpload/SimpleUploadDocFile',
            extData:{
                type: ".doc,.docx,.xls,.xlsx,.pdf,.html,.zip,.rar,.7z,.iso"
            },
            name: 'applyForm',
            fileName: 'file',
            statusName : 'success',
            //path: 'response path data',
            success: function(data){
            },
            error: function(data){
            }
        })


        var file2=jqueryUpload({
            file : 'material',
            url : '/FileUpload/SimpleUploadDocFile',
            extData:{
                type: ".doc,.docx,.xls,.xlsx,.pdf,.html,.zip,.rar,.7z,.iso"
            },
            name: 'material',
            fileName: 'file',
            statusName : 'success',
            //path: 'response path data',
            success: function(data){
            },
            error: function(data){

            }
        })


        $('#form').attr('action','/Copyright/UserCopyright/Add');
        // 初始化表单验证
        initBootstrapValidator(validatorFields,{
            end:function(result){
                if(result.success == true){
                    setTimeout(function(){
                        window.location.href = '/web/myWiz.html';
                    },3000)
                }
                $('button').attr('disabled','disabled');
            }
        });

        //获取申请类别
        getCopyTypeIds($('#copyrightTypeId'))

        function getCopyTypeIds(selector,id){
            $.ajax({
                type:"GET",
                url: "/Setting/SettingDict/0/0?type=copyrightType",
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
            })
        }

        //获取登记周期
        getDicts($('#periodId'))

        function getDicts(selector,id){
            $.ajax({
                type:"GET",
                url: "/Setting/SettingDict/0/0?type=period",
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
            })
        }
        //获取业务类型
        getopyrightBusinessTypes($('#copyrightBusinessTypeId'))

        function getopyrightBusinessTypes(selector,id){
            $.ajax({
                type:"GET",
                url: "/Setting/SettingDict/0/0?type=copyrightBusinessType",
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
            })
        }
        if(objectid!=undefined) {
            $.ajax({
                type: 'GET',
                url: '/Copyright/UserCopyright/Edit/' + objectid,
                dataType: 'json',
                success: function (data) {
                    var option1 = {
                        selector: $('#copyrightBusinessTypeId'),
                        type: 'copyrightBusinessType',
                        id: data.copyrightBusinessTypeId,
                        cb: function () {
                            $('#copyrightBusinessTypeId').attr('disabled', 'true');
                        }
                    };
                    getDict(option1);
                    var option2 = {
                        selector: $('#copyrightTypeId'),
                        type: 'copyrightType',
                        id: data.copyrightTypeId,
                        cb: function () {
                            $('#copyrightTypeId').attr('disabled', 'true');
                        }
                    };
                    getDict(option2);
                    var option3 = {
                        selector: $('#periodId'),
                        type: 'period',
                        id: data.periodId,
                        cb: function () {
                            $('#periodId').attr('disabled', 'true');
                        }
                    };
                    getDict(option3);

                    $.each(data, function (ind, val) {
                        var tar = $('input[name="' + ind + '"]');
                        if (tar.attr('type') != 'radio') {
                            tar.val(val)
                        }

                    });

                    $.each(data, function (ind, val) {
                        var tar = $('textarea[name="' + ind + '"]');
                        if (tar.attr('type') != 'radio') {
                            tar.val(val)
                        }
                    });
                    file1.setData(data.applyForm, 'hide');
                    file2.setData(data.material, 'hide');
                    //$('#copyrightBusinessTypeId').val(data.copyrightBusinessTypeId).select2();
                    $('#applyForm input').attr('readonly', 'true');
                    $('textarea').attr('readonly', true);
                    $('input').attr('readonly', true);
                    $('button').attr('disabled', 'disabled');
                    $('input[name=mustRead]').attr('checked', 'checked');
                }
            })
            getCommentInfo(objectid,'userCopyright');
            $('#notice').hide();
            $('.read').hide();
        }
    })

})