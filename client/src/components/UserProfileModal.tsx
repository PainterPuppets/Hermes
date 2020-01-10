import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Modal, Input, Empty, Button, Typography } from 'antd';
import styled from 'styled-components';
import AuthStore from 'store/AuthStore'
import CommonStore from 'store/CommonStore'

import UserAvatar from '../components/UserAvatar'
import AvatarUploader from '../components/User/AvatarUploader';
import _ from 'lodash'
import './styles.less'

const { Title, Paragraph, Text } = Typography;


const StyledProfile = styled.div`
  background: rgba(32,34,37,.6);
  border-color: #202225;
  padding: 20px;
  margin-bottom: 40px;
  position: relative;
  border-width: 1px;
  border-style: solid;
  border-radius: 5px;
  
  display: flex;
  .user-profile-avatar {
    margin-right: 20px;
    height: 100px;
    width: 100px;
    .avatar {
      height: 100px;
      width: 100px;
    }
  }
  .user-profile {
    strong {
      user-select: none;
      color: rgba(220,221,222,.3);
    }
    .ant-typography {
      margin-bottim: 0px;
      color: #b9bbbe;
    }
  }
`;

@observer
class UserProfileModal extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
    }
  }

  render() {
    return (
      <Modal
        visible={CommonStore.profileModalVisible}
        centered
        title={null}
        footer={null}
        closable={false}
        onCancel={CommonStore.closeProfileModal}
      >
        <StyledProfile>
          <AvatarUploader className="user-profile-avatar"/>
          <Typography className="user-profile">
            <Text strong>Username</Text>
            <Paragraph className="username">{AuthStore.user.username}</Paragraph>
            <Text strong>Email</Text>
            <Paragraph className="username">{AuthStore.user.email}</Paragraph>
          </Typography>
        </StyledProfile>
        <Button
          type="primary"
          className="logout-btn"
          onClick={CommonStore.logout}
        >
          Logout
        </Button>
      </Modal>
    );
  }
}

export default UserProfileModal;
