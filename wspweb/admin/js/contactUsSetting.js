/**
 * Created by Hawk on 15/12/18.
 */
require(['jquery', 'pm','bootstrap'], function(){

	$(function(){
		selectRich("#selectRich");
		$("#saveRich").on('click', function(){
			var id = $('.selectRich').attr('data-id');
			if(!id){
				showAlert('请选择富文本','warn');
				return;
			}
			$.ajax({
				url : '/Setting/SettingAbout/Update',
				method : "POST",
				data : {
					flag : 2,
					objectid : 2,
					richtextid : id
				},
				success : function(data){
					if(data.success === true){
						showAlert(data.msg);
					}
				}
			})
		});
		$('#viewRich').on('click', function(){
			var self = $(this);
			window.open('/web/viewRich.html?id=' + self.parent().find('input').attr('data-id')+'&name='+self.parent().find('input').val())
		});
		var date = new Date();
		$.ajax({
			url:'/Setting/SettingAbout/Edit/2?time='+date.getTime(),
			success: function(data){
				$(".selectRich").val(data.settingRichText.title).attr('data-id',data.richtextid);
			}
		});
	})




});