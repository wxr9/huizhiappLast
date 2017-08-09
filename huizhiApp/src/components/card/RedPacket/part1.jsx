import React from 'react';
import { List, Switch, WingBlank, Card, Flex, Tag, Icon, Tabs } from 'antd-mobile';
import { createForm } from 'rc-form';
import { Link } from 'react-router';
import config from '../../../config';
import './RedPacket.less';
import requestGET from '../../../utils/requestGET';


var validInfoList = [];
var invalidInfoList = [];
var count = 0;
const TabPane = Tabs.TabPane;

// 红包
class part1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal1: false,
      validInfoList: [],
      invalidInfoList: [],
      valid_border:'none',
      invalid_border:'none',
      valid_color:'#333',
      invalid_color:'#333',
      valid_display:'',
      invalid_display:'none',
      packet_none1:'none',//暂无可用红包/暂无已用红包显示
      packet_none2:'none',//暂无可用红包/暂无已用红包显示
    };
  }
  componentWillMount () {
    requestGET(config.validRedPacketUrl).then((data) => {//从配置文件中读取url
      console.log(config.validRedPacketUrl);
      console.log("validRedPacketUrl data",data);
      validInfoList = [];
      var dataList = data;
      if (dataList.length===0){
        this.setState({
          packet_none1:'block',
        })
      }
      for (var i=0; i<dataList.length; i++){
        validInfoList.push(dataList[i]);
      }
      console.log("validInfoList",validInfoList);
      this.setState({
        validInfoList: validInfoList,
      })
    });
    requestGET(config.invalidRedPAcketUrl).then((data) => {//从配置文件中读取url
      console.log(config.invalidRedPAcketUrl);
      console.log("invalidRedPacketUrl data",data);
      invalidInfoList = [];
      var dataList = data;
      if (dataList.length===0){
        this.setState({
          packet_none2:'block',
        })
      }

      for (var i=0; i<dataList.length; i++){
        invalidInfoList.push(dataList[i]);
      }
      console.log("invalidInfoList",invalidInfoList);
      this.setState({
        invalidInfoList: invalidInfoList,
      })
    });
    this.changeTab('00');
  }

  changeTab(tabNo){
    if(tabNo=="00"){
      this.setState({
        valid_border:'4px solid #259dda',
        valid_color:'#259dda',
        invalid_border:'none',
        invalid_color:'#333',
        valid_display:'',
        invalid_display:'none',
      });
    }else{
      this.setState({
        invalid_border:'4px solid #259dda',
        invalid_color:'#259dda',
        valid_border:'none',
        valid_color:'#333',
        invalid_display:'',
        valid_display:'none',
      });
    }
  }

  render() {
    const { getFieldProps } = this.props.form;
    const {validInfoList,invalidInfoList} = this.state;
    return (
      <form>
        {/*<List>*/}
          {/*<img className="RedPacket_img" src={require('../../../assets//mine/mine-p1.jpg')} alt="图片" />*/}
        {/*</List>*/}
        <WingBlank>
                {/*<Tabs className="RedPacket_Tabs">*/}
                  {/*<TabPane tab="可用红包" key="1">*/}
                    <div className="redPacket_line">
                      <div className="redPacket_detail"
                           style={{ borderBottom:this.state.valid_border, color:this.state.valid_color }}
                           onClick={() =>this.changeTab('00')}>可用红包</div>
                      <div className="redPacket_detail"
                           style={{ borderBottom:this.state.invalid_border, color:this.state.invalid_color }}
                           onClick={() =>this.changeTab('01')}>已用/过期红包</div>
                    </div>
                    <div className="RedPacket_left" style={{ display:this.state.valid_display }}>
                      <List
                        className="RedPacket_list"
                      >
                        {
                          validInfoList.map((data) => {
                              count = count + 1;
                            let startDate = data.createTime;
                            let endDate = data.validateDate;
                            if (startDate!==undefined&&startDate!==null&&startDate!==""){
                              startDate = startDate.substring(0,16).replace('-',".").replace('-',".")
                            }
                            if (endDate!==undefined&&endDate!==null&&endDate!==""){
                              endDate = endDate.substring(0,16).replace('-',".").replace('-',".")
                            }
                              return (
                              <div  key={count}>
                                <div className="packet">
                                  <div className="RedPacket_Icon_div">
                                  <Icon type={require('../../../assets/card/redPacket_yes.svg')} className="RedPacket_Icon"/><br/>
                                    <span className="big">￥{data.sum}</span>
                                  </div>
                                  <div className="RedPacket_font_right">
                                    <span className="RedPacket_font_big">充值随机红包</span><br/>
                                    {/*<span className="RedPacket_font">满100可用，限最新版本客户端使用</span>*/}
                                  </div>
                                </div>
                                <div className="packet_time">有效期：{startDate}-{endDate}
                                </div>
                              </div>


                              );
                            }
                          )
                        }
                      </List>
                      <div className="packet_none" style={{display:this.state.packet_none1}}>
                        <img className="packet_none_png" src={require('../../../assets/card/redpacket_no.png')} alt="图片"/><br/>
                        暂无可用红包
                      </div>
                    </div>
                  {/*</TabPane>*/}
                  {/*<TabPane tab="已用/过期红包" key="2">*/}
                    <div className="RedPacket_right" style={{ display:this.state.invalid_display }}>
                      <List
                        className="RedPacket_list"
                      >
                        {
                          invalidInfoList.map((data) => {
                              count = count + 1;
                              let startDate = data.createTime;
                              let endDate = data.validateDate;
                              if (startDate!==undefined&&startDate!==null&&startDate!==""){
                                startDate = startDate.substring(0,16).replace('-',".").replace('-',".")
                              }
                              if (endDate!==undefined&&endDate!==null&&endDate!==""){
                                endDate = endDate.substring(0,16).replace('-',".").replace('-',".")
                              }
                              return (
                                <div className="RedPacket_color_no" key={count}>
                                  <div className="packet">
                                    <div className="RedPacket_Icon_div">
                                      <Icon type={require('../../../assets/card/redPacket_no.svg')} className="RedPacket_Icon"/><br/>
                                      <span className="big_no">￥{data.sum}</span>
                                    </div>
                                    <div className="RedPacket_font_right">
                                      <span className="RedPacket_font_big">充值随机红包</span><br/>
                                      {/*<span className="RedPacket_font">满100可用，限最新版本客户端使用</span>*/}
                                    </div>
                                  </div>
                                  <div className="packet_time">有效期：{startDate}-{endDate}
                                  </div>
                                </div>
                              );
                            }
                          )
                        }
                      </List>
                      <div className="packet_none" style={{display:this.state.packet_none2}}>
                        <img className="packet_none_png" src={require('../../../assets/card/redpacket_no.png')} alt="图片"/><br/>
                        暂无已用/过期红包
                      </div>
                    </div>
                  {/*</TabPane>*/}
                {/*</Tabs>*/}
        </WingBlank>
      </form>
    );
  }
}
const part1Wrapper = createForm()(part1);
export default part1Wrapper;
