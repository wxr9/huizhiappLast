/**
 * Created by z on 2016/10/27.
 */
require(['jquery','pm','bootstrapvalidator'], function(){
    $(function(){

        var objectid=queryString("objectid");
        //设置文本字段值
        if(objectid==undefined){
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
            url: '/Setting/Readme/Type/Edit?type=hzCardEnterpApply',
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
        //上传附件
        var uploadFile;
        require(['jqueryUpload'], function (UploadImg) {
            uploadFile = UploadImg({
                file: 'attachment',
                url: '/FileUpload/SimpleUploadDocFile',
                extData: {
                    type: '.xls,.xlsx'
                },
                fileName: 'file',
                name: 'attachment',
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
            attachment: {
                validators: {
                    notEmpty:{
                        message:'请上传附件'
                    }
                }
            }

        }

        $('#parkCont').on('click',function(){
            var inputs=$(this).find('input');
            var num=0;
            for(var i= 0;i<inputs.length;i++){
                if(inputs[i].checked==true){
                    num++;
                }
            }
            if(num>0){
                $('#form button').removeAttr('disabled');
            }
        })
        if(objectid!=undefined){
            var form = $('#form');
            $.ajax({
                type: 'GET',
                url: '/CardApply/Enterprise/Edit/' + objectid,
                dataType: 'json',
                success: function (data) {
                    var status = data.status;
                    $.each(data,function(ind,val){
                        if(ind == 'attachment' && status != 3){
                            //can't upload
                            $('#attachmentBox').empty().append('<a class="btn btn-blue" href="/'+val+'" download>下载</a>')
                        }else if(ind == 'mark'){
                            var value = val || "";
                            $('#suggest').val(value);
                        }else if(ind == 'getTime'){
                            var value = val || "";
                            $('#getTime').val(value);
                        }else{
                            $("input[name='"+ind+"']").val(val);
                        }
                    });
                    if(status == 3 || status == 2 || status == 4){
                        //显示意见和领取时间
                        $('.check').show();
                        if(status == 3){
                            //can edit
                            uploadFile.setData("/"+data.attachment);
                            form.append('<input type="hidden" name="id" value="'+data.id+'">');
                            form.attr('action','/CardApply/Enterprise/Update');
                            initBootstrapValidator(validatorFields,{
                                before:function(){
                                    var isRead  = $('#mustRead');

                                    if(isRead.length > 0 && isRead.eq(0).is(':checked') == false) {
                                        showAlert('请阅读用户须知并同意');
                                        isRead.eq(0).focus();
                                        isRead.on('click', function(){
                                            form.find('button.submit').removeAttr('disabled');
                                        });
                                        return false;
                                    }
                                },
                                end:function(result){
                                    $('#submit').attr('disabled','disabled');
                                    if(result.success == true){
                                        setTimeout(function(){
                                            window.location.href = '/web/myWiz.html';
                                        },3000)
                                    }
                                }
                            });
                            $('#stop').on('click',function(){
                                $.ajax({
                                    method:"POST",
                                    url:'/CardApply/Enterprise/Update',
                                    data:{
                                        "id":data.id,
                                        "status":4
                                    },
                                    dataType:'josn',
                                    success:function(result){
                                        if(result.success){
                                            showAlert(result.msg);
                                            setTimeout(function(){
                                                window.location.href = '/web/myWiz.html';
                                            },3000)
                                        }else{
                                            showAlert(result.msg, 'danger');
                                        }

                                    }
                                })
                            })
                        }else{
                            $('#form input').attr('readonly','true');
                            $('#submit').attr('disabled','disabled');
                            $('#stop').attr('disabled','disabled');
                        }



                    }else{
                        $('#form input').attr('readonly','true');
                        $('#submit').attr('disabled','disabled');
                        $('#stop').attr('disabled','disabled');
                    }
                }
            });
        }else{
            //new add
            $('#stop').css('display','none');
            $('#form').attr('action','/CardApply/Enterprise/Add');
            // 初始化表单验证
            initBootstrapValidator(validatorFields,{
                alertMsg:'请阅读用户须知并同意',
                end:function(result){
                    $('button').attr('disabled','disabled');
                    if(result.success == true){
                        setTimeout(function(){
                            window.location.href = '/web/myWiz.html';
                        },3000)
                    }
                }


            });
        }

    })

})