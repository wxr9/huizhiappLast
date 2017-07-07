import React from 'react';
import svgpath from 'svgpath';
import qr from 'qr-image';
import './Pay.less';//引入样式文件

class CodeQr extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      path: null // 保存二维码SVG的path
    };
  }
  componentWillMount(){
      const originPath = qr.svgObject("1234567890abcdefghij").path; //  获得二维码的绘制路径
      // this.setState({path: originPath});
      const scaledPath = svgpath(originPath).scale(15, 15).toString();
      this.setState({path: scaledPath});
  }
  render() {
    return (
      <div className="codeQr_loc">

        <br/>
        <br/>
        <br/>
        <div className="codeQr_sty">
          <svg style={{overflow:'inherit'}} ref={(ref)=>this._qrcodeSVG = ref} transform="scale(2)">
            <path d={this.state.path?this.state.path:null}/>
          </svg>
        </div>
      </div>
    );
  }
}
export default CodeQr;
