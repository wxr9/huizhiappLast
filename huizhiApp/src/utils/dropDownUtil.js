import requestGET from './requestGET';

//一级下拉框
export default function dropDownOne(url) {
  var dataArr = [];
  requestGET(url).then((data) => {//从配置文件中读取url
    var dataList = data.msg.result;
    var data = "";

    for (var i=0; i<dataList.length; i++){
      data = dataList[i];
      var obj={};
      obj.label = data.name;
      obj.value = data.objectid;
      dataArr.push(obj);
    }
    console.log("dataArr:"+dataArr);
  });
  return dataArr;
}

//二级联动下拉框
 function dropDownTwo(url,rootId) {
  var url_Parent = url .replace("{ParentId}",rootId);
  console.log(url_Parent);
  var dataArr = dropDownOne(url);
  var _dataArr = [dropDownOne(url)];
  for (var i=0;i<dataArr.length;i++){
    var parentId = dataArr[i].value;
    var url_N = url.replace("{ParentId}",parentId);
    var dataArr_C = dropDownOne(url_N);
    _dataArr[i]=dataArr_C;
  }
  console.log(_dataArr);
  return _dataArr;
}


