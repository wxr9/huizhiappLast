/**
 * Created by z on 2016/10/27.
 */
require(['jquery','pm','bootstrapvalidator'], function(){
    $(function(){
        var objectid=queryString("objectid");
        var form = $('#form');
        //设置文本字段值
        if(objectid == undefined){
            checkInfo();
            getUserInfo(function(user){
                //姓名
                $("input[name='username']").val(user.username);
                //邮箱
                $("input[name='email']").val(user.email);
                //公司
                if (user.enterprise == null) {
                    $('input[name="company"]').val(user.enterpriseInput || "");
                } else {
                    $('input[name="company"]').val(user.enterprise.name || "");
                }
                //联系方式
                $("input[name='contact']").val(user.phone);
            })
        }

        //须知
        $.ajax({
            type: 'GET',
            url: '/Setting/Readme/Type/Edit?type=hzCardPersonApply',
            dataType: 'json',
            async: false,
            success: function (result) {
                //须知
                $("#notice").html(result.content);
                if(result.isRead==-1){
                    //$("#notice").hide();
                    $('.read').remove();
                }
            }
        });
        // 验证字段
        var validatorFields = {
            username:{
                validators: {
                    notEmpty: {
                        message: '申请人姓名不能为空'
                    },
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
            company: {
                validators: {
                    notEmpty: {
                        message: '公司名称不能为空'
                    },
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
            contact: {
                validators: {
                    notEmpty: {
                        message: '联系方式不能为空'
                    },
                    regexp: {
                        regexp:/^[0-9]{11}$/,
                        message:  '请输入11位手机号'
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
            realname:{
                validators: {
                    notEmpty: {
                        message: '真实姓名不能为空'
                    },
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
            idcard: {
                validators: {
                    notEmpty:{
                        message:'身份证号码不能为空'
                    },
                    regexp:{
                        regexp:/^\d{17}[\dXx]{1}$/,
                        message: '请填写18位身份证'
                    }
                }
            }

        }

        if(objectid!=undefined){
            $.ajax({
                type: 'GET',
                url: '/CardApply/Person/Edit/' + objectid,
                dataType: 'json',
                success: function (data) {
                    //read data
                    $.each(data,function(ind,val){
                        if(ind == 'mark'){
                            var value = val || "";
                            $('#suggest').val(value);
                        }else if(ind == 'getTime'){
                            var value = val || "";
                            $('#getTime').val(value);
                        }else{
                            $("input[name='"+ind+"']").val(val);
                        }
                    });
                    var status = data.status;
                    if(status == 2 || status == 3 || status == 4) {
                        $('.check').show();
                        if (status == 3) {
                            //can modify
                            form.append('<input type="hidden" name="id" value="' + data.id + '">');
                            form.attr('action', '/CardApply/Person/Update');
                            initBootstrapValidator(validatorFields, {
                                before: function () {
                                    var isRead = $('#mustRead');
                                    if (isRead.length > 0 && isRead.eq(0).is(':checked') == false) {
                                        showAlert('请阅读用户须知并同意');
                                        isRead.eq(0).focus();
                                        isRead.on('click', function () {
                                            form.find('button.submit').removeAttr('disabled');
                                        });
                                        return false;
                                    }
                                },
                                end: function (result) {
                                    $('#submit').attr('disabled', 'disabled');
                                    if (result.success == true) {
                                        setTimeout(function () {
                                            window.location.href = '/web/myWiz.html';
                                        }, 3000)
                                    }
                                }
                            });

                            $('#stop').on('click', function () {
                                $.ajax({
                                    method: "POST",
                                    url: '/CardApply/Person/Update',
                                    data: {
                                        "id": data.id,
                                        "status": 4
                                    },
                                    dataType: 'josn',
                                    success: function (result) {
                                        if (result.success) {
                                            showAlert(result.msg);
                                            setTimeout(function () {
                                                window.location.href = '/web/myWiz.html';
                                            }, 3000)
                                        } else {
                                            showAlert(result.msg, 'danger');
                                        }

                                    }
                                })
                            })
                        } else {
                            $('#form input').attr('readonly', 'true');
                            $('#submit').attr('disabled', 'disabled');
                            $('#stop').attr('disabled', 'disabled');
                        }
                    }else{
                        $('#form input').attr('readonly', 'true');
                        $('#submit').attr('disabled', 'disabled');
                        $('#stop').attr('disabled', 'disabled');
                    }
                }
            })
        }else{
            //新增
            $('#stop').css('display','none');
            form.attr('action','/CardApply/Person/Add');
            // 初始化表单验证`
            initBootstrapValidator(validatorFields,{
                alertMsg:'请阅读用户须知并同意',
                end:function(result){
                    $('#submit').attr('disabled','disabled');
                    if(result.success == true){
                        setTimeout(function(){
                            window.location.href = '/web/user/cardDetail.html';
                        },3000)
                    }
                }

            });

        }

    })



})