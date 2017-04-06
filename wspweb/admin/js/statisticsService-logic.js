require(['jquery', 'bootstrap', 'datepicker', 'pm'], function () {
    $(document).ready(function () {


		$(".form_datetime").datetimepicker({
			format: "yyyy-mm-dd",
			language: 'cn',
			autoclose: true,
			todayBtn: true,
			startDate: "2015-01-01",
			endDate: new Date(),
			minView: "month"
		});
		$.ajax({
			url: '/workflow/api/pistatcount',
			success: function (data) {
				$("#CS1").html(data.total);
				$("#CS2").html(data.total_month);
				$("#CS3").html(data.total_day);
			}
		});
		$.ajax({
			url: '/workflow/api/duestatcount',
			success: function (data) {
				$("#YQ1").html(data.total);
				$("#YQ2").html(data.total_month);
				$("#YQ3").html(data.total_day);
			}
		});
		//评价
		$.ajax({
			url: '/Comment/StatisticsNumber',
			success: function (data) {
				$(data[0]).each(function (i, v) {
					$("#pj" + (i + 1)).html(v)
				})
			}
		});


		//点击事件
		var typeArr = $('button[name="type"]');
		typeArr.on('click', function () {
			$(this).addClass('active').siblings().removeClass('active')
		})
		var op={
			url:'/workflow/api/pistatdate/',
			title:'服务次数统计',
			legend:['服务次数'],
			sname:'服务次数'
		}
		//tab切换
		var tabId ='oneNav';

		$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
			$('input[name="beginDate"]').val("");
			$('input[name="endDate"]').val("");
			$('#serviceType').empty();

			tabId = e.target.id;
			if(tabId=='oneNav'){
				op={
					url:'/workflow/api/pistatdate',
					title:'服务次数统计',
					legend:['服务次数'],
					sname:'服务次数',
					id:'one'
				}


			}else if(tabId == 'twoNav'){
				op={
					url:'/workflow/api/duestatdate',
					title:'逾期次数',
					legend:['逾期次数'],
					sname:'逾期次数',
					id:'two'
				}


			}else{
				op={
					url:'/Comment/StatisticsData',
					title:'服务评价统计',
					legend:['响应速度','服务态度','服务速度'],
					sname:'统计次数',
					id:'three'
				}

			}
		})
		//开始时间小于结束时间
		var start;
		var end;
		$('#typeBegin').on('change', function(){
			start= new Date($('#typeBegin').val());
			end= new Date($('#typeEnd').val());
			if(start>end&&end!='') {
				showAlert('结束时间不小于开始时间');
				$('#typeBtn').attr('disabled','disabled');
			}else if((end-start)/1000/60/60/24>30 && $('.dayOrMonth1').is(':checked')){
				showAlert('日统计查询时间不能超过30天');
				$('#typeBtn').attr('disabled','disabled');
			}else{
				$('#typeBtn').removeAttr('disabled','');
			}
		})
		$('#typeEnd').on('change', function(){
			start= new Date($('#typeBegin').val());
			end= new Date($('#typeEnd').val());
			if(start>end) {
				showAlert('结束时间不能晚于开始时间');
				$('#typeBtn').attr('disabled','disabled');
			}else if((end-start)/1000/60/60/24>30 && $('.dayOrMonth1').is(':checked')){
				showAlert('日统计查询时间不能超过30天');
				$('#typeBtn').attr('disabled','disabled');
			}else{
				$('#typeBtn').removeAttr('disabled','');
			}
		});
		$('input[name="dayOrMonth"]').on('change',function(){
			$('#typeEnd').trigger('change');
		})
		//服务类别查询
		$('#typeBtn').on('click', function () {
			showChart(op)
		})
		//产生数据图
		function showChart(op){
			var type = $('button[name="type"].active').val();
			var beginDate = $('input[name="beginDate"]').val();
			var endDate = $('input[name="endDate"]').val();
			var flag = $('input[name="dayOrMonth"]:checked').val();
			var option ={};
			$.ajax({
				type: 'GET',
				url: op.url +'?beginDate='+ beginDate + '&endDate=' + endDate + '&query=' + type + '&flag=' + flag,
				dataType: 'json',
				success: function (data) {
					var xdata;
					var ydata;

					if(op.id == 'three'){
						xdata = data.xAxis;
						ydata = data.series;

						var	option = {
							title: {
								text: op.title
							},
							tooltip: {
								trigger: 'axis'
							},
							legend: {
								data: op.legend
							},
							calculable: true,
							xAxis: [
								{
									type: 'category',
									data: xdata[0].data
								}
							],
							yAxis: [
								{
									type: 'value'
								}
							],
							series: [
								{
									name: '响应速度',
									type: 'bar',
									data: ydata[2].data,
									//markPoint: {
									//	data: [
									//		{type: 'max', name: '最大值'},
									//		{type: 'min', name: '最小值'}
									//	]
									//},
									// markLine: {
									// 	data: [
									// 		{type: 'average', name: '平均值'}
									// 	]
									// }
								},
								{
									name: '服务态度',
									type: 'bar',
									data: ydata[1].data,
									//markPoint: {
									//	data: [
									//		{type: 'max', name: '最大值'},
									//		{type: 'min', name: '最小值'}
									//	]
									//},
									// markLine: {
									// 	data: [
									// 		{type: 'average', name: '平均值'}
									// 	]
									// }
								},
								{
									name: '服务速度',
									type: 'bar',
									data: ydata[3].data
								}
							]
						};
					}else{
						xdata = data.xAxis.data;
						ydata = data.series.data;
					var	option = {
							title: {
								text: op.title
							},
							tooltip: {
								trigger: 'axis'
							},
							legend: {
								data: op.legend
							},
							xAxis: [
								{
									type: 'category',
									data: xdata
								}
							],
							yAxis: [
								{
									type: 'value'
								}
							],
							series: [
								{
									name: op.sname,
									type: 'bar',
									data: ydata
								}
							]
						};
					}
					//初始化图表
					require([
						'echarts',
						'echarts/chart/bar'
					], function (ec) {
						var typeChart = ec.init(document.getElementById('serviceType'));
						typeChart.setOption(option);

					})

				},
				error: function (e) {

				}
			});

		}

		//show detail
		$.ajax({
			type:"GET",
			url:'/workflow/api/pistatbytype',
			dataType:'json',
			success:function(result){
				if(result != undefined){
					var data = result;
					var category = data.category;
					var month = data.category_month;
					var day = data.category_day;
					//初始化图表
					require([
						'echarts',
						'echarts/chart/pie'
					], function (ec) {
						var chart1 = ec.init(document.getElementById('chart1'));
						var chart2 = ec.init(document.getElementById('chart2'));
						var chart3 = ec.init(document.getElementById('chart3'));
						chart1.setOption(option('累计服务次数', category));
						if(month.length != 0){
							chart2.setOption(option('当月服务次数', month));
							if(day.length != 0){
								chart3.setOption(option('当日服务次数', day));
							}else{
								$('#chart3').parent().remove();
							}
						}else{
							$('#chart2').parent().remove();
							$('#chart3').parent().remove();
						}
					})

					$(".rectangleGrid1").on('mouseover','.rectangle',function(e){
						var next = $(this).next('.panel-chart');
						if(next){
							next.stop().slideDown();
						}
					})
					$(".rectangleGrid1").on('mouseout','.rectangle',function(e){
						$('.panel-chart').stop().slideUp();
					})
				}

			}
		})
		function option(title,chartDate){
			var chartLegend = getLegendName(chartDate);

			var op = {
				title : {
					text: title,
					x:'left',
					textStyle:{
						fontSize:18,
						fontWeight:'bolder',
						color: '#008acb'
					}
				},
				tooltip : {
					trigger: 'item',
					formatter: "{a} <br/>{b} : {c} ({d}%)"
				},
				legend: {
					orient : 'vertical',
					x : 'right',
					data:chartLegend
				},
				calculable : true,
				series : [
					{
						name: '数据详情',
						type: 'pie',
						radius: '55%',
						center: ['40%', '60%'],
						itemStyle: {
							normal: {
								label: {
									position: 'outer',
									formatter: "{b} {c}"
								},
								labelLine: {
									show: true
								}
							},
							emphasis: {
								label: {
									show: true,
									formatter: "{b} {d}%"
								}
							}
						},
						data:chartDate

					}
				]
			};

			return op;
		}

		//获取图标名
		function getLegendName(data){
			var name = [];
			var len = data.length;
			data.forEach(function(e){
				name.push(e.name);
			})
			return name;
		}


	});

});
