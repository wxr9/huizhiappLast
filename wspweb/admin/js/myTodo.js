require(['jquery', 'bootstrap', 'datatables', 'pm'], function () {
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
			url: '/workflow/api/processinstances/my_done/list',
			data:function(d){
				d.sn__contains=$('input[name=sn__contains]').val()
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
			//   "sTitle": '申请公司',
			//   "data": 'phone'
			// }, {
			"sTitle": "当前状态",
			"data": "current_state"
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
				var type = row.sn.slice(0, 2);
				//if(type == 'WY' || type == 'IT'){
				//	return ('<a target="_blank" href="/web/myWorkflowDetail.html?sn='+row.sn+'&repairId='+row.identity_field_value +'" style="margin-left:10px;">查看详情</a>');
				//}else
				return ('<a target="_blank" href="/admin/workflowView.html?id='+row.current_taskinstance_id+'&iid='+row.identity_field_value+'&type='+type+'" style="margin-left:10px;">查看详情</a>');
			},
			targets: 5
		}]
	});
	$(function(){
		//查询
		$('input[name=sn__contains]').bind('keydown', function (e) {
			var key = e.which;
			if (key == 13) {
				zdfp.ajax.reload();
			}
		})
		$('#searchBtn').on('click',function(){
			zdfp.ajax.reload();
		})
		//清除查询
		$('#clearBtn').on('click',function(){
			$('input[name=sn__contains]').val("");
			zdfp.ajax.reload();
		})
	})

});
