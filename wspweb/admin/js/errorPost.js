require(['jquery', 'bootstrap', 'datatables', 'pm'], function () {
	// var data = [];

	var zdfp = $("#businessTable").DataTable({
		// "ordering": false,
		// "info": false,
		// "pagingType": "full_numbers",
		// "dom": '<"top"if>rt<"bottom"lp><"clear">',
		"bAutoWidth": true, //自动宽度
		"dom": '<"top"if>rt<"bottom"lp><"clear">',
		"serverSide": true,
		"bDestory": true,
		"info": false,
		"ordering": false,
		"lengthChange": false,
		"sPaginationType": "full_numbers",
		"ajax": {
			url: '/workflow/api/taskinstanceslist/Retrieve/',
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
			"data": "task_name"
		}, {
			"sTitle": "当前状态",
			"data": "display_state"
		}, {
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
				return '<a href="javascript:void(0)" class="viewTable" data-id="' + data + '">回收</a>';
			},
			targets: 6
		}]
	});
	$("input[type='search']").attr("placeholder", "流水号");
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
});
