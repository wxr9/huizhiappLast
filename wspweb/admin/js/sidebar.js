require(['jquery'], function () {
	$(function(){
		$.ajax({
			url : '/Setting/MenuAdmin/GetRoleMenu?timestamp=' + new Date().getTime(),
			success: function(data){
				var ul = $('#sidebar>ul');
				var a = $('<a href="javascript:void(0)" />');
				var i = $('<i class="fa" />');
				var submenu = $("<li class='submenu' />");
				var li = $("<li />");
				var target,menu;
				$(data).each(function(ind,val){
					if(val.parent == 0){
						target = ul;
						menu = $(a.clone().append(i.clone().addClass(val.icon)).append('<span>'+val.name+'</span>').append(i.clone().addClass('fa-angle-down').css('float','right')));
						target.append(submenu.clone().append(menu).attr('id','menu'+val.id).append('<ul/>'));
					}else{
						target = ul.find('li#menu' + val.parent).find('ul');
						menu = li.clone().append(a.clone().attr('href',val.url).html(val.name));
						target.append(menu);
					}
				})
				$('.submenu > a').click(function (e) {
					e.preventDefault();
					var submenu = $(this).siblings('ul');
					var li = $(this).parents('li');
					var submenus = $('#sidebar li.submenu ul');
					var submenus_parents = $('#sidebar li.submenu');
					if (li.hasClass('open')) {
						if (($(window).width() > 768) || ($(window).width() < 479)) {
							submenu.slideUp();
						} else {
							submenu.fadeOut(250);
						}
						li.removeClass('open');
					} else {
						if (($(window).width() > 768) || ($(window).width() < 479)) {
							submenus.slideUp();
							submenu.slideDown();
						} else {
							submenus.fadeOut(250);
							submenu.fadeIn(250);
						}
						submenus_parents.removeClass('open');
						li.addClass('open');
					}
				});

				var ul = $('#sidebar > ul');

				$('#sidebar > a').click(function (e) {
					e.preventDefault();
					var sidebar = $('#sidebar');
					if (sidebar.hasClass('open')) {
						sidebar.removeClass('open');
						ul.slideUp(250);
					} else {
						sidebar.addClass('open');
						ul.slideDown(250);
					}
				});

				//--------------------------------------根据页面地址，左侧导航设置高亮
				var href = window.location.href;
				$("#sidebar").find('a').each(function(i, v){
					var _link = $(this).attr('href').split('/').pop();
					var hre = href.match(/[^\/]+\.html+/);
					if(hre.length != 0){
						hre=hre[0];
					}
					if(_link == hre){
						$(v).parents(".submenu").addClass('active open');
						$(v).parents('li').eq(0).addClass('active');
					}
				});
			}



		})

	})

});
