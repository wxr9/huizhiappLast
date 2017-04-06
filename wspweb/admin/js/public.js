function refreshWsplist(){
  if(window.wspList){
    return window.wspList.refresh();
  }else if(window.opener){
    return window.opener.wspList.refresh();
  }else if(window.parent){
    return window.parent.wspList.refresh();
  }
  throw(new Error('找不到列表'))
}

/**
 * 获取自动分配
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function getAutoDistribute(data){
  var passData = [];
  passData.push({
    type : 'hidden',
    name : 'objectid',
    val : data.objectid
  })
  passData.push({
    label : "园区",
    name : 'parkId',
    readOnly : true,
    val : data.parkId,
    value : data.parkName
  });
  passData.push({
    label : "楼宇",
    name : 'buildingId',
    readOnly : true,
    val : data.buildingId,
    value : data.buildingName
  });
  passData.push({
    label : '受理人员',
    name : 'acceptorId',
    type : 'select',
    url : '/Setting/User/Role/List/1/100',
    value : data.acceptorId
  });
  return getModelForm(passData);
}


function getWorkflowA(data,status){
    var content = $('<form class="form-horizontal"></form>');
	var se1 = $('<select class="form-control" name="task_user"></select>');
	var se2 = $('<select class="form-control" name="task_id"></select>');
	var row = $('<div class="form-group"></div>');
	var label = $('<label class="col-sm-3 control-label"></label>');
	var ri = $('<div class="col-sm-8"></div>');
	function setS1Value(val, obj){
		var role = obj[val];
        var subm = $("#disableCfm").get(0);
        var state = subm.disabled;
        subm.disabled = true;
		$.ajax({
            url : '/Setting/User/getUserByRoleName?roleName=' + role,
			success: function(da){
                subm.disabled = state;
                se1.empty();
                var hasOne = false;
				if(da.success===false){
					se1.append('<option value="undefined">读取数据失败</option>');
				}else{
                    require(['cookie'], function(){
                        var name = $.cookie('defaultName');
                        se1.append('<option value="undefined">-请选择-</option>');
					$(da).each(function(i,v){
						se1.append('<option value="'+ v.username +'">'+ v.realName || v.username +'</option>');
                        if(v.username == name){
                            hasOne = true;
                        }
					});
						if(!hasOne){
							se1.val(da[0].username);
						}else{
							se1.val(name);
						}
					})
				}
			}
		});
	}
	var obj = {};
	$.ajax({
		url : '/workflow/api/tasks/next/list/'+data.current_task_id+'/1/100',
		success:function(da){
			if(da.success===false){
				se2.append('<option value="undefined">工作流接口异常</option>');
			}else if(da.total == 0){
				se2.append('<option value="undefined">没数据</option>')
			}else{
				se2.append('<option value="undefined">-请选择-</option>');
				$(da.result).each(function(i,v){
					if(v.to_task.nodetype.indexOf("end")!= -1){
                        if(se2.attr('data-end')!= undefined){
                            try{
                                var arr = JSON.parse(se.attr('data-end'));
                                arr.push(v.id);
                                se2.attr('data-end','[' + arr.toString() + ']');
                            }catch(e){
                            }
                        }else{
                            se2.attr('data-end', "["+v.id+"]");
                        }
					}else{
						obj[v.id] = v.to_task.array_assignroles.join(',');
					}
                    se2.append('<option value="'+ v.id +'">'+ v.to_task.name +'</option>')
				});
				se2.val(da.result[0].id);
				se2.trigger('change');
            }
		}
	});
	se2.on('change',function(){
		var endValue;
		var value = $(this).val();
        try{
            endValue= JSON.parse($(this).attr('data-end'));
        }catch(e){
            endValue = [];
        }
        var ret = false;
        $(endValue).each(function(ind,val){
            if(value == val){
                ret = true;
            }
        });
        if(ret){
            se1.attr('disabled', 'disabled');
            $('#disableCfm').removeAttr('disabled');
        }else{
            se1.removeAttr('disabled');
            setS1Value($(this).val(),obj);
        }
	});
    var idv = status.idv ? "&idv=" + status.idv : "";
    var pid = "&pid=" + data.id;
	content.append(row.clone().append('<iframe src="workFlowIframe.html?id='+data.currenttask+ idv+ pid+ '" style="width:100%;' +
		'border:0;overflow: hidden;height:500px;"></iframe>'));
	content.append(row.clone().append(label.clone().html('下一步:')).append(ri.clone().append(se2)));
	content.append(row.clone().append(label.clone().html('下一步处理人:')).append(ri.clone().append(se1)));
	status.data = data;
	status.ele = content;
	return content;
}

function getModelForm(passData){
  var content = $('<form class="form-horizontal"></form>');
  var group = $('<div class="form-group"></div>');
  var label = $('<label for="serviceNeed" class="col-sm-3 control-label"></label>');
  var select = $('<select class="form-control"></select>');
  var hidden = $('<input type="hidden" />');
  var textBox = $('<div class="col-sm-9"></div>');
  var cont = $('<div class="col-sm-12"></div>');
  var input = $('<input class="form-control""/>');
  $(passData).each(function(ind,val){
    if(val.type !== 'hidden'){
      var gp = group.clone().appendTo(content);
      label.clone().html(val.label).appendTo(gp);
      var box = textBox.clone().appendTo(gp);
    }
    if(val.type == 'select'){
      if(val.url){
        $.ajax({
          url : val.url,
          success : function(data){
            var se = select.clone();
            $(data.result).each(function(i,v){
              se.append('<option value="'+ v.rolename+'">'+ v.name+'</option>');
            });
            se.attr('name',val.name);
            se.val(val.value);
            se.appendTo(box);
          }
        })
      }
    }else if(val.type === 'checkbox') {
      if(val.url){
        $.ajax({
          url : val.url,
          success : function(data){
            var ck = cont.clone();
            //TODO-18日
            $(data.result).each(function(i,v){
	            var check = "";
	            $(val.value).each(function(a,b){
								if(b == v.objectid){
									check = 'checked="checked"'
								}
	            });
              ck.append('<div class="col-sm-6"><input style="cursor: pointer" id="'+val.name+ v.objectid + 'kk" ' +
                'class="col-sm-3" type="checkbox" '+check+' name="'+val.name+'" value="'+v.objectid+'" />' + '<label for="'+
                val.name+ v.objectid + 'kk" style="cursor: pointer">'+v.name + "</label></div>")
            });
            ck.appendTo(box);
          }
        })
      }
    }else if(val.type === 'hidden'){
      hidden.clone().attr('name', val.name).val(val.val).appendTo(content);
    }else if(val.readOnly) {
      hidden.clone().attr('name', val.name).val(val.val).appendTo(box);
      input.clone().val(val.value).attr("readOnly","readOnly").appendTo(box)
    }else{
      //hidden.clone().attr('name', val.name).val(val.val).appendTo(box);
      input.clone().attr('name', val.name).val(val.value).appendTo(box)
    }
  });
  return content;
}

/**
 * 根据参数，获取模板
 * @param  {String} type   模板类型
 * @param  {Object} data   模板数据
 * @param  {[type]} status 模板状态
 * @return {[type]}        [description]
 */
