require(['jquery','bootstrap'], function () {

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
			this.render();
			this.initIcon();
		};
		method.initIcon = function () {
			var self = this;
			var tree = this.tree;
			$.each(tree, function (ind, val) {
				if (val.treeParent != undefined) {
					var parentNode = tree[val.treeParent];
					if (!parentNode.isAddIcon) {
						var icon = $('<icon class="expandIcon"></icon>');
						icon.on('click', function () {
							$(this).toggleClass('expandIcon').toggleClass('shrinkIcon');
							if (!parentNode.hasClass('shrink')) {
								var height = parentNode.children('dt').height();
								parentNode.addClass('shrink');
							} else {
								parentNode.removeClass('shrink');
							}
							;
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
			var add = $('<i class="add">➕</i>');
			var del = $('<i class="del">➖</i>');
			ele.children('dt').children('.label').before(add).before(del);
			add.on('click', function () {
				self.addNode({
					name: '新建',
					value: '新建',
					parent: ele.index
				}, self.tree.length, ele.children('dd'));
			});
			del.on('click', function () {
				var tree = self.tree;
				if (ele.isEmpty === false) {
					console.log('子节点不为空,无法删除')
				} else {
					console.log('可以删除');
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
			var submit = $('<button>确定</button>');
			submit.on('click', function () {
				self.serialize();
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
			var input = $('<input type="text" />');
			var button = $('<button class="selectRich">选择富文本</button>');
			text.append(input);
			text.append(button);
			label.val(val.name);
			text.val(val.value);
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
			//text.on('focus',function(){
			//	$(this).addClass('edit');
			//}).on('blur', function(){
			//	$(this).removeClass('edit');
			//}).on('change', function(){
			//	content.value = $(this).val();
			//});
			label.on('focus', function () {
				$(this).addClass('edit');
			}).on('blur', function () {
				$(this).removeClass('edit');
			}).on('change', function () {
				content.name = $(this).val();
				console.log($(this).val());
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
					value: val.value
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
				narrowIcon: './images/narrow.png'
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
				data: [
					{name: "汇智卡帮助", value: '测试'},
					{name: "报修帮助", value: '测试1'},
					{
						name: "办卡须知",
						value: '.admin/help.html',
						id: 0,
						parent: 0
					},
					{
						name: "挂失解挂说明",
						value: './admin/abc.html',
						id: 0,
						parent: 0
					},
					{
						name: "物业报修说明",
						value: './admin/abc.html',
						id: 0,
						parent: 1
					},
					{
						name: "IT报修说明",
						value: './admin/abc.html',
						id: 0,
						parent: 1
					},
					{name: "Q&A", value: '测试3'}]
			});
			$(".selectRich").on('click', function () {
				var self = $(this);
				var modal = getModal({
					title: '自动分配',
					content: $("<div>asdfasdf</div>"),
					url: '/Setting/RichText/Special/1/100?valid=1',
					type: 'rich',
					callback: function () {
						var target = self.parent().find('.selectRich');
						target.val(this.value).attr('data-id', this.current);
						modal.modal('hide')
					}
				});
			});
		})


	});

})

