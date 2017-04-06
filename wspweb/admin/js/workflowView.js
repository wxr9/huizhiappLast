require(['jquery', 'pm', 'datepickercn', 'workflow'], function (jq, a, b, getViewForm) {
    $('html, body').css({
        width: "100%", height: "100%", "overflow-x": "hidden"
    });
    var id = queryString('id');
    var idv = queryString('iid');
    var piid = queryString('pid');
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
        }
        this.n = 0;
        this.end = length;
        this.length = length;
        this.status = false;
        return this;
    }

    getStatus.prototype.error = function (fn) {
        fn();
    };
    getStatus.prototype.over = function () {
        this.n++;
        this.end++;
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
                    $('select').attr('disabled', 'disabled');
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



        var getTemp = function (data) {
            if (data && data.mustSave == true) {
                window.parent.$("#disableCfm").attr('disabled', true);
            } else {
                window.parent.$("#disableCfm").attr('disabled', false);
            }
            var footer = div.clone();
            var formList = [];
            var temp = div.clone();

            $.each(data.form, function (ind, val) {
                    var c = content.clone();
                    formList.push(c);
                    if (ind != 0) {
                        c.append('<hr />');
                    }
                    c.attr('action', val.action || 'readOnly');
                        getReadOnly(val, c);

                    c.append('<div style="clear:both;"></div>');
                    c.appendTo(temp);
                }
            );

            temp.append(footer);
            return temp;
        };


        $.ajax({
            url: '/workflow/api/get/' + id,
            dataType: 'json',
            success: function (data) {
                piid = data.id;
                id = parseInt(data.currenttask);
                $("#temp").css('margin-left','240px').append(getTemp(JSON.parse(data.writeable_fields)));
                $.ajax({
                    url: '/workflow/api/taskinstances/history/opinion/List/0/0/0',
                    data:{
                        piid: piid,
                        tid: id
                    },
                    success: function(da){
                        var target=$("#temp");
                        target.append('<hr />')
                        $(da.objects).each(function(ind,val){
                            var g = $('<div class="form-group col-sm-offset-0"  />')
                            var row = $('<div class="row"></div>')
                            var l = $('<label class="col-sm-3 control-label" style="text-align: right;">'+val.task_user+' :</label>')
                            var c = $('<div class="col-sm-6">'+val.content+'</div>');
                            g.append(l).append(c);
                            target.append(row.append(g));
                        })
                        target.append('<div style="height:240px;" />')
                    }
                })
            }
        })
    })
});