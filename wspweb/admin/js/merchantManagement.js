/**
 * Created by Hawk on 3/7/16.
 */
require(['pm', 'jquery', 'datatables'], function(){
	var dToption = {
		"bAutoWidth": true, //自动宽度
		"dom": '<"top"if>rt<"bottom"lp><"clear">',
		"serverSide": true,
		"bDestory": true,
		"info": false,
		"ordering": false,
		"lengthChange": false,
		"sPaginationType": "full_numbers",
		"ajax": {
			url: '/Setting/User/CommonUser',
			dataSrc: "result"
		},
		"aoColumns": [{
			"sTitle": "用户名",
			"data": "username"
		}, {
			"sTitle": "姓名",
			"data": "realName"
		}, {
			"sTitle": '性别',
			"data": 'sex'
		}, {
			"sTitle": '手机号',
			"data": 'phone'
		}, {
			"sTitle": "汇智卡号",
			"data": "cardid"
		}, {
			"sTitle": "注册时间",
			"data": "createDate"
		}, {
			"sTitle": "最近登录时间",
			"data": "updateDate"
		}, {
			"sTitle": '操作',
			"data": 'id'
		}],
		"oLanguage": {
			"sProcessing": "处理中",
			"sZeroRecords": "没有匹配结果",
			"sInfoFiltered": "(由 _MAX_ 项结果过滤)",
			"sInfoPostFix": "",
			"sLengthMenu": "显示 _MENU_ 项记录",
			"sSearch": "搜索:",
			"sEmptyTable": "表中数据为空",
			"sLoadingRecords": "载入中...",
			"sInfoThousands": ",",
			"oPaginate": {
				"sFirst": "首页",
				"sPrevious": "<<",
				"sNext": ">>",
				"sLast": "末页"
			}
		},
		"columnDefs": [{
			render : function(data, type, row){
				if(row.sex === 1){
					return "男";
				} else if(row.sex === 2){
					return "女";
				}
			},
			targets : 2
		},
			{
				render: function(data, type, row) {
					var username = row.username;
					var html = [];
					html.push('<a class="operate infoBtn" data-toggle="modal" data-target="#infoModal" data-id=' + username + '>查看</a>');
					if (row.deleteFlag === -1) {
						html.push('<a class="operate enableBtn" data-id=' + username + '>解禁</a>');
					} else { //defalut 0
						html.push('<a class="operate disableBtn" data-id=' + username + '>禁用</a>');
					}
					return html.join('');
				},
				targets: 7
			}],
		//初始化结束
		"initComplete": function() {
			$('#activityPubList').width("100%");
		},
		//加载结束
		"drawCallback": function() {

		}
	};
	$(function(){
		var table = $("#memberTable").DataTable(dToption);
		$('#memberTable').on('click', '.disableBtn', function(){
			var modal = getModal({
				content: '确定禁用商户?',
				callback: function(){
					modal.modal('hide');
				}
			})
		})
	});
});