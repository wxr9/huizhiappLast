import React from 'react';
import {Link} from 'react-router';

import { Carousel, WhiteSpace, WingBlank,Icon } from 'antd-mobile';

class Index extends React.Component {
  state = {
    data: ['', '', ''],
    initialHeight: 200,
  }

  componentDidMount() {
    // simulate img loading
    setTimeout(() => {
      this.setState({
        data: ['home-p2', 'home-p2', 'home-p2'],
      });
    }, 50);
  }

  render() {
    const hProp = this.state.initialHeight ? { height: this.state.initialHeight } : {};

    return (
      <div className="index">
        {/*---------------------------------------------第一部分-----轮播图---------------------------------------------*/}
          <Carousel
            className="my-carousel"
            autoplay={true}
            infinite
            selectedIndex={0}
            swipeSpeed={35}
            beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
            afterChange={index => console.log('slide to', index)}
          >
            {this.state.data.map(ii => (
              <a href="http://www.baidu.com" key={ii} style={hProp}>
                <img
                  style={{width:'100%',height:'auto'}}
                  src={require(`../../assets/home/${ii || 'home-p2'}.jpg`)}
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


        {/*---------------------------------------------第二部分--------------------------------------------------------*/}
         <div className="index_par2_div">
              <li>
                <Link className="index_link" to="Recharge">
                  {/*// TODO-ICON*/}
                  <Icon type={require('../../assets/home/home-recharge.svg')} style={{width:'0.85rem',height:'0.85rem'}}/>
                {/*<img src={require('../../assets/home/03.png')} />*/}
                <p>充值</p>
              </Link>
              </li>
              <li>
                <Link className="index_link" to="index/Bound">
                  {/*// TODO-ICON*/}
                  <Icon type={require('../../assets/home/home-balance.svg')}  style={{width:'0.85rem',height:'0.85rem'}}/>
                {/*<img src={require('../../assets/04.png')} />*/}
                <p>余额查询</p>
              </Link>
              </li>
              <li>
                <Link className="index_link" to="ApplyCard">
                  {/*// TODO-ICON*/}
                  <Icon type={require('../../assets/home/home-payment.svg')}  style={{width:'0.85rem',height:'0.85rem'}}/>
                {/*<img src={require('../../assets/05.png')} />*/}
                <p>付款码</p>
              </Link>
              </li>



              <li>
               <Link className="index_link" to="index/propertyRepair">
                 {/*// TODO-ICON*/}
                 <Icon type={require('../../assets/home/home-repair.svg')}  style={{width:'0.85rem',height:'0.85rem'}}/>
                {/*<img src={require('../../assets/07.png')} />*/}
                <p>物业报修</p>
              </Link>
              </li>
              <li>
               <Link className="index_link" to="index/itRepair">
                 {/*// TODO-ICON*/}
                 <Icon type={require('../../assets/home/home-itrepair.svg')}  style={{width:'0.85rem',height:'0.85rem'}}/>
                {/*<img src={require('../../assets/08.png')} />*/}
                <p>IT报修</p>
              </Link>
              </li>
              <li>
                <Link className="index_link" to="index/instructionBinding">
                  {/*// TODO-ICON*/}
                  <Icon type={require('../../assets/home/home-ship.svg')}  style={{width:'0.85rem',height:'0.85rem'}}/>
                {/*<img src={require('../../assets/09.png')} />*/}
                <p>游船预约</p>
                </Link>
              </li>


               <li>
                 <Link className="index_link" to="index/APP">
                   {/*// TODO-ICON*/}
                   <Icon type={require('../../assets/home/home-add.svg')}  style={{width:'0.85rem',height:'0.85rem'}}/>
                 {/*<img src={require('../../assets/10.png')} />*/}
                 <p>更多</p>
                 </Link>
               </li>
          </div>

        {/*---------------------------------------------第三部分--------------------------------------------------------*/}
        <div className="index_par4">
          <div className="index_par4_div">
            <li>
              <Link className="index_link" to="TransactionQuery">
              <img src={require('../../assets/home/home-p3.jpg')} />
              <div className="index_bg_div"></div>
              <div value="啤酒节活动" className="index_font">啤酒节活动</div>
              </Link>
            </li>
            <li>
              <img src={require('../../assets/home/home-p3.jpg')} style={{paddingLeft:'4%'}} />
              <div className="index_bg_div" style={{marginLeft:'4%'}}></div>
              <div className="index_font" style={{marginLeft:'4%'}}>梦想启航</div>
            </li>
            <li>
              <img src={require('../../assets/home/home-p3.jpg')} style={{marginTop: '2%'}} />
              <div className="index_bg_div"></div>
              <div value="啤酒节活动" className="index_font">啤酒节活动</div>
            </li>
            <li>
              <img src={require('../../assets/home/home-p3.jpg')}  style={{paddingLeft:'4%',marginTop: '2%'}} />
              <div className="index_bg_div" style={{marginLeft:'4%'}}></div>
              <div  className="index_font" style={{marginLeft:'4%'}}>梦想启航</div>
            </li>
          </div>
        </div>
        </div>

    );
  }
}
export default Index;