function getTemp(type,data,status){
  if(type === 'rich'){
    return getRichTemp(data,status);
  }else if(type === 'richlist'){
    return getRichListContent(data,status);
  }else if(type === 'autoDistribute'){
    return getAutoDistribute(data,status);
  }else if (type === 'engineer'){
    return getEngineerDetail(data,status);
  }else if(type === 'workflowA'){
	  return getWorkflowA(data,status);
  }
}

/**
 * 获取维修工程师详情模板
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function getEngineerDetail(data,status){
  var passData = [];
  passData.push({
    name : 'objectid',
    type : 'hidden',
    val : data.objectid
  });
  passData.push({
    label: '姓名',
    name : 'name',
    value : data.name
  });
  passData.push({
    label : '手机号',
    name : 'mobile',
    value : data.mobile
  });
  passData.push({
    label : '工种选择',
    value : data.jobType,
    name : 'jobType',
    type : 'checkbox',
    url : '/Setting/SettingDict/1/100?type=worktype'
  });
  return getModelForm(passData);
}

/**
 * 获取富文本列表模板
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function getRichListContent(data){
  var temp = [];
  var pic;
  if(data.pic === null || data.pic === ""){
    pic = "/admin/images/huizhi.jpg";
  }else{
      pic = '/'+data.pic;
  }
  //时间,只保留年月日
  var updateDate = data.updateDate.split(" ");
	var style = "";
	if(data.deleteFlag == -1){
		style= "background:#eee;-webkit-filter: grayscale(100%);-moz-filter: grayscale(100%);-ms-filter: grayscale(100%);-o-filter: grayscale(100%);filter: grayscale(100%);filter: gray;"
	}
  temp.push('<div class="media" style="'+style+'">');
  temp.push('<div class="media-left">');
  temp.push('<img src="'+pic+'" class="media-object">');
  temp.push('</div><div class="media-body"><div class="media-lf"><h4 class="media-heading">');
  temp.push(data.title);
  temp.push('</h4>');
  temp.push('<div>'+data.memo+'</div>');
  temp.push('</div><div class="media-rg"><span class="author">');
  temp.push('作者：'+data.author||'');
  temp.push('</span><br><span class="date">');
  temp.push('日期：'+updateDate[0]);
  temp.push('</span><br>');
  if (data.deleteFlag == -1) {
    temp.push('<a class="operate enableBtn"  id=' + data.objectid + '>解禁</a>');
  } else { //defalut 1
      temp.push('<a class="operate disableBtn" id=' + data.objectid +'>禁用</a>');
      temp.push('<a href=\"/admin/editRichText.html?id='+ data.objectid +'" target="_blank" class="operate editBtn">编辑</a>');
  }
  temp.push('</div></div></div>');
  return  temp.join('')
}


/**
 * 获取富文本选择列表(服务设置页面)
 * @param  {[type]} data   [description]
 * @param  {[type]} status [description]
 * @return {[type]}        [description]
 */
function getRichTemp(data,status){
  var ul = $("<ul class='richSelectList'></ul>");
  var arr = [];
  $(data.result).each(function(ind,val){
    arr.push('<li data-id="'+val[1]+'">'+val[0]+'</li>')
  });
  ul.append(arr.join(''));
  ul.on('click', 'li', function(){
    var li = $(this);
    li.addClass('current').siblings().removeClass('current');
    status.current = li.attr('data-id');
    status.value = li.html();
  });
  return ul;
}

/**
 * 获取异步加载列表
 *
 * @param  {[type]} ele [description]
 * @return {[type]}     [description]
 */
