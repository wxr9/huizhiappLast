require(['jquery','pm'], function () {
	$(function () {
		$.ajax({
			url: '/Setting/SettingHelps/1/10',
            type:'GET',
            dataType:'json',
			success: function (data) {
				data = JSON.parse(data.result[0].content) || '';
                $('#nav-help').empty();
                $('#nav-content').empty();
				$(data).each(function (ind, val) {
					var parsent; //一级菜单
                    var child=[]; //子菜单
					if (val.parent === undefined) {
                        var id = ind;
                        if(ind == 0){
                            parsent = "<li class='active'><a data-toggle='tab' href='#parent"+ind+"'>" + val.filename + "</a></li>";
                            child.push("<div class='tab-pane active' id='parent"+ind+"'><ul class='item'>");
                        }else{
                            parsent = "<li><a data-toggle='tab' href='#parent"+ind+"'>" + val.filename + "</a></li>";
                            child.push("<div class='tab-pane' id='parent"+ind+"'><ul class='item'>")
                        }

						$('#nav-help').append(parsent);
                        var num = 0;
                        $(val.files).each(function(ind,val){
                            if(val.id != ""){
                                num++;
                                child.push("<li><a target='_blank' href='/web/viewRich.html?id="+val.id+"&name="+val.name+"'><span class='num'>"+arabic2Roman(num)+"</span>"+val.name+"</a></li>")
                            }
                        });
                        child.push("</ul></div>");
                        $('#nav-content').append(child.join(''));
					}
				});
			}
		});


        //将阿拉伯字母转成罗马字母
        var arabic2Roman = function(number){
            // convert the number to a roman numeral
            var  roman = {M:1000,CM:900, D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1 };
            var ans = '';
            while(number>0){
                for(var a in roman){
                    if(roman[a]<=number){ ans += a; number-=roman[a]; break;}

                }
            }
            return ans;
        };
	});
});
