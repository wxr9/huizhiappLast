define(['jquery', 'datepickercn'], function () {
    /**
     *
     * @param labelName
     * @param name
     * @param value
     * @param v
     * @returns {*|jQuery}
     */
    function getCheckbox(labelName, name, value, v) {
        if (value == undefined) {
            value = "";
        }
        var label = $('<label class="isCheck" />').html(labelName);
        var checkbox = $('<input type="checkbox" name="' + name + '" value="' + value + '"/>');
        var box = $("<span/>").css({
            'display': 'inline-block',
            'margin': '0px 10px'
        }).attr('name', name);
        box.append(label).append(checkbox);
        box.label = label;
        box.checkbox = checkbox;
        box.setValue = function (val) {
            checkbox.attr('value', val);
            return this;
        };
        box.getValue = function () {
            return checkbox.attr('value');
        }
        box.checked = function () {
            checkbox.attr('checked', true)
            return this;
        }
        if (v == value) {
            box.checked();
        }
        ;
        return box;
    }


//获取深度数据
    function getDep(data, v) {
        if (v === undefined) {
        }
        if (Object.prototype.toString.call(v.name) === '[object Array]') {
        } else {
            return getNormalDep(data, v);
        }
        ;

    }

    function getNormalDep(data, v) {
        var path = v.name.replace(/\s/g, "").split("-");
        if (path.length === 1) {
            return getVal(data, path[0]);
        } else {
            return getVal(data, path[0]) + '-' + getVal(data, path[1]);
        }
    }

//深度数据取值操作
    function getVal(data, path) {
        function getPath(da, pa) {
            var arg = [].slice.call(pa);
            if (arg.length === 1) {
                if (da == undefined) {
                    return "";
                }
                return da[pa];
            } else {
                if (da == null) {
                    return "";
                }
                return getPath(da[arg.shift()], arg);
            }
        }

        var path = path.split('.');
        if (path.length === 1) {
            return data[path[0]];
        } else {
            return getPath(data, path)
        }
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
        function fDate(date){
            if(date< 10){
                return "0"+ date;
            }else{
                return date;
            }
        }
        var month = d.getMonth() + 1;
        var day = d.getDate();
        var hours = d.getHours();
        var minute = d.getMinutes();
        var second = d.getSeconds();
        month = fDate(month)
        day = fDate(day)
        hours = fDate(hours)
        minute = fDate(minute)
        second = fDate(second)
        if (type == 'yyyy/mm/dd') {
            return d.getFullYear() + "/" + month + "/" + day;
        }else if(type =='hh:mm'){
            return date;
        }else{
            return d.getFullYear() + "/" + (month) + "/" + day + " " + hours + ":" + minute + ":" + second;
        }
    }

//template----------------------------------------------------------------------------
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

    var download = $('<a download target="_blank">下载</a>');
    var fgf = div.clone().css({
        margin: '15px 0',
        clear: 'both',
    });

    function choseDate(str) {
        if(str === undefined){
            str ='yyyy/mm/dd hh:mm:ss'
        }
        str = str.toLowerCase();
        if (str === "hh:mm") {
            return {
                keyboardNavigation: false,
                format: 'hh:ii',
                todayBtn: false,
                autoclose: true,
                startDate: new Date("2016/01/01"),
                startView: 1,
                maxView: 1,
                minView: 0
            }
        }else if( str === "yyyy/mm/dd"){
            return {
                keyboardNavigation: false,
                format: 'yyyy/mm/dd',
                todayBtn: true,
                autoclose: true,
                startDate: new Date(),
                startView: 2,
                maxView: 4,
                minView: 2
            }
        }else if(str === "yyyy/mm/dd hh:mm:ss"){
            return {
                keyboardNavigation: false,
                format: 'yyyy/mm/dd hh:ii:ss',
                todayBtn: true,
                startDate: new Date(),
                autoclose: true,
                startView: 2,
                maxView: 4,
                minView: 0
            }
        }

    }

    function getViewForm(ret, data) {
        var forms = $("<div/>");
        var formData = []
        if (ret.multiple === true) {
            formData.push(getMultipleForm(ret, data));
        } else {
            formData.push(getSingleForm(ret, data));
        }

        $(formData).each(function (ind, val) {
            forms.append(val);
        });
        return forms;
    }

    function getMultipleForm(ret, data) {
        var formData = [];
        var wrapForm = [];
        $(data.result).each(function (index, value) {
            formData.push(getSingleForm(ret, value));
        });
        $(formData).each(function (ind, val) {
            var wrap = $('<div class="multipleForm"/>');
            wrap.append(val);
            wrapForm.push(wrap)
        });
        return wrapForm;
    }

    function getSingleForm(ret, data) {
        var singleForm = $('<div class="singleForm"/>');
        $(ret.item).each(function (i, v) {
            singleForm.append(getViewLine(v, data, singleForm));
        });
        return singleForm;
    };
    function getSignLine(v, data, forms) {
        var lineData = group.clone();
        v.type = v.type || 'text';
        if (v.label !== undefined) {
            var labelData = label.clone().html(v.label + ":");
            lineData.append(labelData);
        }
        if (v.type == 'hidden') {
            return getViewInput(v.type, getDep(data, v), v.name, v, forms, data);
        }
        if(data.result){
            data = data.result[0];
        }
        lineData.append(formRight.clone().append(getViewInput(v.type, getDep(data, v), v.name, v, forms, data)));
        return lineData;
    }

    function getLineTemplate(sort, group, data, hasCheck, index, v) {
        var label = $("<label class='meetingRoom-label'/>");
        var line = $('<div class="' + sort + '" />');
        if (sort == "meetingRoom") {
            line.append(label.clone().html(v.label + ":"));
            line.append(getViewInput(v.type, data[v.name], v.name, v))
            $(group).each(function (ind, val) {
                line.append(label.clone().html(val.label + ":"));
                line.append(getViewInput(val.type, data[val.name], val.name, val))
            })
        } else if (sort == "classroom") {
            line.append(label.clone().html(v.label + ":"));
            line.append(getViewInput(v.type, data[v.name], v.name, v))
            $(group).each(function (ind, val) {
                var chx = getCheckbox(val.value, val.name, val.label, data['halfDay']);
                chx.on('click', function(){
                    var state = $(this).find('input').get(0).checked;
                    var name = $(this).attr('name');
                    $(this).siblings('span').find('input[name="'+name+'"]').get(0).checked = !state
                })
                line.append(chx);
            });
        }else if(sort == "opinion"){
            var opinionLabel = $("<label class='col-sm-3 control-label col-sm-offset-0' />");
            var comment  =$('<div class="opinion-comment"/>')
            var dat = $('<div class="opinion-date" />')
            line.append(opinionLabel.html(data["opinion_name"] + ":"))
            line.append(comment.html(data["content"]))
            line.append(dat.html(data["complete_date"]));
        }
        if (hasCheck !== undefined) {
            line.append(getCheckbox('通过', hasCheck, index, index));
        }
        return line;
    }

    function getUserLine(v, data, index) {
        if (v.sort) {
            var hasCheck = v.check ? v.check.name : undefined;
            return getLineTemplate(v.sort, v.group, data, hasCheck, index, v)
        }
    }

    function getMultipleLine(v, data) {
        var group = $("<div class='multipleForm'/>");
        var dataSrc = data.result || data.objects;
        $(dataSrc).each(function (index, value) {
            group.append(getUserLine(v, value, index))
        })
        return group;
    }

    function getViewLine(v, data, forms) {
        if (v.inResult == true) {
            return getSignLine(v, data['result'][0], forms)
        } else {
            if (v.multiple == true) {
                return getMultipleLine(v, data, forms)
            } else {
                return getSignLine(v, data, forms);
            }
        }
    }

    function initSelect(v, value, te) {
        if (undefined == te) {
            debugger;
        }
        te.append('<option value="0">-请选择-</option>');
        var dataSrc = v.dataSrc || 'result';
        if (v.url) {
            $.ajax({
                url: v.url,
                success: function (d) {
                    $(d[dataSrc]).each(function (i, v) {
                        te.append('<option value="' + v.objectid + '">' + v.name + '</option>');
                    });
                    te.val(value);
                    te.trigger('change');
                }
            })
        }
    }

    var getInput = {};
    getInput.getText = function (value) {
        return textLabel.clone().html(value);
    }
    getInput.getHidden = function (value, name) {
        return hidden.clone().attr('name', name).val(value);
    }
    getInput.getFile = function (value) {
        if(value === ""){
            return "未上传"
        }
        return download.clone().attr('href', '/' + value);
    }
    getInput.getDate = function (value, name, v) {
        var converValue = converDate(value, v.format);
        var abc = input.clone().val(converValue).attr({'readOnly': 'readOnly', name: name,'date-type':'date'});
        if(v.readOnly !== true){
            abc.datetimepicker(choseDate(v.format));
        }
        return abc;
    }
    getInput.getSelect = function (value, name, v, forms, data) {
        var isChange = false;
        var te = select.clone().attr({'name': name});
        if (v.parent && (v.notLinkwork == undefined)) {
            forms.find('select[name="' + v.parent + '"]').on('change', function () {
                var id = this.value || 0;
                te.empty();
                if (!isChange) {
                    v.url = v.url.replace("{{" + v.parent + "}}", id);
                    isChange = true;
                } else {
                    var reg = /\d+$/;
                    if (reg.test(v.url)) {
                        v.url = v.url.replace(reg, id);
                    }
                }
                if (id != 0) {
                    initSelect(v, value, te)
                }
            })
        } else if (v.parent && v.notLinkwork == true) {
            v.url = v.url.replace("{{" + v.parent + "}}", getVal(data, v.parent));
            initSelect(v, value, te)
        }
        else {
            initSelect(v, value, te)
        }
        te.on('change',function(){
            $('.btn-primary').removeAttr('disabled');
            window.parent.$("#disableCfm").attr('disabled', true);
        })
        return te;
    }
    getInput.getTextArea = function (value, name) {
        var dom =textArea.clone().attr({'name': name}).val(value);
        dom.on('input', function(){
            $(".btn.btn-primary").removeAttr('disabled');
        });
        return dom;
    }
    getInput.getImage = function (value) {
        if(value == "" || value == null || value == undefined){
            return "<img />";
        }
        return img.clone().attr('src', '/' + value).addClass('workflowImg');
    }

    function getViewInput(type, value, name, v, forms, data) {
        if (type === 'text') {
            return getInput.getText(value);
        } else if (type === 'hidden') {
            return getInput.getHidden(value, name);
        } else if (type === 'file') {
            return getInput.getFile(value);
        } else if (type === 'date') {
            return getInput.getDate(value, name, v);
        } else if (type === 'select') {
            return getInput.getSelect(value, name, v, forms, data);
        } else if (type === 'textArea') {
            return getInput.getTextArea(value, name);
        } else if (type === 'image') {
            return getInput.getImage(value);
        }
    }

    return getViewForm;
})

