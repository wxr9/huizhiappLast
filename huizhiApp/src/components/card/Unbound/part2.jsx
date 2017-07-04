import React from 'react';
import { Link } from 'react-router';
import { Card,WhiteSpace,WingBlank,Button,Grid,Icon,Toast,Modal} from 'antd-mobile';
const prompt = Modal.prompt;
import './unbound.less'

const array1 = [
  {
    text: '绑定',
    onPress: value => new Promise((resolve) => {
      Toast.info('onPress promise', 1);
      setTimeout(() => {
        resolve();
        console.log(`value:${value}`);
      }, 1000);
    }),
  },
  { text: '取消' },
];
class part2 extends React.Component {
  render() {
    return (
      <div>
        <Card  className="Unbound_part2 card_none">
          <div className="Unbound_part2_position" >
            <Button type="" inline size=""
                    onClick={() => prompt('请您输入你要绑定的汇智卡', '', array1)}
                    className="Unbound_bund_card card_none">
              绑定汇智卡
            </Button>
            <Link to="ApplyCard">
              <Button  type="" inline size="" className="Unbound_apply_card card_none " >
                申请汇智卡
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }
}

export default part2;
