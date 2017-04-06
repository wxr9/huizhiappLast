require(['jquery', 'datatables', 'pm'], function () {
    var qs = queryString('type');
    var parentida = queryString('parentid');
    var level = queryString('level');
    function initList(ele, opt) {
        if (!this instanceof initList) {
            return new initList(ele)
        }
        var self = this;
        this.refresh = function () {
            setData(self.page)
        };
        var qs = opt.qs;
        var parentid = opt.parentid;
        function getContent(objects) {
            var pageCount;
            if (objects.total % objects.pagesize === 0) {
                pageCount = parseInt(objects.total / objects.pagesize);
            } else {
                pageCount = parseInt(objects.total / objects.pagesize) + 1;
            }
            self.pageCount = pageCount;
            var currentPage = objects.page;
            var pageList = getPage(pageCount, currentPage);
            var pageContent = [];
            var result = objects.result;
            var liClass = "";
            pageContent.push('<li class="dictLi"><span class="dictSpan">标题</span><span class="dictSpan">类别</span><span class="dictSpan">排序</span><span class="dictSpan">操作</span></li>');
            for (var i = 0; i < result.length; i++) {
                console.log(result);
                liClass = "";
                if (i % 2 == 0) {
                    liClass = " odd"
                }
                pageContent.push('<li class="dictLi' + liClass + '"><span class="dictSpan">' + result[i].name + '</span><span class="dictSpan">' + result[i].type + '</span><span class="dictSpan">' + result[i].orderFlag + '</span>');
                pageContent.push('<span class="dictSpan">')
                pageContent.push('<a class="dictOp edit" data-id="' + result[i].objectid + '">编辑</a>')
                if((result[i].type == "repairsCommFlag" ||result[i].type == "ITrepairsFlag" || result[i].type == "merchantType")&& level == undefined ){
                    pageContent.push('<a target="_blank" href="/admin/dictDetail.html?type=' + result[i].type + '&parentid='+result[i].objectid+'&level=three" class="dictOp">查看详情</a>')
                }
                pageContent.push('<a class="dictOp delete" data-name="'+result[i].name+'" data-id="' + result[i].objectid + '">删除</a>')
                pageContent.push('</span></li>')
                //pageContent.push(getTemp('richlist', result[i]));
            }
            pageContent = pageContent.join('');
            return pageContent + pageList;
        }

        function getPage(page, current) {
            var temp = [];
            temp.push('<nav><ul class="pagination">');
            temp.push('<li><a href="javascript:void(0)" class="prevPage"><span>«</span></a></li>');
            for (var i = 1; i <= page; i++) {
                if (i == current) {
                    temp.push('<li class="current"><a>' + i + '</a></li>')
                } else {
                    temp.push('<li class="paginationItem" page-num="' + i + '"><a>' + i + '</a></li>')
                }
                if (page > 10 && i > 4 && i < page - 4) {
                    temp.push('<li class="current"><a>…</a></li>');
                    i = page - 4;
                }
            }
            temp.push('<li><a href="javascript:void(0)" class="nextPage"><span>»</span></a></li>');
            temp.push('</ul><nav>');
            return temp.join('');
        }

        function setData(page, size) {
            var target = $(ele);
            page = page || 1;
            size = size || 10;
            self.page = parseInt(page);
            var url = '/Setting/SettingDict/' + page + "/" + size;
            if (qs && qs != "") {
                url = url + "?type=" + qs +"&parentid="+ parentid;
            }
            target.empty().append('<div style="text-align: center"><img src="/admin/images/loadinglist.gif" /></div>').fadeIn(200);
            $.ajax({
                url: url,
                success: function (data) {

                    target.empty().hide().append(getContent(data)).fadeIn(200).find('img').on('error', function () {
                        $(this).attr('src', '/admin/images/huizhi.jpg');
                    });
                    if (data.result.length == 0) {
                        target.prepend('<div style="text-align: center">找不到结果</div>')
                    }
                }
            })
        }

        setData();
        $(ele).on('click', '.paginationItem', function () {
            setData($(this).attr('page-num'));
        });
        $(ele).on('click', '.prevPage', function () {
            if (self.page != 1) {
                setData(self.page - 1);
            }
        });
        $(ele).on('click', '.nextPage', function () {
            if (self.page != self.pageCount) {
                setData(self.page + 1);
            }
        });
        window.wspList = this;
        return this;
    }

    if (qs != undefined && qs != "") {
       var dataList = initList('#uldatatable', {qs: qs,parentid:parentida});
        $('#uldatatable').on('click', '.edit', function () {
            var self = $(this);
            var id = self.attr('data-id');
            $.ajax({
                url: '/Setting/SettingDict/Edit/' + id,
                success: function (data) {
                    var html = $('<div></div>');
                    var li = $('<li class="dict-modal-li"></li>');
                    var label = $("<label class='dict-modal-label'>标题:</label>");
                    var input = $("<input class='dict-modal-input' type='text' name='name' />");
                    html.append(li.clone().append(label.clone()).append(input.clone().val(data.name)));
                    html.append(li.clone().append(label.clone().html("英文名：")).append(input.clone().attr('name', 'english').val(data.english)));
                    html.append(li.clone().append(label.clone().html("type：")).append(input.clone().attr('name', 'type').val(data.type)).hide());
                    html.append(li.clone().append(label.clone().html("排序：")).append(input.clone().attr({'name': 'orderFlag'}).val(data.orderFlag)));
                    var modal = getModal({
                        'title': data.type,
                        'content': html,
                        'callback': function () {
                            var value = this.ele.find('input[name="name"]').val();
                            var orderFlag = this.ele.find('input[name="orderFlag"]').val();
                            var english = this.ele.find('input[name="english"]').val();
                            $('input[name="orderFlag"]').on('focus',function(){
                                $('#disableCfm').removeAttr('disabled');
                            })
                            if(parseInt(orderFlag) > 0 && orderFlag == parseInt(orderFlag)) {
                                var dd = {
                                    english:english,
                                    name: value,
                                    objectid: id,
                                    type: data.type,
                                    orderFlag: orderFlag,
                                    parentid: parentida
                                };

                                $.ajax({
                                    url: '/Setting/SettingDict/Update',
                                    method: 'post',
                                    data: dd,
                                    success: function (da) {
                                        showAlert(da.msg);
                                        modal.modal('hide');
                                        dataList.refresh();
                                    }
                                })
                            }else{
                                showAlert("排序必须是大于0的整数",'danger')
                            }
                        }
                    })
                }
            })
        });
        $('#add').on('click', function () {
            var html = $('<div></div>');
            var li = $('<li class="dict-modal-li"></li>');
            var label = $("<label class='dict-modal-label'>标题:</label>");
            var input = $("<input class='dict-modal-input' type='text' name='name' />");
            html.append(li.clone().append(label.clone()).append(input.clone()));
            html.append(li.clone().append(label.clone().html("排序:")).append(input.clone().attr('name', 'orderFlag').attr('type','number')));
            html.append('<div style="font-size:12px;color:#999;">排序请填写大于0的整数.</div>');
            var modal = getModal({
                'title': '新增' + qs,
                'content': html,
                'callback': function () {
                    var value = this.ele.find('input[name="name"]').val();
                    var orderFlag = this.ele.find('input[name="orderFlag"]').val();
                    $('input[name="orderFlag"]').on('focus',function(){
                        $('#disableCfm').removeAttr('disabled');
                    })
                    if(parseInt(orderFlag) > 0 && orderFlag == parseInt(orderFlag)) {
                        $.ajax({
                            url: '/Setting/SettingDict/Add',
                            method: 'post',
                            data: {
                                name: value,
                                parentid: parentida,
                                type: qs,
                                orderFlag: orderFlag
                            },
                            success: function (da) {
                                showAlert(da.msg);
                                modal.modal('hide');
                                dataList.refresh();
                            }
                        })
                    }else{
                        showAlert("排序必须是大于0的整数",'danger')
                    }
                }
            })
        })
        $('#uldatatable').on('click', '.delete', function () {
            var liName = $(this).attr('data-name');
            var id = $(this).attr('data-id');
            var html = $('<div></div>');
            var li = $('<li class="dict-modal-li">是否删除'+liName+'</li>');
            html.append(li);
            var modal = getModal({
                'title': '删除数据字典',
                'content': html,
                'callback': function () {
                    $.ajax({
                        url: '/Setting/SettingDict/Delete/' + id,
                        success: function (da) {
                            showAlert(da.msg);
                            modal.modal('hide');
                            dataList.refresh();
                        }
                    })
                }
            })
        })
    }
});