import React from 'react';
import { SwipeAction,List, Badge, Flex, WhiteSpace, Tabs, Card ,Modal} from 'antd-mobile';
import { Link } from 'react-router';

import './PersonNotify.less';
import config from '../../../config';
import requestGET from  '../../../utils/requestGET';

var status = true;//展开
const NUM_ROWS = 10;
const alert = Modal.alert;

// 个人消息中心第二部分--内容选项
class PersonNotify2 extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      title:this.props.title,
      createTime:this.props.createTime,
      objectid:this.props.objectid,
      detail:<Card.Body style={{display: "none"}}>
        <div>{this.props.content}</div>
      </Card.Body>,
      isReadFlag:[],
    };
  }

  componentWillMount () {
    var isReadFlag = '';//是否已读
    if(this.props.readStatus == 1){//未读
      isReadFlag =  <div className="personNotify_circle"> </div>;
    }else{//已读
      isReadFlag =  <div> </div>;
    }
    this.setState({
      isReadFlag:isReadFlag,
    })
  }
  checkDetail= (val) =>{
    var detail;
    if(status){//未展开
      detail =  <Card.Body style={{display: "none"}}>
        <div>{this.props.content}</div>
      </Card.Body>
    }else{
      detail =  <Card.Body>
        <div>{this.props.content}</div>
      </Card.Body>
    }

    this.setState({
      detail:detail,
    })
    status = !status;
  }

  render() {
    return (
        <div>
        {/*<SwipeAction*/}
          {/*autoClose*/}
          {/*right={[*/}
            {/*{*/}
              {/*text: 'Delete',*/}
              {/*onPress: () => console.log('删除'),*/}
              {/*style: { backgroundColor: '#F4333C', color: 'white' },*/}
            {/*},*/}
          {/*]}*/}
          {/*onOpen={() => console.log('global open')}*/}
          {/*onClose={() => console.log('global close')}*/}
        {/*>*/}
            <Card className="personNotify_par1_card">
              <Card.Header
                className="personNotify_par1_cardHeader"
                title={
                  <div>
                    <Flex className="personNotify_par1_Flex">
                      <Flex.Item className="personNotify_par1_Flex_color" >{this.state.title}</Flex.Item>
                      <Flex.Item className="personNotify_par1_Flex_width" >{this.state.createTime}</Flex.Item>
                    </Flex>
                  </div>}/>
              {this.state.detail}
          </Card>
      {/*</SwipeAction>*/}
    <WhiteSpace />
    </div>
    );
  }
}
export default PersonNotify2;