function initList(ele, opt){
  if(!this instanceof initList){
    return new initList(ele)
  }
  var self = this;
  this.refresh = function(){
    setData(self.page)
  };
	var qs='';
	if(opt.search && typeof opt.search == 'string'){
		$(opt.search).on('keypress', function(e){
			if(e.keyCode === 13){
				$(opt.search).trigger('change');
				qs = $(this).val();
				setData();
			}
		})
	}
  function getContent(objects){
    var pageCount;
    if(objects.total % objects.pagesize === 0){
      pageCount = parseInt(objects.total / objects.pagesize);
    }else{
      pageCount = parseInt(objects.total / objects.pagesize)+1;
    }
    self.pageCount = pageCount;
    var currentPage = objects.page;
    var pageList = getPage(pageCount, currentPage);
    var pageContent = [];
    var result = objects.result;
    for (var i =0;i<result.length;i++){
      pageContent.push(getTemp('richlist', result[i]));
    }
    pageContent = pageContent.join('');
    return pageContent + pageList;
  }

  function getPage(page,current){
    var temp = [];
    temp.push('<nav><ul class="pagination">');
    temp.push('<li><a href="javascript:void(0)" class="prevPage"><span>«</span></a></li>');
    for(var i=1;i<=page;i++){
        if(i == current){
          temp.push('<li class="current"><a>'+i+'</a></li>')
        }else{
          temp.push('<li class="paginationItem" page-num="'+i+'"><a>'+i+'</a></li>')
        }
      if(page > 10 && i > 4  && i < page-4){
        temp.push('<li class="current"><a>…</a></li>');
        i = page -4;
      }
    }
    temp.push('<li><a href="javascript:void(0)" class="nextPage"><span>»</span></a></li>');
    temp.push('</ul><nav>');
    return temp.join('');
  }

  function setData(page,size){
	  var target = $(ele);
	  page = page || 1;
    size = size || 10;
    self.page = parseInt(page);
	  var url = '/Setting/RichText/'+page + "/" + size;
	  if(qs && qs != ""){
		  qs = encodeURI(qs);
		  url = url + "?searchName=" + qs;
	  }
	  target.empty().append('<div style="text-align: center"><img src="/admin/images/loadinglist.gif" /></div>').fadeIn(200);
    $.ajax({
      url : url,
      success : function(data){
        target.empty().hide().append(getContent(data)).fadeIn(200).find('img').on('error', function(){
	        $(this).attr('src', '/admin/images/huizhi.jpg');
        });
	      if(data.result.length ==0){
		      target.prepend('<div style="text-align: center">找不到结果</div>')
	      }
      }
    })
  }
  setData();
  $(ele).on('click','.paginationItem', function(){
    setData($(this).attr('page-num'));
  });
  $(ele).on('click', '.prevPage', function(){
    if(self.page != 1){
      setData(self.page-1);
    }
  });
  $(ele).on('click', '.nextPage', function(){
    if(self.page != self.pageCount){
      setData(self.page +1);
    }
  });
  window.wspList = this;
  return this;
}
/**
 * 选择富文本编辑器
 * @param Dom
 * selectRich(ele, {
 *   querySring:[[a,1],[b,2]]
 * })
 */

function selectRich(ele, option){
  $(ele).on('click', function(){
    var self = $(this);
      var opt = {
          title :'自动分配',
          content : $("<div>asdfasdf</div>"),
          url : '/Setting/RichText/Special',
          queryString: [[
              'valid', 1]
          ],
          type : 'rich',
          page: true,
          callback : function(){
              var target = self.parent().find('.selectRich');
              target.val(this.value).attr('data-id',this.current);
              modal.modal('hide')
          }
      }
      assign(opt,option);
    var modal = getModal(opt);
  });
}


/**
 * 模态弹窗
 * @param {Object} option
 *  {
 *  title : '模态框标题',
 *  content : '模态框内容，可以是DOM, jQuery DOM',
 *  callback : '模态框确定的回调函数'
 *  submit : '模态框确定按钮文字'
 *  }
 * @return {Object}  模态框本身，jQuery对象
 */
function getModal(option){
  $("#disableModal").remove();
  var opt = {
    title : '标题',
    content : '<div>正文</div>',
    type : 'rich',
    callback : function(data){
    },
    submit : '确定',
    error : function(e){
    },
  }
  var status = {};
	assign(status,option.extData);
  assign(opt,option);
	var size = option.size || 'min';
	if(size == 'large'){
		size = ' modal-lg'
	}else{
		size = ' modal-ms'
	}
  var modal = $('<div id="disableModal" tabindex="-1" class="modal fade">');
  var box = $('<div class="modal-dialog'+size+'"></div>');
  var content = $('<div class="modal-content"></div>');
  var head = $('<div class="modal-header"></div>');
  var close = $('<button type="button" data-dismiss="modal" class="close"><span>×</span></button>');
  var title = $('<h4 class="modal-title">'+opt.title+'</h4>');
  var body = $('<div class="modal-body"></div>');
  var bodyContent = $('<div class="statusTip"></div>');
  var footer = $('<div class="modal-footer">');
  var right = $('<button id="disableCfm" class="btn btn-bg-blue">'+opt.submit+'</button>');
  var cacel = $('<button data-dismiss="modal" class="btn btn-default">取消</button>');
	function getPage(page,current){
		var temp = [];
		temp.push('<nav><ul class="pagination">');
		temp.push('<li><a href="javascript:void(0)" class="prevPage"><span>«</span></a></li>');
		for(var i=1;i<=page;i++){
			if(i == current){
				temp.push('<li class="current"><a>'+i+'</a></li>')
			}else{
				temp.push('<li class="paginationItem" page-num="'+i+'"><a>'+i+'</a></li>')
			}
			if(page > 10 && i > 4  && i < page-4){
				temp.push('<li class="current"><a>…</a></li>');
				i = page -4;
			}
		}
		temp.push('<li><a href="javascript:void(0)" class="nextPage"><span>»</span></a></li>');
		temp.push('</ul><nav>');
		return temp.join('');
	}
	if(opt.extButton){
		var extButton = $('<button class="btn btn-danger">'+opt.extButton+'</button>');
		footer.append(extButton);
		extButton.on('click',opt.extButtonEvent.bind(status));
	}
	if(option.disabled === true){
		right.attr('disabled','true')
	}
  if(opt.url){
    bodyContent.append('<div style="text-align:center;"><img src="/admin/images/loadinglist.gif" /></div>');
	  if(opt.page === true){
		  var page = 1;
		  var pageSize = 10;
		  var url = opt.url;
		  var qs = "";
		  var pg;
		  var cp = 1;
            if(opt.queryString){
                var qsArra=[];
                $.each(opt.queryString, function(index,value){
                    qsArra.push(value.join('='));
                })
                qs = "?" + qsArra.join('&');
            }

		  function setData(){
			  url = opt.url + "/"+ cp + "/" + pageSize;
			  url = url + qs;
			  $.ajax({
				  url: url,
				  success: function(data){
					  bodyContent.hide().empty().append(getTemp(opt.type,data,status)).slideDown(200);
					  pg = data.total / 10;
					  if(pg%1 != 0){
						  pg = parseInt(pg) +1;
					  }
					  bodyContent.append(getPage(pg,cp))
				  }
			  })
		  }
		  bodyContent.on('click','.paginationItem', function(){
			  cp = $(this).attr('page-num');
			  setData();
		  });
		  bodyContent.on('click', '.prevPage', function(){
			  if(cp != 1){
				  cp = parseInt(cp) - 1;
				  setData();
			  }
		  });
		  bodyContent.on('click', '.nextPage', function(){

			  if(cp != pg){
                  cp = parseInt(cp) + 1;
				  setData();
			  }
		  });
		  setData();
	  }else{
		  $.ajax({
			  url : opt.url,
			  success : function(data){
				  bodyContent.hide().empty().append(getTemp(opt.type,data,status)).slideDown(200);
			  },
			  error : opt.error
		  })
	  }
  }else if(opt.data){
	  bodyContent.hide().empty().append(getTemp(opt.type,opt.data,status)).slideDown(200);
  }else{
    bodyContent.append(opt.content);
  }
  status.ele = bodyContent;
	if(opt.cancel != undefined){
		cacel.html(opt.cancel);
	}
	if(opt.okBtn === false){
		right.hide();
	}
  modal.append(box.append(content.append(head.append(close).append(title)).append(body.append(bodyContent)).append(footer.append(right).append(cacel))));
  right.on('click', function(){
      right.attr('disabled','disabled');
      opt.callback.bind(status)();
  });
  $("body").append(modal);
  return modal.modal('show');
}

