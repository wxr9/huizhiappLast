require(['jquery'], function () {
    $(function () {
        var contactUs; //联系我们

        //获取联系我们配置
        $.ajax({
            type: 'GET',
            url: '/Setting/SettingAbout/Edit/2',
            dataType: 'json',
            async: true,
            success: function (result) {
                contactUs = result;
                if (contactUs['settingRichText'] != null) {
                    $('#content').append(contactUs['settingRichText']['content']);
                }
            }
        });
    })
});
