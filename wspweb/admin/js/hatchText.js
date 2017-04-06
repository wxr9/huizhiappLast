/**
 * Created by Administrator on 2016/4/7.
 */
require(['jquery', 'bootstrap','pm','bootstrapvalidator','dropify','select2', 'ckeditor'], function(){

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
            url : '/Setting/Readme/Type/Edit?type=userIncubator',
            method : "get",
            success : function(data){
                CKEDITOR.instances.editor.setData(data.content);
                $("input[name='deleteflag']").val(data.deleteflag);
                $("input[name='isPopup']").val(data.isPopup);
                data.isRead==1?$('input[name=isRead]').eq(0).attr("checked",'checked'):$('input[name=isRead]').eq(1).attr("checked",'checked');
                $("input[name='name']").val(data.name);
                $("#form input[name='objectid']").val(data.objectid);
                $("input[name='type']").val(data.type);
            }
        })
        $('#form').attr('action','/Setting/Readme/Update');
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
    })
});