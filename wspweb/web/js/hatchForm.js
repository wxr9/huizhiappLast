require(['jquery', 'bootstrap','pm','bootstrapvalidator','select2', 'datepicker'], function(){
    $(function(){
        var objectid=queryString("objectid");
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

        //须知
        $.ajax({
            type: 'GET',
            url: '/Setting/Readme/Type/Edit?type=userIncubator',
            dataType: 'json',
            async: false,
            success: function (result) {
                //须知
                $("#notice").html(result.content);
                if(result.isRead==-1){
                    $('.read').remove();
                }
            }

        })
        //时间
        var mydate = new Date();
        var year=mydate.getFullYear(); //获取完整的年份(4位,1970-????)
        var month=(mydate.getMonth()+1)<10?'0'+(mydate.getMonth()+1):(mydate.getMonth()+1); //获取当前月份(0-11,0代表1月)
        var day=mydate.getDate()<10?'0'+mydate.getDate():mydate.getDate(); //获取当前日(1-31)
        //var hour=mydate.getHours()<10?'0'+mydate.getHours():mydate.getHours(); //获取当前小时数(0-23)
        //var minute=mydate.getMinutes()<10?'0'+mydate.getMinutes():mydate.getMinutes(); //获取当前分钟数(0-59)
        //var second=mydate.getSeconds()<10?'0'+mydate.getSeconds():mydate.getSeconds(); //获取当前秒数(0-59)

        var time=year+'/'+month+'/'+day;
        $('input[name=appointmentDate]').val(time)

        // 验证字段
        var validatorFields = {
            chineseName: {
                validators: {
                    notEmpty:{
                        message:'姓名不能为空'
                    },
                    stringLength: {
                        min: 1,
                        max: 20,
                        message: '限20字以内'
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

        };
        //选择时间
        $(".form_datetime")
            .datetimepicker({
                format: "yyyy/mm/dd",
                autoclose: true,
                todayBtn: true,
                pickerPosition: "bottom-left",
                minView:2,
                forceParse: false,
                startDate: new Date()
            });

        $('#form').attr('action','/Incubator/UserIncubator/Add');
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

        $('input[name=appointmentDate]').change(function(){
            $('button[type=submit]').removeAttr('disabled');
        })
        var objectid=queryString("objectid");
        if(objectid!=undefined){
            //去掉须知
            $('#mustRead').parent().parent().hide();
            $('#notice').hide();
            $.ajax({
                type: 'GET',
                url: '/Incubator/UserIncubator/Edit/' + objectid,
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
                    setRadio('rentType',data.rentType);
                    function setRadio(name,val){
                        var inputs=$('input[name='+name+']');
                        var radio=val;
                        inputs.each(function(){
                            if($(this).val()==radio){
                                $(this).attr('checked','checked');
                            }
                        })
                    }
                    $('button[type=submit]').hide();
                    $('input[name=appointmentDate]').val(data.appointmentDate);
                    $(".form_datetime").datetimepicker('remove');
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