function filterSN(row){
    var SN = row.sn;
    var ind = row.sn.slice(0,2);
    query = {
        objectid : row.id
    }
    return SNTemp(SN,query);
}
function SNTemp(SN,query){
    var ind = SN.slice(0,2);
    var obj ={
        RZ:'/web/services/hatchApply.html',
        LP:'/web/services/huntApply.html',
        PX:'/web/services/companyApply.html',
        HY:'/web/services/meetingRoomForm.html', //?objectid=1&name=202
        ZZ:'/web/services/copyrightApply.html', //
        GG:'/web/services/commercialApply.html',  //
        WY:'物业报修',
        CS:'/web/services/testApply.html',  //
        IT:'IT报修',
        JS:'/web/services/classroomForm.html'  //?objectid=1&name=致远厅
    }
    var url = obj[ind];
    var qs = "";
    var i = 0;
    if(query){
        for(var p in query){
            qs = qs + (i==0?'?':"&") + p +'='  + query[p];
        }
    }
    url = url + qs;
    return SN;
}
/**
 * 格式化字符串
 * @param  {[type]} date  [description]
 * @param  {[type]} style [description]
 * @return {[type]}       [description]
 */
function formatDate(date, style) {
    if (style === undefined) {
        style = 'yyyy/mm/dd';
    }
    var ab = new Date(date);
    if (ab.toString() == "Invalid Date" || ab == "Invalid date") {
        ab = new Date(date.split('-').join('/'));
    }
    if (style === 'yyyy/mm/dd') {
        var y = ab.getFullYear();
        var m = ab.getMonth() + 1;
        var d = ab.getDate();
        var ret = y + "/" + m + "/" + d;
        return ret;
    }

}


/**
 * 根据浏览器的 queryString 返回相对应的 值
 * @param  {String} query 需要返回的值的键名
 * @return {String} 对应的值
 */

var queryString = function (query) {
    var search = window.location.search + '';
    if (search.charAt(0) != '?') {
        return undefined;
    } else {
        search = search.replace('?', '').split('&');
        for (var i = 0; i < search.length; i++) {
            if (search[i].split('=')[0] == query) {
                return decodeURI(search[i].split('=')[1]);
            }
        }
        return undefined;
    }
};

/**
 * 合并对象，把合并对象的属性合并到目标对象上，重复的覆盖
 * @param  {Object} target  目标对象
 * @param  {Object} sources 被合并对象
 * @return {Object} targetObject
 */
function assign(target, sources) {
    if (target == null) {
        throw new TypeError('Object.assign target cannot be null or undefined');
    }

    var to = Object(target);
    var hasOwnProperty = Object.prototype.hasOwnProperty;

    for (var nextIndex = 1; nextIndex < arguments.length; nextIndex++) {
        var nextSource = arguments[nextIndex];
        if (nextSource == null) {
            continue;
        }

        var from = Object(nextSource);
        // We don't currently support accessors nor proxies. Therefore this
        // copy cannot throw. If we ever supported this then we must handle
        // exceptions and side-effects. We don't support symbols so they won't
        // be transferred.
        for (var key in from) {
            if (hasOwnProperty.call(from, key)) {
                to[key] = from[key];
            }
        }
    }

    return to;
}

/**
 * 后台公用的通知窗口
 * @param  *{String} title  通知的标题内容
 * @param  {String Array['success', 'warn', 'error', 'info']} type 弹窗类型，默认 `success`
 * @param  {String} content 弹窗正文，弹窗的具体消息
 * @return {[type]}
 */
function showAlert(title, type, content) {
    var html = [];
    html.push('<div class="lbalert alert ');
    if (content) {
        html.push('alert-block ');
    }
    if (type === 'danger') {
        html.push('alert-danger');
    } else if (type === 'info') {
        html.push('alert-info');
    } else if (type === 'warning') {
        html.push('alert-warning');
    } else {
        html.push('alert-success');
    }
    html.push('"><a class="close" data-dismiss="alert" href="#">×</a><span class="alert-heading">');
    html.push(title);
    html.push('</span>');
    if (content) {
        html.push(content);
    }
    html.push("</div></div>")
    var target = $(html.join(''));
    var alertBox = $("#alert_BOX");
    if (alertBox.length === 0) {
        $('body').append($("<div id='alert_BOX'></div>"));
    }
    target.hide().appendTo("#alert_BOX").slideDown();
    setTimeout(function () {
        target.slideUp(300, function(){
	        target.remove();
        })
    }, 3000);
    if (!window.autoScrollAlertBox) {
        function resize() {
            var self = $(window);
            var top = self.scrollTop();
            var target = $("#alert_BOX");
            target.css({
                'position': 'fixed',
                'top': "0"
            });
        }
        $(window).on('scroll', function () {
            resize();
        });
        resize();
        window.autoScrollAlertBox = true;
    }
}
// jQuery plugins
define(["jquery"],function(){
  $.fn.serializeStr = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
      if (o[this.name]) {
        if (!o[this.name].push) {
          o[this.name] = [o[this.name]];
        }
        o[this.name].push(this.value || '');
        // o[this.name] = o[this.name] + "," +this.value;

            } else {
                o[this.name] = this.value || '';
            }
        });
        return JSON.stringify(o);
    };
    $.fn.serializeObj = function () {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };

})

