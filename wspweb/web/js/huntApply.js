require(['jqueryUpload','jquery', 'bootstrap','pm','bootstrapvalidator','select2'], function(jqueryUpload){
    $(function(){
        var objectid=queryString("objectid");
        // 验证字段
        var user;//登录用户
        $.ajax({
                type: 'GET',
                url: '/Setting/User/MyInfo',
                dataType: 'json',
                async: false,
                success: function (result) {
            user = result;
        }
        });
        //设置文本字段值
        if(objectid==undefined) {
            checkInfo();
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
        }
        //联系方式
        $("input[name='phone']").val(user.phone);
        // 验证字段

        //须知

        $.ajax({
            type: 'GET',
            url: '/Setting/Readme/Type/Edit?type=userHeadhunting',
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

        var validatorFields = {
            submitted:true,
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
            //memo: {
            //    validators: {
            //        notEmpty:{
            //            message:'备注不能为空'
            //        }
            //    }
            //},
            jobObligation: {
                validators: {
                    notEmpty:{
                        message:'职位职责不能为空'
                    }
                }
            },
            jobsCondition: {
                validators: {
                    notEmpty:{
                        message:'职位任职条件不能为空'
                    }
                }
            },
            jobsMoney: {
                validators: {
                    notEmpty:{
                        message:'职位薪资不能为空'
                    }
                }
            },
            jobsName: {
                validators: {
                    notEmpty:{
                        message:'职位名称不能为空'
                    },
                    stringLength: {
                        min: 0,
                        max: 50,
                        message: '限50字以内'
                    },
                }
            }
        }

        $('#form').attr('action','/Headhunting/UserHeadhunting/Add');
        // 初始化表单验证
        initBootstrapValidator(validatorFields,{
            end:function(result){
                $('button.submit').attr('disabled','disabled');
                if(result.success == true){
                    setTimeout(function(){
                        window.location.href = '/web/myWiz.html';
                    },3000)
                }
            },
            replaceData: function (data) {
                return data.replace(/jobsName\d+/g, 'jobsName').replace(/jobObligation\d+/g, 'jobObligation').replace(/jobsCondition\d+/g, 'jobsCondition').replace(/jobsMoney\d+/g, 'jobsMoney');
            }
        });


        //上传附件

        var file1 =jqueryUpload({
            file : 'accessory',
            url : '/FileUpload/SimpleUploadDocFile',
            extData:{
                type: ".doc,.docx,.xls,.xlsx,.pdf,.html,.zip,.rar,.7z,.iso"
            },
            name: 'accessory',
            fileName: 'file',
            statusName : 'success',
            //path: 'response path data',
            success: function(data){
            },
            error: function(data){
            }
        })
        if(objectid==undefined){
            var num=1;
            $("#form").on('click', '.addBtn',function(){
                //var formGroup=$(this).parent().parent();
                //formGroup.after(formGroup.clone());
                var  html=[];
                html.push('<div class="bg_gray clearfix"><div class="col-sm-10">' +
                    '<div class="form-group"><div class="col-sm-3 text-right">' +
                    '<label class="control-label"><span class="star"></span><span>职位名称：</span></label></div>' +
                    '<div class="col-sm-9"><input class="form-control" type="text" name="jobsName'+num+'" /></div></div>' +
                    '<div class="form-group"><div class="col-sm-3 text-right">' +
                    '<label class="control-label"><span class="star"></span><span>工作职责：</span></label></div>' +
                    '<div class="col-sm-9"><textarea class="form-control" type="text" name="jobObligation'+num+'"></textarea></div></div>' +
                    '<div class="form-group"><div class="col-sm-3 text-right">' +
                    '<label class="control-label"><span class="star"></span><span>任职条件：</span></label></div>' +
                    '<div class="col-sm-9"><textarea class="form-control" type="text" name="jobsCondition'+num+'"></textarea></div></div>' +
                    '<div class="form-group"><div class="col-sm-3 text-right">' +
                    '<label class="control-label"><span class="star"></span><span>薪资描述：</span></label></div>' +
                    '<div class="col-sm-9"><textarea class="form-control" type="text" name="jobsMoney'+num+'"></textarea></div></div>' +
                    '</div>' +
                    '<div class="con-sm-2"><a class="addBtn fl" href="javascript:;"><i class="fa fa-plus-circle" aria-hidden="true"></i></a>' +
                    '<a class="delBtn fl" href="javascript:;"><i class="fa fa-minus-circle" aria-hidden="true"></i></a></div></div>')
                $("#cont").append(html);
                /*新增列表后，新增元素加入到Validator中*/
                $('#form').bootstrapValidator('addField', 'jobsName'+num+'', {
                    validators: {
                        notEmpty: {
                            message: '职位名称不能为空'
                        },
                        stringLength: {
                            min: 0,
                            max: 50,
                            message: '限50字以内'
                        },
                    }
                });
                $('#form').bootstrapValidator('addField', 'jobObligation'+num+'', {
                    validators: {
                        notEmpty: {
                            message: '工作职责不能为空'
                        }
                    }
                });
                $('#form').bootstrapValidator('addField', 'jobsCondition'+num+'', {
                    validators: {
                        notEmpty: {
                            message: '任职条件不能为空'
                        }
                    }
                });
                $('#form').bootstrapValidator('addField', 'jobsMoney'+num+'', {
                    validators: {
                        notEmpty: {
                            message: '薪资描述不能为空'
                        }
                    }
                });
                num++;
            })
            $("#form").on('click', '.delBtn',function(){
                var formGroup=$(this).parent().parent();
                formGroup.remove();
            })
        }
        if(objectid!=undefined){
            //获取值
            $.ajax({
                type: 'GET',
                url: '/Headhunting/UserHeadhunting/Edit/' + objectid,
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
                    file1.setData(data.accessory,'hide');
                }
            })
            //获取职位值
            $.ajax({
                type: 'GET',
                url: '/Headhunting/HeadhuntingJobs/HeadhuntingJobs/Edit/' + objectid,
                dataType: 'json',
                success: function (data) {
                    function creat(nameCH,nameEN,val,type1){
                        var html=[];
                        html.push('<div class="form-group">' +
                            '<div class="col-sm-12">' +
                            '<div class="col-sm-3 text-right"><label class="control-label"><span class="star"></span><span>'+nameCH+'</span></label></div>' +
                            '<div class="col-sm-9">');
                        if(type1=='textarea'){
                            html.push('<textarea class="form-control" type="text" name="'+nameEN+'">'+val+'</textarea>');
                        }else{
                            html.push('<input class="form-control" type="text" name="'+nameEN+'" value="'+val+'"/>');
                        }
                        html.push('</div></div></div>');
                        return html.join('');
                    }
                    if(data.result.length>1){
                        $('#cont').empty()
                        var html=[];
                        $.each(data.result,function(ind,val){
                            html.push('<div class="bg_gray clearfix"><div class="col-sm-10">')
                            html.push(creat('职位名称：','jobsName', val.name ,'input'));
                            html.push(creat('工作职责：','jobObligation', val.obligation ,'textarea'));
                            html.push(creat('任职条件：','jobsCondition',val.conditions,'textarea'));
                            html.push(creat('薪资描述：','jobsMoney',val.money,'textarea'));
                            html.push('</div></div>')
                        });
                        $('#cont').append(html.join(''))
                    }else{
                        $.each(data.result,function(ind,val) {
                            $('input[name=jobsName]').val(val.name);
                            $('textarea[name="jobObligation"]').text(val.obligation);
                            $('textarea[name="jobsCondition"]').text(val.conditions);
                            $('textarea[name="jobsMoney"]').text(val.money);
                        })
                        $('#cont .addBtn').hide();
                    }

                    $('#form input').attr('readonly',true);
                    $('textarea').attr('readonly',true);
                    $('button').attr('disabled','disabled');
                    $('input[type=checkbox]').attr('checked','checked');
                }


            })
            //评价
            getCommentInfo(objectid,'userHeadhunting');
            $('#notice').hide();
            $('.read').hide();
        }
    })

})
