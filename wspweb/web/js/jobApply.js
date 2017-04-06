/**
 * Created by Administrator on 2016/3/24.
 */
require(['jqueryUpload','jquery', 'bootstrap','pm','bootstrapvalidator','select2'], function(jqueryUpload){
    $(function(){
        var jobId = queryString('id');
        var jobName = queryString('jobName');
        $('input[name="jobsid"]').val(jobId);
        $('input[name="jobName"]').val(jobName);

        //获取个人信息
        if(jobId!=undefined) {
            checkInfo();
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

        // 验证字段
        var validatorFields = {
            chineseName:{
                validators: {
                    notEmpty: {
                        message: '姓名不能为空'
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
            phone: {
                validators: {
                    notEmpty: {
                        message: '联系方式不能为空'
                    },
                    regexp: {
                        regexp:/^1[0-9]{10}$/,
                        message:  '请输入11位手机号'
                    }
                }
            },
            jobId: {
                validators: {
                    notEmpty: {
                        message: '目前职位不能为空'
                    }
                }
            },
            url: {
                validators: {
                    notEmpty: {
                        message: '上传简历不能为空'
                    }
                }
            }
        }

        var file1=jqueryUpload({
            file : 'fileUpload',
            url : '/FileUpload/SimpleUploadDocFile',
            extData:{
                type: ".doc,.docx,.xls,.xlsx,.pdf,.html,.zip,.rar,.7z,.iso"
            },
            name: 'url',
            fileName: 'file',
            statusName : 'success',
            //path: 'response path data',
            success: function(data){
            },
            error: function(data){

            }
        })

        $('#form').attr('action','/Jobs/UserJobs/Add');
        // 初始化表单验证
        initBootstrapValidator(validatorFields,{
            end:function(result){
                $('button').attr('disabled','disabled');
                if(result.success == true){
                    setTimeout(function(){
                        window.location.href = '/web/myWiz.html';
                    },3000)
                }
            }

        });
        //详情页
        var objectid=queryString("objectid");
        if(objectid!=undefined){
            $.ajax({
                type: 'GET',
                url: '/Jobs/UserJobs/Edit/' + objectid,
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
                    $('input[name=jobName]').val(data.jobs.name);
                    $('input[name=chineseName]').val(data.chineseName);
                    $('input[name=email]').val(data.email);
                    $('input[name=phone]').val(data.phone);
                    $('button[type=submit]').hide();
                    //附件
                    file1.setData(data.url,'hide');
                    $('#applyForm input').attr('readonly','true');
                    $('textarea').attr('readonly',true);
                    $('#form input').attr('readonly',true);
                    $('button').attr('disabled','disabled');
                    $('button').hide();
                }

            })
        }

    })

})
