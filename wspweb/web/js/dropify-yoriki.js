require(['jquery', 'dropify'], function () {
    $(function () {
        $('.dropify').dropify({
            messages: {
                'default': '把文件拖到此处 或 点击上传文件',
                'replace': '把文件拖到此处 或 点击替换文件',
                'remove': '移除',
                'error': '对不起，您上传的文件超出大小限制'
            }
        })
    })
});
