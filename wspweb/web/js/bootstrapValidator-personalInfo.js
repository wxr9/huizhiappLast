require(['jquery', 'bootstrap', 'bootstrapvalidator', 'pm','datepicker'], function () {
    $(function () {
        //if(queryString('mustCheck') == 'true'){
        //    showAlert('请完善个人资料.');
        //}
        checkMust();
        var user; //登录用户
        function toggleSelect(status) {
            if (status == "disabled") {
                $('form [id="address1"]').val(0);
                $('form [id="address1"]').attr('disabled', 'true');
                $('form [name="hometownCity"]').val(0);
                $('form [name="hometownCity"]').attr('disabled', 'true');
                $('form [id="address3"]').val(0);
                $('form [id="address3"]').attr('disabled', 'true');
                $('form [name="apartmentCity"]').val(0);
                $('form [name="apartmentCity"]').attr('disabled', 'true');
            } else if (status == "able") {
                $('form [id="address1"]').removeAttr('disabled');
                $('form [name="hometownCity"]').removeAttr('disabled');
                $('form [id="address3"]').removeAttr('disabled');
                $('form [name="apartmentCity"]').removeAttr('disabled');
            }
        }

        function dateTimeParse(date) {
            if (date != null) {
                var temp;
                temp = date.match(/\S{10}/g)[0].replace(/-/g,'/');
                return temp;
            } else {
                return;
            }
        }
        // 获取学历列表
        function getEducationList() {
            $.ajax({
                type: "GET",
                url: '/Setting/SettingDict/0/0?type=education',
                dataType: "json",
                async: false,
                success: function (result) {
                    $('select[name="education"] option').remove();
                    $('select[name="education"]').append('<option value="0">请选择...</option>');
                    if (result.total > 0) {
                        $.each(result.result, function (index, element) {
                            var option = "<option value=" + element.objectid + ">" + element.name + "</option>";
                            $('select[name="education"]').append(option);
                        });
                    }
                }
            });
        }
        // 获取国籍列表
        function getNationList() {
            $.ajax({
                type: "GET",
                url: '/Setting/SettingDict/0/0?type=nation',
                dataType: "json",
                async: false,
                success: function (result) {
                    $('select[name="nation"] option').remove();
                    $('select[id="address1"] option').remove();
                    $('select[name="hometownCity"] option').remove();
                    $('select[id="address3"] option').remove();
                    $('select[name="apartmentCity"] option').remove();
                    $('select[name="nation"]').append('<option value="0">请选择...</option>');
                    if (result.total > 0) {
                        $.each(result.result, function (index, element) {
                            var option = "<option value=" + element.objectid + " english="+element.english+">" + element.name + "</option>";
                            $('select[name="nation"]').append(option);
                        });
                    }
                }
            });
        }
        // 获取户籍地省列表
        function getAddress1List() {
            $.ajax({
                type: "GET",
                url: '/Setting/SettingCity/ParentId/0/0/1000001',
                dataType: "json",
                async: false,
                success: function (result) {
                    $('select[id="address1"] option').remove();
                    $('select[name="hometownCity"] option').remove();
                    $('select[id="address1"]').append('<option value="0">请选择...</option>');
                    if (result.total > 0) {
                        $.each(result.result, function (index, element) {
                            var option = "<option value=" + element.objectid + ">" + element.name + "</option>";
                            $('select[id="address1"]').append(option);
                        })
                    }
                }
            });
        }
        // 根据户籍地省获取户籍地市列表
        function gethometownCityList(provinceid) {
            $.ajax({
                type: "GET",
                url: '/Setting/SettingCity/ParentId/0/0/' + provinceid,
                dataType: "json",
                async: false,
                success: function (result) {
                    $('select[name="hometownCity"] option').remove();
                    $('select[name="hometownCity"]').append('<option value="0">请选择...</option>');
                    if (result.total > 0) {
                        $.each(result.result, function (index, element) {
                            var option = "<option value=" + element.objectid + ">" + element.name + "</option>";
                            $('select[name="hometownCity"]').append(option);
                        })
                    }
                }
            });
        }
        // 获取居住地省列表
        function getAddress3List() {
            $.ajax({
                type: "GET",
                url: '/Setting/SettingCity/ParentId/0/0/1000001',
                dataType: "json",
                async: false,
                success: function (result) {
                    $('select[id="address3"] option').remove();
                    $('select[name="apartmentCity"] option').remove();
                    $('select[id="address3"]').append('<option value="0">请选择...</option>');
                    if (result.total > 0) {
                        $.each(result.result, function (index, element) {
                            var option = "<option value=" + element.objectid + ">" + element.name + "</option>";
                            $('select[id="address3"]').append(option);
                        })
                    }
                }
            });
        }
        // 根据居住地省获取居住地市列表
        function getapartmentCityList(provinceid) {
            $.ajax({
                type: "GET",
                url: '/Setting/SettingCity/ParentId/0/0/' + provinceid,
                dataType: "json",
                async: false,
                success: function (result) {
                    $('select[name="apartmentCity"] option').remove();
                    $('select[name="apartmentCity"]').append('<option value="0">请选择...</option>');
                    if (result.total > 0) {
                        $.each(result.result, function (index, element) {
                            var option = "<option value=" + element.objectid + ">" + element.name + "</option>";
                            $('select[name="apartmentCity"]').append(option);
                        })
                    }
                }
            });
        }

        //设置form的action，提交表单用
        $("#formYoriki").attr("action", '/Setting/User/CompleteUserInfo');

        //初始化国籍列表
        getNationList();
        //初始化学历列表
        getEducationList();

        //文本字段
        var textfields = ["userFlag", "username", "name", "realName", "workYears", "enterpriseInput", "education", "signature"];
        //radio字段
        var radiofields = ["sex", "marital"];

        //获取个人信息
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
        for (var i = 0; i < textfields.length; i++) {
            var fieldstr = textfields[i];
            $('form [name="' + textfields[i] + '"]').val(user[fieldstr]);
        }
        //默认中国
        var defaultNation = $('select[name="nation"] option[english="china"]').val();
        var nationId = user["nation"] != 0 ? user["nation"] : defaultNation;
        $('form [name="nation"]').val(nationId);
        //设置radio字段值
        for (var i = 0; i < radiofields.length; i++) {
            var fieldstr = radiofields[i];
            $('form [name="' + radiofields[i] + '"]' + '[value="' + user[fieldstr] + '"]').prop("checked", true);
        }
        //设置生日
        var dopt = {
            format: "yyyy/mm/dd",
            autoclose: true,
            todayBtn: true,
            pickerPosition: "bottom-left",
            startView: 2,
            minView: 2,
            endDate: new Date()
        }
        if (user['birthday'] != null) {
            // 解决日期为空接口会报错的问题
            if (user['birthday'] == "1900-01-01 00:00:00") {
                $('form [id="birthday"]').val("");
            } else {
                $('form [id="birthday"]').val(dateTimeParse(user['birthday']));
            }
        }
        //选择营业时间
        $(".form_datetime")
            .datetimepicker(dopt)
        //设置户籍地省和市/居住地省和市
        if ($('form [name="nation"]').val() == defaultNation) {
            getAddress1List();
            if (user['settingHometowntCity'] != null && user['settingHometowntCity']['settingCity'] != null) {
                $('form [id="address1"]').val(user['settingHometowntCity']['settingCity']['objectid']);
            } else {
                $('form [id="address1"]').val(0);
            }
            gethometownCityList($('form [id="address1"]').val());
            if (user['settingHometowntCity'] != null) {
                $('form [name="hometownCity"]').val(user['settingHometowntCity']['objectid']);
            } else {
                $('form [name="hometownCity"]').val(0);
            }
            getAddress3List();
            if (user['settingApartmentCity'] != null && user['settingApartmentCity']['settingCity'] != null) {
                $('form [id="address3"]').val(user['settingApartmentCity']['settingCity']['objectid']);
            } else {
                $('form [id="address3"]').val(0);
            }
            getapartmentCityList($('form [id="address3"]').val());
            if (user['settingApartmentCity'] != null) {
                $('form [name="apartmentCity"]').val(user['settingApartmentCity']['objectid']);
            } else {
                $('form [name="apartmentCity"]').val(0);
            }
        }

        //如果国籍非中国，户籍地和居住地不可选
        if ($('select[name="nation"]').val() != defaultNation) {
            toggleSelect("disabled");
        }

        // 验证字段
        var validatorFields = {
            workYears: {
                validators: {
                    notEmpty: {
                        message: '工作年限不能为空'
                    },
                    greaterThan: {
                        value: 0,
                        message: '工作年限不能小于0'
                    }
                }
            },
            nation: {
                validators: {
                    callback: {
                        callback: function (value, validator) {
                            if (value == 0) {
                                return {
                                    valid: false,
                                    message: '请选择国籍'
                                }
                            }
                            return true;
                        }
                    }
                }
            },
            address1: {
                validators: {
                    callback: {
                        callback: function (value, validator) {
                            if (value == 0 ) {
                                return {
                                    valid: false,
                                    message: '请选择省份'
                                }
                            }
                            return true;
                        }
                    }
                }
            },
            hometownCity: {
                validators: {
                    callback: {
                        callback: function (value, validator) {
                            if (value == 0&&$('address1').val()!=0) {
                                return {
                                    valid: false,
                                    message: '请精确到市'
                                }
                            }
                            return true;
                        }
                    }
                }
            },
            address3: {
                validators: {
                    callback: {
                        callback: function (value, validator) {
                            if (value == 0) {
                                return {
                                    valid: false,
                                    message: '请选择省份'
                                }
                            }
                            return true;
                        }
                    }
                }
            },
            apartmentCity: {
                validators: {
                    callback: {
                        callback: function (value, validator) {
                            if ($('address3').val() != 0 && value == 0) {
                                return {
                                    valid: false,
                                    message: '请精确到市'
                                }
                            }
                            return true;
                        }
                    }
                }
            },
            birthday:{
                validators: {
                    notEmpty: {
                        message: '出生日期不能为空'
                    }
                }
            },
            signature:{
                validators: {
                    stringLength: {
                        max: 140,
                        message: '限140个字符以内'
                    }
                }
            }
        }

        $('.form_datetime')
            .on('change', function(e) {
                $('#formYoriki')
                // Get the bootstrapValidator instance
                    .data('bootstrapValidator')
                    // Mark the field as not validated, so it'll be re-validated when the user change date
                    .updateStatus('birthday', 'NOT_VALIDATED', null)
                    // Validate the field
                    .validateField('birthday')
            });
        // 初始化表单验证
        $('#formYoriki')
            .bootstrapValidator({
                message: 'This value is not valid',
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
                var $form = $(e.target);

                // Get the BootstrapValidator instance
                var bv = $form.data('bootstrapValidator');

                // 验证成功，提交前处理逻辑
                var temp = $('#birthday').val();
                temp = temp.replace(/-/g, '/');
                $('#birthdayForSubmit').val(temp);
                if ($('#birthdayForSubmit').val() == "") {
                    $('#birthdayForSubmit').val("1900/01/01"); // 为了解决日期为空时接口会报错
                }

                // 转义特殊字符，防止js注入
                checkJsInject();

                // Use Ajax to submit form data
                $.ajax({
                    type: "POST",
                    url: $form.attr('action'),
                    data: $form.serialize(),
                    //dataType: "json",
                    async: false,
                    success: function (result) {
                        if (result.success) {
                            showAlert("个人资料已更新", "success");
                            setTimeout("window.location.reload()", 2000);
                        } else {
                            showAlert("个人资料更新失败", "danger");
                            setTimeout("window.location.reload()", 2000);
                        }

                    }
                });

                $('#formYoriki').data('bootstrapValidator').resetForm();
            })

        // 表单事件绑定
        $('#formYoriki')
            .on('change', 'select[name="nation"]', function () {
                if ($('select[name="nation"]').val() == defaultNation) {
                    toggleSelect("able");
                    getAddress1List();
                    getAddress3List();
                    $('#address1').parent().parent().show();
                    $('#address3').parent().parent().show();
                } else {
                    toggleSelect("disabled");
                    $('#address1').parent().parent().hide();
                    $('#address3').parent().parent().hide();
                };
            })
            .on('change', 'select[id="address1"]', function () {
                $('form [name="hometownCity"]').val(0);
                gethometownCityList($('form [id="address1"]').val());
            })
            .on('change', 'select[id="address3"]', function () {
                $('form [name="apartmentCity"]').val(0);
                getapartmentCityList($('form [id="address3"]').val());
            })
        //返回
        $('#prePage').click(function(){
            history.back(-1);
        })
        if($('select[name=nation]').val()==12||$('select[name=nation]').val()==357) {
            $('#address1').parent().parent().hide();
            $('#address3').parent().parent().hide();
        }
    })
})
