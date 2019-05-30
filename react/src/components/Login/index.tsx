import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Tabs, Modal } from 'antd';
import styled from 'styled-components';
import colors from '../../utils/colors';
import LoginModal from './LoginModal';

import './style.less';

const StyledLogin = styled.div`
  background-color: ${colors.scrollbarThumbBackground};
  border-color: ${colors.grayLight};
  display: flex;
  height: 100%;
  min-height: 100%;
  width: 100%;
`;


@observer
class LoginPage extends Component<any, {}> {

  render() {

    return (
      <StyledLogin>
        <LoginModal visible={true} onCancel={() => {}}/>
      </StyledLogin>
    );
  }
}

export default LoginPage;