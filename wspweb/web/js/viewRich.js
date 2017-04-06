require(['jquery', 'pm'], function(){
	var id = queryString('id');
	var name = queryString('name');
	$('.pageTitle').html(name);
	if(id != undefined){
		$.ajax({
			url: '/Setting/RichText/Edit/'+ id,
			success: function(data){
				$("#content").append(data.content);

			}
		})
	}
	var title = queryString('title');
	if(title != undefined){
		$.ajax({
			url: '/Setting/RichText/ByTitle/Edit?title=' + encodeURI(title),
			success: function(data){
				$("#content").append(data.content);
			}
		})
		$('.pageTitle').text(title);
	}
});