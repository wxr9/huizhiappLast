/**
 * 首页第一部分--轮播图
 */
import React from 'react';
import {Link} from 'react-router';
import {Carousel, WhiteSpace, WingBlank, Drawer, Icon} from 'antd-mobile';
import requestGET from '../../../utils/requestGET';
import config from '../../../config';
import './index.less'
import PersonCenter1 from '../../user/PersonCenter/PersonCenter1';
import PersonCenterUnLogin from '../../user/PersonCenter/PersonCenter_UnLogin';
import PersonCenter2 from '../../user/PersonCenter/PersonCenter2';

class part1 extends React.Component {
  state = {
    banner: [],
    open: false,
    display:'none',
    display2:'',
  }
  onOpenChange = (...args) => {
    if(sessionStorage.userInfo){
      console.log("已登录！");
      this.setState({
        display:'',
        display2:'none',
      });
    }else {
      console.log("未登录，请登录！");
      this.setState({
        display:'none',
        display2:'',
      });
    }
    console.log(args);
    this.setState({ open: !this.state.open });
  }
  componentWillMount() {
    var page = 0;
    var pageSize = 0;
    var url = config.BannerUrl + "/" + page + "/" + pageSize;
    //console.log(url);
    requestGET(url).then((data) => {//从配置文件中读取url
      var banner = data.msg.result;
      console.log(banner+'----');
      this.setState({
        banner: banner
      })
    });
  }

  componentDidMount() {
    // simulate img loading
    setTimeout(() => {
      this.setState({
        //banner: banner
        data: ['home-p2', 'home-p2', 'home-p2'],
      });
    }, 50);
  }

  render() {
    const sidebar = (<div className="div-siderbar">
      <div style={{display:this.state.display}}>
      <PersonCenter1/>
      </div>
      <div style={{display:this.state.display2}}>
        <PersonCenterUnLogin/>
      </div>
      <PersonCenter2/>
    </div>);
    const {banner} = this.state;
    // const hProp = this.state.initialHeight ? { height: this.state.initialHeight } : {};
    const url = "http://222.73.203.71:8080/";
    //console.log({banner});
    return (
      <div>
      <Carousel
        className="my-carousel"
        autoplay={true}
        infinite
        selectedIndex={0}
        swipeSpeed={35}
        beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
        afterChange={index => console.log('slide to', index)}
      >
        {
          banner.map((li) => (
            <a key={li}>
              <img
                className="index_img_banner"
                src={url+li.imgUrl}
              //src={require(`../../../assets/home/${ii || 'home-p2'}.jpg`)}
               alt="icon"
               onLoad={() => {
                 // fire window resize event to change height
                 window.dispatchEvent(new Event('resize'));
                 this.setState({
                   initialHeight: null,
                 });
               }}
            />
          </a>
          ))}
      </Carousel>
        <Drawer
          className="my-drawer"
          style={{ minHeight: document.documentElement.clientHeight - 200 }}
          enableDragHandle
          contentStyle={{ color: '#A6A6A6', textAlign: 'center', paddingTop: 42 }}
          sidebar={sidebar}
          open={this.state.open}
          onOpenChange={this.onOpenChange}
        />
      </div>
    );
  }
}

export default part1;
