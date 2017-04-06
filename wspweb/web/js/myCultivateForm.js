require(['jquery', 'bootstrap','pm','bootstrapvalidator','select2'], function(){
    $(function(){
        checkInfo();
        var user;//登录用户;
        var id=queryString("id");
        var courseName=queryString('name');
        var courseName;
        //获取个人信息
        if(id!=undefined) {
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
        $("input[name='courseId']").val(id);
        $("#courseName").val(courseName);
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
            sex: {
                validators: {
                    callback: {
                        callback: function (value, validator) {
                            if (value == 0) {
                                return {
                                    valid: false,
                                    message: '请选择性别'
                                }
                            }
                            return true;
                        }
                    }
                }
            },
            courseId: {
                validators: {
                    callback: {
                        callback: function (value, validator) {
                            if (value == 0) {
                                return {
                                    valid: false,
                                    message: '请选择课程'
                                }
                            }
                            return true;
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
            censusRegister: {
                validators: {
                    callback: {
                        callback: function (value, validator) {
                            if (value == 0) {
                                return {
                                    valid: false,
                                    message: '请选择户籍'
                                }
                            }
                            return true;
                        }
                    }
                }
            },
            schoolTimeArray: {
                validators: {
                    callback: {
                        callback: function (value, validator) {
                            if (value == '') {
                                return {
                                    valid: false,
                                    message: '请选择上课时间'
                                }
                            }
                            return true;
                        }
                    }
                }
            },
        }

        // 初始化表单验证
        //initFormValidator(validatorFields, fn_successBeforeSubmit);
        //initBootstrapValidator(validatorFields,{
        //    begin:function(){
        //        $('#gradeId').val("0")
        //    },
        //    end:function(){
        //        $('button').attr('disabled','disabled');
        //        setTimeout(function(){
        //            window.location.href = '/web/myWiz.html';
        //        },3000)
        //    }
        //
        //});
  
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

        $("#form").data('bootstrapValidator');
        $("input[name='schoolTime']").each(function(ind,val){
            $(val).val(ind+1);
        })
        getGradeId($("#gradeId"));
        //获取等级
        function getGradeId(selector,id){
            $.ajax({
                type:"GET",
                url: "/Setting/SettingDict/0/0/?type=grade",
                dataType:'json',
                success: function(data){
                    var options = [];
                    var List = data.result;
                    if(List==null){
                        showAlert('没有课程');
                    }else{
                        options.push("<option value='0' selected></option>")
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
                }
            })
        }
        getEducation($("#education"));
        //获取学历
        function getEducation(selector,id){
            $.ajax({
                type:"GET",
                url: "/Setting/SettingDict/0/0/?type=education",
                dataType:'json',
                success: function(data){
                    var options = [];
                    var List = data.result;
                    if(List==null){
                        showAlert('没有学历');
                    }else{
                        options.push("<option value='0' selected></option>")
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
                }
            })
        }
        getyears($("#years"));
        //获取工作年限
        function getyears(selector,id){
            $.ajax({
                type:"GET",
                url: "/Setting/SettingDict/0/0/?type=workYears",
                dataType:'json',
                success: function(data){
                    var options = [];
                    var List = data.result;
                    if(List==null){
                        showAlert('没有年限');
                    }else{
                        options.push("<option value='0' selected></option>")
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
                }
            })
        }
        getGrades($("#jobTitle"));
        //获取目前职位
        function getGrades(selector,id){
            $.ajax({
                type:"GET",
                url: "/Setting/SettingDict/0/0/?type=jobTitle",
                dataType:'json',
                success: function(data){
                    var options = [];
                    var List = data.result;
                    if(List==null){
                        showAlert('没有职位');
                    }else{
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
                }
            })
        }

        //详情
        var objectid=queryString("objectid");
        if(objectid!=undefined){
            $.ajax({
                type: 'GET',
                url: '/Cultivate/UserCultivate/Edit/' + objectid,
                dataType: 'json',
                success: function (data) {
                    var option1 = {
                        selector: $('#gradeId'),
                        type: 'grade',
                        id: data.gradeId,
                        cb:function(){
                            $('#gradeId').attr('disabled','true');
                        }
                    };
                    getDict(option1);
                    var option2 = {
                        selector: $('#education'),
                        type: 'education',
                        id: data.educationId,
                        cb:function(){
                            $('#education').attr('disabled','true');
                        }
                    };
                    getDict(option2);
                    var option3 = {
                        selector: $('#years'),
                        type: 'workYears',
                        id: data.workYearId,
                        cb:function(){
                            $('#years').attr('disabled','true');
                        }
                    };
                    getDict(option3);
                    var option4 = {
                        selector: $('#jobTitle'),
                        type: 'jobTitle',
                        id: data.jobId,
                        cb:function(){
                            $('#jobTitle').attr('disabled','true');
                        }
                    };
                    getDict(option4)
                    $.each(data,function(ind,val){
                        var tar = $('textarea[name="'+ind+'"]');
                        if(tar.attr('type') != 'radio'){
                            tar.val(val)
                        }
                    });
                    $.each(data,function(ind,val){
                        var tar = $('input[name="'+ind+'"]');
                        if(tar.attr('type') != 'radio'){
                            tar.val(val)
                        }
                    });
                    setRadio('sex',data.sex);
                    setRadio('socialInsurance',data.socialInsurance);
                    setRadio('censusRegister',data.censusRegister);
                    function setRadio(name,val){
                        var inputs=$('input[name='+name+']');
                        var radio=val;
                        inputs.each(function(){
                            if($(this).val()==radio){
                                $(this).attr('checked','checked');
                            }
                        })
                    }
                    //setSelect(schoolTimeArray,val)
                    //function setSelect(name,val){
                    //    var selects=$('input[name='+name+']');
                    //    var options=val;
                    //    selects.each(function(){
                    //        if($(this).val()==radio){
                    //            $(this).attr('checked','checked');
                    //        }
                    //    })
                    //}
                    setCheckbox('schoolTimeArray',data.schoolTime)
                    function setCheckbox(name,val){
                        var inputs=$('input[name='+name+']');
                        var radio=val.split(',');
                        var arr=[];
                        for(var i=0;i<radio.length;i++){
                            if(radio[i]=='周一'){
                                arr.push(1);
                            }else if(radio[i]=='周二'){
                                arr.push(2);

                            }else if(radio[i]=='周三'){
                                arr.push(3);

                            }else if(radio[i]=='周四'){
                                arr.push(4);

                            }else if(radio[i]=='周五'){
                                arr.push(5);

                            }else if(radio[i]=='周六'){
                                arr.push(6);

                            }else if(radio[i]=='周日'){
                                arr.push(7);
                            }
                        }
                        inputs.each(function(){
                            for(var i=0;i<arr.length;i++){
                                if($(this).val()==arr[i]){
                                    $(this).attr('checked','checked');
                                }
                            }

                        })
                    }


                    //$('input[name=chineseName]').val(data.chineseName);
                    $('#courseName').val(data.course.name);
                    $('#applyForm input').attr('readonly','true');
                    $('textarea').attr('readonly',true);
                    $('input').attr('readonly',true);
                    $('button').attr('disabled','disabled');
                    $('button').hide();
                }
            })
        }
    })

})
