require(['jquery', 'pm', 'datepickercn', 'workflow'], function (jq, a, b, getViewForm) {
    $('html, body').css({
        width: "100%", height: "100%", "overflow-x": "hidden"
    });
    //删除表单
    function delItem(arr, n) {
        if (n < 0) return arr;
        return arr.slice(0, n).concat(arr.slice(n + 1, arr.length));
    }

    //日期格式化
    function converDate(date, type) {
        if(type == undefined){
            type = "yyyy/mm/dd"
        }
        if (date == null || date == undefined) {
            date = new Date();
        }
        var d = new Date(date);
        var cache = d.toString();
        if (cache === "NaN" || cache === "Invalid Date" || cache === "Invalid date") {
            d = new Date(date.replace(/-/g, '/'));
        }
        if (type == 'yyyy/mm/dd') {
            return d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate();
        }else if(type =='hh:mm'){
            return date;
        }else{
            return d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
        }
    }
    var id = queryString('id');
    var idv = queryString('idv');
    var piid = queryString('pid');
    var dateOption = {
        keyboardNavigation: false,
        format: 'yyyy/mm/dd hh:ii:ss',
        todayBtn: true,
        startDate: new Date(),
        autoclose: true,
        startView: 2,
        maxView: 4,
        minView: 0
    }
    var div = $('<div></div>');
    var content = $('<form class="form-horizontal"></form>');
    var group = $('<div class="form-group"></div>');
    var label = $('<label class="col-sm-3 control-label col-sm-offset-0"></label>');
    var textLabel = $('<label class="form-label col-sm-8" style="line-height: 2.5;"></label>');
    var formRight = $('<label class="col-sm-8" style="line-height: 2.5;"></label>');
    var select = $('<select class="form-control"></select>');
    var hidden = $('<input type="hidden" />');
    var text = $('<div class="col-sm-6"></div>');
    var checkbox = $('<input type="checkbox" />')
    var cont = $('<div class="col-sm-12"></div>');
    var textArea = $('<textarea class="form-control"></textarea>');
    var conBtn = $('<div style="font-size:30px;position: absolute;top:50%;left:5%;"></div>');
    var addForm = $('<i class="fa fa-plus-square-o" style="cursor: pointer;margin: 0 10px 0 0;"></i>');
    var delForm = $('<i class="fa fa-minus-square-o del" style="cursor: pointer"></i>');
    var input = $('<input class="form-control"/>');
    var img = $("<img />");
    //获取状态,提交处理
    function getStatus(length) {
        if (this instanceof getStatus != true) {
            return new getStatus(length);
        };
        this.errorList = [];
        this.n = 0;
        this.end = length;
        this.step = 0;
        this.length = length;
        this.status = false;
        return this;
    }
    getStatus.prototype.throwError = function(){
        var list = this.errorList;
        var target = window.parent || window;
        if(list.length>0){
            $(list).each(function(ind,val){

                var msg = val.responseText;
                try{
                    msg = JSON.parse(msg).msg;
                }catch(e){

                }
                target.showAlert(msg);
            })
        };
    }
    getStatus.prototype.error = function (e) {
        this.step++;
        this.errorList.push(e);
        if(this.step == this.length){
            this.throwError();
        }
    };
    getStatus.prototype.over = function () {
        this.n++;
        this.end++;
        this.step++;
        if(this.step == this.length){
            this.throwError();
        }
        if (this.n === this.length) {
            this.status = true;
            return true;
        }
        if (this.end === this.length) {
            return false;
        }
    };
//template----------------------------------------------------------------------------
    $(function () {
        function getReadOnly(val, c) {
            var ajaxOption = {
                url: val.url + idv,
                success: function (data) {
                    c.attr('action', 'readOnly');
                    c.append(getViewForm(val, data, c));
                }
            }
            if (val.workflowData) {
                ajaxOption.data = {
                    piid: piid,
                    tid: id
                }
            }
            $.ajax(ajaxOption)
        }


        function getEdit(val, c) {
            var ajaxOpt = {
                url: val.url + idv,
                success: function (data) {
                    if (val.workflowData == true) {
                        c.append(hidden.clone().attr('name', 'piid').val(piid)).append(hidden.clone().attr('name', 'tid').val(id));
                    }
                    c.append(getViewForm(val, data, c))
                    c.find('textarea').each(function(ind,val){
                        $(val).focus();
                    })
                }
            };
            if (val.workflowData) {
                ajaxOpt.data = {
                    piid: piid,
                    tid: id
                }
            }
            $.ajax(ajaxOpt)

        }

        var getTemp = function (data) {
            if (data && data.mustSave == true) {
                window.parent.$("#disableCfm").attr('disabled', true);
            } else {
                window.parent.$("#disableCfm").attr('disabled', false);
            }
            var footer = div.clone();
            var submit = $('<a class="btn btn-primary">保存</a>');
            footer.append(text.clone().addClass("offset5").append(submit));
            var formList = [];
            submit.appendTo(footer);
            submit.on('click', function () {
                var self = this;
                if (self.disabled == true) {
                    return;
                }
                var length = 0;
                var sta;
                $(formList).each(function (ind, val) {
                    if (val.attr('action') != "readOnly") {
                        length++;
                        $.ajax({
                            url: val.attr('action'),
                            method: "post",
                            data: val.serialize().replace('-207', idv),
                            success: function (data) {
                                var status = sta.over();
                                var target = window.parent || window;
                                if (status === true) {

                                    if (window.parent) {
                                        self.disabled = true;
                                        $(self).attr('disabled', true);
                                        window.parent.$("#disableCfm").attr('disabled', false);
                                    }
                                    target.showAlert('保存成功');
                                } else if (status === false) {
                                    target.showAlert('保存失败', 'warn');
                                } else if (status == undefined) {

                                }
                            },
                            error: function (e) {
                                sta.error(e);
                            }
                        })
                    }
                });
                sta = getStatus(length);
            });

            var temp = div.clone();

            $.each(data.form, function (ind, val) {
                    var c = content.clone();
                    formList.push(c);
                    if (ind != 0) {
                        c.append('<hr />');
                    }
                    c.attr('action', val.action || 'readOnly');
                    if (val.readOnly) {
                        getReadOnly(val, c);
                    } else {
                        getEdit(val, c)
                    }

                    if (val.add == true) {
                        var btn = conBtn.clone();
                        var nForm = addForm.clone();
                        var dForm = delForm.clone().hide();
                        btn.append(nForm).append(dForm);
                        c.css('position', 'relative');
                        c.append(btn);
                        c.addClass('form-list');
                        nForm.on('click', function () {
                            var newForm = c.clone(true);
                            c.find('input').each(function (ind, val) {
                                var name = $(this).attr('name');
                                newForm.find('input[name="' + name + '"]').val($(val).val());
                            });
                            newForm.find('input').each(function (ind, val) {
                                if ($(val).attr('date-type') === 'date') {
                                    $(val).datetimepicker(dateOption).val(converDate(new Date(),'all'))
                                }
                            });
                            newForm.find('textArea').val("");
                            newForm.find('input[name="objectid"]').val(0)
                            newForm.find('.del').show();
                            $('.form-list').eq(-1).after(newForm);
                            formList.push(newForm);
                        });
                        dForm.on('click', function () {
                            var target = $(this).parents('form').get(0);
                            $(formList).each(function (ind, val) {
                                if (target === val.get(0)) {
                                    formList = delItem(formList, ind);
                                    val.remove();
                                    return false;
                                }
                            });
                        });
                    }
                    c.append('<div style="clear:both;"></div>');
                    c.appendTo(temp);
                }
            );

            temp.append(footer);
            return temp;
        };


        $.ajax({
            url: '/workflow/api/edit/' + id,
            dataType: 'json',
            success: function (data) {
                $("#temp").append(getTemp(JSON.parse(data.readable_fields)));
            }
        })
    })
});