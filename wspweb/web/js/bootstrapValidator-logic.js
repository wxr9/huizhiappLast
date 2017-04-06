// 转换成HTML实体字符
function replaceEntityIdentifier(value) {
    var tmp = value;
    /*tmp = tmp.replace(/&/g, '&amp;');*/
    tmp = tmp.replace(/</g, '&lt;');
    tmp = tmp.replace(/>/g, '&gt;');
    /*tmp = tmp.replace(/"/g, '&quot;');*/
    tmp = tmp.replace(/'/g, '&apos;');
    return tmp;
}

// 转义特殊字符，防止js注入
function checkJsInject() {
    $.each($('form textarea'), function (index, element) {
        element.value = replaceEntityIdentifier(element.value);
    })
    $.each($('form input[type="text"]'), function (index, element) {
        element.value = replaceEntityIdentifier(element.value);
    })
}
