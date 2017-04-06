require(['jquery', 'bootstrap', 'bootstrapvalidator', 'pm'], function () {
	// 验证字段
	var validatorFields = {
		contact: {
			validators: {
				notEmpty: {
					message: '联系方式不能为空'
				}
			}
		},
		company: {
			validators: {
				notEmpty: {
					message: '公司名称不能为空'
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
		typeId: {
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
		repairType2: {
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
				}
			}
		},
		description: {
			validators: {
				notEmpty: {
					message: '保修描述不能为空'
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
	// 验证成功，提交前处理逻辑
	var fn_successBeforeSubmit = function () {

	};
	$.ajax({
		url : '/Setting/Park/1/100',
		success : function(data){
			var target = $("#parkId");
			function getBuildingList(ele){
				$.ajax({
					url : '/Setting/Building/1/100?parkId=' + target.val(),
					success : function(da){
						var ta = $(ele).empty();
						$(da.result).each(function(i,v){
							ta.append('<option value="'+ v.objectid+'">'+ v.name+'</option>');
						})
					}
				})
			}
			$(data.result).each(function(ind,val){
				target.append('<option value="'+val.objectid+'"> '+val.name+'</option>');
			});
			getBuildingList("#buildingId");
			target.on('change', function(){
				getBuildingList("#buildingId");
			})
		}
	});

	// 初始化表单验证
	initBootstrapValidator(validatorFields, fn_successBeforeSubmit);
	$("#form").data('bootstrapValidator').validate();
	var status = false;
	var sn,objid;

	require(['dropify'], function(){
		$('.dropify').dropify({
			messages: {
				'default': '把文件拖到此处 或 点击上传文件',
				'replace': '把文件拖到此处 或 点击替换文件',
				'remove': '移除',
				'error': '对不起，您上传的文件超出大小限制'
			},onfileload : function(data){
				$("#photo_urlA").val(data);
			}
		})
	});
	$("#save").on('click', function(){
		var bv = $("#form").data('bootstrapValidator');
		if(!bv.isValid()){
			bv.validate();
			showAlert('保存失败' , 'warn');
		}else{
			showAlert('保存成功');
			//var formData = $("#form").serialize();
			var formObj = $("#form").serializeObj();
			status = 'wait';
			formObj.typeId = 2;
			$.ajax({
				url : '/UserRepair/Add',
				method : 'post',
				data  : formObj,
				success : function(data){
					status = true;
					if(data.success === true){
						sn = data.sn;
						objid = data.objectid;
					}else{
						showAlert(data.msg);
					}
				}
			});
		}
	});
	$("#send").on('click', function(){
		if(status === true){
			$.ajax({
				url : '/workflow/api/create/1',
				success : function(data){
					if(data.success !== false){
						$.ajax({
							url : '/workflow/api/newTransfer',
							method : "POST",
							data : {
								identity_field_value : objid,
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
									if (window.opener) {
										window.opener.href = "";
										window.close();
									} else {
										setTimeout(function () {
											window.location.href = "myWiz.html"
										}, 3000)
									}
									$("#save").attr('disabled', true)
								}
							}
						})
					}else{
					}
				}
			});
		}else if(status ==='wait'){
			showAlert('保存中,请稍后...', 'warn');
		}else{
			showAlert('请先保存', 'warn');
		}
	})

});
