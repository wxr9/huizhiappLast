require(['jquery', 'bootstrap','pm','bootstrapvalidator','dropify','select2','ckeditor', 'datepickercn','raty', 'datatables'], function(){

    $(function(){

        var initSample = (function() {
            var wysiwygareaAvailable = isWysiwygareaAvailable(),
                isBBCodeBuiltIn = !!CKEDITOR.plugins.get('bbcode');
            return function() {
                var editorElement = CKEDITOR.document.getById('editor');
                if (isBBCodeBuiltIn) {
                    editorElement.setHtml(
                        'Hello world!\n\n'
                    );
                }
                if (wysiwygareaAvailable) {
                    CKEDITOR.replace('editor');
                } else {
                    editorElement.setAttribute('contenteditable', 'true');
                    CKEDITOR.inline('editor');
                }
            };

            function isWysiwygareaAvailable() {

                if (CKEDITOR.revision == ('%RE' + 'V%')) {
                    return true;
                }
                return !!CKEDITOR.plugins.get('wysiwygarea');
            }
        })();
        initSample();

        $.ajax({
            url : '/Setting/Readme/Type/Edit?type=userHeadhunting',
            method : "get",
            success : function(data){
                CKEDITOR.instances.editor.setData(data.content);
                $("#form input[name='deleteflag']").val(data.deleteflag);
                $("#form input[name='isPopup']").val(data.isPopup);
                data.isRead==1?$('#form input[name=isRead]').eq(0).attr("checked",'checked'):$('#form input[name=isRead]').eq(1).attr("checked",'checked');
                $("#form input[name='name']").val(data.name);
                $("#form input[name='objectid']").val(data.objectid);
                $("#form input[name='type']").val(data.type);
            }
        })
        //$('#form').attr('action','/Setting/Readme/Update');
        $("#saveRich").click(function () {
            var data = $("#form").serialize();
            data = data.replace('content=','content='+encodeURIComponent(CKEDITOR.instances.editor.getData()));
            $.ajax({
                url : '/Setting/Readme/Update',
                method : "post",
                data:data,
                success: function (data) {
                    showAlert(data.msg);
                },
                error: function () {
                }
            })
        })
        //
        //自动评价设置
        $.ajax({
            url: '/Setting/SettingAutoComment/Edit?type=headhunting' ,
            success: function (data) {
                function pushData(target, length, name) {
                    var arr = [];
                    for (var i = 0; i < length; i++) {
                        target.append('<option value="' + i + '">' + i + name + '</option>');
                    }
                }

                var arr = ['autoCommentSpeed', 'autoCommentAttitude', 'autoCommentQuality'];
                $(arr).each(function (ind, val) {
                    $("#" + val).raty('score', data[val]);
                });
                $('#ratyForm input[name=objectid]').val(data.objectid)
                $("#content").val(data.content);
                var dayTime = $("#dayTime");
                var hourTime = $("#hourTime");
                var minTime = $("#minTime");
                pushData(dayTime, 30, '天');
                pushData(hourTime, 24, '时');
                pushData(minTime, 60, '分');
                var min = data.autoCommentDeadline % 60;
                var hour = (data.autoCommentDeadline - min) % 1440 / 60;
                var day = (data.autoCommentDeadline - min - (hour * 60)) % 86400 / 24 / 60;
                dayTime.val(day);
                hourTime.val(hour);
                minTime.val(min);
            }
        });
        // 评价设置--------------------------------------
        var stararr = ['autoCommentSpeed', 'autoCommentAttitude', 'autoCommentQuality'];
        var starind = 0;

        $('.ratyRating').each(function (ind, val) {
            $(val).raty({
                path: '../../lib/images',
                scoreName: stararr[starind++],
                score: 5
            });
        });

        $("#saveEvaluate").on('click', function () {
            var form = $('#ratyForm');
            var dayTime = parseInt($('#dayTime').val());
            var hourTime = parseInt($('#hourTime').val());
            var minTime = parseInt($('#minTime').val());
            dayTime = isNaN(dayTime) ? 0 : dayTime;
            hourTime = isNaN(hourTime) ? 0 : hourTime;
            minTime = isNaN(minTime) ? 0 : minTime;
            var min = ((dayTime * 24) + hourTime) * 60 + minTime;
            $.ajax({
                url: '/Setting/SettingAutoComment/Update',
                method: 'POST',
                data: {
                    objectid:$('#ratyForm input[name="objectid"]').val(),
                    type:'headhunting',
                    autoCommentAttitude: $('input[name="autoCommentAttitude"]').val(),
                    content: $("#content").val(),
                    autoCommentQuality: $('input[name="autoCommentQuality"]').val(),
                    autoCommentSpeed: $('input[name="autoCommentSpeed"]').val(),
                    autoCommentDeadline:min
                },
                success: function (data) {
                    if (data.success == true) {
                        showAlert(data.msg);
                    } else {
                        showAlert(data.msg, 'warn');
                    }
                }
            })
        });

    })
});