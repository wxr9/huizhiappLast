define(['jquery'], function($){
	//UploadImg({
	//	file : 'abc',
	//	url : '/FileUpload/SimpleUploadFile',
	//	extData:{
	//		type: 'png'
	//	},
	//	name: 'imgname',
	//	fileName: 'fileName',
	//  statusName : 'status',
	//  preview: {
	//    prevUlr : '',
	//    target : jqueryDom,
	//  },
	//	path: 'response path data',
	//	success: function(data){
	//		console.log(data);
	//	},
	//	error: function(data){
	//
	//	}
	//});
	//return obj
	/**
	 *
	 * @param options
	 * @returns {UploadImg}
	 * method reset 重置
	 * method setData 设置图片
	 * props file dom对象
	 * @constructor
     */
	function UploadImg(options){
		const  fileTypes =".doc,.docx,.xls,.xlsx,.pdf,.html,.zip,.rar,.7z,.iso";
		const  imageTypes = ".jpeg,.jpg,.png,.gif,.bmp";
		if(!(this instanceof UploadImg)){
			return new UploadImg(options)
		}
		function setTip(target){
			return $('<span></span>').css({position:'absolute','top':0,'left':0,'vertical-align': 'top','white-space':'nowrap'}).appendTo(target);
		}

		function newUpload(fileInput,targetInput, action,extData){
			var tipsBox = $(fileInput).next('.tipsHBox').remove();
			tipsBox = $('<span class="tipsHBox"></span>').css({'position':'absolute',"top": '0px','left': box.width() + 20 + 'px'});
			tipsBox.insertAfter(fileInput);
			var tips = setTip(tipsBox);
			var arg = [].slice.call(arguments);
			var callback = arg[arg.length-1];
			if(!(typeof callback === 'function')){
				callback = function(){}
			}
			var form = $('<form enctype="multipart/form-data" target="iFrameHUpload" action="'+action+'" method="POST"></form>').hide();
			file = fileInput.clone(true).insertBefore(fileInput);
			fileInput.appendTo(form);
			if(extData){
				for(var p in extData){
					form.append('<input type="hidden" value="'+extData[p]+'" name="'+p+'" />');
				}
			}
			var iframe = $('<iframe name="iFrameHUpload"></iframe>').hide();
			var body = $('body').eq(0);
			body.append(form).append(iframe);
			var loadImg = loadingImg.clone();
			loadImg.appendTo(tips);
			//befor submit
			if(/msie/i.test(navigator.userAgent)){
				form.eq(0).submit();
				form.eq(0).submit();
				form.eq(0).submit();
			}else{
				form.eq(0).submit();

			}
			//after submit
			iframe.on('load', function(){
				loadImg.remove();
				var html = $(this).contents().find("body").text();
				var result;
				try{
					result = JSON.parse(html);
					if(result.success){
						trueImg.clone().appendTo(tips);
					}else{
						falseImg.clone().appendTo(tips);
					}
				}catch(e){
					if(typeof result == 'object'){
						trueImg.clone().appendTo(tips);
					}else{
						falseImg.clone().appendTo(tips);
						result = {
							msg : '数据上传失败!',
							success : false
						}
					}
				}

				if(result.success ){
					tips.append('<span style="white-space: nowrap;vertical-align:top;display: inline-block;">'+result.msg+'</span>').css({color:'rgb(89,151,34)'});
					targetInput.val(result.path).trigger('input');
				}else{
					tips.append('<span style="white-space: nowrap;vertical-align:top;display: inline-block;">'+result.msg+'</span>').css({color:'rgb(204,51,51)'});
				}
				form.remove();
				iframe.remove();
				callback(result);
				//do something
			});
		};
		var setType = options.extData ? options.extData.type : fileTypes; //如果没有设置type值，默认为fileTypes中包含的格式
		var isRead = options.isRead;
		var target = $("#" + options.file).attr('type','hidden');
		var multiple = options.multiple ? 'multiple="multiple"' : "";
		var file = $('<input type="file" '+multiple+'/>').hide().insertBefore(target).attr('name','file');
		var form = file.parents('form').eq(0);
		file.css('visibility','hidden');
		var viewBox;
		if(options.preview){
			viewBox =  options.preview.target || $("<div class='previewBox' />");
		}else{
			viewBox = $("<div class='previewBox' />");
		}
		var fileName = options.name || file.attr('name');
		target.attr('name', fileName)
		var loadingImgUrl = options.loadingImg || "/lib/images/loading.gif";
		var validatorImg = options.validatorImg || "/lib/images/validator.png";
		var path = options.path || 'path';
		var loadingImg = $('<img src="'+loadingImgUrl+'" />').css({width:'16px',height:'16px','display':'inline-block'});
		var icon = $('<i></i>');
		icon.css({'margin-top':'5px','display':'inline-block',width:'16px',height:'16px',overfolw:'hidden',"background-repeat":'no-repeat','background-image':'url('+validatorImg+')','vertical-align': 'top','white-space':'nowrap'});
		var trueImg = icon.clone();
		var falseImg = icon.clone();
		trueImg.css({'background-position': '-16px' });
		file.css({'opacity':'0',width:'100%',height: '100%'});
		var box = $('<span style="display: inline-block;position: relative;cursor: pointer;"></span>').addClass('uploadHBox');
		box.append('<div style="position: absolute;top:0;left:0;text-align: center;width: 100%;">浏览文件</div>');
		if(!options.style){
			box.css({
				border: '1px solid #eee',
				color: 'rgb(80,164,224)',
				'font-size': '14px',
				width: '80px',
				height: '36px',
				'line-height' : '36px',
				padding: '0px 5px',
				'border-radius': '5px'
			});

		}
		box.on('click', function(){
			file.trigger('click');
		});
		box.css({width:'120px;'});
		file.before(box);
		file.appendTo(box);
		file.on('click', function(e){
			e.stopPropagation()
		});

		box.before(viewBox);
		file.on('change', function(){
			file.attr('name', options.fileName);
			newUpload(file,target,options.url, options.extData, function(result){
				if(result[options.statusName] === true){
					if(options.success){
						options.success(result);
					}
					if(options.preview){
						var url = [],img,imgbox=$('<div/>');
						if(typeof result.path ==='string'){
							url.push(result.path)
						}else{
							url = result.path;
						}
						for(var i = 0;i<url.length;i++){
							url[i] = options.preview.prevUrl + url[i];
							img = $('<img src="'+url[i]+'" />').css({'max-width': '100%', 'max-height':'100%','margin':'10px'});
							imgbox.append(img)
						}
						viewBox.empty().append(imgbox);
					}
				}else{
					if(options.error){
						options.error(result.msg);
					}
				}
				file.attr('name', "");
				target.trigger('input');
				target.trigger('change');
			});
		});
		this.file = file;
		this.reset = function(){

			viewBox.empty();
			box.find('.tipsHBox').empty();
			target.val('');
			return this;
		}
		this.setData = function(url,type){
			var img;
			this.reset();
			if(imageTypes.indexOf(setType) != -1 || setType == 'img'){
				var img2 = $("<div/>");
				$(url.split(',')).each(function(ind,val){
					img2.append($('<img src="/'+val+'" />').css({'max-width': '100%', 'max-height':'100%','margin':'10px'}));
				})
				img = img2;
			}else if(fileTypes.indexOf(setType)!= -1){
				if(url !== ""){
					img = $('<a target="_blank" download href="/'+url+'" class="downBtn" style="line-height: 3;display: inline-block;">下载</a>');
				}else{
					img = $('<a class="downBtn">未上传</a>')
				}
			}
			viewBox.append(img)
			target.val(url);
			var tipsBox = $('<span class="tipsHBox"></span>').css({'position':'absolute',"top": '0px','left': box.width() + 20 + 'px'});
			$(target).next('.tipsHBox').remove();
			var tips = setTip(tipsBox);
			tips.append('<span style="white-space: nowrap;vertical-align:top;display: inline-block;">已上传</span>').css({color:'rgb(89,151,34)'});
			tipsBox.appendTo(box);
			target.trigger('input');
			target.trigger('change');
			if(type == 'hide'){
				box.hide();
				if(url == ''){
					img.hide();
				}
			}
			return this;
		}
		return this;

	}

	return UploadImg;
});
