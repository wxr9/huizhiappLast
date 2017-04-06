require(['jquery'], function () {
    $(function () {
        var aboutUs; // 关于我们

        //获取关于我们配置
        $.ajax({
            type: 'GET',
            url: '/Setting/SettingAbout/Edit/1',
            dataType: 'json',
            async: true,
            success: function (result) {
                aboutUs = result;
                if (aboutUs['settingRichText'] != null) {
                    $('#content').append(aboutUs['settingRichText']['content']);
                }
            }
        });
    })
});
