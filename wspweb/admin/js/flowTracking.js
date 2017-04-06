require(['jquery', 'bootstrap', 'datatables', 'pm','datepicker'], function () {
	// var data = [];

	var zdfp = $("#businessTable").DataTable({
		// "ordering": false,
		// "info": false,
		// "pagingType": "full_numbers",
		// "dom": '<"top"if>rt<"bottom"lp><"clear">',
		"bAutoWidth": true, //自动宽度
		"dom": '<"top">rt<"bottom"lp><"clear">',
		"serverSide": true,
		"bDestory": true,
		"info": false,
		"ordering": false,
		"lengthChange": false,
		"sPaginationType": "full_numbers",
		"ajax": {
			url: '/workflow/api/processinstances',
			data:function(d){
				d.starttime__gte = $('#startDate').val();
				d.starttime__lte = $('#endDate').val();
				d.sn__contains=$('input[name=sn__contains]').val();
				d.process__business__id=$('#select').val();
			},
			dataSrc: "result"
		},
		"aoColumns": [{
			"sTitle": "流水号",
			"data": "sn"
		}, {
			"sTitle": "服务类别",
			"data": "process_name"
		}, {
			"sTitle": '申请人',
			"data": 'creator'
		}, {
			"sTitle": "当前节点",
			"data": "current_state"
		}, {
			"sTitle": "处理人",
			"data": "current_user"
		},
			{
			"sTitle": "发起时间",
			"data": "addtime"
		}, {
			"sTitle": '操作',
			"data": 'id'
		}],
		// "paging": false,
		"language": {
			"sProcessing": "处理中",
			"sZeroRecords": "没有匹配结果",
			"sInfo": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
			"sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
			"sInfoFiltered": "(由 _MAX_ 项结果过滤)",
			"sInfoPostFix": "",
			"lengthMenu": "显示 _MENU_ 条",
			"sSearch": "搜索:",
			"sEmptyTable": "表中数据为空",
			"sLoadingRecords": "载入中...",
			"sInfoThousands": ",",
			"oPaginate": {
				"sFirst": "首页",
				"sPrevious": "<<",
				"sNext": ">>",
				"sLast": "末页"
			},
			"oAria": {
				"sSortAscending": ": 以升序排列此列",
				"sSortDescending": ": 以降序排列此列"
			}
		},
		"columnDefs": [{
			render: function (data, type, row) {
				var type = row.sn.slice(0, 2);
				return ('<a target="_blank" href="/admin/workflowView.html?id='+row.current_taskinstance_id+'&iid='+row.identity_field_value+'&type='+type+'" style="margin-left:10px;">查看详情</a>');
				//return '<a href="/web/myWorkflowDetail.html?sn='+row.sn+'&repairId='+row.identity_field_value+'" target="_blank" class="viewTable">查看详情</a>';
				//return '<a href="javascript:void(0)" class="viewTable" data-id="' + data + '">查看详情</a>';
			},
			targets: 6
		}]
	});
	//$("input[type='search']").attr("placeholder", "公司/流水号");
	$("#businessTable").on('click', '.viewTable', function () {
		var id = $(this).attr('data-id');
		$.ajax({
			url : '/workflow/api/taskinstances/recovery/' + id,
			method : 'delete',
			success : function(data){
				data.success === true ? showAlert(data.msg) : showAlert(data.msg, 'warn');
				zdfp.ajax.reload();
			}
		})
	});

	//逾期列表
	var overdue = $("#overdueTable").DataTable({
		// "ordering": false,
		// "info": false,
		// "pagingType": "full_numbers",
		// "dom": '<"top"if>rt<"bottom"lp><"clear">',
		"bAutoWidth": true, //自动宽度
		"dom": '<"top">rt<"bottom"lp><"clear">',
		"serverSide": true,
		"bDestory": true,
		"info": false,
		"ordering": false,
		"lengthChange": false,
		"sPaginationType": "full_numbers",
		"ajax": {
			url: '/workflow/api/taskinstanceslist/due/list',
			data:function(d){
				d.starttime__gte = $('#starttime__gte').val();
				d.starttime__lte = $('#starttime__lte').val();
				d.sn__contains=$('input[name=sn__contains]').val();
				d.process__business__id=$('#select').val();
			},
			dataSrc: "result"
		},
		"aoColumns": [{
			"sTitle": "流水号",
			"data": "sn"
		}, {
			"sTitle": "服务类别",
			"data": "process_name"
		}, {
			"sTitle": '申请人',
			"data": 'creator'
		}, {
			"sTitle": '受理人',
			"data": 'task_user'
		}, {
			"sTitle": '业务名称',
			"data": 'task_name'
		}, {
			"sTitle": "逾期时间",
			"data": "duetime"
		}, {
			"sTitle": '状态',
			"data": 'display_state'
		},{
			"sTitle": '操作',
			"data": 'id'
		}
		],
		// "paging": false,
		"language": {
			"sProcessing": "处理中",
			"sZeroRecords": "没有匹配结果",
			"sInfo": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
			"sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
			"sInfoFiltered": "(由 _MAX_ 项结果过滤)",
			"sInfoPostFix": "",
			"lengthMenu": "显示 _MENU_ 条",
			"sSearch": "搜索:",
			"sEmptyTable": "表中数据为空",
			"sLoadingRecords": "载入中...",
			"sInfoThousands": ",",
			"oPaginate": {
				"sFirst": "首页",
				"sPrevious": "<<",
				"sNext": ">>",
				"sLast": "末页"
			},
			"oAria": {
				"sSortAscending": ": 以升序排列此列",
				"sSortDescending": ": 以降序排列此列"
			}
		},
		"columnDefs": [{
			render: function (data, type, row) {
				var type = row.sn.slice(0, 2);
				return '<a href="/admin/workflowView.html?id='+row.id+'&iid='+row.identity_field_value+'&type='+type+'" target="_blank" class="viewTable">查看详情</a>';
				//return '<a href="javascript:void(0)" class="viewTable" data-id="' + data + '">查看详情</a>';
			},
			targets: 7
		}]
	});
	$(function(){
		//开始时间小于结束时间
		$('#endDate').on('change', function(){
			var start = new Date($('#startDate').val());
			var end = new Date($('#endDate').val());
			if(start>end) {
				showAlert('结束时间不小于开始时间')
			}
		});
		//选择时间
		$(".form_datetime")
			.datetimepicker({
				format: "yyyy-mm-dd",
				autoclose: true,
				todayBtn: true,
				pickerPosition: "bottom-left",
				minView: 'month',
				startDate: '2015-01-01',
				endDate: new Date()
			})
		//查询
		$('#searchBtn').on('click',function(){
			zdfp.ajax.reload(null, false);
			overdue.ajax.reload(null, false);
		})
		//选择项的下拉菜单
		getSelects($("#select"));
		//获取所有培训项目id
		function getSelects(selector, id) {
			$.ajax({
				type: "GET",
				url: "/workflow/api/business",
				dataType: 'json',
				success: function (data) {
					var target = $("#select");
					target.append('<option></option>');
					$(data.objects).each(function (ind, val) {
						target.append('<option value="' + val.id + '">' + val.name + '</option>');
					})
				}
			})
		}

		//清除查询
		$('#clearBtn').on('click',function(){
			$('#startDate').val("");
			$('#endDate').val("");
			$('#select').val("");
			$('input[name=sn__contains]').val("");
			zdfp.ajax.reload(null, false);
			overdue.ajax.reload(null, false);
		})
		//逾期没有查询条件
		$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
			if($(e.target).text()=='逾期'){
				$('#searchForm').hide();
			}else{
				$('#searchForm').show();
			}
		})
	})
});
