/**
 * Created by Administrator on 2016/4/8.
 */
require(['jquery', 'bootstrap','pm','bootstrapvalidator','select2'], function(){
    $(function(){

        var objectid=queryString("objectid");
        //设置文本字段值
        if(objectid==undefined){
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
                $("input[name='contact']").val(user.phone);
            })
        }

        //须知
        $.ajax({
            type: 'GET',
            url: '/Setting/Readme/Type/Edit?type=enterApply',
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
        //园区
        $.ajax({
            type: 'GET',
            url: '/Setting/SettingDict/0/0?type=enterPark',
            dataType: 'json',
            success: function (data) {
                var html=[];
                $.each(data.result,function(ind,val){
                    html.push('<label><input type="checkbox" name="parks" value="'+val.objectid+'"/><span class="week"> '+val.name+'</span></label>');
                });
                $('#parkCont').append(html.join(''));
            }
        })
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

            //details: {
            //    validators: {
            //        notEmpty: {
            //            message: '需求说明不能为空'
            //        }
            //    }
            //},

            applicant: {
                validators: {
                    notEmpty:{
                        message:'申请人不能为空'
                    },
                    stringLength: {
                        min: 0,
                        max: 50,
                        message: '限50字以内'
                    }
                }
            },
            area: {
                validators: {
                    notEmpty:{
                        message:'需求面积不能为空'
                    },
                    callback:{
                        message:"面积为大于零并且不超过10万的整数值",
                        callback:function(value,vlidator){
                            var num = parseInt(value);
                            return (num > 0 && num <= 100000) && (num == value)
                        }
                    }

                }
            },
            //parks: {
            //    callback: {
            //        callback: function (value, validator) {
            //            if (value == '') {
            //                return {
            //                    valid: false,
            //                    message: '请选择园区'
            //                }
            //            }
            //            return true;
            //        }
            //    }
            //},
            //产业类别
            sTypeId: {
                validators: {
                    callback: {
                        callback: function (value, validator) {
                            if (value == 0) {
                                return {
                                    valid: false,
                                    message: '请选择产业类别'
                                }
                            }
                            return true;
                        }
                    }
                }
            },
            //企业规模
            sStafffId: {
                validators: {
                    callback: {
                        callback: function (value, validator) {
                            if (value == 0) {
                                return {
                                    valid: false,
                                    message: '请选择企业规模'
                                }
                            }
                            return true;
                        }
                    }
                }
            }
        }

        $('#form').attr('action','/Setting/EnterApply/Add');
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

        //产业类别字典
        getTypes($('#type'))
        //获取产业类别字典
        function getTypes(selector,id){
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

        //企业规模字典
        getStaffs($('#staff'))
        //获取企业规模字典
        function getStaffs(selector,id){
            $.ajax({
                type:"GET",
                url: "/Setting/SettingDict/0/0?type=enterpriseScale",
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
            $.ajax({
                type: 'GET',
                url: '/Setting/EnterApply/Edit/' + objectid,
                dataType: 'json',
                success: function (data) {
                    setCheckbox('parks',data.park)
                    function setCheckbox(name,val){
                        var inputs=$('input[name='+name+']');
                        var radio=val.split(',');
                        inputs.each(function(){
                            for(var i=0;i<radio.length;i++){
                                if($(this).val()==radio[i]){
                                    $(this).attr('checked',true);
                                }
                            }
                        })
                    }
                    var option1 = {
                        selector: $('#staff'),
                        type: 'enterpriseScale',
                        id: data.sStafffId,
                        cb:function(){
                            $('#staff').attr('disabled','true');
                        }
                    };
                    getDict(option1);
                    var option2 = {
                        selector: $('#type'),
                        type: 'enterpriseIndustry',
                        id: data.sTypeId,
                        cb:function(){
                            $('#type').attr('disabled','true');
                        }
                    };
                    getDict(option2);
                    $.each(data,function(ind,val){
                        var tar = $('input[name="'+ind+'"]');
                        if(tar.attr('type') != 'radio'&&tar.attr('type') != 'checkbox'){
                            tar.val(val)
                        }
                    });
                    $.each(data,function(ind,val){
                        var tar = $('textarea[name="'+ind+'"]');
                        if(tar.attr('type') != 'radio'&&tar.attr('type') != 'checkbox'){
                            tar.val(val)
                        }
                    });
                }
            })
            $('#form input').attr('readonly','true');
            $('textarea').attr('readonly',true);
            $('button').attr('disabled','disabled');
            //评价
            getCommentInfo(objectid,'enterApply');
            $('#notice').hide();
            $('.read').hide();
        }

    })

})