import React from 'react';
import {Link} from 'react-router';
import { Carousel, WhiteSpace, WingBlank } from 'antd-mobile';

class Welcome extends React.Component {
  state = {
    data: ['', '', ''],
    initialHeight: 400,
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        data: ['lead-p1', 'lead-p2', 'lead-p3'],
      });
    }, 50);
  }

  render() {
    const hProp = this.state.initialHeight ? { height: this.state.initialHeight } : {};
    return (
      <div>
        <Carousel
          className="my-carousel"
          autoplay={false}
          infinite={false}
          selectedIndex={0}
          swipeSpeed={35}
          beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
          afterChange={index => console.log('slide to', index)}
        >
          {this.state.data.map(ii => (
            <a href="#" key={ii} style={hProp}>
              <img
                style={{width:'100%',height:'100%'}}
                src={require(`../../assets/lead/${ii || 'lead-p1'}.jpg`)}
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
        <Link className="index_link" to="login">
          <div style={{position:'fixed',top:'2%',right:'2%', zIndex: '2000'}}>跳过</div>
        </Link>
      </div>
    );
  }
}
export default Welcome;
