require(['jquery','pm', 'bootstrap','select2','bootstrapvalidator'], function () {
    $(function () {
        checkMust();
        var enterprise; // 企业信息
        //是否企业管理员
        $.ajax({
            method: 'GET',
            url: '/Setting/User/IsEnterpriseAdminUser?',
            dataType: 'json',
            data:{
                timestamp : new Date().getTime()
            },
            async: false,
            success: function (result) {
                var canEdit = false;
                if (result.success) {
                    $('#leave').css('display','none');
                    //可编辑
                    canEdit = true;
                }
                //获取企业信息
                $.ajax({
                    type: 'GET',
                    url: '/Setting/Enterprise/EnterpriseInfo?timestamp=' + new Date().getTime(),
                    dataType: 'json',
                    async: false,
                    success: function (result) {

                        var data = result;
                        var form = document.forms.companyForm;
                        var showForm = document.forms.showForm;
                        var lists = ['abbreviation','address','clmId','contacts','contactsinfo','name','objectid','username','intake','scale','industry','type'];

                        
                        if(!canEdit){
                            showForm.style.display="block";
                            for(var i=0; i<8; i++){
                                var val = lists[i];
                                showForm[val].value = data[val];
                            }
                            showForm.intake.value = data['enterpriseIntake']['name'];
                            showForm.scale.value = data['enterpriseScale']['name'];
                            showForm.industry.value = data['enterpriseIndustry']['name'];
                            showForm.type.value = data['enterpriseType']['name'];
                            
                        }else{
                            form.style.display = "block";
                            for(var i=0; i<8; i++){
                                var val = lists[i];
                                form[val].value = data[val];
                            }
                            getDicts($(form.intake),"years",data.intake);
                            getDicts($(form.scale),"enterpriseScale",data.scale);
                            getDicts($(form.industry),"enterpriseIndustry",data.industry);
                            getDicts($(form.type),"enterpriseType",data.type);

                            // 表单验证
                            var fieldsList = {
                                contacts: {
                                    validators:{
                                        notEmpty: {
                                            message: '联系人不能为空'
                                        },
                                        stringLength: {
                                            max: 20,
                                            message: '限20个字符以内'
                                        }
                                    }
                                },
                                contactsinfo: {
                                    validators:{
                                        notEmpty: {
                                            message: '联系方式不能为空'
                                        },
                                        stringLength: {
                                            max: 20,
                                            message: '限20个字符以内'
                                        },
                                        digits: {
                                            message:'请输入数字'
                                        }
                                    }
                                },
                                address: {
                                    validators:{
                                        notEmpty: {
                                            message: '地址不能为空'
                                        },
                                        stringLength: {
                                            max: 100,
                                            message: '限100个字符以内'

                                        }
                                    }
                                },
                                name: {
                                    validators:{
                                        notEmpty: {
                                            message: '企业名称不能为空'
                                        },
                                        stringLength: {
                                            max: 100,
                                            message: '限100个字符以内'

                                        }
                                    }
                                },
                                abbreviation: {
                                    validators:{
                                        stringLength: {
                                            max: 50,
                                            message: '限50个字符以内'
                                        }
                                    }
                                },
                                intake: {
                                    validators:{
                                        notEmpty: {
                                            message: '入驻年不能为空'
                                        }
                                    }
                                },
                                scale: {
                                    validators:{
                                        notEmpty: {
                                            message: '企业规模不能为空'
                                        }
                                    }
                                },
                                industry: {
                                    validators:{
                                        notEmpty: {
                                            message: '所属行业不能为空'
                                        }
                                    }
                                },
                                type: {
                                    validators:{
                                        notEmpty: {
                                            message: '企业类型不能为空'
                                        }
                                    }
                                }

                            };

                            $('#companyForm').attr('action','/Setting/Enterprise/Update');
                            //初始化验证
                            initBootstrapValidator(fieldsList);
                        }


                    }
                });
            }
        });
        function getDicts(selector,type,id){
            $.ajax({
                type:"GET",
                url: "/Setting/SettingDict/0/0?type=" + type,
                dataType:'json',
                success: function(data){
                    var options = [];
                    var List = data.result;
                    options.push("<option value='' selected></option>");
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


        //点击模态框确认按钮后调用离开企业接口
        $('#confirmLeave').click(function () {
            $.ajax({
                type: 'GET',
                url: '/Setting/User/LeaveEnterprise',
                //dataType: 'json',
                success: function (result) {
                    if (result.success) {
                        $('#myModal').modal('hide');
                        showAlert(result.msg,'success');
                        setTimeout(function(){
                            window.location.href = "/web/searchEnterprise.html";
                        },3000)
                    }else{
                        showAlert(result.msg,'danger')
                    }
                }
            });
        });
    })
})
