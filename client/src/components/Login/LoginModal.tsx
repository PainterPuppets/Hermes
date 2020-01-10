import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Tabs, Modal } from 'antd';
import DiscordIcon from '../../icons/Discord';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

import './style.less';

const TabPane = Tabs.TabPane;

interface Props {
  visible: boolean,
  onCancel: Function,
}

const initialState = {
  autoLogin: true,
  type: 'login',
  username: '',
  password: '',
};
type State = Readonly<typeof initialState>

@observer
class LoginModal extends Component<Props, {}> {
  readonly state: State = initialState

  onTabChange = (key: any) => {
    this.setState({
      type: key,
    });
  }

  changeAutoLogin = (e: { target: { checked: any; }; }) => {
    this.setState({
      autoLogin: e.target.checked
    });
  };

  render() {

    return (
      <Modal
        visible={this.props.visible}
        title={null}
        footer={null}
        closable={false}
        maskClosable={false}
        onCancel={() => this.props.onCancel}
      >
        <div className="login-modal-header">
          <DiscordIcon className="login-modal-logo"/>
        </div>
        <Tabs defaultActiveKey="login" activeKey={this.state.type} onChange={this.onTabChange}>
          <TabPane tab="登录" key="login">
            <LoginForm onRegistration={() => this.onTabChange("signup")} onSuccess={() => { }} />
          </TabPane>
          <TabPane tab="注册" key="signup">
            <SignupForm onSuccess={() => this.onTabChange("login")} />
          </TabPane>
        </Tabs>
      </Modal>
    );
  }
}

export default LoginModal;
