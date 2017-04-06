/** Created by iris on 16/4/6.*/
require(['jqueryUpload','jquery', 'bootstrap','datepicker','bootstrapvalidator','pm'], function(UploadImg){
    $(function(){
        $.ajax({
            type:'GET',
            url:'/Setting/Readme/Type/Edit?type=userCommercialize',
            dataType:'json',
            success:function(data){
                if(data.content != undefined){
                    $('#noticeContent').empty().append(data.content);
                }else{
                    $('#noticeContent').empty().append('广告服务暂无用户须知');
                }

            }
        })
        var objectid=queryString("objectid");
        var file1;
        if(objectid==undefined) {
            checkInfo();
            //$.ajax({
            //    type: 'get',
            //    url: '/Setting/User/MyInfo',
            //    success: function (data) {
            //        $('input[name="chineseName"]').val(data.realName || "");
            //        $('input[name="company"]').val(data.enterprise ? data.enterprise.name : "");
            //        $('input[name="email"]').val(data.email || "");
            //        $('input[name="phone"]').val(data.phone || "");
            //    }
            //
            //})
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
            // 验证字段
            var validatorFields = {
                chineseName:{
                    validators: {
                        notEmpty: {
                            message: '预约人姓名不能为空'
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
                            min: 1,
                            max: 100,
                            message: '限100字以内'
                        },
                        regexp: {
                            regexp:/^(([\u4e00-\u9fa5]|[a-zA-Z0-9\(\)\（\）])+)$/,
                            message:  '请勿输入特殊字符'
                        }
                    }
                },
                beginDate: {
                    validators: {
                        notEmpty: {
                            message: '开始时间不能为空'
                        }
                    }
                },
                endDate: {
                    validators: {
                        notEmpty: {
                            message: '结束时间不能为空'
                        },
                        callback:{
                            message:'结束时间必须不小于开始时间',
                            callback:function(fieldValue, validator){
                                var time = validator.getFieldElements('beginDate').val();
                                var start = new Date(time);
                                var end = new Date(fieldValue);
                                return end >= start;
                            }
                        }
                    }
                },
                phone: {
                    validators: {
                        notEmpty: {
                            message: '联系方式不能为空'
                        },
                        regexp: {
                            regexp: /^1[0-9]{10}$/,
                            message: '请输入11位手机号'
                        }
                    }
                },
                accessory: {
                    validators: {
                        notEmpty: {
                            message: '广告内容不能为空'
                        }
                    }
                },
                content: {
                    validators: {
                        notEmpty: {
                            message: '需求说明不能为空'
                        }
                    }
                }
            };


            //选择时间
            $(".form_datetime")
                .datetimepicker({
                    format: "yyyy/mm/dd",
                    autoclose: true,
                    todayBtn: true,
                    pickerPosition: "bottom-left",
                    minView: 'month',
                    startDate: new Date()
                });

            //图片上传
                file1 =UploadImg({
                    file: 'photoUrl',
                    url: '/FileUpload/SimpleUploadFile',
                    extData: {
                        type: 'png'
                    },
                    fileName: 'file',
                    name: 'accessory',
                    loadingImg: '/lib/images/loading.gif',
                    validatorImg: '/lib/images/validator.png',
                    path: 'response path data',
                    statusName: 'success',
                    preview: {
                        prevUrl: '/'
                    },
                    success: function (data) {
                        showAlert('上传成功');
                    },
                    error: function (data) {
                        showAlert('上传失败');
                    }
                });
            // 初始化表单验证
            $('#applyForm').attr('action', '/Commercialize/UserCommercialize/Add');


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
                    $('.submit').attr('disabled','true');
                    e.preventDefault();
                    // Get the form instance
                    var $form = $(e.target);
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
                                setTimeout("window.location.href='/web/myWiz.html'", 5000);
                            }
                        }
                    });

                })
                .on('click', 'button[data-dismiss]', function () {
                    $('#applyForm').data('bootstrapValidator').resetForm();
                });


            $('.form_datetime')
                .on('change', function (e) {
                    $('#applyForm')
                    // Get the bootstrapValidator instance
                        .data('bootstrapValidator')
                        // Mark the field as not validated, so it'll be re-validated when the user change date
                        .updateStatus('beginDate', 'NOT_VALIDATED', null)
                        .updateStatus('endDate', 'NOT_VALIDATED', null)
                        // Validate the field
                        .validateField('beginDate')
                        .validateField('endDate');
                });
            if(objectid!=undefined){
                $.ajax({
                    type: 'GET',
                    url: ' /Commercialize/UserCommercialize/Edit/' + objectid,
                    dataType: 'json',
                    success: function (data) {
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
                        $('input[name="company"]').val(data.company);
                        $('input[name=beginDate]').val(data.beginDate.substr(0,10))
                        $('input[name=endDate]').val(data.endDate.substr(0,10));
                        file1.setData(data.accessory);
                        $('.previewBox img').attr('src','/'+data.accessory);
                        $(".form_datetime").datetimepicker('remove');
                        $('#applyForm input').attr('readonly','true');
                        $('textarea').attr('readonly',true);
                        $('button').attr('disabled','disabled');
                        $('input[type=checkbox]').attr('checked','checked');
                        $('.uploadHBox').hide();
                    }
                })
                getCommentInfo(objectid,'commercialize');

            }
    })

});
