/** Created by iris on 16/4/6.*/
require(['jquery', 'bootstrap','select2','bootstrapvalidator','pm','jqueryUpload'], function(){
    $(function(){
        var objectid=queryString("objectid");
        var applyFile;
        var materialFile;
        var file1;
        var file2;
        $.ajax({
            type: 'GET',
            url: '/Setting/Readme/Type/Edit?type=userTestApplyfor',
            dataType: 'json',
            success: function (result) {
                //须知
                $("#notice").html(result.content);
                if(result.isRead==-1){
                    $('.read').remove();
                }
            }
            //success: function (data) {
            //    if (data.content != undefined) {
            //        $('#noticeContent').empty().append(data.content);
            //    } else {
            //        $('#noticeContent').empty().append('暂无用户须知');
            //    }
            //
            //}
        });
        if(objectid==undefined) {
            checkInfo();
            //获取个人信息
            getUserInfo(function (user) {
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


            //价格
            $.ajax({
                type: 'get',
                url: '/TestApplyfor/UserTestApplyforConfig/Edit/1',
                success: function (data) {
                    $('#testPrice').append(data.content || "");
                }

            });


            // 验证字段
            var validatorFields = {
                chineseName:{
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
                phone: {
                    validators: {
                        regexp: {
                            regexp:/^1[0-9]{10}$/,
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
                softName: {
                    validators: {
                        stringLength: {
                            min: 1,
                            max: 50,
                            message: '限50字以内'
                        },
                        notEmpty: {
                            message: '软件名称不能为空'
                        }
                    }
                },
                softVersion: {
                    validators: {
                        stringLength: {
                            min: 1,
                            max: 50,
                            message: '限50字以内'
                        },
                        notEmpty: {
                            message: '版本号不能为空'
                        }
                    }
                },
                softAbbreviation: {
                    validators: {
                        stringLength: {
                            max: 50,
                            message: '限50字以内'
                        }
                    }
                },
                organizers: {
                    validators: {
                        notEmpty: {
                            message: '送测单位不能为空'
                        },
                        stringLength: {
                            max: 50,
                            message: '限50字以内'
                        }
                    }
                },
                testTypeId: {
                    validators: {
                        notEmpty: {
                            message: '测试类别不能为空'
                        }
                    }
                },
                content: {
                    validators: {
                        notEmpty: {
                            message: '需求说明不能为空'
                        }
                    }
                },
                applyForm: {
                    validators: {
                        notEmpty: {
                            message: '申请表不能为空'
                        }
                    }
                }
            };
            //测试类别
            var options = {
                selector: $('#testType'),
                type: 'testType'
            };
            getDict(options);

            //文件上传
            require(['jqueryUpload'], function (UploadImg) {
                 file1 =UploadImg({
                    file: 'apply',
                    url: '/FileUpload/SimpleUploadDocFile',
                    extData: {
                        type: ".doc,.docx,.xls,.xlsx,.pdf,.html,.zip,.rar,.7z,.iso",
                        typeSize: '10'
                    },
                    fileName: 'file',
                    name: 'applyForm',
                    loadingImg: '/lib/images/loading.gif',
                    validatorImg: '/lib/images/validator.png',
                    path: 'response path data',
                    statusName: 'success',
                    success: function (data) {
                        showAlert('上传成功');
                    },
                    error: function (data) {
                        showAlert('上传失败');
                    }
                })
            });
            require(['jqueryUpload'], function (UploadImg) {
                file2 =UploadImg({
                    file: 'material',
                    url: '/FileUpload/SimpleUploadDocFile',
                    extData: {
                        type:".doc,.docx,.xls,.xlsx,.pdf,.html,.zip,.rar,.7z,.iso",
                        typeSize: '20'
                    },
                    fileName: 'file',
                    name: 'material',
                    loadingImg: '/lib/images/loading.gif',
                    validatorImg: '/lib/images/validator.png',
                    path: 'response path data',
                    statusName: 'success',
                    success: function (data) {
                        showAlert('上传成功');
                    },
                    error: function (data) {
                        showAlert('上传失败');
                    }
                })
            });
            // 初始化表单验证
            $('#applyForm').attr('action', '/TestApplyfor/UserTestApplyfor/Add');


            $('#applyForm').bootstrapValidator({
                    message: 'This value is not valid.',
                    excluded: [':disabled'],
                    feedbackIcons: {
                        valid: '',
                        invalid: '',
                        validating: ''
                    },

                    fields: validatorFields
                })
                .on('success.form.bv', function (e) {
                    // Prevent form submission
                    e.preventDefault();
                    // Get the form instance
                    var $form = $(e.target),
                        validator = $form.data('bootstrapValidator'),
                        submitButton = validator.getSubmitButton();
                    var isRead  = $('#mustRead');
                    if(isRead.length > 0 && isRead.eq(0).is(':checked') == false) {
                        showAlert('请阅读用户须知');
                        isRead.eq(0).focus();
                        isRead.on('click', function(){
                            $form.find('button.submit').removeAttr('disabled');
                        });
                        return false;
                    }
                    //$form.find('button.submit').removeAttr('disabled');
                    $('#testBtn').attr('disabled','disabled');
                    // Get the BootstrapValidator instance
                    // 转义特殊字符，防止js注入
                    checkJsInject();
                    var bv = $form.data('bootstrapValidator');
                    // Use Ajax to submit form data
                    $.ajax({
                        type: 'POST',
                        url: $form.attr('action'),
                        data: $form.serialize(),
                        dataType: 'json',
                        async: true,
                        success: function (result) {
                            if (result.success == false) {
                                showAlert(result.msg, 'warn')
                            } else {
                                showAlert(result.msg, 'success');
                                setTimeout(function(){window.location.href='/web/myWiz.html'}, 3000);
                            }
                        }
                    });

                })
        //详情页面
        if(objectid!=undefined){
            //去掉须知
            $('#mustRead').parent().parent().hide();
            $('#notice').hide();

            $.ajax({
                type: 'GET',
                url: '/TestApplyfor/UserTestApplyfor/Edit/' + objectid,
                dataType: 'json',
                success: function (data) {
                    var options = {
                        selector: $('#testType'),
                        type: 'testType',
                        id: data.testTypeId,
                        cb:function(){
                            $('#testType').attr('disabled','true');
                        }
                    };
                    getDict(options);
                    $.each(data,function(ind,val){
                        var tar = $('input[name="'+ind+'"]');
                        if(tar.attr('type') != 'radio'){
                            tar.val(val)
                        }
                    });

                    $.each(data,function(ind,val){
                        var tar = $('textarea[name="'+ind+'"]');
                        if(tar.attr('type') != 'radio'){
                            tar.val(val)
                        }
                    });

                    //附件
                    file1.setData(data.applyForm,'hide');
                    file2.setData(data.material,'hide');
                    //$('#copyrightBusinessTypeId').val(data.copyrightBusinessTypeId).select2();
                    $('#applyForm input').attr('readonly','true');
                    $('textarea').attr('readonly',true);
                    $('input').attr('readonly',true);
                    $('button').attr('disabled','disabled');
                    $('input[name=mustRead]').attr('checked','checked');
                    //var txtUrl=$('#apply').val()
                    //$('#apply').parent().empty().html('<a href="'+txtUrl+'">浏览文件</a>')
                    //if(data.applyFile != undefined)
                    //    applyFile.setData(data.applyForm);
                    //if(data.material != undefined)
                    //    materialFile.setData(data.material);

                }
            })
            getCommentInfo(objectid,'userTestApplyfor');
            //$('input').attr('readonly',true);
            //$('textarea').attr('readonly',true);
            //$('button').attr('disabled','disabled');
            //$('input[type=checkbox]').attr('checked','checked');
                  }
    })

});

