import React from 'react';
import JsBarcode from 'jsbarcode';
import './Pay.less';//引入样式文件

class CodeBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      memberCode:'',
      display:'none',
      p:'inline-block',
    }
  }

  componentDidMount(){
    //从缓存中读取
    var userInfo = localStorage.userInfo;
    //json转换为Object对象
    var reData = JSON.parse(userInfo);
    var  memberCode=reData.memberCode;
    this.setState({
      memberCode:memberCode
    });
    //调用条形码生成工具，并将memberCode的值传给条形码
    JsBarcode(this._barcodeSVG, memberCode,
      {
        format: "CODE128",//选择要使用的条形码类型
        displayValue: false,  //  不显示原始值
        // background: '#4b8b7f',  //  背景色
        // lineColor: 'rgba(255,255,255,0.5)', // 线条颜色
        width:4,  // 线条宽度
        height:200,//条形码高度
        fontSize:36//原始值字体大小
      },
    );
  }
    display= () =>{
        this.setState({
          display:'inline-block',
          p:'none'
        })
    }
  hidden= () =>{
    this.setState({
      display:'none',
      p:'inline-block'
    })
  }
  render() {
    const va =  this.state.memberCode.substring(0,4)+"******"+"查看数字";
    return (
      <div className="codeBar_loc">
        <br/>
        <label className="codeBar_lable">扫码付款</label><br/>
        <svg ref={(ref)=>this._barcodeSVG = ref}></svg><br/>
        <p onClick={() => this.display()} style={{display:this.state.p}}>{va}</p>
        <p onClick={() => this.hidden()} style={{display:this.state.display}}>{this.state.memberCode}</p>
      </div>
    );
  }
}

export default CodeBar;
