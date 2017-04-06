require(['jquery','bootstrap','pm'], function () {
	//flag:f前台b后台
	var flag= queryString('flag') || 'f';
	if(flag =='b'){
		$('#title').html('后台帮助中心设置');
	}
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

	(function () {
		var method = {};
		method.init = function () {
			var self =this;
			if(this.data.length > 0){
				self.render();
				self.initIcon();
			}else if(self.option.url){
				$.ajax({
					url: self.option.url,
					success:function(data){
						console.log(data.content);
						self.data = JSON.parse(data.content);
						self.render();
						self.initIcon();
					}
				})
			}

		};
		method.initIcon = function () {
			var self = this;
			var tree = this.tree;
			$.each(tree, function (ind, val) {
				if (val.treeParent != undefined) {
					var parentNode = tree[val.treeParent];
					if (!parentNode.isAddIcon) {
						var icon = $('<icon class="expandIcon fa fa-folder-open"></icon>');
						icon.on('click', function () {
							$(this).toggleClass('expandIcon').toggleClass('shrinkIcon');
							$(this).toggleClass('fa-folder-open').toggleClass('fa-folder'); //icon toggle
							if (!parentNode.hasClass('shrink')) {
								var height = parentNode.children('dt').height();
								parentNode.addClass('shrink');
							} else {
								parentNode.removeClass('shrink');
							}

						});
						parentNode.children('dt').prepend(icon);
						parentNode.isAddIcon = true;
					}
				}
				self.addButton(val);
			})
		};
		method.removeNode = function (ele) {
			var tree = this.tree;
			var prev, next, eleIndex;
			eleIndex = ele.index;
			if (!(ele.treeParent === undefined)) {
				var index;
				$.each(tree[ele.treeParent].childList, function (i, v) {
					if (v === ele) {
						index = i;
						return false;
					}
				});
				var pe = tree[ele.treeParent].childList.slice(0, index);
				var ne = tree[ele.treeParent].childList.slice(index + 1, tree[ele.treeParent.length])
				tree[ele.treeParent].childList = [].concat(pe, ne);
				if (tree[ele.treeParent].childList.length === 0) {
					tree[ele.treeParent].isEmpty = true;
				}
			}

			prev = tree.slice(0, ele.index);
			next = tree.slice(ele.index + 1, tree.length);
			$.each(next, function (ind, val) {
				if (val) {
					if (val.treeParent != undefined && eleIndex < val.treeParent) {
						val.treeParent = val.treeParent - 1;
					}
					if (val.index > eleIndex) {
						val.index = val.index - 1;
					}
				}
			});
			ele.slideUp(200, function () {
				$(this).remove();
			})
			this.tree = [].concat(prev, next);
		};
		method.addButton = function (ele) {
			var self = this;
			var tree = self.tree;
			var add = $('<i class="add fa fa-plus-circle"></i>');
			var del = $('<i class="del fa fa-minus-circle"></i>');
			if(self.option.deep && self.option.deep > ele.deep){
				ele.children('dt').children('.label').before(add).before(del);
			}else{
				ele.children('dt').children('.label').before(del);
			}
			add.on('click', function () {
				self.addNode({
					name: '请填写标题',
					value: '请选择富文本',
					class: 'new',  //new add
					parent: ele.index
				}, self.tree.length, ele.children('dd'));
			});
			del.on('click', function () {
				var tree = self.tree;
				if (ele.isEmpty === false) {
					showAlert('子菜单不为空,无法删除','danger')
				} else {
					showAlert('删除成功','success');
					self.removeNode(ele);
				}
			})
		};

		method.render = function () {
			var root = this.ele;
			root.empty();
			var self = this;
			$(this.data).each(function (ind, val) {
				self.addNode(val, ind)
			});
			var submit = $('<button class="btn btn-success" style="margin:20px auto;">确定</button>');
			submit.on('click', function () {
				self.option.callback(self.serialize());
				$(this).attr('disabled','true');
			});
			root.append(submit);
		};
		method.addNode = function (val, ind, targetNode) {
			var self = this;
			var root = this.ele;
			root.deep = 0;
			var tree = this.tree = this.tree || [];
			var target, par, deep;
			var content = $('<dl></dl>');
			var hd = $('<dt></dt>');
			var bd = $('<dd></dd>');
			var label = $('<input type="text" class="label" />');
			var text = $('<div type="text" class="value"></div>');
			var input = $('<input type="text" readOnly="readOnly" />');
			var button = $('<button class="selectRich btn btn-info btn-sm">选择富文本</button>');
			text.append(input);
			text.append(button);
			label.val(val.name);
			label.addClass(val.class);    //new add color
			input.addClass(val.class);    //new add color
			text.find('input').val(val.value).attr('data-id',val.val);
			if (val.parent != undefined) {
				par = tree[val.parent];
				target = par.children('dd');
				par.isEmpty = false;
				par.childList.push(content);
				content.treeParent = +val.parent;
			} else {
				par = root;
				target = root;
				root.childList = root.childList || [];
				root.isEmpty = false;
			}
			if (targetNode) {
				target = targetNode;
			}
			deep = par.deep + 1;

			label.on('focus', function () {
				$(this).addClass('edit');
			}).on('blur', function () {
				$(this).removeClass('edit');
			}).on('change', function () {
				$(this).addClass('new');   //add new color
				content.name = $(this).val();
			});
			input.on('change', function(){
				content.value = input.val();
				content.val = input.attr('data-id');
				$(input).addClass('new');  //add new color
			});
			content.append(hd, bd);
			hd.attr('data-deep', deep);
			hd.append(label);
			hd.append(text);
			content.isEmpty = true;
			content.childList = [];
			content.deep = deep;
			content.name = val.name;
			content.value = val.name;
			content.val = val.val;
			content.index = ind;

			tree[ind] = content;
			if (targetNode) {
				self.addButton(content);
			}
			target.append(content.hide());
			content.slideDown(200)
		};
		method.serialize = function () {
			var ret = [];
			$(this.tree).each(function (ind, val) {
				var obj = {
					parent: val.treeParent,
					name: val.name,
					value: val.value,
					val: val.val,
					id:val.id
				};
				if (obj.parent === undefined) {
					delete obj.parent;
				}
				ret.push(obj);
			});
			return ret;
		};

		function Tree(options) {
			this.option = {
				rootIcon: './images/root.png',
				expandIcon: './images/expand.png',
				narrowIcon: './images/narrow.png',
				callback: function(ret){
				}
			};
			assign(this.option, options);
			this.ele = $(this.selector).addClass('hTree');
			this.data = this.option.data || [];
			assign(this, method);
			this.init();
			return this;
		}

		$.fn.extend({
			Tree: Tree
		});

	})($);
	$(function () {
		require(['pm'], function () {
			$('#tree').Tree({
				deep:2,
				callback: function(ret){
					$.ajax({
						url: '/Setting/SettingHelps/Update',
						method: 'POST',
						data:{
							objectid: 1,
							flag:flag,
							content: JSON.stringify(ret)
						},
						success:function(data){
							showAlert('保存成功');
							setTimeout(function(){
								window.location.reload();
							},3000)
						}
					})
				},
				url: '/Setting/SettingHelps/Edit?type='+flag

			});
			$("#tree").on('click','.selectRich', function () {
				var self = $(this);
				var modal = getModal({
					title :'自动分配',
					content : $("<div>asdfasdf</div>"),
					url : '/Setting/RichText/Special/1/100',
					type : 'rich',
					callback : function(){
						self.prev().val(this.value).attr('data-id',this.current).trigger('change');
						modal.modal('hide')
					}
				});
			});
		})


	});

})