// 转换成HTML实体字符
function replaceEntityIdentifier(value) {
    var tmp = value;
    /*tmp = tmp.replace(/&/g, '&amp;');*/
    tmp = tmp.replace(/</g, '&lt;');
    tmp = tmp.replace(/>/g, '&gt;');
    /*tmp = tmp.replace(/"/g, '&quot;');*/
    tmp = tmp.replace(/'/g, '&apos;');
    return tmp;
}

function CKSet(value) {
    var tmp = value;
    /*tmp = tmp.replace(/&/g, '&amp;');*/
    tmp = tmp.replace(/&lt;/g, '<');
    tmp = tmp.replace(/&gt;/g, '>');
    /*tmp = tmp.replace(/"/g, '&quot;');*/
    tmp = tmp.replace(/&apos;/g, "'");
    return tmp;
}

// 转义特殊字符，防止js注入
function checkJsInject() {
    $.each($('form textarea'), function (index, element) {
        element.value = replaceEntityIdentifier(element.value);
    })
    $.each($('form input[type="text"]'), function (index, element) {
        element.value = replaceEntityIdentifier(element.value);
    })
}

// 初始化表单验证
function initBootstrapValidator(fieldsList, callback) {
    $('form')
        .bootstrapValidator({
            message: 'This value is not valid',
            excluded: [':disabled'],
            feedbackIcons: {
                valid: '',
                invalid: '',
                validating: ''
            },
            fields: fieldsList
        })
        .on('success.form.bv', function (e) {
            // Prevent form submission
            e.preventDefault();

            // Get the form instance
            var alertMsg = '请阅读用户须知';
            if(callback){
                if(callback.alertMsg != undefined){
                    alertMsg =  callback.alertMsg;//针对汇智卡企业/个人申请提示
                }

            }

            var $form = $(e.target),
                validator = $form.data('bootstrapValidator'),
                submitButton = validator.getSubmitButton();
            var isRead  = $('#mustRead');
            if(isRead.length > 0 && isRead.eq(0).is(':checked') == false) {
                showAlert(alertMsg);
                isRead.eq(0).focus();
                isRead.on('click', function(){
                    $form.find('button.submit').removeAttr('disabled');
                })
                return false;
            }
            $form.find('button.submit').removeAttr('disabled');
            var data = $form.serialize();

            checkJsInject();
            // 转义特殊字符，防止js注入
            if(callback){
                if(callback.prev != undefined){
                    callback.prev();
                }

            }

            if(callback){
                if(callback.replaceData != undefined){
                    data = callback.replaceData(data);
                }
            }
            // Use Ajax to submit form data

            //前后台验证区分
            var status = $('#loginStatus').attr('loginstatus');
            var path = window.location.pathname;
            if(path.indexOf('admin') == -1){
                checkMust();
            }else{
                status = true;
            }

            if(status){
                $.ajax({
                    type: "POST",
                    url: $form.attr('action'),
                    data: data,
                    dataType: "json",
                    async: false,
                    success: function (result) {
                        if(result.success == false){
                            showAlert(result.msg,'warn')
                        }else{
                            showAlert(result.msg);
                        }
                            //关闭模态框
                        $("#editModal").modal("hide");
                        $("#addModal").modal("hide");
                        //重置表格
                        validator.resetForm();
                        if(Object.prototype.toString.call(callback) == '[object Function]'){
                            callback();
                        }else if(callback && callback.end){
                            callback.end(result);
                        }
                    }
                });
            }

            //window.location.reload();
        })
        .on('click', 'button[data-dismiss]', function () {
            $('form').data('bootstrapValidator').resetForm();
        });
}


/*生活中心显示商品模版
 * data为数据列表[{},{}……]
 * n为显示模版的个数
 * type为类型
 * */
function getProductModel(data,n){
    var len = data.length;
    var model = [];
    if (len > n && n != undefined){
        len = n;
    }
    for (var i=0; i< len; i++){
        var d = data[i];
        var type = d.sDict.english || 'other'; //discount/price/other
        var companyName = d.company.name || "";
        //图片
        var productImg = '/'+ d.coverImg;
        model.push("<div class='product-box'><div class='product-item'>" +
            "<div class='product-img' style='background:url("+ productImg +") no-repeat center center;background-size:100%'></div>");
        //标题
        model.push("<div class='product-detail'>");
        var title = d.title;
        title = title.length > 19 ? title.slice(0,16) + '...' : title;
        //折扣
        if (type == 'price'){//原价/现价
            model.push("<div class='row'><div class='product-title'><sapn class='product'>" + title + "</sapn></div>" +
                "<div class='product-cost'><span class='now-price'>&yen;"+ d.current +"</span><br/><del>&yen;"+ d.origin +"</del></div></div>" )
        } else if (type == 'discount'){//折扣
            model.push("<div class='row'><div class='product-title'><sapn class='product'>" + title + "</sapn></div>" +
                "<div class='product-cost'><span class='now-price'>"+ d.discount +"折</span></div></div>" )
        } else{//无
            model.push("<div class='row'><div class='product-title'><sapn class='product'>" + title + "</sapn></div></div>")
        }
        //详情
        model.push("<div class='row'><span class='icon'></span><span class='shop'>"+ companyName +"</span>" +
            "<a href='/web/lifeCenter/preferentialDetail.html?objectid="+ d.objectid +"' class='product-more-btn'>查看详情</a></div>" +
            "</div></div></div>")
    }
    return model.join("");

}
//服务中心的相关验证
function initFormValidator(fieldsList) {
    $('form')
        .bootstrapValidator({
            message: 'This value is not valid',
            excluded: [':disabled'],
            feedbackIcons: {
                valid: '',
                invalid: '',
                validating: ''
            },
            fields: fieldsList
        })
        .on('success.form.bv', function (e) {
            // Prevent form submission
            e.preventDefault();

            // Get the form instance
            var $form = $(e.target),
                validator = $form.data('bootstrapValidator'),
                submitButton = validator.getSubmitButton();
            // 转义特殊字符，防止js注入
            checkJsInject();

            // Use Ajax to submit form data
            $.ajax({
                type: "POST",
                url: $form.attr('action'),
                data: $form.serialize(),
                dataType: "json",
                async: false,
                success: function (result) {
                    if(result.success == false){
                        showAlert(result.msg,'warn');
                    }else{
                        showAlert(result.msg,'success');
                        setTimeout(function(){
                            window.location.href = '/web/myWiz.html';
                        },3000)
                    }
                    //关闭模态框
                    $("#editModal").modal("hide");
                    $("#addModal").modal("hide");
                    //重置表格
                    validator.resetForm();
                }
            });
        })
        .on('click', 'button[data-dismiss]', function () {
            $('form').data('bootstrapValidator').resetForm();
        });
}


//数据字典
//element:绑定的id ，type：查询的类型
//options = {
//    selector: $('#id'),
//    id: 初始化的值,
//    type: 查询类型,
//    cb: 回调函数
//}
function getDict(options){
    var selector = options.selector;
    var type = options.type;
    var id = options.id || '';
    var cb = options.cb || '';

    $.ajax({
        type:"GET",
        url: "/Setting/SettingDict/0/0?type="+type,
        dataType:'json',
        success: function(data){
            var options = [];
            var List = data.result;
            options.push("<option value='' selected></option>")
            for(var i=0,len=List.length; i<len; i++){
                options.push("<option value=\'"+ List[i].objectid +"\'>"+List[i].name+"</option>");
            }
            selector.empty().append(options.join(""));
            if(id){
                selector.val(id).select2();
            }else{
                var d = selector.children().eq(0).val();
                selector.val("value", d);
                selector.val(d).select2();
            }
            cb ? cb() : "";
        }
    })
}

/**
 *
 * @param option
 * {
 * begin: {Date} 开始时间,
 * weekPrev: {String} 输出周的前缀,*'周五',
 * end: {Date} 结束时间,优先级高于长度,
 * format: {String} 格式,目前支持['yy-mm-dd', 'yy/mm/dd'],
 * endLength: {Number} 如果不输入结束时间,可以直接从这里输出固定长度的时间,
 * inDay: {String || Array} 可选['weekend', 'workday', {Array Number}] 可以过滤周末,工作日,还有指定的日期,比如[1,2]可以过滤周一周二
 * offset: {Number} 日期偏移,单位天
 *  }
 * @returns {Array}
 */
function getDateList(option){
    var defaultOption = {
        begin: new Date(),
        weekPrev: '周',
        //end : new Date(),
        format: 'yy-mm-dd',
        endLength: 7,
        //inDay: 'weekend' || 'workday' || [0,1,2]
    }
    //定义选项
    var opt = assign({}, defaultOption, option);
    var begin = opt.begin || new Date();
    var end = opt.end;
    var endLength = opt.endLength;
    var inDay = opt.inDay || [0,1,2,3,4,5,6];
    var weekPrev = opt.weekPrev;


    //定义常量
    var oneDay = 1000 * 60 * 60 *24;
    var weekList = [ '日', '一', '二', '三', '四', '五', '六'];

    if(opt.offset != undefined){
        begin = new Date(begin.getTime() + (opt.offset * oneDay));
    }

    //定义变量
    var year, month, day, week, length, data, thisDay;
    var dayList = [];
    if(end != undefined){
        length = ((new Date(end).getTime() - new Date(begin).getTime())/ oneDay) +1;
    }else{
        length = endLength;
    }
    //定义方法
    function checkWeek(date,inD){
        var checkDay;
        if(inD == 'weekend'){
            checkDay = [0,6]
        }else if(inD == 'workday'){
            checkDay = [1,2,3,4,5];
        }else if(Object.prototype.toString.call(inD) == '[object Array]'){
            checkDay = inD;
        }
        for(var i=0;i<checkDay.length;i++){
            if(date.getDay() == checkDay[i]){
                return true;
            }
        }
        return false;
    }
    function formateDate(date,format){
        format = format || 'yy-mm-dd';
        var rep;
        var thisDay = new Date(date);
        if(format == 'yy-mm-dd'){
            rep = '-';
        }else if(format == 'yy/mm/dd'){
            rep = '/';
        }
        year = thisDay.getFullYear();
        month = thisDay.getMonth() + 1;
        day = thisDay.getDate();
        return year + rep + month + rep + day;
    }

    for(var i=0;i<length;i++){
        thisDay = new Date(new Date(begin).getTime() + (oneDay * i));
        year = thisDay.getFullYear();
        month = thisDay.getMonth() + 1;
        week = thisDay.getDay();
        day = thisDay.getDate();
        if(!checkWeek(thisDay, inDay)){
            continue;
        }
        data = {
            date : thisDay,
            year : year,
            week : week,
            day: day,
            format : formateDate(thisDay),
            weekC : weekPrev + weekList[week]
        }
        dayList.push(data);
    }
    return dayList;
}

function loadSelect(options){
    var method = options.method || 'GET';
    var selector = $(options.target);
    var id = options.id;
    var url= options.url;
    var callback = options.callback;
    $.ajax({
        type: "GET",
        url: url,
        method: method,
        dataType: 'json',
        success: function (data) {
            var options = [];
            var List = data.result;
            options.push("<option value='' selected></option>")
            for (var i = 0, len = List.length; i < len; i++) {
                options.push("<option value=\'" + List[i].objectid + "\'>" + List[i].name + "</option>");
            }
            selector.empty().append(options.join(""));
            if (id) {
                selector.val(id).select2();
            } else {
                var d = selector.children().eq(0).val();
                selector.val("value", d);
                selector.val(d).select2();
            }
            callback ? callback() : "";
        }
    })
}



function checkInfo(){
    $.ajax({
        url: '/Setting/User/MyInfo',
        success: function(data){
            if(data.success === false) {
                var ta =$("#login");
                ta.length > 0 ? ta.get(0).click() : '';
            }
            // else{
            //     $.ajax({
            //         url: '/Setting/User/IsCompleteInfo',
            //         dataType: 'json',
            //         success: function(data){
            //             if(data.success != true){
            //                 var mo;
            //                 if(data.msg.indexOf("邮箱") != -1){
            //                     mo = getModal({
            //                         title :'请绑定邮箱',
            //                         content: '接下来的内容,可能需要您<a target="_blank" href="/web/user/accountSafe.html">绑定验证邮箱</a>才能继续.',
            //                         submit: '去完善',
            //                         callback: function(data){
            //                             location.href = '/web/accountSafe.html'
            //                         }
            //                     });
            //                 }
            //                 else if(data.msg.indexOf("手机") != -1){
            //                     mo = getModal({
            //                         title :'请绑定手机号',
            //                         content: '接下来的内容,可能需要您<a target="_blank" href="/web/user/accountSafe.html">绑定手机号</a>才能继续.',
            //                         submit: '去完善',
            //                         callback: function(data){
            //                             location.href = '/web/accountSafe.html'
            //                         }
            //                     });
            //                 }
            //                 else{
            //                     mo = getModal({
            //                         title :'请完善个人资料',
            //                         content: '接下来的内容,可能需要您<a target="_blank" href="/web/personalInfo.html?mustCheck=true">完善</a>您的个人资料.',
            //                         submit: '去完善',
            //                         callback: function(data){
            //                             location.href = '/web/personalInfo.html?mustCheck=true'
            //                         }
            //                     });
            //                 }
            //
            //             }
            //         }
            //     })
            // }
        }
    })

}
function checkMust(){
    $.ajax({
        url: '/Setting/User/MyInfo?timestamp=' + new Date().getTime(),
        success: function(data){
            if(data.success === false) {
                var ta =$("#login");
                ta.length > 0 ? ta.get(0).click() : '';
            }
        }
    })
}

function doCook(name, val){
    if(val == undefined){
        try{
            return JSON.parse(JSON.parse(sessionStorage.getItem(name)));
        }catch (e){
        }
    }else{
        try{
            sessionStorage.setItem(name,JSON.stringify(val));
        }catch (e){
        }
    }
    return false;
}

function getUserInfo(fn){
        $.ajax({
            url: '/Setting/User/MyInfo?timestamp=' + new Date().getTime(),
            success: function(data){
                    fn(data)
            }
        })
}
window.getUserInfo = getUserInfo;
function showMessage(content, type,time){
    time = time || 3000;
    var iconType, color;
    if(type == 'warn'){
        iconType =  '&#xe71b;';
        color = 'rgb(230,219,116)';
    }else if(type == 'error'){
        iconType = '&#xe648;';
        color = 'rgb(240,210,210)'
    }else if(type == 'success'){
        iconType = '&#xe64b;'
        color = 'rgb(0,200,83)';
    }else {
        iconType = '&#xe63b;';
        color = 'rgb(52,152,219)';
    }
    var html = $('<div class="alert-box"></div>');
    var ab = $('<div class="alert-conent-box"></div>');
    var ac = $('<div class="alert-content"></div>');
    var ai = $('<div class="alert-info-box"><i class="alert-icon iconfont" style="color:'+color+'">'+iconType+'</i><span class="alert-info">'+content+'</span></div>');
    html.append(ab.append(ac.append(ai)));
    ac.css({opacity:0, 'top':'-30px'});
    $('body').append(html);
    ac.animate({opacity: 1,'top':0},500, function(){
        setTimeout(function(){
            ac.animate({opacity: 0,top:'-30px'},500, function(){
                html.remove();
            });
        }, time)
    });
}
window.showMessage = showMessage;
//查看详情的评价
function getCommentInfo(id,type){

    $.ajax({
        type: 'get',
        url: '/Comment/Info?id=' + id + '&type='+type,
        dataType: 'json',
        success: function (data) {
            if(data.success==undefined){
                $('#comment').show();
                $('#comment1').append(data['content']); //评价内容
                $('#duration').parent().css('background', 'url(/web/images/duration-' + data['duration'] + '.png) no-repeat center');
                $('#duration').append(data['duration'] + '分'); //响应速度
                $('#attitude').parent().css('background', 'url(/web/images/attitude-' + data['attitude'] + '.png) no-repeat center');
                $('#attitude').append(data['attitude'] + '分'); //服务态度
                $('#quality').parent().css('background', 'url(/web/images/quality-' + data['quality'] + '.png) no-repeat center');
                $('#quality').append(data['quality'] + '分'); //服务质量
            }else{
                $('#form').append('<a style="display: block;text-align: center">暂无评价信息！</a>')
            }
        }
    })
    $('button').hide();
}


//检测背景图片是否加载成功
function bgLoaded( jqSelector, jqContext  ) {

    var jqSelector = jqSelector || 'blur-bg',
        jqContext = jqContext || false;
    $(jqSelector,jqContext).each(function() {
        var $figure = $(this), bgImg, bgImgUrl = $figure.css('background-image');
        if(bgImgUrl && !$figure.hasClass('bg-loaded')) {
            //获取图片地址
            bgImg = bgImgUrl.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
            //生成临时对象检测URL是否请求成功
            $('<img/>').attr('src', bgImg).on({
                // 成功后移除临时对象
                load : function() {
                    $(this).remove();
                    $figure.addClass('bg-loaded');
                },
                // 失败 移除临时对象,显示默认图片
                error : function() {
                    $(this).remove();
                    $(jqSelector).css('background-image','url(/web/images/thumbnail1.png)');
                   }
            });
        }
    });
}
//获取所有角色
function getRoles(selector,id){
    $.ajax({
        type:"GET",
        url: "/Setting/User/Role/List/0/0",
        dataType:'json',
        success: function(data){
            var options = [];
            var List = data.result;
            for(var i=0,len=List.length; i<len; i++){
                options.push("<option value=\'"+ List[i].rolename +"\'>"+List[i].name+"</option>");
            }
            selector.empty().append(options.join(""));
            if(id){
                selector.val(id).select2();
            }else{
                selector.select2();
            }
        }
    })
}
//前后台帮助中心
function helpCenterInit(ele,data){
    var data = data || '';
    if(data){
        $.each(data,function(index,value){
            addFile(ele,value);
        })
    }else{
        addFile(ele);
    }

    function addFile(ele,data){
        var filebox = ele;
        var data = data || "";
        var file = $('<div class="file"></div>');
        var parentCont = $('<div class="parentCont"></div>');
        var delBtn = $('<span class="btn fa fa-minus-circle"></span>');
        var addBtn = $('<span class="btn fa fa-plus-circle"></span><span class="text">添加文件</span>');
        var input = $('<input class="file-name" type="text" name="filename" placeholder="请填写文件夹名称">');
        var childCont = $('<ul class="childCont"></ul>');
        if(data){
            input.val(data.filename);
            if(data.files != ""){
                $.each(data.files,function(i,v){
                    addChild(childCont,v);
                })
            }
        }
        // 添加节点
        parentCont.append(delBtn);
        parentCont.append(input);
        parentCont.append(addBtn);
        file.append(parentCont);
        file.append(childCont);
        filebox.append(file);
        input.bind('focus',function(){
            if($(this).hasClass('hightlight'))
                $(this).removeClass('hightlight');
        })
        addBtn.bind('click',function(){
            addChild(childCont,data);
        })
        delBtn.bind('click',function(){
            removeFile($(this).parent().parent());
        })

    }
    function addChild(childCont,data){
        var data = data || "";
        var childBox = $('<li></li>');
        var delBtn = $('<span class="del fa fa-minus-circle"></span>');
        var name = $('<input class="file-name" type="text" name="name" placeholder="请填写文件名">');
        var title = $('<input class="file-name" type="text" name="title" placeholder="请选择富文本" readonly>');
        var richtext = $('<span class="btn btn-info selectRich">选择富文本</span>');

        if(data){
            name.val(data.name);
            title.val(data.title);
            title.attr('id',data.id);
        }
        childBox.append(delBtn);
        childBox.append(name);
        childBox.append(title);
        childBox.append(richtext);
        childCont.append(childBox);

        delBtn.bind('click',function(){
            $(this).parent().remove();
        });
        richtext.bind('click',function(){
            var self = $(this);
            var modal = getModal({
                title :'自动分配',
                content : $("<div>asdfasdf</div>"),
                url : '/Setting/RichText/Special/1/100',
                type : 'rich',
                callback : function(){
                    self.prev().val(this.value).attr('id',this.current).trigger('change');
                    modal.modal('hide')
                }
            });
        })
    }
    function removeFile(file){
        if(file.children().eq(1).children().length==0){
            file.remove();
        }else{
            showAlert('请先删除文件夹中的文件');
        }

    }
}
// 广告发布
function publish(){
    $.ajax({
        method:'POST',
        url:'/Setting/Index/Create',
        success:function(data){
            showAlert(data.msg);
        }
    })
}
//裁剪图片
function readImage(selector,opt){
    var width = opt ? opt.width : 360;
    var height = opt ? opt.height : 240;
    var $image = selector || $('#image');
    var input = document.getElementById('input');
    if (typeof FileReader !== 'undefined') {
        var reader = new FileReader();
        reader.onload = function (e) {
            var url = e.target.result;
            $image.attr('src', url);
            initCropper($image,{width:width,height:height});
            $image.cropper('replace',url);
        };
        if (input.files && input.files[0]) {
            reader.readAsDataURL(input.files[0]);
        }
    } else { // IE10-
        input.select();
        input.blur();
        var src = document.selection.createRange().text;
        $image.attr('src', url);
        initCropper($image,{width:width,height:height});
        $image.cropper('replace',url);
    }
}
function initCropper(ele,opt){
    $('.upload-tip').hide();
    $('.image-box').show();
    var $ele = ele;
    var option = $.extend({
        width:360,
        height:240
    },opt);
    var $previews = $('.preview');
    $ele.cropper({
        viewMode:1,
        preview:'.preview',
        dragMode:'move',
        restore:false,
        guides:false,
        highlight:false,
        cropBoxMovable:false,
        cropBoxResizable:false,
        aspectRatio:option.width/option.height,
        built:function(){

        },
        build:function(){
            var $clone = $(this).clone();
            $previews.css({
                overflow:'hidden'
            }).html($clone);
        },
        crop:function(e){
            var imageData = $(this).cropper('getImageData');
            var previewAspectRatio = e.width / e.height;
            $previews.each(function(){
                var $preview = $(this);
                var previewWidth = $preview.width();
                var previewHeight = previewWidth / previewAspectRatio;
                var imageScaledRatio = e.width / previewWidth;

                $preview.height(previewHeight).find('img').css({
                    width: imageData.naturalWidth / imageScaledRatio,
                    height: imageData.naturalHeight / imageScaledRatio,
                    marginLeft: -e.x / imageScaledRatio,
                    marginTop: -e.y / imageScaledRatio
                });
            });
        }
    });

}
function uploadImage(ele,callback){
    var that = ele;
    var $image = $('#image');

    var filename = $('#input').val().split('\\').slice(-1).toString();
    var type = $('#input').val().split('.').slice(-1).toString();
    type = type == "jpg" ? "jpeg" : type;
    $image.cropper('getCroppedCanvas').toBlob(function (blob) {
        var formData = new FormData();
        formData.append('file', blob, filename);
        // /FileUpload/SimpleUploadFileByCut
        $.ajax('/FileUpload/SimpleUploadFile', {
            method: "POST",
            data: formData,
            processData: false,
            contentType: false,
            dataType: "json",
            success: function (result) {
                if (result.success) {
                    that.addClass('disabled');
                    showAlert(result.msg);
                    $('#realInput').val(result.path);
                    $('.upload-tip').show();
                    if (typeof callback == "function") callback();
                } else {
                    that.removeClass('disabled');
                    showAlert(result.msg, 'danger');
                    $('.upload-tip').hide();
                }
            },
            error: function () {
                console.log('Upload error');
            }
        });

    },"image/"+type);
}