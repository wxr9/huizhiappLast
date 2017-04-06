require(['jqueryUpload','jquery', 'bootstrap','pm','bootstrapvalidator','select2'], function(jqueryUpload){
    $(function(){
        var objectid=queryString("objectid");
        var file;
        //设置文本字段值
        if(objectid==undefined) {
            checkInfo();
            getUserInfo(function (user) {
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
            url: '/Setting/Readme/Type/Edit?type=enterpriseCultivate',
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
            chineseName:{
                validators: {
                    notEmpty: {
                        message: '姓名不能为空'
                    },
                    stringLength: {
                        min: 0,
                        max: 50,
                        message: '限50字以内'
                    },
                    regexp: {
                        regexp:/^(([\u4e00-\u9fa5]|[a-zA-Z0-9])+)$/,
                        message:  '请勿输入特殊字符'
                    }
                }
            },
            email: {
                validators: {
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

            //accessory: {
            //    validators: {
            //        notEmpty: {
            //            message: '附件不能为空'
            //        }
            //    }
            //},

            //content: {
            //    validators: {
            //        notEmpty: {
            //            message: '培训需求不能为空'
            //        }
            //    }
            //},
            peoplesArray: {
                validators: {
                    notEmpty: {
                        message: '培训人数不能为空'
                    },
                    regexp: {
                        regexp: /^\d+$/,
                        message: '请输入大于等于零的整数'
                    }
                }
            },
            chineseName: {
                validators: {
                    notEmpty:{
                        message:'姓名不能为空'
                    },
                    stringLength: {
                        min: 0,
                        max: 20,
                        message: '限20字以内'
                    }
                }
            },
            companyAddress: {
                validators: {
                    notEmpty:{
                        message:'公司地址不能为空'
                    },
                    stringLength: {
                        min: 0,
                        max: 200,
                        message: '限200字以内'
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
            //业务方向
            businessType: {
                validators: {
                    callback: {
                        callback: function (value, validator) {
                            if (value == 0) {
                                return {
                                    valid: false,
                                    message: '请选择业务方向'
                                }
                            }
                            return true;
                        }
                    }
                }
            },
            //培训需求项目
            priojectidArray: {
                validators: {
                    callback: {
                        callback: function (value, validator) {
                            if (value == 0) {
                                return {
                                    valid: false,
                                    message: '请选择培训需求项目'
                                }
                            }
                            return true;
                        }
                    }
                }
            }
        }

        //上传附件

        file=jqueryUpload({
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

        $('#form').attr('action','/EnterpriseCultivate/EnterpriseCultivate/Add');
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
                return data.replace(/priojectidArray\d+/g, 'priojectidArray').replace(/peoplesArray\d+/g, 'peoplesArray');
            }
        });

        //新增时，读取所有培训项目id

        getCompanys($("#priojectidArray"));

        //获取所有培训项目id
        function getCompanys(selector,id){
            $.ajax({
                type:"GET",
                url: "/Setting/SettingDict/cultivateProject/List/",
                dataType:'json',
                success: function(data){
                    //var target = $('select[name="priojectidArray"]');
                    //    $(data).each(function(ind,val){
                    //        target.append('<option value="'+val.objectid+'">'+val.name+'</option>');
                    //    })
                    var options = [];
                    var List = data;
                    options.push("<option value='' selected></option>")
                    for(var i=0,len=List.length; i<len; i++){
                        options.push("<option english='"+List[i].english+"' value=\'"+ List[i].objectid +"\'>"+List[i].name+"</option>");
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
        var num=1;
        $("#form").on('click', '.addBtn1', function () {
            //var formGroup = $(this).parent().parent();
            //formGroup.after(formGroup.clone(true));
            var  html=[];
            html.push('<div class="bg_gray clearfix"><div class="col-sm-10">' +
                '<div class="form-group"><div class="col-sm-4 text-right">' +
                '<label class="control-label"><span class="star"></span><span>培训需求项目：</span></label></div>' +
                '<div class="col-sm-8"><select id="priojectidArray'+num+'" class="form-control" type="text" name="priojectidArray'+num+'" ></select><p></p></div></div>' +
                '<div class="form-group"><div class="col-sm-4 text-right">' +
                '<label class="control-label"><span class="star"></span><span>培训项目人数：</span></label></div>' +
                '<div class="col-sm-8"><input class="form-control" type="text" name="peoplesArray'+num+'"/></div></div>' +
                '</div>' +
                '<div class="con-sm-2"><a class="addBtn1 fl" href="javascript:;"><i class="fa fa-plus-circle" aria-hidden="true"></i></a>' +
                '<a class="delBtn1 fl" href="javascript:;"><i class="fa fa-minus-circle" aria-hidden="true"></i></a></div></div>')
            $("#cont").append(html);
            getCompanys($('#priojectidArray'+num+''));
            $('#form').on('change','select',function(){
                $(this).siblings('p').text('')
                var tips=$(this)[0].selectedOptions[0].attributes.english.value;
                if(tips!='null'){
                    $(this).siblings('p').append(tips)
                }
            })
            /*新增列表后，新增元素加入到Validator中*/
            $('#form').bootstrapValidator('addField', 'priojectidArray'+num+'', {
                validators: {
                    callback: {
                        callback: function (value, validator) {
                            if (value == 0) {
                                return {
                                    valid: false,
                                    message: '请选择培训需求项目'
                                }
                            }
                            return true;
                        }
                    }
                }
            });
            $('#form').bootstrapValidator('addField', 'peoplesArray'+num+'', {
                validators: {
                    notEmpty: {
                        message: '培训人数不能为空'
                    },
                    regexp: {
                        regexp: /^\d+$/,
                        message: '请输入大于等于零的整数'
                    }
                }
            });
            num++;
        })
        $("#form").on('click', '.delBtn1', function () {
            var formGroup = $(this).parent().parent();
            formGroup.remove();
        })
        //新增业务方向
        //业务方向字典
        getDicts($('#businessType'));

        var Lists=$('select');
        for(var i=1;i<Lists.length;i++){
            $(Lists[i]).change(function(){
                $('#tip').empty();
                var tips=$(this)[0].selectedOptions[0].attributes.english.value;
                if(tips!='null'){
                    $('#tip').append(tips)
                }
            })
        }
        //获取业务方向字典
        function getDicts(selector,id){
            $.ajax({
                type:"GET",
                url: "/Setting/SettingDict/0/0?type=enterpriseIndustry",
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
            //获取值
            $.ajax({
                type: 'GET',
                url: '/EnterpriseCultivate/EnterpriseCultivate/Edit/' + objectid,
                dataType: 'json',
                success: function (data) {
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
                    //select的值
                    var options = {
                        selector: $('#businessType'),
                        type: 'enterpriseIndustry',
                        id: data.businessType,
                        cb:function(){
                            $('#businessType').attr('disabled','true');
                        }
                    };
                    getDict(options);
                    file.setData(data.accessory,'hide');
                }
            })
            //获取培训值
            $.ajax({
                type: 'GET',
                url: ' /EnterpristCultivate/EnterpristCultivateProject/ByEnterpriseCultivateId/List/0/0/' + objectid,
                dataType: 'json',
                success: function (data) {
                    function creat(nameCH, nameEN, val) {
                        var html = [];
                        html.push('<div class="form-group">' +
                            '<div class="col-sm-12">' +
                            '<div class="col-sm-4 text-right"><label class="control-label"><span class="star"></span><span>' + nameCH + '</span></label></div>' +
                            '<div class="col-sm-8"><input class="form-control" type="text" name="' + nameEN + '" value="' + val + '" readonly/></div>' +
                            '</div>' +
                            '</div>')
                        return html;
                    }
                    $('#cont').empty()
                    var html = [];
                    $.each(data.result, function (ind,val) {
                        html.push('<div class="bg_gray clearfix"><div class="col-sm-10">')
                        html.push(creat('培训需求项目：', 'priojectidArray', val.project.name));
                        html.push(creat('培训项目人数：', 'peoplesArray', val.peoples));
                        html.push('</div></div>')
                    });
                    $('#cont').append(html.join(''))

                }
            })
            $('#form input').attr('readonly',true);
            $('textarea').attr('readonly',true);
            $('button').attr('disabled','disabled');
            $('input[type=checkbox]').attr('checked','checked');
            //评价+3
            getCommentInfo(objectid,'enterpriseCultivate');
            $('#notice').hide();
            $('.read').hide();
            $('select[name=priojectidArray]').attr('disabled','disabled');
            $('#cont .addBtn1').hide();
            $('#cont .delBtn1').hide();
            $("#form").on('click', '.addBtn1',function(){
                return false;
            })
            $("#form").on('click', '.delBtn1',function(){
                return false;
            })


        }
    })

})
