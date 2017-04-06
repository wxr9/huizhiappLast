require(['jquerySrc','pm'], function(){
	$.fn.serializeStr = function() {
		var o = {};
		var a = this.serializeArray();
		$.each(a, function() {
			if (o[this.name]) {
				if (!o[this.name].push) {
					o[this.name] = [o[this.name]];
				}
				o[this.name].push(this.value || '');
			} else {
				o[this.name] = this.value || '';
			}
		});
		return JSON.stringify(o);
	};
	$.fn.serializeObj = function() {
		var o = {};
		var a = this.serializeArray();
		$.each(a, function() {
			if (o[this.name]) {
				if (!o[this.name].push) {
					o[this.name] = [o[this.name]];
				}
				o[this.name].push(this.value || '');
			} else {
				o[this.name] = this.value || '';
			}
		});
		return o;
	};
	$.ajaxSetup({
		error: function(jqXHR, textStatus, errorThrown) {
			switch (jqXHR.status) {
				case(500):
					showAlert("服务器系统内部错误");
					break;
				case(401):
					showAlert("未登录");
					break;
				case(403):
					var path = location.pathname;
					if(path.split('/').indexOf('admin') > -1){
						window.location.href='/admin/login.html';
					}else{
						window.location.href='/';
					}
					showAlert("无权限执行此操作");
					break;
				case(408):
					showAlert("请求超时");
					break;
			}
		},
		complete:function(xhr){
			if(xhr.responseText === '{timeout:true}'){
				showAlert("请求超时");
				var path = location.pathname;
				if(path.indexOf('admin') == -1){
					window.location.href='/admin/login.html';
				}else{
					window.location.href='/';
				}
			}
		},
		cache: false,
	});

});
