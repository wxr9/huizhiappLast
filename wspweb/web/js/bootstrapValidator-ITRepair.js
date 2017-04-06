require(['jquery', 'bootstrap', 'bootstrapvalidator','datepicker','dropify', 'pm'], function () {
    $(function () {
        checkInfo();
        // var isITRepairEnable = false; // IT报修是否处于有效期
        // var isBind=false;//IT报修是否绑定企业
        // var mssssg = "";
        // var baseEnable;//IT报修是否停止服务
        //申请IT网络报修
        //如果非有效时间，弹出提示
        //获取IT报修是否处于申请有效期
        // $.ajax({
        //     type: 'GET',
        //     url: '/Setting/CheerDay/IsRepairEnable/2',
        //     //dataType: 'json',
        //     async: false,
        //     success: function (result) {
        //         mssssg = result.msg;
        //         if (result.success) {
        //             isITRepairEnable = true;
        //         }else{
        //             showAlert('非工作时间不能申请IT报修')
        //         }
        //     }
        // });
        //判断IT报修是否停止
        // $.ajax({
        //     type: 'GET',
        //     url: '/Setting/SettingRepairComment/Edit/2',
        //     //dataType: 'json',
        //     async: false,
        //     success: function (result) {
        //         baseEnable=result.baseEnable;
        //     }
        // });
        //是否是企业用户，进入IT报修页面
        // $.ajax({
        //     url:'/Setting/User/IsBindEnterprise',
        //     //dataType:'json',
        //     async: false,
        //     success:function(result){
        //         if(result.msg=='已绑定'){
        //             isBind=true;
        //         }else if(result.msg=='审核中'){
        //             showAlert('您绑定的企业正在审核中！');
        //         }else{
        //             showAlert('您尚未绑定企业！');
        //         }
        //     }
        // })
        // if(baseEnable!==1){
        //         if(isBind==false|isITRepairEnable ==false){
        //             $('#save').attr('disabled','disabled');
        //         }
        // }

        // 验证字段
        var validatorFields = {
                contact: {
                    validators: {
                        notEmpty: {
                            message: '联系方式不能为空'
                        },
                        regexp: {
                            regexp:/^[0-9]{11}$/g,
                            message:  '请输入11位手机号'
                        }
                    }
                },
                mobile: {
                    validators: {
                        //notEmpty: {
                        //    message: '固定电话不能为空'
                        //},
                        regexp: {
                            regexp:/^[0-9]{8}$/g,
                            message:  '请输入8位固定电话号码'
                        }
                    }
                },
                //photoUrl: {
                //    validators: {
                //        notEmpty: {
                //            message: '图片不能为空'
                //        }
                //    }
                //},
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
                parkId: {
                    validators: {
                        callback: {
                            callback: function (value, validator) {
                                if (value == 0) {
                                    return {
                                        valid: false,
                                        message: '请选择园区'
                                    }
                                }
                                return true;
                            }
                        }
                    }
                },
                buildingId: {
                    validators: {
                        callback: {
                            callback: function (value, validator) {
                                if (value == 0) {
                                    return {
                                        valid: false,
                                        message: '请选择楼宇'
                                    }
                                }
                                return true;
                            }
                        }
                    }
                },
                repairTypeParent: {
                    validators: {
                        callback: {
                            callback: function (value, validator) {
                                if (value == 0) {
                                    return {
                                        valid: false,
                                        message: '请选择报修类别'
                                    }
                                }
                                return true;
                            }
                        }
                    }
                },
                repairType: {
                    validators: {
                        callback: {
                            callback: function (value, validator) {
                                if (value == 0) {
                                    return {
                                        valid: false,
                                        message: '请选择类型'
                                    }
                                }
                                return true;
                            }
                        }
                    }
                },
                address: {
                    validators: {
                        notEmpty: {
                            message: '报修地址不能为空'
                        },
                        stringLength: {
                            min: 0,
                            max: 200,
                            message: '限200字以内'
                        }
                    }
                },
                description: {
                    validators: {
                        notEmpty: {
                            message: '报修描述不能为空'
                        },
                        stringLength: {
                            min: 0,
                            max: 100,
                            message: '限100字以内'
                        }
                    }
                },
                memo: {
                    validators: {
                        stringLength: {
                            min: 0,
                            max: 100,
                            message: '限100字以内'
                        }
                    }
                }
            }
        //选择时间
        $(".form_datetime")
            .datetimepicker({
                format: "yyyy/mm/dd hh:ii",
                autoclose: true,
                todayBtn: true,
                pickerPosition: "bottom-left",
                minView: '0',
                startDate: new Date()
            });

        $.ajax({
            url: '/Setting/Park/1/100',
            success: function (data) {
                var target = $("#parkId");

                function getBuildingList(ele) {
                    $.ajax({
                        url: '/Setting/Building/BuildingByParkId/1/100/' + target.val(),
                        success: function (da) {
                            var ta = $(ele).empty();
                            $(da.result).each(function (i, v) {
                                ta.append('<option value="' + v.objectid + '">' + v.name + '</option>');
                            })
                        }
                    })
                }
                $(data.result).each(function (ind, val) {
                    target.append('<option value="' + val.objectid + '"> ' + val.name + '</option>');
                });
                getBuildingList("#buildingId");
                target.on('change', function () {
                    getBuildingList("#buildingId");
                })
            }
        });

        $.ajax({
            url:  '/Setting/SettingDict/ParentIdExceptTop/List/0/0?type=ITrepairsFlag',
            success: function (data) {
                var target = $("#repairTypeParent");

                function getRepairTypeList(ele) {
                    $.ajax({
                        url: '/Setting/SettingDict/ParentId/0/0/' + target.val(),
                        success: function (da) {
                            var ta = $(ele).empty();
                            $(da.result).each(function (i, v) {
                                ta.append('<option value="' + v.objectid + '">' + v.name + '</option>');
                            })
                        }
                    })
                }
                $(data.result).each(function (ind, val) {
                    target.append('<option value="' + val.objectid + '"> ' + val.name + '</option>');
                });
                getRepairTypeList("#repairType");
                target.on('change', function () {
                    getRepairTypeList("#repairType");
                })
            }
        });

        $.ajax({
            url: '/Setting/User/MyInfo',
            success: function (data) {
                $('#applicant').val(data.username);
                $('#contact').val(data.phone);
                if (data.enterpriseId) {
                    $('#company').val(data.enterprise.name);
                } else {
                    $('#company').val(data.enterpriseInput);
                }
	            $("#form").data('bootstrapValidator').validate();

            }
        });


        // 初始化表单验证
        initBootstrapValidator(validatorFields,function(e){
            window.open('', '_self', ''); window.close();
        });
        //$("#form").data('bootstrapValidator').validate();
        var status = false;
        var sn, objid;
					require(['jqueryUpload'], function(UploadImg){
						UploadImg({
							file : 'photo_urlA',
							url : '/FileUpload/UploadImgComm',
							extData:{
								type: 'png'
							},
                            multiple:true,
							fileName:'file',
                            name:'photoUrl',
							loadingImg: '/lib/images/loading.gif',
							validatorImg: '/lib/images/validator.png',
							path: 'response path data',
							statusName: 'success',
							preview: {
								prevUrl: '/'
							},
							success: function(data){
								showAlert('上传成功');
							},
							error: function(data){
								showAlert('上传失败');
							}
						})

					});

        $("#save").on('click', function () {
            var bv = $("#form").data('bootstrapValidator');
            if (!bv.isValid()) {
                bv.validate();
                showAlert('请完善必填项信息', 'warn');
            } else {
                //var formData = $("#form").serialize();
	            $(this).attr('disabled','disabled');
	            var formObj = $("#form").serializeObj();
                status = 'wait';
                formObj.typeId = 2;
                formObj.createDate = new Date;
                $.ajax({
                    url: '/UserRepair/Add',
                    method: 'post',
                    data: formObj,
                    success: function (data) {
                        status = true;
                        if (data.success === true) {

                            sn = data.sn;
                            objid = data.objectid;
                            $("#send").get(0).click();
                            //获取IT报修是否处于申请有效期
                            $.ajax({
                                type: 'GET',
                                url: '/Setting/CheerDay/IsRepairEnable/2',
                                //dataType: 'json',
                                async: false,
                                success: function (result) {
                                    if(!result.success){
                                        showAlert(result.msg);
                                    }
                                }
                            });
                        } else {
	                        showAlert(data.msg);
                        }
                    }
                });
            }
        });

        var deleteRepair = function (oid) {
            $.ajax({
                url: '/UserRepair/Delete/' + oid,
                method: 'post',
                success: function () {}
            });
        };

        $("#send").hide().on('click', function () {
            if (status === true) {
                $.ajax({
                    url: '/workflow/api/create/2',
                    success: function (data) {
                        if (data.success !== false) {
                            if (data.process && data.task_id && data.task_user && data.related_table) {
                                $.ajax({
                                    url: '/workflow/api/newTransfer',
                                    method: "POST",
                                    data: {
                                        identity_field_value: objid,
                                        process_id: data.process,
                                        task_id: data.task_id,
                                        task_user: data.task_user,
                                        sn: sn,
                                        related_table: data.related_table,
                                        title: sn
                                    },
                                    success: function (da) {
                                        if (da.success == false) {
                                            deleteRepair(objid);
                                            showAlert(da.msg, 'warn');
                                        } else if (da.success === true) {
                                            showAlert(da.msg);
                                            //if (window.opener) {
                                            //    window.opener = null;
                                            //    window.open('', '_self', ''); window.close();
                                            //} else {
                                            setTimeout(function () {
                                                window.location.href = "myWiz.html"
                                            }, 3000)
                                            //}
                                            $("#save").attr('disabled', true)
                                        }
                                    }
                                })
                            } else {
                                deleteRepair(objid);
                                showAlert(data.msg,'warn');
                            }
                        } else {
                            //console.log(data);
                        }
                    }
                });
            } else if (status === 'wait') {
                showAlert('保存中,请稍后...', 'warn');
            } else {
                showAlert('请先保存', 'warn');
            }
        })
    })
});
