/**
 * Created by Hawk on 3/7/16.
 */
function getModalTemp(option){
	var item = option.item;
	var content = $('<div />');
	var line = $('<div class="form-group" />');
	var label = $('<label class="col-sm-3" />');
	var input = $('<input class="form-control" />');
	var text = $('<div />');
	var sp = $('<div class="col-sm-7" />');
	$(item).each(function(ind,val){
		var da = lineData.clone();
		var target;
		da.push(label.clone().html(val.label));
		var rda = sp.clone().appendTo(da);
		if(val.type === 'input'){
			target = input.clone().attr('type', 'text');
		}else if(val.type === 'text'){
			target = text.clone();
		}else if(val.type === 'select'){

		}else if(val.type === 'img'){

		}
		if(val.disabled === true){
			target.attr('disabled', true);
		}
		rda.append(target);

	})
}
